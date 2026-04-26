package com.carelink.controller;

import com.carelink.repository.AppointmentRepository;
import com.carelink.repository.SaleRepository;
import com.carelink.repository.LabReportRepository;
import com.carelink.entity.AppointmentStatus;
import com.carelink.entity.LabTestStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/finance")
@PreAuthorize("hasRole('ADMIN')")
public class FinanceController {

    private final AppointmentRepository appointmentRepo;
    private final SaleRepository saleRepo;
    private final LabReportRepository labReportRepo;

    public FinanceController(AppointmentRepository appointmentRepo, SaleRepository saleRepo, LabReportRepository labReportRepo) {
        this.appointmentRepo = appointmentRepo;
        this.saleRepo = saleRepo;
        this.labReportRepo = labReportRepo;
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getFinancialSummary() {
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        // 1. Doctor Payments
        var appointments = appointmentRepo.findAll();
        double doctorTotal = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.CONFIRMED || a.getStatus() == AppointmentStatus.CONFIRMED_PAID || a.getStatus() == AppointmentStatus.COMPLETED)
                .mapToDouble(a -> 2500.0)
                .sum();
        
        double doctorMonthly = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.CONFIRMED || a.getStatus() == AppointmentStatus.CONFIRMED_PAID || a.getStatus() == AppointmentStatus.COMPLETED)
                .filter(a -> a.getAppointmentDate().isAfter(startOfMonth) || a.getAppointmentDate().isEqual(startOfMonth))
                .mapToDouble(a -> 2500.0)
                .sum();

        Map<String, Double> doctorBreakdown = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.CONFIRMED || a.getStatus() == AppointmentStatus.CONFIRMED_PAID || a.getStatus() == AppointmentStatus.COMPLETED)
                .collect(Collectors.groupingBy(
                        a -> "Dr. " + a.getDoctor().getFirstName() + " " + a.getDoctor().getLastName(),
                        Collectors.summingDouble(a -> 2500.0)
                ));
        
        Map<String, Double> doctorMonthlyBreakdown = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.CONFIRMED || a.getStatus() == AppointmentStatus.CONFIRMED_PAID || a.getStatus() == AppointmentStatus.COMPLETED)
                .filter(a -> a.getAppointmentDate().isAfter(startOfMonth) || a.getAppointmentDate().isEqual(startOfMonth))
                .collect(Collectors.groupingBy(
                        a -> "Dr. " + a.getDoctor().getFirstName() + " " + a.getDoctor().getLastName(),
                        Collectors.summingDouble(a -> 2500.0)
                ));

        // 2. Pharmacy Payments
        var sales = saleRepo.findAll();
        double pharmacyTotal = sales.stream()
                .mapToDouble(s -> s.getTotalAmount())
                .sum();
        
        double pharmacyMonthly = sales.stream()
                .filter(s -> s.getCreatedAt().isAfter(startOfMonth) || s.getCreatedAt().isEqual(startOfMonth))
                .mapToDouble(s -> s.getTotalAmount())
                .sum();

        // 3. Lab Payments
        var labReports = labReportRepo.findAll();
        double labTotal = labReports.stream()
                .filter(r -> r.isPaid())
                .mapToDouble(r -> r.getLabTest().getPrice() != null ? r.getLabTest().getPrice() : 0.0)
                .sum();
        
        double labMonthly = labReports.stream()
                .filter(r -> r.isPaid())
                .filter(r -> r.getCreatedAt().isAfter(startOfMonth) || r.getCreatedAt().isEqual(startOfMonth))
                .mapToDouble(r -> r.getLabTest().getPrice() != null ? r.getLabTest().getPrice() : 0.0)
                .sum();

        Map<String, Double> labBreakdown = labReports.stream()
                .filter(r -> r.isPaid())
                .collect(Collectors.groupingBy(
                        r -> r.getLabTest().getName(),
                        Collectors.summingDouble(r -> r.getLabTest().getPrice() != null ? r.getLabTest().getPrice() : 0.0)
                ));
        
        Map<String, Double> labMonthlyBreakdown = labReports.stream()
                .filter(r -> r.isPaid())
                .filter(r -> r.getCreatedAt().isAfter(startOfMonth) || r.getCreatedAt().isEqual(startOfMonth))
                .collect(Collectors.groupingBy(
                        r -> r.getLabTest().getName(),
                        Collectors.summingDouble(r -> r.getLabTest().getPrice() != null ? r.getLabTest().getPrice() : 0.0)
                ));

        Map<String, Object> response = new HashMap<>();
        response.put("doctorTotal", doctorTotal);
        response.put("doctorMonthly", doctorMonthly);
        response.put("doctorBreakdown", doctorBreakdown);
        response.put("doctorMonthlyBreakdown", doctorMonthlyBreakdown);
        response.put("pharmacyTotal", pharmacyTotal);
        response.put("pharmacyMonthly", pharmacyMonthly);
        response.put("labTotal", labTotal);
        response.put("labMonthly", labMonthly);
        response.put("labBreakdown", labBreakdown);
        response.put("labMonthlyBreakdown", labMonthlyBreakdown);
        response.put("grandTotal", doctorTotal + pharmacyTotal + labTotal);
        response.put("monthlyTotal", doctorMonthly + pharmacyMonthly + labMonthly);
        response.put("currentMonth", LocalDate.now().getMonth().toString());

        return ResponseEntity.ok(response);
    }
}
