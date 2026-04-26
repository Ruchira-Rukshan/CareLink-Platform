package com.carelink.controller;

import com.carelink.entity.MedicineBatch;
import com.carelink.entity.Medicine;
import com.carelink.repository.MedicineBatchRepository;
import com.carelink.repository.MedicineRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/batches")
@CrossOrigin(origins = "http://localhost:3000")
public class BatchController {

    private final MedicineBatchRepository batchRepo;
    private final MedicineRepository medicineRepo;

    public BatchController(MedicineBatchRepository batchRepo, MedicineRepository medicineRepo) {
        this.batchRepo = batchRepo;
        this.medicineRepo = medicineRepo;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MedicineBatch create(@RequestParam Long medicineId, @RequestBody MedicineBatch payload) {
        Medicine med = medicineRepo.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found: " + medicineId));

        MedicineBatch batch = batchRepo.findByMedicine_IdAndBatchNumber(medicineId, payload.getBatchNumber())
                .orElseGet(MedicineBatch::new);

        if (batch.getId() == null) {
            batch.setMedicine(med);
            batch.setBatchNumber(payload.getBatchNumber());
            batch.setExpiryDate(payload.getExpiryDate());
            batch.setReceivedDate(payload.getReceivedDate());
            batch.setQty(0);
        } else {
            if (!batch.getExpiryDate().equals(payload.getExpiryDate())) {
                throw new RuntimeException("Batch number already exists with different expiry date.");
            }
        }

        if (payload.getQty() <= 0)
            throw new RuntimeException("Qty must be > 0");

        batch.setQty(batch.getQty() + payload.getQty());
        med.setStockQty(med.getStockQty() + payload.getQty());
        medicineRepo.save(med);
        return batchRepo.save(batch);
    }

    @GetMapping("/medicine/{medicineId}")
    public List<MedicineBatch> listByMedicine(@PathVariable Long medicineId) {
        return batchRepo.findByMedicine_IdOrderByExpiryDateAsc(medicineId);
    }

    @GetMapping("/{id}")
    public MedicineBatch get(@PathVariable Long id) {
        return batchRepo.findById(id).orElseThrow(() -> new RuntimeException("Batch not found: " + id));
    }

    @PutMapping("/{id}")
    public MedicineBatch update(@PathVariable Long id, @RequestBody MedicineBatch payload) {
        MedicineBatch b = batchRepo.findById(id).orElseThrow(() -> new RuntimeException("Batch not found: " + id));
        int diff = payload.getQty() - b.getQty();
        b.setBatchNumber(payload.getBatchNumber());
        b.setQty(payload.getQty());
        b.setExpiryDate(payload.getExpiryDate());
        b.setReceivedDate(payload.getReceivedDate());

        Medicine med = b.getMedicine();
        med.setStockQty(med.getStockQty() + diff);
        medicineRepo.save(med);
        return batchRepo.save(b);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        MedicineBatch b = batchRepo.findById(id).orElseThrow(() -> new RuntimeException("Batch not found: " + id));
        Medicine med = b.getMedicine();
        med.setStockQty(Math.max(0, med.getStockQty() - b.getQty()));
        medicineRepo.save(med);
        batchRepo.delete(b);
    }
}
