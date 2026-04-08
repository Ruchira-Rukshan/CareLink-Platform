package com.carelink.controller;

import com.carelink.dto.CreateSaleRequest;
import com.carelink.entity.Sale;
import com.carelink.entity.SaleStatus;
import com.carelink.repository.SaleRepository;
import com.carelink.service.SaleService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/sales")
@CrossOrigin(origins = "http://localhost:3000")
public class SaleController {

    private final SaleService saleService;
    private final SaleRepository saleRepo;

    public SaleController(SaleService saleService, SaleRepository saleRepo) {
        this.saleService = saleService;
        this.saleRepo = saleRepo;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Sale create(@RequestBody CreateSaleRequest req) {
        return saleService.createSale(req);
    }

    @GetMapping
    public List<Sale> getAll() {
        return saleRepo.findAll();
    }

    @GetMapping("/{id}")
    public Sale get(@PathVariable Long id) {
        return saleRepo.findById(id).orElseThrow(() -> new RuntimeException("Sale not found: " + id));
    }

    @PatchMapping("/{id}/status")
    public Sale updateStatus(@PathVariable Long id, @RequestParam SaleStatus status) {
        Sale sale = saleRepo.findById(id).orElseThrow(() -> new RuntimeException("Sale not found: " + id));
        sale.setStatus(status);
        return saleRepo.save(sale);
    }

    @PatchMapping("/{id}/cancel")
    public Sale cancel(@PathVariable Long id) {
        return saleService.cancelSale(id);
    }

    @GetMapping("/stats/today")
    public Double getTodaySales() {
        return saleService.getTodaySalesCount();
    }
}
