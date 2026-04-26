package com.carelink.controller;

import com.carelink.entity.Supplier;
import com.carelink.repository.SupplierRepository;
import com.carelink.service.SupplierService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@CrossOrigin(origins = "http://localhost:3000")
public class SupplierController {

    private final SupplierRepository repo;
    private final SupplierService service;

    public SupplierController(SupplierRepository repo, SupplierService service) {
        this.repo = repo;
        this.service = service;
    }

    // Supplier registration is now managed by central authority.
    /*
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Supplier create(@RequestBody Supplier supplier) {
        return service.create(supplier);
    }
    */

    @GetMapping
    public List<Supplier> all() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Supplier get(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found: " + id));
    }

    /*
    @PutMapping("/{id}")
    public Supplier update(@PathVariable Long id, @RequestBody Supplier payload) {
        Supplier s = repo.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found: " + id));
        s.setCompanyRegId(payload.getCompanyRegId());
        s.setName(payload.getName());
        s.setPhone(payload.getPhone());
        s.setEmail(payload.getEmail());
        return repo.save(s);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    @PatchMapping("/{id}/deactivate")
    public Supplier deactivate(@PathVariable Long id) {
        Supplier s = repo.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found: " + id));
        s.setActive(false);
        return repo.save(s);
    }
    */
}
