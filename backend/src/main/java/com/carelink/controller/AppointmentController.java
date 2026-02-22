package com.carelink.controller;

import com.carelink.entity.Appointment;
import com.carelink.entity.AppointmentStatus;
import com.carelink.entity.Role;
import com.carelink.entity.User;
import com.carelink.dto.CreateAppointmentRequest;
import com.carelink.dto.AppointmentResponse;
import com.carelink.repository.AppointmentRepository;
import com.carelink.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentController(AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(
            @AuthenticationPrincipal User doctor,
            @RequestBody CreateAppointmentRequest request) {
        if (doctor.getRole() != Role.DOCTOR) {
            return ResponseEntity.status(403).body("Only doctors can create appointments.");
        }

        User patient = userRepository.findById(request.getPatientId()).orElse(null);
        if (patient == null || patient.getRole() != Role.PATIENT) {
            return ResponseEntity.badRequest().body("Invalid patient ID.");
        }

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setNotes(request.getNotes());

        Appointment saved = appointmentRepository.save(appointment);

        return ResponseEntity.ok(mapToResponse(saved));
    }

    @GetMapping("/me")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(@AuthenticationPrincipal User user) {
        List<Appointment> appointments;
        if (user.getRole() == Role.DOCTOR) {
            appointments = appointmentRepository.findByDoctor_IdOrderByAppointmentDateAsc(user.getId());
        } else if (user.getRole() == Role.PATIENT) {
            appointments = appointmentRepository.findByPatient_IdOrderByAppointmentDateAsc(user.getId());
        } else {
            return ResponseEntity.status(403).build();
        }

        List<AppointmentResponse> dtos = appointments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private AppointmentResponse mapToResponse(Appointment appt) {
        AppointmentResponse res = new AppointmentResponse();
        res.setId(appt.getId());
        res.setDoctorId(appt.getDoctor().getId());
        res.setDoctorName("Dr. " + appt.getDoctor().getLastName());
        res.setPatientId(appt.getPatient().getId());
        res.setPatientName(appt.getPatient().getFirstName() + " " + appt.getPatient().getLastName());
        res.setAppointmentDate(appt.getAppointmentDate());
        res.setStatus(appt.getStatus().name());
        res.setNotes(appt.getNotes());
        return res;
    }
}
