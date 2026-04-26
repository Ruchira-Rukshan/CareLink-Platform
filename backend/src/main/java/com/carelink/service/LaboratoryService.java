package com.carelink.service;

import com.carelink.dto.LabBookingRequest;
import com.carelink.entity.*;
import com.carelink.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LaboratoryService {
    private final LabTestRepository labTestRepository;
    private final LabSlotRepository labSlotRepository;
    private final LabReportRepository labReportRepository;
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    public LaboratoryService(LabTestRepository labTestRepository,
            LabSlotRepository labSlotRepository,
            LabReportRepository labReportRepository,
            NotificationRepository notificationRepository,
            EmailService emailService) {
        this.labTestRepository = labTestRepository;
        this.labSlotRepository = labSlotRepository;
        this.labReportRepository = labReportRepository;
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
    }

    // ── Test Catalog Management ──────────────────────────────────────────────

    public List<LabTest> getAllLabTests() {
        return labTestRepository.findAll();
    }

    public List<LabTest> getActiveLabTests() {
        return labTestRepository.findAll().stream()
                .filter(LabTest::isActive)
                .collect(Collectors.toList());
    }

    public LabTest createLabTest(LabTest labTest) {
        labTest.setActive(true);
        return labTestRepository.save(labTest);
    }

    public LabTest updateLabTest(Long id, LabTest updated) {
        LabTest existing = labTestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab test not found"));
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setCategory(updated.getCategory());
        existing.setPrepInstructions(updated.getPrepInstructions());
        existing.setResourceRequired(updated.getResourceRequired());
        existing.setDurationMinutes(updated.getDurationMinutes());
        existing.setFastingRequired(updated.isFastingRequired());
        return labTestRepository.save(existing);
    }

    public void toggleLabTest(Long id, boolean active) {
        LabTest test = labTestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab test not found"));
        test.setActive(active);
        labTestRepository.save(test);
    }

    public void deleteLabTest(Long id) {
        LabTest test = labTestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab test not found"));

        // Check if there are reports linked to this test
        if (labReportRepository.existsByLabTest(test)) {
            throw new RuntimeException(
                    "Cannot delete test: It has associated medical reports. Please deactivate it instead.");
        }

        labTestRepository.delete(test);
    }

    // ── Slot Management ──────────────────────────────────────────────────────

    public List<LabSlot> getAllAvailableSlots() {
        return labSlotRepository.findAvailableSlots(LocalDateTime.now());
    }

    public LabSlot createSlot(LabSlot slot) {
        if (slot.getCapacity() <= 0)
            slot.setCapacity(1);
        return labSlotRepository.save(slot);
    }

    public List<LabSlot> getSlotsByTech(User tech) {
        return labSlotRepository.findByLabTech(tech);
    }

    public List<LabSlot> getFutureSlotsByTech(User tech) {
        return labSlotRepository.findByLabTechAndTestTimeAfterOrderByTestTimeAsc(tech, LocalDateTime.now());
    }

    public LabSlot closeSlot(Long slotId) {
        LabSlot slot = labSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        slot.setClosed(true);
        return labSlotRepository.save(slot);
    }

    public LabSlot reopenSlot(Long slotId) {
        LabSlot slot = labSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        slot.setClosed(false);
        return labSlotRepository.save(slot);
    }

    // ── Booking & Patient Workflow ────────────────────────────────────────────

    @Transactional
    public LabReport bookLabTest(User patient, LabBookingRequest req) {
        LabTest test = labTestRepository.findById(req.getTestId())
                .orElseThrow(() -> new RuntimeException("Lab test not found"));
        LabSlot slot = labSlotRepository.findById(req.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!slot.isAvailable()) {
            throw new RuntimeException("This time slot is no longer available. Please choose another.");
        }

        // Increment booked count
        slot.setBookedCount(slot.getBookedCount() + 1);
        labSlotRepository.save(slot);

        LabReport report = LabReport.builder()
                .patient(patient)
                .labTest(test)
                .labSlot(slot)
                .status(LabTestStatus.REQUESTED)
                .build();

        return labReportRepository.save(report);
    }

    public List<LabReport> getReportsByPatient(User patient) {
        return labReportRepository.findByPatientOrderByCreatedAtDesc(patient);
    }

    public List<LabReport> getReportsByTech(User tech) {
        return labReportRepository.findByLabTech(tech);
    }

    public List<LabReport> getAllReports() {
        return labReportRepository.findAllByOrderByCreatedAtDesc();
    }

    // ── Technician Workflow ───────────────────────────────────────────────────

    @Transactional
    public LabReport updateReportStatus(Long reportId, LabTestStatus status, String notes, String reportFileUrl) {
        LabReport report = labReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        LabTestStatus old = report.getStatus();
        report.setStatus(status);

        if (notes != null && !notes.isBlank())
            report.setNotes(notes);
        if (reportFileUrl != null && !reportFileUrl.isBlank())
            report.setReportFileUrl(reportFileUrl);

        // Track when sample was collected
        if (status == LabTestStatus.SAMPLE_COLLECTED && report.getSampleCollectedAt() == null) {
            report.setSampleCollectedAt(LocalDateTime.now());
        }

        // Notify patient when result is ready
        if (status == LabTestStatus.RESULT_READY || status == LabTestStatus.COMPLETED) {
            Notification notification = new Notification(
                    report.getPatient(),
                    "🧪 Lab Report Ready – " + report.getLabTest().getName(),
                    "Your diagnostic report for " + report.getLabTest().getName() +
                            " (Ref: " + report.getBookingReference() + ") is now ready. " +
                            "Please log in to your dashboard to access your results.");
            notificationRepository.save(notification);
        }

        return labReportRepository.save(report);
    }

    @Transactional
    public LabReport markAsPaid(Long reportId) {
        LabReport report = labReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        if (report.getStatus() == LabTestStatus.COMPLETED || report.getStatus() == LabTestStatus.CANCELLED || report.getStatus() == LabTestStatus.RESULT_READY) {
            throw new RuntimeException("Cannot mark as paid: Report is in " + report.getStatus() + " status.");
        }

        report.setPaid(true);
        report.setStatus(LabTestStatus.PAID);

        // Notify patient via in-app notification
        String prepNote = report.getLabTest().isFastingRequired()
                ? " ⚠️ Remember: Fasting required 12 hours before your test."
                : "";
        Notification notification = new Notification(
                report.getPatient(),
                "Lab Booking Confirmed & Paid – " + report.getLabTest().getName(),
                "Your payment was received. Booking reference: " + report.getBookingReference() +
                        ". Appointment: " + report.getLabSlot().getTestTime().toString() + "." + prepNote);
        notificationRepository.save(notification);

        // Notify Technician via in-app notification
        if (report.getLabSlot().getLabTech() != null) {
            Notification techNotif = new Notification(
                    report.getLabSlot().getLabTech(),
                    "New Paid Test Booking – " + report.getLabTest().getName(),
                    "Patient " + report.getPatient().getFirstName() + " " + report.getPatient().getLastName() +
                            " has paid for " + report.getLabTest().getName() + " on " + report.getLabSlot().getTestTime().toString() +
                            ". Ref: " + report.getBookingReference());
            notificationRepository.save(techNotif);
        }

        // ── Automated Email Notifications (Lab Booking) ──
        try {
            emailService.sendLabBookingConfirmation(report);
            emailService.sendNewLabBookingToTech(report);
        } catch (Exception e) {
            System.err.println("Failed to send lab booking confirmation emails: " + e.getMessage());
        }

        return labReportRepository.save(report);
    }

    @Transactional
    public void deleteReport(Long reportId) {
        LabReport report = labReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        // Decr count if it was incremented
        LabSlot slot = report.getLabSlot();
        if (slot.getBookedCount() > 0) {
            slot.setBookedCount(slot.getBookedCount() - 1);
            labSlotRepository.save(slot);
        }
        
        labReportRepository.delete(report);

        // ── Automated Email Notifications (Lab Cancellation) ──
        try {
            emailService.sendLabCancellationEmail(report);
        } catch (Exception e) {
            System.err.println("Failed to send lab cancellation email: " + e.getMessage());
        }
    }

    // ── Statistics ────────────────────────────────────────────────────────────

    public Map<String, Long> getStatusSummary() {
        List<LabReport> all = labReportRepository.findAll();
        return all.stream()
                .collect(Collectors.groupingBy(r -> r.getStatus().name(), Collectors.counting()));
    }
}
