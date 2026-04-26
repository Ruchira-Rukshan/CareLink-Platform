package com.carelink.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String username;

    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Role role;

    private boolean banned = false;
    private boolean approved = false;

    // ── Common Profile Fields ─────────────────────────────────
    private String firstName;
    private String lastName;
    private String phone;

    // ── Patient-Specific Fields ───────────────────────────────
    private String nationalId;
    private String dob; // stored as String "YYYY-MM-DD"
    private String gender;
    @Column(length = 512)
    private String address;
    private String bloodGroup;
    @Column(length = 1024)
    private String allergies;
    private String emergencyContactName;
    private String emergencyContactPhone;

    // ── Doctor-Specific Fields ────────────────────────────────
    @Column(unique = true)
    private String medicalLicenseNumber;
    private String specialization;
    @Column(length = 512)
    private String qualifications;
    private Integer yearsOfExperience;
    private String certificatePath;
    private String profilePicturePath;

    // ── Supplier-Specific Fields ──────────────────────────────
    @Column(unique = true)
    private String companyName;
    @Column(unique = true)
    private String companyRegId;
    private String resetToken;
    private java.time.LocalDateTime resetTokenExpiry;
    private boolean twoFactorEnabled = false;
    private String twoFactorCode;
    private java.time.LocalDateTime twoFactorExpiry;

    // ─────────────────────────────────────────────────────────
    public User() {
    }

    // All-args constructor kept for builder compatibility
    public User(String username, String email, String password, Role role, boolean banned, boolean approved) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.banned = banned;
        this.approved = approved;
    }

    // ── Builder ───────────────────────────────────────────────

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private String username;
        private String email;
        private String password;
        private Role role;
        private boolean banned;
        private boolean approved = false;
        private String firstName;
        private String lastName;
        private String phone;
        private String nationalId;
        private String dob;
        private String gender;
        private String address;
        private String bloodGroup;
        private String allergies;
        private String emergencyContactName;
        private String emergencyContactPhone;
        private String medicalLicenseNumber;
        private String specialization;
        private String qualifications;
        private Integer yearsOfExperience;
        private String certificatePath;
        private String profilePicturePath;
        private String companyName;
        private String companyRegId;
        private String resetToken;
        private java.time.LocalDateTime resetTokenExpiry;
        private boolean twoFactorEnabled;
        private String twoFactorCode;
        private java.time.LocalDateTime twoFactorExpiry;

        public UserBuilder username(String v) {
            this.username = v;
            return this;
        }

        public UserBuilder email(String v) {
            this.email = v;
            return this;
        }

        public UserBuilder password(String v) {
            this.password = v;
            return this;
        }

        public UserBuilder role(Role v) {
            this.role = v;
            return this;
        }

        public UserBuilder banned(boolean v) {
            this.banned = v;
            return this;
        }

        public UserBuilder approved(boolean v) {
            this.approved = v;
            return this;
        }

        public UserBuilder firstName(String v) {
            this.firstName = v;
            return this;
        }

        public UserBuilder lastName(String v) {
            this.lastName = v;
            return this;
        }

        public UserBuilder phone(String v) {
            this.phone = v;
            return this;
        }

        public UserBuilder nationalId(String v) {
            this.nationalId = v;
            return this;
        }

        public UserBuilder dob(String v) {
            this.dob = v;
            return this;
        }

        public UserBuilder gender(String v) {
            this.gender = v;
            return this;
        }

        public UserBuilder address(String v) {
            this.address = v;
            return this;
        }

        public UserBuilder bloodGroup(String v) {
            this.bloodGroup = v;
            return this;
        }

        public UserBuilder allergies(String v) {
            this.allergies = v;
            return this;
        }

        public UserBuilder emergencyContactName(String v) {
            this.emergencyContactName = v;
            return this;
        }

        public UserBuilder emergencyContactPhone(String v) {
            this.emergencyContactPhone = v;
            return this;
        }

        public UserBuilder medicalLicenseNumber(String v) {
            this.medicalLicenseNumber = v;
            return this;
        }

        public UserBuilder specialization(String v) {
            this.specialization = v;
            return this;
        }

        public UserBuilder qualifications(String v) {
            this.qualifications = v;
            return this;
        }

        public UserBuilder yearsOfExperience(Integer v) {
            this.yearsOfExperience = v;
            return this;
        }

        public UserBuilder certificatePath(String v) {
            this.certificatePath = v;
            return this;
        }
        
        public UserBuilder profilePicturePath(String v) {
            this.profilePicturePath = v;
            return this;
        }

        public UserBuilder companyName(String v) {
            this.companyName = v;
            return this;
        }

        public UserBuilder companyRegId(String v) {
            this.companyRegId = v;
            return this;
        }

        public UserBuilder resetToken(String v) {
            this.resetToken = v;
            return this;
        }

        public UserBuilder resetTokenExpiry(java.time.LocalDateTime v) {
            this.resetTokenExpiry = v;
            return this;
        }

        public UserBuilder twoFactorEnabled(boolean v) {
            this.twoFactorEnabled = v;
            return this;
        }

        public UserBuilder twoFactorCode(String v) {
            this.twoFactorCode = v;
            return this;
        }

        public UserBuilder twoFactorExpiry(java.time.LocalDateTime v) {
            this.twoFactorExpiry = v;
            return this;
        }

        public User build() {
            User u = new User(username, email, password, role, banned, approved);
            u.firstName = this.firstName;
            u.lastName = this.lastName;
            u.phone = this.phone;
            u.nationalId = this.nationalId;
            u.dob = this.dob;
            u.gender = this.gender;
            u.address = this.address;
            u.bloodGroup = this.bloodGroup;
            u.allergies = this.allergies;
            u.emergencyContactName = this.emergencyContactName;
            u.emergencyContactPhone = this.emergencyContactPhone;
            u.medicalLicenseNumber = this.medicalLicenseNumber;
            u.specialization = this.specialization;
            u.qualifications = this.qualifications;
            u.yearsOfExperience = this.yearsOfExperience;
            u.certificatePath = this.certificatePath;
            u.profilePicturePath = this.profilePicturePath;
            u.companyName = this.companyName;
            u.companyRegId = this.companyRegId;
            u.resetToken = this.resetToken;
            u.resetTokenExpiry = this.resetTokenExpiry;
            u.twoFactorEnabled = this.twoFactorEnabled;
            u.twoFactorCode = this.twoFactorCode;
            u.twoFactorExpiry = this.twoFactorExpiry;
            return u;
        }
    }

    // ── Getters & Setters ─────────────────────────────────────
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
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

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String v) {
        this.password = v;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role v) {
        this.role = v;
    }

    public boolean isBanned() {
        return banned;
    }

    public void setBanned(boolean v) {
        this.banned = v;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean v) {
        this.approved = v;
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

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer v) {
        this.yearsOfExperience = v;
    }

    public String getCertificatePath() {
        return certificatePath;
    }

    public void setCertificatePath(String v) {
        this.certificatePath = v;
    }

    public String getProfilePicturePath() {
        return profilePicturePath;
    }

    public void setProfilePicturePath(String v) {
        this.profilePicturePath = v;
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

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public java.time.LocalDateTime getResetTokenExpiry() {
        return resetTokenExpiry;
    }

    public void setResetTokenExpiry(java.time.LocalDateTime resetTokenExpiry) {
        this.resetTokenExpiry = resetTokenExpiry;
    }

    public boolean isTwoFactorEnabled() {
        return twoFactorEnabled;
    }

    public void setTwoFactorEnabled(boolean twoFactorEnabled) {
        this.twoFactorEnabled = twoFactorEnabled;
    }

    public String getTwoFactorCode() {
        return twoFactorCode;
    }

    public void setTwoFactorCode(String twoFactorCode) {
        this.twoFactorCode = twoFactorCode;
    }

    public java.time.LocalDateTime getTwoFactorExpiry() {
        return twoFactorExpiry;
    }

    public void setTwoFactorExpiry(java.time.LocalDateTime twoFactorExpiry) {
        this.twoFactorExpiry = twoFactorExpiry;
    }

    // ── UserDetails ───────────────────────────────────────────
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !banned;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return approved;
    }
}
