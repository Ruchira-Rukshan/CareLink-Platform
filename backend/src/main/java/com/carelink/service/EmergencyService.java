package com.carelink.service;

import com.carelink.entity.EmergencyAlert;
import com.carelink.entity.User;
import com.carelink.repository.EmergencyAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmergencyService {

    @Autowired
    private EmergencyAlertRepository emergencyAlertRepository;

    @Autowired
    private com.carelink.repository.UserRepository userRepository;

    @Autowired
    private com.carelink.repository.NotificationRepository notificationRepository;

    public EmergencyAlert createAlert(User patient, Double lat, Double lng) {
        EmergencyAlert alert = new EmergencyAlert();
        alert.setPatient(patient);
        alert.setLatitude(lat);
        alert.setLongitude(lng);
        alert.setTimestamp(LocalDateTime.now());
        alert.setStatus("PENDING");
        
        EmergencyAlert saved = emergencyAlertRepository.save(alert);

        // 1. Notify the Patient in-app
        com.carelink.entity.Notification patientNotif = new com.carelink.entity.Notification(
                patient,
                "SOS Alert Triggered",
                "Your emergency signal has been received. Our response team has been notified and help is on the way."
        );
        notificationRepository.save(patientNotif);

        // 2. Notify the Emergency Response Team in-app
        List<User> responders = userRepository.findByRole(com.carelink.entity.Role.EMERGENCY);
        for (User responder : responders) {
            com.carelink.entity.Notification teamNotif = new com.carelink.entity.Notification(
                    responder,
                    "🚨 PRIORITY: NEW EMERGENCY SOS",
                    "Patient " + patient.getFirstName() + " " + patient.getLastName() + " has triggered an SOS alert."
            );
            notificationRepository.save(teamNotif);
        }

        return saved;
    }

    public List<EmergencyAlert> getAllAlerts() {
        return emergencyAlertRepository.findAllByOrderByTimestampDesc();
    }

    public List<EmergencyAlert> getPendingAlerts() {
        return emergencyAlertRepository.findByStatusOrderByTimestampDesc("PENDING");
    }

    public EmergencyAlert updateStatus(Long id, String status, String notes, User responder) {
        EmergencyAlert alert = emergencyAlertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        alert.setStatus(status);
        if (notes != null) alert.setNotes(notes);
        if (responder != null) alert.setResponder(responder);
        return emergencyAlertRepository.save(alert);
    }
}
