package com.carelink.repository;

import com.carelink.entity.MedicineBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MedicineBatchRepository extends JpaRepository<MedicineBatch, Long> {
    List<MedicineBatch> findByMedicine_IdAndQtyGreaterThanAndExpiryDateGreaterThanEqualOrderByExpiryDateAsc(
            Long medicineId, int qty, LocalDate today);

    List<MedicineBatch> findByMedicine_IdOrderByExpiryDateAsc(Long medicineId);

    List<MedicineBatch> findByExpiryDateBefore(LocalDate date);

    List<MedicineBatch> findByExpiryDateBetween(LocalDate start, LocalDate end);

    Optional<MedicineBatch> findByMedicine_IdAndBatchNumber(Long medicineId, String batchNumber);
}
