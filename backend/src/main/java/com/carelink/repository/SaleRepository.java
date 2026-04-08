package com.carelink.repository;

import com.carelink.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    @Query("SELECT SUM(s.totalAmount) FROM Sale s WHERE s.createdAt >= :after")
    Double sumTotalAmountCreatedAfter(@Param("after") LocalDateTime after);
}
