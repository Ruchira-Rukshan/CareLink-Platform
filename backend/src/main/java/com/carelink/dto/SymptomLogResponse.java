package com.carelink.dto;

import java.time.LocalDateTime;
import java.util.List;

public class SymptomLogResponse {
    private Long id;
    private List<String> symptoms;
    private String predictedDisease;
    private LocalDateTime createdAt;

    public SymptomLogResponse(Long id, List<String> symptoms, String predictedDisease, LocalDateTime createdAt) {
        this.id = id;
        this.symptoms = symptoms;
        this.predictedDisease = predictedDisease;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getId() { return id; }
    public List<String> getSymptoms() { return symptoms; }
    public String getPredictedDisease() { return predictedDisease; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
