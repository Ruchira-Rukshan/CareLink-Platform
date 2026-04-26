package com.carelink.dto;

import com.carelink.entity.DoctorReview;
import java.time.LocalDateTime;

public class DoctorReviewResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long appointmentId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    
    public DoctorReviewResponse() {}

    public DoctorReviewResponse(DoctorReview review) {
        this.id = review.getId();
        this.patientId = review.getPatient().getId();
        this.patientName = review.getPatient().getFirstName() + " " + review.getPatient().getLastName();
        this.appointmentId = review.getAppointment().getId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
