package com.carelink.service;

import com.carelink.dto.CreateSaleRequest;
import com.carelink.entity.*;
import com.carelink.repository.MedicineBatchRepository;
import com.carelink.repository.MedicineRepository;
import com.carelink.repository.SaleRepository;
import com.carelink.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {

    private final SaleRepository saleRepo;
    private final MedicineRepository medicineRepo;
    private final MedicineBatchRepository batchRepo;
    private final UserRepository userRepo;
    private final PrescriptionService prescriptionService;

    public SaleService(SaleRepository saleRepo,
            MedicineRepository medicineRepo,
            MedicineBatchRepository batchRepo,
            UserRepository userRepo,
            PrescriptionService prescriptionService) {
        this.saleRepo = saleRepo;
        this.medicineRepo = medicineRepo;
        this.batchRepo = batchRepo;
        this.userRepo = userRepo;
        this.prescriptionService = prescriptionService;
    }

    @Transactional
    public Sale createSale(CreateSaleRequest req) {
        Sale sale = new Sale();

        // Link to patient profile if available
        if (req.getPatientId() != null) {
            User patient = userRepo.findById(req.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found for ID: " + req.getPatientId()));
            sale.setPatient(patient);
            sale.setPatientName(patient.getUsername());
            sale.setPatientPhone(patient.getPhone());
        } else {
            sale.setPatientName(req.getPatientName());
            sale.setPatientPhone(req.getPatientPhone());
        }

        double total = 0;

        for (CreateSaleRequest.Item itemReq : req.getItems()) {
            if (itemReq.getQty() <= 0)
                throw new RuntimeException("Qty must be > 0");

            Medicine med = medicineRepo.findById(itemReq.getMedicineId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found: " + itemReq.getMedicineId()));

            if (med.getExpiryDate() != null && med.getExpiryDate().isBefore(LocalDate.now())) {
                throw new RuntimeException("Cannot sell expired medicine: " + med.getName());
            }

            SaleItem si = new SaleItem();
            si.setSale(sale);
            si.setMedicine(med);
            si.setQty(itemReq.getQty());
            si.setUnitPrice(med.getPrice());
            si.setLineTotal(med.getPrice() * itemReq.getQty());

            List<MedicineBatch> batches = batchRepo
                    .findByMedicine_IdAndQtyGreaterThanAndExpiryDateGreaterThanEqualOrderByExpiryDateAsc(
                            med.getId(), 0, LocalDate.now());

            int need = itemReq.getQty();
            if (med.getStockQty() < need) {
                throw new RuntimeException("Not enough total stock for " + med.getName() + " (Only "
                        + med.getStockQty() + " available)");
            }

            for (MedicineBatch b : batches) {
                if (need <= 0)
                    break;
                int take = Math.min(b.getQty(), need);
                b.setQty(b.getQty() - take);
                batchRepo.save(b);

                SaleBatchUsage usage = new SaleBatchUsage();
                usage.setSaleItem(si);
                usage.setBatch(b);
                usage.setQtyUsed(take);
                si.getBatchUsages().add(usage);
                need -= take;
            }

            med.setStockQty(med.getStockQty() - itemReq.getQty());
            medicineRepo.save(med);

            sale.getItems().add(si);
            total += si.getLineTotal();
        }

        sale.setTotalAmount(total);
        Sale savedSale = saleRepo.save(sale);

        // If this sale was from a prescription, mark it as dispensed
        if (req.getPrescriptionId() != null) {
            prescriptionService.markAsDispensed(req.getPrescriptionId());
        }

        return savedSale;
    }

    @Transactional
    public Sale cancelSale(Long saleId) {
        Sale sale = saleRepo.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found: " + saleId));

        if (sale.getStatus() != SaleStatus.PLACED) {
            throw new RuntimeException("Cancel allowed only when status is PLACED");
        }

        for (SaleItem item : sale.getItems()) {
            for (SaleBatchUsage usage : item.getBatchUsages()) {
                MedicineBatch batch = usage.getBatch();
                batch.setQty(batch.getQty() + usage.getQtyUsed());
                batchRepo.save(batch);
            }
            Medicine med = item.getMedicine();
            med.setStockQty(med.getStockQty() + item.getQty());
            medicineRepo.save(med);
        }

        sale.setStatus(SaleStatus.CANCELLED);
        return saleRepo.save(sale);
    }

    @Transactional(readOnly = true)
    public Double getTodaySalesCount() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        Double total = saleRepo.sumTotalAmountCreatedAfter(startOfDay);
        return total != null ? total : 0.0;
    }
}
