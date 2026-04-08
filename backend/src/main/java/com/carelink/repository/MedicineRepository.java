package com.carelink.repository;

import com.carelink.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByStockQtyLessThanEqual(int stockQty);

    List<Medicine> findByExpiryDateBefore(LocalDate date);

    List<Medicine> findByExpiryDateBetween(LocalDate start, LocalDate end);

    List<Medicine> findByNameContainingIgnoreCase(String name);

    @Query("SELECT m FROM Medicine m WHERE m.stockQty < m.minStockLevel")
    List<Medicine> findLowStockMedicines();
}
