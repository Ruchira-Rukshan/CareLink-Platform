package com.carelink.dto;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
    private boolean banned;
    private boolean approved;
    private String firstName;
    private String lastName;
    private String specialization;
    private String phone;

    // Patient
    private String nationalId;
    private String dob;
    private String gender;
    private String address;
    private String bloodGroup;
    private String allergies;
    private String emergencyContactName;
    private String emergencyContactPhone;

    // Doctor
    private String medicalLicenseNumber;
    private String qualifications;
    private Integer yearsOfExperience;
    private String certificatePath;

    public UserResponse() {
    }

    public UserResponse(Long id, String username, String email, String role, boolean banned,
            boolean approved, String firstName, String lastName, String specialization, String phone,
            String nationalId, String dob, String gender, String address, String bloodGroup,
            String allergies, String emergencyContactName, String emergencyContactPhone,
            String medicalLicenseNumber, String qualifications, Integer yearsOfExperience, String certificatePath) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.banned = banned;
        this.approved = approved;
        this.firstName = firstName;
        this.lastName = lastName;
        this.specialization = specialization;
        this.phone = phone;
        this.nationalId = nationalId;
        this.dob = dob;
        this.gender = gender;
        this.address = address;
        this.bloodGroup = bloodGroup;
        this.allergies = allergies;
        this.emergencyContactName = emergencyContactName;
        this.emergencyContactPhone = emergencyContactPhone;
        this.medicalLicenseNumber = medicalLicenseNumber;
        this.qualifications = qualifications;
        this.yearsOfExperience = yearsOfExperience;
        this.certificatePath = certificatePath;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public boolean isBanned() {
        return banned;
    }

    public boolean isApproved() {
        return approved;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getPhone() {
        return phone;
    }

    public String getNationalId() {
        return nationalId;
    }

    public String getDob() {
        return dob;
    }

    public String getGender() {
        return gender;
    }

    public String getAddress() {
        return address;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public String getAllergies() {
        return allergies;
    }

    public String getEmergencyContactName() {
        return emergencyContactName;
    }

    public String getEmergencyContactPhone() {
        return emergencyContactPhone;
    }

    public String getMedicalLicenseNumber() {
        return medicalLicenseNumber;
    }

    public String getQualifications() {
        return qualifications;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public String getCertificatePath() {
        return certificatePath;
    }

    public static UserResponseBuilder builder() {
        return new UserResponseBuilder();
    }

    public static class UserResponseBuilder {
        private Long id;
        private String username, email, role;
        private boolean banned;
        private boolean approved;
        private String firstName, lastName, specialization, phone;

        private String nationalId, dob, gender, address, bloodGroup, allergies, emergencyContactName,
                emergencyContactPhone;
        private String medicalLicenseNumber, qualifications;
        private Integer yearsOfExperience;
        private String certificatePath;

        public UserResponseBuilder id(Long v) {
            this.id = v;
            return this;
        }

        public UserResponseBuilder username(String v) {
            this.username = v;
            return this;
        }

        public UserResponseBuilder email(String v) {
            this.email = v;
            return this;
        }

        public UserResponseBuilder role(String v) {
            this.role = v;
            return this;
        }

        public UserResponseBuilder banned(boolean v) {
            this.banned = v;
            return this;
        }

        public UserResponseBuilder approved(boolean v) {
            this.approved = v;
            return this;
        }

        public UserResponseBuilder firstName(String v) {
            this.firstName = v;
            return this;
        }

        public UserResponseBuilder lastName(String v) {
            this.lastName = v;
            return this;
        }

        public UserResponseBuilder specialization(String v) {
            this.specialization = v;
            return this;
        }

        public UserResponseBuilder phone(String v) {
            this.phone = v;
            return this;
        }

        public UserResponseBuilder nationalId(String v) {
            this.nationalId = v;
            return this;
        }

        public UserResponseBuilder dob(String v) {
            this.dob = v;
            return this;
        }

        public UserResponseBuilder gender(String v) {
            this.gender = v;
            return this;
        }

        public UserResponseBuilder address(String v) {
            this.address = v;
            return this;
        }

        public UserResponseBuilder bloodGroup(String v) {
            this.bloodGroup = v;
            return this;
        }

        public UserResponseBuilder allergies(String v) {
            this.allergies = v;
            return this;
        }

        public UserResponseBuilder emergencyContactName(String v) {
            this.emergencyContactName = v;
            return this;
        }

        public UserResponseBuilder emergencyContactPhone(String v) {
            this.emergencyContactPhone = v;
            return this;
        }

        public UserResponseBuilder medicalLicenseNumber(String v) {
            this.medicalLicenseNumber = v;
            return this;
        }

        public UserResponseBuilder qualifications(String v) {
            this.qualifications = v;
            return this;
        }

        public UserResponseBuilder yearsOfExperience(Integer v) {
            this.yearsOfExperience = v;
            return this;
        }

        public UserResponseBuilder certificatePath(String v) {
            this.certificatePath = v;
            return this;
        }

        public UserResponse build() {
            return new UserResponse(
                    id, username, email, role, banned, approved, firstName, lastName, specialization, phone,
                    nationalId, dob, gender, address, bloodGroup, allergies, emergencyContactName,
                    emergencyContactPhone,
                    medicalLicenseNumber, qualifications, yearsOfExperience, certificatePath);
        }
    }
}
