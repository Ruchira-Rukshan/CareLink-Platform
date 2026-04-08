package com.carelink.controller;

import com.carelink.entity.Medicine;
import com.carelink.repository.MedicineRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/medicines")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicineController {

    private final MedicineRepository repo;

    public MedicineController(MedicineRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Medicine create(@RequestBody Medicine medicine) {
        return repo.save(medicine);
    }

    @GetMapping
    public List<Medicine> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Medicine getById(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found: " + id));
    }

    @PutMapping("/{id}")
    public Medicine update(@PathVariable Long id, @RequestBody Medicine payload) {
        Medicine m = repo.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found: " + id));
        m.setName(payload.getName());
        m.setBrand(payload.getBrand());
        m.setCategory(payload.getCategory());
        m.setPrice(payload.getPrice());
        m.setStockQty(payload.getStockQty());
        m.setExpiryDate(payload.getExpiryDate());
        return repo.save(m);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repo.existsById(id))
            throw new RuntimeException("Medicine not found: " + id);
        repo.deleteById(id);
    }

    @PatchMapping("/{id}/stock")
    public Medicine updateStock(@PathVariable Long id, @RequestParam int qty) {
        Medicine m = repo.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found: " + id));
        int newQty = m.getStockQty() + qty;
        if (newQty < 0)
            throw new RuntimeException("Not enough stock. Current stock: " + m.getStockQty());
        m.setStockQty(newQty);
        return repo.save(m);
    }

    @GetMapping("/low-stock")
    public List<Medicine> getLowStock() {
        return repo.findLowStockMedicines();
    }
}
