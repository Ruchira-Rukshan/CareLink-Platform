package com.carelink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lab_reports")
public class LabReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne
    @JoinColumn(name = "lab_tech_id")
    private User labTech;

    @ManyToOne
    @JoinColumn(name = "lab_test_id", nullable = false)
    private LabTest labTest;

    @ManyToOne
    @JoinColumn(name = "lab_slot_id", nullable = false)
    private LabSlot labSlot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private LabTestStatus status;

    private String reportFileUrl;

    @Column(length = 2000)
    private String notes;

    // Booking reference for patient
    @Column(unique = true)
    private String bookingReference;

    // Sample collected timestamp
    private LocalDateTime sampleCollectedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private boolean paid = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (bookingReference == null) {
            bookingReference = "LAB-" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public LabReport() {
    }

    public LabReport(User patient, LabTest labTest, LabSlot labSlot, LabTestStatus status) {
        this.patient = patient;
        this.labTest = labTest;
        this.labSlot = labSlot;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getPatient() {
        return patient;
    }

    public void setPatient(User patient) {
        this.patient = patient;
    }

    public User getLabTech() {
        return labTech;
    }

    public void setLabTech(User labTech) {
        this.labTech = labTech;
    }

    public LabTest getLabTest() {
        return labTest;
    }

    public void setLabTest(LabTest labTest) {
        this.labTest = labTest;
    }

    public LabSlot getLabSlot() {
        return labSlot;
    }

    public void setLabSlot(LabSlot labSlot) {
        this.labSlot = labSlot;
    }

    public LabTestStatus getStatus() {
        return status;
    }

    public void setStatus(LabTestStatus status) {
        this.status = status;
    }

    public String getReportFileUrl() {
        return reportFileUrl;
    }

    public void setReportFileUrl(String reportFileUrl) {
        this.reportFileUrl = reportFileUrl;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public LocalDateTime getSampleCollectedAt() {
        return sampleCollectedAt;
    }

    public void setSampleCollectedAt(LocalDateTime sampleCollectedAt) {
        this.sampleCollectedAt = sampleCollectedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    public static LabReportBuilder builder() {
        return new LabReportBuilder();
    }

    public static class LabReportBuilder {
        private User patient;
        private LabTest labTest;
        private LabSlot labSlot;
        private LabTestStatus status;
        public LabReportBuilder patient(User v) {
            this.patient = v;
            return this;
        }

        public LabReportBuilder labTest(LabTest v) {
            this.labTest = v;
            return this;
        }

        public LabReportBuilder labSlot(LabSlot v) {
            this.labSlot = v;
            return this;
        }

        public LabReportBuilder status(LabTestStatus v) {
            this.status = v;
            return this;
        }

        public LabReport build() {
            LabReport r = new LabReport(patient, labTest, labSlot, status);
            return r;
        }
    }
}
