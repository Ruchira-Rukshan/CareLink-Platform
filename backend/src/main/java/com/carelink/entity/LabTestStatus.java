package com.carelink.entity;

public enum LabTestStatus {
    REQUESTED, // Patient booked, waiting
    PAID, // Patient has paid for the test
    SAMPLE_COLLECTED, // Technician marked sample as collected
    IN_LAB, // Sample is being processed
    RESULT_READY, // Results are ready, report uploaded
    COMPLETED, // Patient has been notified and acknowledged
    CANCELLED // Cancelled for any reason
}
