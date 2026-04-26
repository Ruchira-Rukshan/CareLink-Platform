package com.carelink.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "lab_tests")
public class LabTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private Double price;

    @Column(length = 50)
    private String category; // e.g., "HAEMATOLOGY", "RADIOLOGY", "MICROBIOLOGY", "BIOCHEMISTRY"

    @Column(length = 500)
    private String prepInstructions; // e.g., "Fast for 12 hours before the test"

    private String resourceRequired; // e.g., "Phlebotomist", "MRI Room", "CT Scanner"

    private Integer durationMinutes = 30; // Estimated test duration in minutes

    private boolean fastingRequired = false;

    private boolean active = true;

    public LabTest() {
    }

    public LabTest(String name, String description, Double price) {
        this.name = name;
        this.description = description;
        this.price = price;
    }

    // Full constructor
    public LabTest(String name, String description, Double price, String category,
            String prepInstructions, String resourceRequired,
            Integer durationMinutes, boolean fastingRequired) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.prepInstructions = prepInstructions;
        this.resourceRequired = resourceRequired;
        this.durationMinutes = durationMinutes;
        this.fastingRequired = fastingRequired;
        this.active = true;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPrepInstructions() {
        return prepInstructions;
    }

    public void setPrepInstructions(String prepInstructions) {
        this.prepInstructions = prepInstructions;
    }

    public String getResourceRequired() {
        return resourceRequired;
    }

    public void setResourceRequired(String resourceRequired) {
        this.resourceRequired = resourceRequired;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public boolean isFastingRequired() {
        return fastingRequired;
    }

    public void setFastingRequired(boolean fastingRequired) {
        this.fastingRequired = fastingRequired;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public static LabTestBuilder builder() {
        return new LabTestBuilder();
    }

    public static class LabTestBuilder {
        private String name;
        private String description;
        private Double price;
        private String category;
        private String prepInstructions;
        private String resourceRequired;
        private Integer durationMinutes = 30;
        private boolean fastingRequired = false;

        public LabTestBuilder name(String v) {
            this.name = v;
            return this;
        }

        public LabTestBuilder description(String v) {
            this.description = v;
            return this;
        }

        public LabTestBuilder price(Double v) {
            this.price = v;
            return this;
        }

        public LabTestBuilder category(String v) {
            this.category = v;
            return this;
        }

        public LabTestBuilder prepInstructions(String v) {
            this.prepInstructions = v;
            return this;
        }

        public LabTestBuilder resourceRequired(String v) {
            this.resourceRequired = v;
            return this;
        }

        public LabTestBuilder durationMinutes(Integer v) {
            this.durationMinutes = v;
            return this;
        }

        public LabTestBuilder fastingRequired(boolean v) {
            this.fastingRequired = v;
            return this;
        }

        public LabTest build() {
            return new LabTest(name, description, price, category, prepInstructions,
                    resourceRequired, durationMinutes, fastingRequired);
        }
    }
}
