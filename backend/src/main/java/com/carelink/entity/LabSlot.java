package com.carelink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lab_slots")
public class LabSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lab_tech_id", nullable = false)
    private User labTech;

    @Column(nullable = false)
    private LocalDateTime testTime;

    @Column(nullable = true)
    private LocalDateTime endTime;

    private int capacity = 1; // Max concurrent bookings for this slot
    private int bookedCount = 0; // Current number of bookings

    // isAvailable is now derived: available = (bookedCount < capacity)
    // We keep a manual override flag for closed/cancelled slots
    private boolean isClosed = false;

    public LabSlot() {
    }

    public LabSlot(User labTech, LocalDateTime testTime, int capacity) {
        this.labTech = labTech;
        this.testTime = testTime;
        this.capacity = capacity;
        this.bookedCount = 0;
        this.isClosed = false;
    }

    public LabSlot(User labTech, LocalDateTime testTime, LocalDateTime endTime, int capacity) {
        this.labTech = labTech;
        this.testTime = testTime;
        this.endTime = endTime;
        this.capacity = capacity;
        this.bookedCount = 0;
        this.isClosed = false;
    }

    public boolean isAvailable() {
        return !isClosed && bookedCount < capacity;
    }

    // For compatibility with old code
    public void setAvailable(boolean available) {
        this.isClosed = !available;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getLabTech() {
        return labTech;
    }

    public void setLabTech(User labTech) {
        this.labTech = labTech;
    }

    public LocalDateTime getTestTime() {
        return testTime;
    }

    public void setTestTime(LocalDateTime testTime) {
        this.testTime = testTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getBookedCount() {
        return bookedCount;
    }

    public void setBookedCount(int bookedCount) {
        this.bookedCount = bookedCount;
    }

    public boolean isClosed() {
        return isClosed;
    }

    public void setClosed(boolean closed) {
        isClosed = closed;
    }

    public int getRemainingCapacity() {
        return Math.max(0, capacity - bookedCount);
    }

    public static LabSlotBuilder builder() {
        return new LabSlotBuilder();
    }

    public static class LabSlotBuilder {
        private User labTech;
        private LocalDateTime testTime;
        private LocalDateTime endTime;
        private int capacity = 1;

        public LabSlotBuilder labTech(User v) {
            this.labTech = v;
            return this;
        }

        public LabSlotBuilder testTime(LocalDateTime v) {
            this.testTime = v;
            return this;
        }

        public LabSlotBuilder endTime(LocalDateTime v) {
            this.endTime = v;
            return this;
        }

        public LabSlotBuilder capacity(int v) {
            this.capacity = v;
            return this;
        }

        public LabSlotBuilder isAvailable(boolean v) {
            return this;
        } // compatibility shim

        public LabSlot build() {
            return new LabSlot(labTech, testTime, endTime, capacity);
        }
    }
}
