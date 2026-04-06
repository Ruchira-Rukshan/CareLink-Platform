package com.carelink.controller;

import com.carelink.entity.EmergencyAlert;
import com.carelink.entity.User;
import com.carelink.entity.Role;
import com.carelink.repository.UserRepository;
import com.carelink.service.EmergencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/emergency")
public class EmergencyController {

    @Autowired
    private EmergencyService emergencyService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/panic")
    public ResponseEntity<EmergencyAlert> triggerPanic(
            @AuthenticationPrincipal User patient,
            @RequestBody Map<String, Double> location) {
        
        Double lat = location.get("latitude");
        Double lng = location.get("longitude");
        
        return ResponseEntity.ok(emergencyService.createAlert(patient, lat, lng));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<EmergencyAlert>> getAllAlerts() {
        return ResponseEntity.ok(emergencyService.getAllAlerts());
    }

    @GetMapping("/alerts/pending")
    public ResponseEntity<List<EmergencyAlert>> getPendingAlerts() {
        return ResponseEntity.ok(emergencyService.getPendingAlerts());
    }

    @PatchMapping("/alerts/{id}/status")
    public ResponseEntity<EmergencyAlert> updateAlertStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> update) {
        
        String status = update.get("status");
        String notes = update.get("notes");
        
        return ResponseEntity.ok(emergencyService.updateStatus(id, status, notes, user));
    }

    @PostMapping("/ambulance/register")
    public ResponseEntity<User> registerAmbulance(@RequestBody Map<String, String> payload) {
        if (userRepository.findByEmail(payload.get("email")).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        User ambulance = new User();
        ambulance.setEmail(payload.get("email"));
        ambulance.setUsername(payload.get("email")); // Required field
        ambulance.setPassword(passwordEncoder.encode(payload.get("password")));
        ambulance.setFirstName(payload.get("plateNumber") != null ? payload.get("plateNumber") : "Ambulance");
        ambulance.setLastName("Responder");
        ambulance.setRole(Role.EMERGENCY);
        ambulance.setApproved(true); // Allow login immediately
        return ResponseEntity.ok(userRepository.save(ambulance));
    }

    @GetMapping("/ambulances")
    public ResponseEntity<List<User>> getAllAmbulances() {
        return ResponseEntity.ok(userRepository.findByRole(Role.EMERGENCY));
    }
}
