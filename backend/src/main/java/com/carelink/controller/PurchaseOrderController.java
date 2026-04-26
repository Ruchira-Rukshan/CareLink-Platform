package com.carelink.controller;

import com.carelink.dto.CreatePurchaseOrderRequest;
import com.carelink.entity.PurchaseOrder;
import com.carelink.entity.PurchaseOrderStatus;
import com.carelink.repository.PurchaseOrderRepository;
import com.carelink.service.PurchaseOrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/purchase-orders")
@CrossOrigin(origins = "http://localhost:3000")
public class PurchaseOrderController {

    private final PurchaseOrderService service;
    private final PurchaseOrderRepository repo;
    private final com.carelink.repository.SupplierRepository supplierRepo;

    public PurchaseOrderController(PurchaseOrderService service,
            PurchaseOrderRepository repo,
            com.carelink.repository.SupplierRepository supplierRepo) {
        this.service = service;
        this.repo = repo;
        this.supplierRepo = supplierRepo;
    }

    /** Pharmacy creates a new PO */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PurchaseOrder create(@RequestBody CreatePurchaseOrderRequest req) {
        if (req.getSupplierId() == null)
            throw new RuntimeException("SupplierId is required");
        if (req.getItems() == null || req.getItems().isEmpty())
            throw new RuntimeException("At least one item is required");
        return service.createPO(req);
    }

    /** Get POs (pharmacy sees all; supplier sees only theirs) */
    @GetMapping
    public List<PurchaseOrder> all(Principal principal) {
        if (principal == null)
            return repo.findAll();

        // If supplier, filter by their supplier profile
        return supplierRepo.findByUser_Username(principal.getName())
                .map(s -> repo.findBySupplierId(s.getId()))
                .orElseGet(() -> repo.findAll()); // fallback for non-supplier users (pharmacists)
    }

    /** Get single PO details */
    @GetMapping("/{id}")
    public PurchaseOrder get(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("PO not found: " + id));
    }

    /**
     * Universal status update endpoint.
     * Supplier uses: CREATED → PROCESSING → SHIPPED
     * Pharmacy uses: SHIPPED → RECEIVED
     * Either can CANCEL.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Principal principal) {
        try {
            String statusStr = body.get("status");
            String invoiceUrl = body.get("invoiceUrl");
            if (statusStr == null)
                return ResponseEntity.badRequest().body(Map.of("message", "status is required"));

            PurchaseOrderStatus newStatus = PurchaseOrderStatus.valueOf(statusStr);
            String username = principal != null ? principal.getName() : "system";
            PurchaseOrder updated = service.updateStatus(id, newStatus, invoiceUrl, username);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status value"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** Legacy endpoint: Pharmacy directly marks as received */
    @PatchMapping("/{id}/receive")
    public PurchaseOrder receive(@PathVariable Long id) {
        return service.receivePO(id);
    }
}
