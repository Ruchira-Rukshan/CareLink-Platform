package com.carelink.controller;

import com.carelink.repository.UserRepository;
import com.carelink.dto.UserResponse;
import com.carelink.dto.UpdateUserRequest;
import com.carelink.entity.User;
import com.carelink.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(mapToResponse(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateUserRequest request) {

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            user.setEmail(request.getEmail());
            // Intentionally not updating username to avoid login breakage
        }
        if (request.getPhone() != null)
            user.setPhone(request.getPhone());
        if (request.getAddress() != null)
            user.setAddress(request.getAddress());
        if (request.getBloodGroup() != null)
            user.setBloodGroup(request.getBloodGroup());
        if (request.getAllergies() != null)
            user.setAllergies(request.getAllergies());
        if (request.getEmergencyContactName() != null)
            user.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactPhone() != null)
            user.setEmergencyContactPhone(request.getEmergencyContactPhone());
        if (request.getTwoFactorEnabled() != null)
            user.setTwoFactorEnabled(request.getTwoFactorEnabled());

        // Doctor only fields validation
        if ("DOCTOR".equals(user.getRole().name())) {
            if (request.getSpecialization() != null)
                user.setSpecialization(request.getSpecialization());
            if (request.getQualifications() != null)
                user.setQualifications(request.getQualifications());
            if (request.getYearsOfExperience() != null)
                user.setYearsOfExperience(request.getYearsOfExperience());
        }

        // Supplier only fields
        if ("SUPPLIER".equals(user.getRole().name())) {
            if (request.getCompanyName() != null)
                user.setCompanyName(request.getCompanyName());
            if (request.getCompanyRegId() != null)
                user.setCompanyRegId(request.getCompanyRegId());
        }

        userRepository.save(user);
        return ResponseEntity.ok(mapToResponse(user));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(
                userRepository.findAll().stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList()));
    }

    @GetMapping("/patients")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PHARMACIST')")
    public ResponseEntity<List<UserResponse>> getPatients() {
        return ResponseEntity.ok(
                userRepository.findByRole(Role.PATIENT).stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList()));
    }

    @GetMapping("/patients/search")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PHARMACIST')")
    public ResponseEntity<List<UserResponse>> searchPatients(
            @RequestParam(required = false, defaultValue = "") String query) {
        String q = query.toLowerCase();
        List<User> patients = userRepository.findByRole(Role.PATIENT).stream()
                .filter(u -> (u.getUsername() != null && u.getUsername().toLowerCase().contains(q)) ||
                        (u.getFirstName() != null && u.getFirstName().toLowerCase().contains(q)) ||
                        (u.getLastName() != null && u.getLastName().toLowerCase().contains(q)) ||
                        (u.getPhone() != null && u.getPhone().contains(q)))
                .collect(Collectors.toList());

        return ResponseEntity.ok(patients.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
    }

    @PostMapping("/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> toggleBan(@PathVariable Long id) {
        var user = userRepository.findById(id)
                .orElseThrow();
        user.setBanned(!user.isBanned());
        userRepository.save(user);
        return ResponseEntity.ok(mapToResponse(user));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> approveUser(@PathVariable Long id) {
        var user = userRepository.findById(id).orElseThrow();
        user.setApproved(true);
        userRepository.save(user);
        return ResponseEntity.ok(mapToResponse(user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : "UNKNOWN")
                .banned(user.isBanned())
                .approved(user.isApproved())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .specialization(user.getSpecialization())
                .phone(user.getPhone())
                .nationalId(user.getNationalId())
                .dob(user.getDob())
                .gender(user.getGender())
                .address(user.getAddress())
                .bloodGroup(user.getBloodGroup())
                .allergies(user.getAllergies())
                .emergencyContactName(user.getEmergencyContactName())
                .emergencyContactPhone(user.getEmergencyContactPhone())
                .medicalLicenseNumber(user.getMedicalLicenseNumber())
                .qualifications(user.getQualifications())
                .yearsOfExperience(user.getYearsOfExperience())
                .certificatePath(user.getCertificatePath())
                .companyName(user.getCompanyName())
                .companyRegId(user.getCompanyRegId())
                .twoFactorEnabled(user.isTwoFactorEnabled())
                .profilePicturePath(user.getProfilePicturePath())
                .build();
    }
}
