package com.carelink.controller;

import com.carelink.dto.DoctorReviewRequest;
import com.carelink.dto.DoctorReviewResponse;
import com.carelink.entity.Appointment;
import com.carelink.entity.DoctorReview;
import com.carelink.entity.Role;
import com.carelink.entity.User;
import com.carelink.repository.AppointmentRepository;
import com.carelink.repository.DoctorReviewRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/doctor-reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class DoctorReviewController {

    private final DoctorReviewRepository doctorReviewRepository;
    private final AppointmentRepository appointmentRepository;

    public DoctorReviewController(DoctorReviewRepository doctorReviewRepository, AppointmentRepository appointmentRepository) {
        this.doctorReviewRepository = doctorReviewRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorReviewResponse>> getDoctorReviews(@PathVariable Long doctorId) {
        List<DoctorReviewResponse> reviews = doctorReviewRepository.findByDoctor_IdOrderByCreatedAtDesc(doctorId)
                .stream()
                .map(DoctorReviewResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/me")
    public ResponseEntity<List<DoctorReviewResponse>> getMyReviews(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != Role.DOCTOR) {
            return ResponseEntity.status(403).build();
        }
        List<DoctorReviewResponse> reviews = doctorReviewRepository.findByDoctor_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(DoctorReviewResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    public ResponseEntity<?> submitReview(@AuthenticationPrincipal User user,
            @Valid @RequestBody DoctorReviewRequest request) {
        if (user == null || user.getRole() != Role.PATIENT) {
            return ResponseEntity.status(401).body(Map.of("message", "Only patients can leave doctor reviews."));
        }

        Appointment appt = appointmentRepository.findById(request.getAppointmentId()).orElse(null);
        if (appt == null || !appt.getPatient().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid appointment."));
        }
        
        if (!appt.getStatus().name().equals("COMPLETED")) {
            return ResponseEntity.badRequest().body(Map.of("message", "You can only review completed appointments."));
        }

        if (doctorReviewRepository.existsByAppointment_Id(appt.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "You have already reviewed this appointment."));
        }

        DoctorReview review = new DoctorReview();
        review.setPatient(user);
        review.setDoctor(appt.getDoctor());
        review.setAppointment(appt);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());

        doctorReviewRepository.save(review);
        return ResponseEntity.ok(new DoctorReviewResponse(review));
    }
}
