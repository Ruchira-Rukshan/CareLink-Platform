package com.carelink.controller;

import com.carelink.entity.Medicine;
import com.carelink.repository.MedicineRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/medicines/alerts")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryAlertController {

    private final MedicineRepository repo;

    public InventoryAlertController(MedicineRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public Map<String, Object> alerts(@RequestParam(defaultValue = "30") int days) {
        LocalDate today = LocalDate.now();
        LocalDate soon = today.plusDays(days);

        List<Medicine> expired = repo.findByExpiryDateBefore(today);
        List<Medicine> expiringSoon = repo.findByExpiryDateBetween(today, soon);

        List<Medicine> all = repo.findAll();
        List<Medicine> lowStock = new ArrayList<>();
        for (Medicine m : all) {
            if (m.getStockQty() <= m.getMinStockLevel())
                lowStock.add(m);
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("expired", expired);
        res.put("expiringSoon", expiringSoon);
        res.put("lowStock", lowStock);
        res.put("daysWindow", days);
        return res;
    }
}
