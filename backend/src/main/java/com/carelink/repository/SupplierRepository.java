package com.carelink.repository;

import java.util.Optional;
import com.carelink.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    boolean existsByCompanyRegId(String companyRegId);

    Optional<Supplier> findByCompanyRegId(String companyRegId);

    Optional<Supplier> findByUser_Username(String username);
}
