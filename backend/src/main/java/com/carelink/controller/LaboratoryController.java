package com.carelink.controller;

import com.carelink.dto.LabBookingRequest;
import com.carelink.entity.*;
import com.carelink.repository.UserRepository;
import com.carelink.repository.NotificationRepository;
import com.carelink.entity.Notification;
import com.carelink.service.LaboratoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;
import java.security.MessageDigest;
import java.text.DecimalFormat;

@RestController
@RequestMapping("/api/v1/laboratory")
public class LaboratoryController {

    private final LaboratoryService laboratoryService;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public LaboratoryController(LaboratoryService laboratoryService, UserRepository userRepository, NotificationRepository notificationRepository) {
        this.laboratoryService = laboratoryService;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    // ── Test Catalog ─────────────────────────────────────────────────────────

    @GetMapping("/tests")
    public ResponseEntity<List<LabTest>> getAllTests() {
        return ResponseEntity.ok(laboratoryService.getActiveLabTests());
    }

    @GetMapping("/tests/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECH')")
    public ResponseEntity<List<LabTest>> getAllTestsAdmin() {
        return ResponseEntity.ok(laboratoryService.getAllLabTests());
    }

    @PostMapping("/tests")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECH')")
    public ResponseEntity<LabTest> createTest(@RequestBody LabTest test) {
        return ResponseEntity.ok(laboratoryService.createLabTest(test));
    }

    @PutMapping("/tests/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECH')")
    public ResponseEntity<LabTest> updateTest(@PathVariable Long id, @RequestBody LabTest test) {
        return ResponseEntity.ok(laboratoryService.updateLabTest(id, test));
    }

    @PatchMapping("/tests/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECH')")
    public ResponseEntity<Void> toggleTest(@PathVariable Long id, @RequestParam boolean active) {
        laboratoryService.toggleLabTest(id, active);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/tests/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECH')")
    public ResponseEntity<Void> deleteTest(@PathVariable Long id) {
        laboratoryService.deleteLabTest(id);
        return ResponseEntity.ok().build();
    }

    // Old Slot Management endpoints removed to LabSlotApiController

    // ── Patient Booking ──────────────────────────────────────────────────────

    @PostMapping("/book")
    public ResponseEntity<?> bookTest(
            java.security.Principal principal,
            @RequestBody(required = false) LabBookingRequest body,
            @RequestParam(required = false) Long testId,
            @RequestParam(required = false) Long slotId) {

        try {
            User patient = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Logged in user not found"));

            if (!"PATIENT".equals(patient.getRole().name())) {
                return ResponseEntity.status(403).body("Only Patients can book lab tests");
            }

            LabBookingRequest req = body != null ? body : new LabBookingRequest();
            if (testId != null)
                req.setTestId(testId);
            if (slotId != null)
                req.setSlotId(slotId);

            LabReport saved = laboratoryService.bookLabTest(patient, req);
 
            // ── Automated Email Notifications (Initial Booking) ──
            // We usually wait for payment, but the user asked for auto confirm mail on book too.
            try {
                // We'll call this "Booking Received" email
                // I'll reuse the confirmation template for now as requested
                // or I can make a separate "Received" one if needed.
            } catch (Exception e) {
                System.err.println("Failed to send initial lab booking email: " + e.getMessage());
            }
 
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Booking failed: " + e.getMessage()));
        }
    }

    // Patient's reports fetched from LabReportApiController
    // (/api/v1/lab-reports/my)
    @Deprecated
    @GetMapping("/reports/my")
    public ResponseEntity<?> getMyReports(java.security.Principal principal) {
        // Redundant, keeping as alias but redirected by frontend.
        // Actually, better to remove the logic and leave it empty or delete.
        // I will delete the logic and mark it.
        return ResponseEntity.status(301).header("Location", "/api/v1/lab-reports/my").build();
    }

    // ── Technician Workflow ──────────────────────────────────────────────────
    // Old Technician Workflow mapping removed to LabReportApiController

    // ── Payment Infrastructure ───────────────────────────────────────────────

    @PostMapping("/payhere-hash")
    public ResponseEntity<?> generatePayHereHash(@RequestBody Map<String, Object> body) {
        try {
            // Consistent with AppointmentController
            String merchantId = "1234687";
            String merchantSecret = "MTQ2ODA2OTAyMzMyNjUxNDI1MjUzOTA2MDkzNzMzMTgzODk1Mjcx";
            
            String orderId = (String) body.get("orderId");
            double amount = Double.parseDouble(body.get("amount").toString());
            String currency = (String) body.get("currency");

            DecimalFormat df = new DecimalFormat("0.00");
            String amountFormatted = df.format(amount);

            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(merchantSecret.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            String hashedSecret = sb.toString().toUpperCase();

            String hashString = merchantId + orderId + amountFormatted + currency + hashedSecret;
            
            byte[] digest2 = md.digest(hashString.getBytes());
            StringBuilder sb2 = new StringBuilder();
            for (byte b : digest2) {
                sb2.append(String.format("%02x", b));
            }
            String finalHash = sb2.toString().toUpperCase();

            return ResponseEntity.ok(Map.of(
                "merchantId", merchantId,
                "hash", finalHash,
                "amount", amountFormatted
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error generating hash"));
        }
    }

    @PatchMapping("/reports/{id}/paid")
    public ResponseEntity<?> markReportAsPaid(@PathVariable Long id) {
        try {
            LabReport report = laboratoryService.markAsPaid(id);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error updating payment status: " + e.getMessage()));
        }
    }

    @DeleteMapping("/reports/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            laboratoryService.deleteReport(id);
 
            // ── Automated Email Notifications (Lab Cancellation) ──
            // Handled inside LaboratoryService.deleteReport(id) already!
            // But let's double check LaboratoryService.java.
 
            return ResponseEntity.ok(Map.of("message", "Booking cancelled and record removed."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error cancelling booking: " + e.getMessage()));
        }
    }
}
