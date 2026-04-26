package com.carelink.controller;

import com.carelink.entity.LabReport;
import com.carelink.entity.LabTestStatus;
import com.carelink.entity.User;
import com.carelink.repository.UserRepository;
import com.carelink.service.LaboratoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lab-reports")
public class LabReportApiController {

    private final LaboratoryService laboratoryService;
    private final UserRepository userRepository;

    public LabReportApiController(LaboratoryService laboratoryService, UserRepository userRepository) {
        this.laboratoryService = laboratoryService;
        this.userRepository = userRepository;
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyReports(Principal principal) {
        try {
            User patient = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(laboratoryService.getReportsByPatient(patient));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/tech")
    public ResponseEntity<?> getTechReports(Principal principal) {
        try {
            User tech = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (!"LAB_TECH".equals(tech.getRole().name())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            return ResponseEntity.ok(laboratoryService.getAllReports());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllReports(Principal principal) {
        try {
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Logged in user not found"));
            if (!"LAB_TECH".equals(user.getRole().name()) && !"ADMIN".equals(user.getRole().name())) {
                return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
            }
            return ResponseEntity.ok(laboratoryService.getAllReports());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") String statusStr,
            @RequestParam(value = "notes", required = false) String notes,
            @RequestParam(value = "reportFileUrl", required = false) String reportFileUrl,
            Principal principal) {
        try {
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Logged in user not found"));

            if (!"LAB_TECH".equals(user.getRole().name()) && !"ADMIN".equals(user.getRole().name())) {
                return ResponseEntity.status(403)
                        .body(Map.of("message", "Access denied: Only Lab Technicians can update reports"));
            }

            LabTestStatus status;
            try {
                status = LabTestStatus.valueOf(statusStr);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid status: " + statusStr));
            }

            LabReport report = laboratoryService.updateReportStatus(id, status, notes, reportFileUrl);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Principal principal) {
        try {
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (!"LAB_TECH".equals(user.getRole().name()) && !"ADMIN".equals(user.getRole().name())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            return ResponseEntity.ok(laboratoryService.getStatusSummary());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
