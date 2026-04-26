package com.carelink.controller;

import com.carelink.dto.CreatePrescriptionRequest;
import com.carelink.entity.Prescription;
import com.carelink.entity.User;
import com.carelink.service.PrescriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/prescriptions")
@CrossOrigin(origins = "http://localhost:3000")
public class PrescriptionController {

    private final PrescriptionService service;

    public PrescriptionController(PrescriptionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal User user, @RequestBody CreatePrescriptionRequest req) {
        if (!"DOCTOR".equals(user.getRole().name())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Only doctors can issue prescriptions"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(user.getId(), req));
    }

    @GetMapping("/me/issued")
    public List<Prescription> getMyIssued(@AuthenticationPrincipal User user) {
        return service.getByDoctor(user.getId());
    }

    @GetMapping("/me/received")
    public List<Prescription> getMyReceived(@AuthenticationPrincipal User user) {
        return service.getByPatient(user.getId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam Long patientId) {
        return ResponseEntity.ok(service.getByPatient(patientId));
    }
}
