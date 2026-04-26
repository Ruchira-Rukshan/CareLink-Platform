package com.carelink.controller;

import com.carelink.entity.Medicine;
import com.carelink.entity.Supplier;
import com.carelink.entity.SupplierProduct;
import com.carelink.entity.User;
import com.carelink.repository.MedicineRepository;
import com.carelink.repository.SupplierProductRepository;
import com.carelink.repository.SupplierRepository;
import com.carelink.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/suppliers")
@CrossOrigin(origins = "http://localhost:3000")
public class SupplierProductController {

    private final SupplierProductRepository productRepo;
    private final SupplierRepository supplierRepo;
    private final MedicineRepository medicineRepo;
    private final UserRepository userRepo;

    public SupplierProductController(SupplierProductRepository productRepo,
            SupplierRepository supplierRepo,
            MedicineRepository medicineRepo,
            UserRepository userRepo) {
        this.productRepo = productRepo;
        this.supplierRepo = supplierRepo;
        this.medicineRepo = medicineRepo;
        this.userRepo = userRepo;
    }

    /** GET Supplier's Catalog by Supplier ID */
    @GetMapping("/{supplierId}/catalog")
    public List<SupplierProduct> getCatalog(@PathVariable Long supplierId) {
        return productRepo.findBySupplierId(supplierId);
    }

    /** GET Current Logged-in Supplier's Catalog */
    @GetMapping("/me/catalog")
    public ResponseEntity<?> getMyCatalog(@AuthenticationPrincipal User user) {
        if (!"SUPPLIER".equals(user.getRole().name())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Only suppliers can access this"));
        }
        Supplier supplier = supplierRepo.findByCompanyRegId(user.getCompanyRegId())
                .orElse(null);
        if (supplier == null) {
            return ResponseEntity.ok(List.of()); // No profile matched
        }
        return ResponseEntity.ok(productRepo.findBySupplierId(supplier.getId()));
    }

    /** POST Add Item to Catalog */
    @PostMapping("/me/catalog")
    public ResponseEntity<?> addToMyCatalog(@AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> payload) {
        if (!"SUPPLIER".equals(user.getRole().name())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Only suppliers can access this"));
        }

        Supplier supplier = supplierRepo.findByCompanyRegId(user.getCompanyRegId())
                .orElseThrow(() -> new RuntimeException("Supplier profile not found"));

        Long medicineId = Long.valueOf(payload.get("medicineId").toString());
        double bulkPrice = Double.parseDouble(payload.get("bulkPrice").toString());
        int minQty = Integer.parseInt(payload.get("minOrderQuantity").toString());

        Medicine medicine = medicineRepo.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        SupplierProduct existing = productRepo.findBySupplierIdAndMedicineId(supplier.getId(), medicineId).orElse(null);
        if (existing != null) {
            existing.setBulkPrice(bulkPrice);
            existing.setMinOrderQuantity(minQty);
            return ResponseEntity.ok(productRepo.save(existing));
        }

        SupplierProduct sp = new SupplierProduct();
        sp.setSupplier(supplier);
        sp.setMedicine(medicine);
        sp.setBulkPrice(bulkPrice);
        sp.setMinOrderQuantity(minQty);

        return ResponseEntity.status(HttpStatus.CREATED).body(productRepo.save(sp));
    }

    /** DELETE Item from Catalog */
    @DeleteMapping("/me/catalog/{productId}")
    public ResponseEntity<?> removeFromMyCatalog(@AuthenticationPrincipal User user, @PathVariable Long productId) {
        SupplierProduct sp = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Supplier supplier = supplierRepo.findByCompanyRegId(user.getCompanyRegId())
                .orElseThrow(() -> new RuntimeException("Supplier profile not found"));

        if (!sp.getSupplier().getId().equals(supplier.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not your product"));
        }

        productRepo.delete(sp);
        return ResponseEntity.noContent().build();
    }
}
