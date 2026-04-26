package com.carelink.dto;

public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String role;

    // Common
    private String firstName;
    private String lastName;
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
    private String specialization;
    private String qualifications;
    private String yearsOfExperience;

    // Supplier
    private String companyName;
    private String companyRegId;
    private boolean twoFactorEnabled;

    public RegisterRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String v) {
        this.username = v;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String v) {
        this.email = v;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String v) {
        this.password = v;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String v) {
        this.role = v;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String v) {
        this.firstName = v;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String v) {
        this.lastName = v;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String v) {
        this.phone = v;
    }

    public String getNationalId() {
        return nationalId;
    }

    public void setNationalId(String v) {
        this.nationalId = v;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String v) {
        this.dob = v;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String v) {
        this.gender = v;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String v) {
        this.address = v;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String v) {
        this.bloodGroup = v;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String v) {
        this.allergies = v;
    }

    public String getEmergencyContactName() {
        return emergencyContactName;
    }

    public void setEmergencyContactName(String v) {
        this.emergencyContactName = v;
    }

    public String getEmergencyContactPhone() {
        return emergencyContactPhone;
    }

    public void setEmergencyContactPhone(String v) {
        this.emergencyContactPhone = v;
    }

    public String getMedicalLicenseNumber() {
        return medicalLicenseNumber;
    }

    public void setMedicalLicenseNumber(String v) {
        this.medicalLicenseNumber = v;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String v) {
        this.specialization = v;
    }

    public String getQualifications() {
        return qualifications;
    }

    public void setQualifications(String v) {
        this.qualifications = v;
    }

    public String getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(String v) {
        this.yearsOfExperience = v;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyRegId() {
        return companyRegId;
    }

    public void setCompanyRegId(String companyRegId) {
        this.companyRegId = companyRegId;
    }

    public boolean isTwoFactorEnabled() {
        return twoFactorEnabled;
    }

    public void setTwoFactorEnabled(boolean twoFactorEnabled) {
        this.twoFactorEnabled = twoFactorEnabled;
    }
}
