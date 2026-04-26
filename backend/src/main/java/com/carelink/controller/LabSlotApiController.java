package com.carelink.controller;

import com.carelink.entity.LabSlot;
import com.carelink.entity.User;
import com.carelink.repository.UserRepository;
import com.carelink.service.LaboratoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lab-slots")
public class LabSlotApiController {

    private final LaboratoryService laboratoryService;
    private final UserRepository userRepository;

    public LabSlotApiController(LaboratoryService laboratoryService, UserRepository userRepository) {
        this.laboratoryService = laboratoryService;
        this.userRepository = userRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createSlot(Principal principal, @RequestBody Map<String, Object> body) {
        try {
            User tech = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Logged in user not found"));

            if (!tech.getRole().name().equals("LAB_TECH")) {
                return ResponseEntity.status(403).body("Only Lab Technicians can create slots");
            }

            String testTimeStr = (String) body.get("testTime");
            String endTimeStr = (String) body.get("endTime");
            Integer capacity = body.get("capacity") != null ? Integer.parseInt(body.get("capacity").toString()) : 1;

            LocalDateTime testTime = LocalDateTime.parse(testTimeStr);
            LocalDateTime endTime = null;
            if (endTimeStr != null && !endTimeStr.isBlank()) {
                endTime = LocalDateTime.parse(endTimeStr);
            }

            if (endTime != null && endTime.isAfter(testTime)) {
                List<LabSlot> createdSlots = new java.util.ArrayList<>();
                LocalDateTime current = testTime;
                while (current.isBefore(endTime)) {
                    LabSlot slot = new LabSlot();
                    slot.setLabTech(tech);
                    slot.setTestTime(current);

                    LocalDateTime next = current.plusMinutes(30);
                    if (next.isAfter(endTime)) {
                        slot.setEndTime(endTime);
                        current = endTime; // terminate
                    } else {
                        slot.setEndTime(next);
                        current = next;
                    }
                    slot.setCapacity(capacity);
                    createdSlots.add(laboratoryService.createSlot(slot));
                }
                return ResponseEntity.ok(createdSlots);
            } else {
                LabSlot slot = new LabSlot();
                slot.setLabTech(tech);
                slot.setTestTime(testTime);
                slot.setEndTime(endTime);
                slot.setCapacity(capacity);
                return ResponseEntity.ok(laboratoryService.createSlot(slot));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating slot: " + e.getMessage());
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<LabSlot>> getAvailableSlots() {
        return ResponseEntity.ok(laboratoryService.getAllAvailableSlots());
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMySlots(Principal principal) {
        try {
            User tech = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(laboratoryService.getFutureSlotsByTech(tech));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching slots: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllMySlots(Principal principal) {
        try {
            User tech = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(laboratoryService.getSlotsByTech(tech));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching slots: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<?> closeSlot(@PathVariable Long id, Principal principal) {
        try {
            User tech = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (!tech.getRole().name().equals("LAB_TECH")) {
                return ResponseEntity.status(403).body("Only Lab Technicians can close slots");
            }
            return ResponseEntity.ok(laboratoryService.closeSlot(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error closing slot: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/reopen")
    public ResponseEntity<?> reopenSlot(@PathVariable Long id, Principal principal) {
        try {
            User tech = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (!tech.getRole().name().equals("LAB_TECH")) {
                return ResponseEntity.status(403).body("Only Lab Technicians can reopen slots");
            }
            return ResponseEntity.ok(laboratoryService.reopenSlot(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error reopening slot: " + e.getMessage());
        }
    }
}
