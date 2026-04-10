package com.carelink.repository;

import com.carelink.entity.SupplierProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierProductRepository extends JpaRepository<SupplierProduct, Long> {
    List<SupplierProduct> findBySupplierId(Long supplierId);

    Optional<SupplierProduct> findBySupplierIdAndMedicineId(Long supplierId, Long medicineId);
}
