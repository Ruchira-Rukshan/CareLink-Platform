package com.carelink.dto;

import java.util.List;

public class SymptomLogRequest {
    private List<String> symptoms;
    private String predictedDisease;

    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }

    public String getPredictedDisease() { return predictedDisease; }
    public void setPredictedDisease(String predictedDisease) { this.predictedDisease = predictedDisease; }
}
