package com.carelink.service;

import com.carelink.entity.Appointment;
import com.carelink.entity.AppointmentStatus;
import com.carelink.repository.AppointmentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class AppointmentCleanupService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentCleanupService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    /**
     * Periodically checks for appointments that have passed their scheduled time
     * and are still in PENDING or CONFIRMED status, then marks them as EXPIRED.
     * Runs every hour.
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    @Transactional
    public void expirePastAppointments() {
        LocalDateTime now = LocalDateTime.now();
        List<AppointmentStatus> activeStatuses = Arrays.asList(
                AppointmentStatus.PENDING,
                AppointmentStatus.CONFIRMED);

        List<Appointment> expiredAppointments = appointmentRepository
                .findByStatusInAndAppointmentDateBefore(activeStatuses, now);

        if (!expiredAppointments.isEmpty()) {
            expiredAppointments.forEach(appt -> {
                appt.setStatus(AppointmentStatus.EXPIRED);
            });
            appointmentRepository.saveAll(expiredAppointments);
            System.out.println("Auto-expired " + expiredAppointments.size() + " appointments at " + now);
        }
    }
}
