package com.carelink.controller;

import com.carelink.entity.DoctorSchedule;
import com.carelink.entity.Role;
import com.carelink.entity.User;
import com.carelink.entity.Appointment;
import com.carelink.entity.AppointmentStatus;
import com.carelink.repository.DoctorScheduleRepository;
import com.carelink.repository.AppointmentRepository;
import com.carelink.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/schedules")
@CrossOrigin(origins = "http://localhost:3000")
public class DoctorScheduleController {

    private final DoctorScheduleRepository scheduleRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public DoctorScheduleController(DoctorScheduleRepository scheduleRepository,
            AppointmentRepository appointmentRepository,
            UserRepository userRepository) {
        this.scheduleRepository = scheduleRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    // ── Doctor: Save a shift schedule ─────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> createSchedule(
            @AuthenticationPrincipal User doctor,
            @RequestBody Map<String, Object> body) {

        if (doctor == null || doctor.getRole() != Role.DOCTOR) {
            return ResponseEntity.status(403).body("Only doctors can create schedules.");
        }

        DoctorSchedule schedule = new DoctorSchedule();
        schedule.setDoctor(doctor);
        schedule.setScheduleDate(LocalDate.parse((String) body.get("scheduleDate")));
        schedule.setShiftStart(LocalTime.parse((String) body.get("shiftStart")));
        schedule.setShiftEnd(LocalTime.parse((String) body.get("shiftEnd")));
        if (schedule.getShiftEnd().isBefore(schedule.getShiftStart())) {
            return ResponseEntity.badRequest().body("Shift end time must be after start time.");
        }

        schedule.setConsultationDuration(Integer.parseInt(body.get("consultationDuration").toString()));

        String breakStart = (String) body.get("breakStart");
        String breakEnd = (String) body.get("breakEnd");
        schedule.setBreakStart(breakStart != null && !breakStart.isBlank() ? LocalTime.parse(breakStart) : null);
        schedule.setBreakEnd(breakEnd != null && !breakEnd.isBlank() ? LocalTime.parse(breakEnd) : null);

        Object fee = body.get("consultationFee");
        if (fee != null)
            schedule.setConsultationFee(new BigDecimal(fee.toString()));

        scheduleRepository.save(schedule);
        return ResponseEntity.ok(Map.of("message", "Schedule saved successfully", "id", schedule.getId()));
    }

    // ── Doctor: Update a shift schedule ────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchedule(
            @AuthenticationPrincipal User doctor,
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {

        if (doctor == null || doctor.getRole() != Role.DOCTOR) {
            return ResponseEntity.status(403).body("Only doctors can update schedules.");
        }

        DoctorSchedule schedule = scheduleRepository.findById(id).orElse(null);
        if (schedule == null || !schedule.getDoctor().getId().equals(doctor.getId())) {
            return ResponseEntity.notFound().build();
        }

        // Check if there are active appointments for this date
        long activeAppts = appointmentRepository.findByDoctor_IdOrderByAppointmentDateAsc(doctor.getId())
                .stream()
                .filter(a -> a.getAppointmentDate().toLocalDate().equals(schedule.getScheduleDate()))
                .filter(a -> a.getStatus() == AppointmentStatus.CONFIRMED || a.getStatus() == AppointmentStatus.CONFIRMED_PAID)
                .count();

        if (activeAppts > 0) {
            // Optional: you might allow updating fee, but not Duration/Times if appointments exist.
            // For now, let's keep it simple: blocking if appointments exist.
            return ResponseEntity.badRequest().body("Cannot update schedule with existing confirmed appointments.");
        }

        if (body.get("scheduleDate") != null) {
            schedule.setScheduleDate(LocalDate.parse((String) body.get("scheduleDate")));
        }
        if (schedule.getShiftEnd().isBefore(schedule.getShiftStart())) {
            return ResponseEntity.badRequest().body("Shift end time must be after start time.");
        }

        String breakStart = (String) body.get("breakStart");
        String breakEnd = (String) body.get("breakEnd");
        schedule.setBreakStart(breakStart != null && !breakStart.isBlank() ? LocalTime.parse(breakStart) : null);
        schedule.setBreakEnd(breakEnd != null && !breakEnd.isBlank() ? LocalTime.parse(breakEnd) : null);

        Object fee = body.get("consultationFee");
        if (fee != null)
            schedule.setConsultationFee(new BigDecimal(fee.toString()));

        scheduleRepository.save(schedule);
        return ResponseEntity.ok(Map.of("message", "Schedule updated successfully"));
    }

    // ── Doctor: Delete a shift schedule ────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchedule(
            @AuthenticationPrincipal User doctor,
            @PathVariable Long id) {

        if (doctor == null || doctor.getRole() != Role.DOCTOR) {
            return ResponseEntity.status(403).body("Only doctors can delete schedules.");
        }

        DoctorSchedule schedule = scheduleRepository.findById(id).orElse(null);
        if (schedule == null || !schedule.getDoctor().getId().equals(doctor.getId())) {
            return ResponseEntity.notFound().build();
        }

        // Safety check: Don't delete if there are active appointments
        long activeAppts = appointmentRepository.findByDoctor_IdOrderByAppointmentDateAsc(doctor.getId())
                .stream()
                .filter(a -> a.getAppointmentDate().toLocalDate().equals(schedule.getScheduleDate()))
                .filter(a -> a.getStatus() == AppointmentStatus.CONFIRMED || a.getStatus() == AppointmentStatus.CONFIRMED_PAID)
                .count();

        if (activeAppts > 0) {
            return ResponseEntity.badRequest().body("Cannot delete schedule with active confirmed appointments. Please cancel those first.");
        }

        scheduleRepository.delete(schedule);
        return ResponseEntity.ok(Map.of("message", "Schedule deleted successfully"));
    }

    // ── Doctor: Get own schedules ──────────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> getMySchedules(@AuthenticationPrincipal User doctor) {
        if (doctor == null || doctor.getRole() != Role.DOCTOR) {
            return ResponseEntity.status(403).build();
        }
        List<DoctorSchedule> schedules = scheduleRepository.findByDoctor_IdOrderByScheduleDateAsc(doctor.getId());
        List<Map<String, Object>> result = schedules.stream().map(this::toScheduleMap).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // ── Public: List approved doctors (filterable by specialty) ───────────────
    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctors(@RequestParam(required = false) String specialty) {
        List<User> doctors = userRepository.findByRole(Role.DOCTOR).stream()
                .filter(User::isApproved)
                .filter(d -> specialty == null || specialty.isBlank()
                        || (d.getSpecialization() != null && d.getSpecialization().equalsIgnoreCase(specialty)))
                .collect(Collectors.toList());

        List<Map<String, Object>> result = doctors.stream().map(d -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", d.getId());
            m.put("name", "Dr. " + d.getFirstName() + " " + d.getLastName());
            m.put("specialization", d.getSpecialization());
            m.put("qualifications", d.getQualifications());
            m.put("yearsOfExperience", d.getYearsOfExperience());
            m.put("email", d.getEmail());
            m.put("profilePicturePath", d.getProfilePicturePath());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // ── Public: Get available time slots for a doctor on a date ───────────────
    @GetMapping("/slots")
    public ResponseEntity<?> getAvailableSlots(
            @RequestParam Long doctorId,
            @RequestParam String date) {

        LocalDate localDate = LocalDate.parse(date);

        Optional<DoctorSchedule> scheduleOpt = scheduleRepository
                .findByScheduleDateAndDoctor_Id(localDate, doctorId);

        if (scheduleOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("slots", List.of(), "fee", 0));
        }

        DoctorSchedule schedule = scheduleOpt.get();

        // Get already-booked slots for this doctor on this date
        List<Appointment> booked = appointmentRepository
                .findByDoctor_IdOrderByAppointmentDateAsc(doctorId)
                .stream()
                .filter(a -> a.getAppointmentDate().toLocalDate().equals(localDate))
                .filter(a -> a.getStatus() == AppointmentStatus.CONFIRMED || a.getStatus() == AppointmentStatus.CONFIRMED_PAID || a.getStatus() == AppointmentStatus.COMPLETED)
                .collect(Collectors.toList());

        Set<LocalTime> bookedTimes = booked.stream()
                .map(a -> a.getAppointmentDate().toLocalTime())
                .collect(Collectors.toSet());

        // Generate slots
        List<String> slots = new ArrayList<>();
        LocalTime current = schedule.getShiftStart();
        int duration = schedule.getConsultationDuration();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm");

        while (current.plusMinutes(duration).compareTo(schedule.getShiftEnd()) <= 0) {
            LocalTime slotEnd = current.plusMinutes(duration);

            // Skip if overlaps break
            boolean inBreak = false;
            if (schedule.getBreakStart() != null && schedule.getBreakEnd() != null) {
                inBreak = current.isBefore(schedule.getBreakEnd()) && slotEnd.isAfter(schedule.getBreakStart());
            }

            // Skip if already booked
            boolean isBooked = bookedTimes.contains(current);

            if (!inBreak && !isBooked) {
                slots.add(current.format(fmt));
            }

            current = slotEnd;
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("slots", slots);
        response.put("fee", schedule.getConsultationFee() != null ? schedule.getConsultationFee() : 0);
        response.put("duration", schedule.getConsultationDuration());

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> toScheduleMap(DoctorSchedule s) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", s.getId());
        m.put("scheduleDate", s.getScheduleDate().toString());
        m.put("shiftStart", s.getShiftStart().toString());
        m.put("shiftEnd", s.getShiftEnd().toString());
        m.put("consultationDuration", s.getConsultationDuration());
        m.put("breakStart", s.getBreakStart() != null ? s.getBreakStart().toString() : null);
        m.put("breakEnd", s.getBreakEnd() != null ? s.getBreakEnd().toString() : null);
        m.put("consultationFee", s.getConsultationFee());
        return m;
    }
}
