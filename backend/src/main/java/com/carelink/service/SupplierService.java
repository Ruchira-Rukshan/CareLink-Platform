package com.carelink.service;

import com.carelink.entity.Supplier;
import com.carelink.repository.SupplierRepository;
import org.springframework.stereotype.Service;

@Service
public class SupplierService {

    private final SupplierRepository repo;

    public SupplierService(SupplierRepository repo) {
        this.repo = repo;
    }

    public Supplier create(Supplier supplier) {
        if (repo.existsByCompanyRegId(supplier.getCompanyRegId())) {
            throw new RuntimeException("Supplier already registered with Reg ID: " + supplier.getCompanyRegId());
        }
        return repo.save(supplier);
    }
}
