package com.carelink.service;

import com.carelink.dto.CreatePurchaseOrderRequest;
import com.carelink.entity.*;
import com.carelink.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class PurchaseOrderService {

    private final SupplierRepository supplierRepo;
    private final PurchaseOrderRepository poRepo;
    private final MedicineRepository medicineRepo;
    private final MedicineBatchRepository batchRepo;
    private final NotificationRepository notificationRepo;
    private final UserRepository userRepo;
    private final SupplierProductRepository supplierProductRepo;

    public PurchaseOrderService(SupplierRepository supplierRepo,
            PurchaseOrderRepository poRepo,
            MedicineRepository medicineRepo,
            MedicineBatchRepository batchRepo,
            NotificationRepository notificationRepo,
            UserRepository userRepo,
            SupplierProductRepository supplierProductRepo) {
        this.supplierRepo = supplierRepo;
        this.poRepo = poRepo;
        this.medicineRepo = medicineRepo;
        this.batchRepo = batchRepo;
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
        this.supplierProductRepo = supplierProductRepo;
    }

    private String formatNumber(String prefix, Long id) {
        int year = LocalDate.now().getYear();
        return String.format("%s-%d-%06d", prefix, year, id);
    }

    @Transactional
    public PurchaseOrder createPO(CreatePurchaseOrderRequest req) {
        Supplier supplier = supplierRepo.findById(req.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found: " + req.getSupplierId()));

        PurchaseOrder po = new PurchaseOrder();
        po.setSupplier(supplier);
        po.setStatus(PurchaseOrderStatus.CREATED);
        po.setPoNumber("TEMP");
        po = poRepo.save(po);

        po.setPoNumber(formatNumber("PO", po.getId()));
        double total = 0;

        for (CreatePurchaseOrderRequest.Item it : req.getItems()) {
            if (it.getQty() <= 0)
                throw new RuntimeException("Qty must be > 0");

            Medicine med = medicineRepo.findById(it.getMedicineId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found: " + it.getMedicineId()));

            // Find price and MOQ from supplier catalog
            SupplierProduct catalogItem = supplierProductRepo
                    .findBySupplierIdAndMedicineId(supplier.getId(), med.getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Medicine " + med.getName() + " is not in the supplier's catalog"));

            if (it.getQty() < catalogItem.getMinOrderQuantity()) {
                throw new RuntimeException("Quantity for " + med.getName() + " is less than Minimum Order Quantity ("
                        + catalogItem.getMinOrderQuantity() + ")");
            }

            PurchaseItem pi = new PurchaseItem();
            pi.setPurchaseOrder(po);
            pi.setMedicine(med);
            pi.setQty(it.getQty());
            pi.setBatchNumber(it.getBatchNumber());
            pi.setExpiryDate(it.getExpiryDate());

            pi.setUnitPrice(catalogItem.getBulkPrice());
            pi.setLineTotal(it.getQty() * catalogItem.getBulkPrice());

            po.getItems().add(pi);
            total += pi.getLineTotal();
        }

        po.setTotalAmount(total);
        PurchaseOrder saved = poRepo.save(po);

        // Notify all SUPPLIER users about the new order
        List<User> suppliers = userRepo.findAll().stream()
                .filter(u -> u.getRole() == Role.SUPPLIER)
                .toList();
        for (User s : suppliers) {
            notificationRepo.save(new Notification(s,
                    "📦 New Purchase Order Received",
                    "A new purchase order " + saved.getPoNumber() + " has been placed and requires your action."));
        }

        return saved;
    }

    /**
     * Supplier updates the status of a PO.
     * Allowed transitions:
     * CREATED → PROCESSING → SHIPPED
     * Pharmacy confirms delivery:
     * SHIPPED → RECEIVED (triggers stock update)
     */
    @Transactional
    public PurchaseOrder updateStatus(Long poId, PurchaseOrderStatus newStatus, String invoiceUrl, String updaterUsername) {
        PurchaseOrder po = poRepo.findById(poId)
                .orElseThrow(() -> new RuntimeException("PO not found: " + poId));

        PurchaseOrderStatus current = po.getStatus();

        // Validate allowed transitions
        boolean valid = switch (current) {
            case CREATED -> newStatus == PurchaseOrderStatus.PROCESSING || newStatus == PurchaseOrderStatus.CANCELLED;
            case PROCESSING -> newStatus == PurchaseOrderStatus.SHIPPED || newStatus == PurchaseOrderStatus.CANCELLED;
            case SHIPPED -> newStatus == PurchaseOrderStatus.RECEIVED || newStatus == PurchaseOrderStatus.CANCELLED;
            case RECEIVED -> newStatus == PurchaseOrderStatus.INVOICED;
            default -> false;
        };

        if (!valid) {
            throw new RuntimeException("Cannot transition from " + current + " to " + newStatus);
        }

        po.setStatus(newStatus);
        
        if (newStatus == PurchaseOrderStatus.INVOICED && invoiceUrl != null) {
            po.setInvoiceUrl(invoiceUrl);
        }

        // If RECEIVED: update stock levels automatically
        if (newStatus == PurchaseOrderStatus.RECEIVED) {
            po.setReceivedDate(LocalDate.now());
            for (PurchaseItem item : po.getItems()) {
                Medicine med = item.getMedicine();
                MedicineBatch batch = batchRepo.findByMedicine_IdAndBatchNumber(med.getId(), item.getBatchNumber())
                        .orElseGet(MedicineBatch::new);

                if (batch.getId() == null) {
                    batch.setMedicine(med);
                    batch.setBatchNumber(item.getBatchNumber());
                    batch.setExpiryDate(item.getExpiryDate());
                    batch.setReceivedDate(LocalDate.now());
                    batch.setQty(0);
                }

                batch.setQty(batch.getQty() + item.getQty());
                batchRepo.save(batch);

                med.setStockQty(med.getStockQty() + item.getQty());
                medicineRepo.save(med);
            }

            // Notify all PHARMACIST users
            List<User> pharmacists = userRepo.findAll().stream()
                    .filter(u -> u.getRole() == Role.PHARMACIST)
                    .toList();
            for (User p : pharmacists) {
                notificationRepo.save(new Notification(p,
                        "✅ Stock Replenished",
                        "Purchase Order " + po.getPoNumber()
                                + " has been delivered and inventory has been updated automatically."));
            }
        } else if (newStatus == PurchaseOrderStatus.PROCESSING) {
            // Notify pharmacists: order is being processed
            List<User> pharmacists = userRepo.findAll().stream()
                    .filter(u -> u.getRole() == Role.PHARMACIST)
                    .toList();
            for (User p : pharmacists) {
                notificationRepo.save(new Notification(p,
                        "⚙️ Order Processing",
                        "Purchase Order " + po.getPoNumber() + " is now being processed by the supplier."));
            }
        } else if (newStatus == PurchaseOrderStatus.SHIPPED) {
            // Notify pharmacists: order is on the way
            List<User> pharmacists = userRepo.findAll().stream()
                    .filter(u -> u.getRole() == Role.PHARMACIST)
                    .toList();
            for (User p : pharmacists) {
                notificationRepo.save(new Notification(p,
                        "🚚 Order Shipped",
                        "Purchase Order " + po.getPoNumber()
                                + " has been shipped and is on its way. Please confirm receipt upon delivery."));
            }
        } else if (newStatus == PurchaseOrderStatus.CANCELLED) {
            // Notify both parties
            List<User> pharmacists = userRepo.findAll().stream()
                    .filter(u -> u.getRole() == Role.PHARMACIST)
                    .toList();
            for (User p : pharmacists) {
                notificationRepo.save(new Notification(p,
                        "❌ Order Cancelled",
                        "Purchase Order " + po.getPoNumber() + " has been cancelled."));
            }
        }

        return poRepo.save(po);
    }

    /** Legacy method kept for backwards compatibility */
    @Transactional
    public PurchaseOrder receivePO(Long poId) {
        return updateStatus(poId, PurchaseOrderStatus.RECEIVED, null, "system");
    }
}
