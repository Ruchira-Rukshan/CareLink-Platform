package com.carelink.controller;

import com.carelink.security.JwtService;
import com.carelink.repository.UserRepository;
import com.carelink.dto.AuthenticationRequest;
import com.carelink.dto.RegisterRequest;
import com.carelink.dto.AuthenticationResponse;
import com.carelink.entity.User;
import com.carelink.entity.Role;
import com.carelink.dto.ForgotPasswordRequest;
import com.carelink.dto.ResetPasswordRequest;
import com.carelink.dto.TwoFactorRequest;
import com.carelink.service.EmailService;
import com.carelink.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.Period;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final com.carelink.repository.NotificationRepository notificationRepository;
        private final com.carelink.repository.SupplierRepository supplierRepository;
        private final EmailService emailService;
        private final FileStorageService fileStorageService;

        public AuthenticationController(
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService,
                        AuthenticationManager authenticationManager,
                        com.carelink.repository.NotificationRepository notificationRepository,
                        com.carelink.repository.SupplierRepository supplierRepository,
                        EmailService emailService,
                        FileStorageService fileStorageService) {
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
                this.authenticationManager = authenticationManager;
                this.notificationRepository = notificationRepository;
                this.supplierRepository = supplierRepository;
                this.emailService = emailService;
                this.fileStorageService = fileStorageService;
        }

        @PostMapping(value = "/register", consumes = { "multipart/form-data" })
        @Transactional
        public ResponseEntity<AuthenticationResponse> register(
                        @RequestPart("request") RegisterRequest request,
                        @RequestPart(value = "profilePic", required = false) MultipartFile profilePic,
                        @RequestPart(value = "certificate", required = false) MultipartFile certificate) {
                // Check duplicate email / username
                if (userRepository.findByUsername(request.getEmail()).isPresent()) {
                        return ResponseEntity.badRequest().body(
                                        new AuthenticationResponse("Email already registered"));
                }

                // 1. Validate Names (No numbers allowed)
                if (request.getFirstName() != null && request.getFirstName().matches(".*\\d.*")) {
                        return ResponseEntity.badRequest().body(new AuthenticationResponse("First name cannot contain numbers"));
                }
                if (request.getLastName() != null && request.getLastName().matches(".*\\d.*")) {
                        return ResponseEntity.badRequest().body(new AuthenticationResponse("Last name cannot contain numbers"));
                }

                // 2. Validate Phone (Exactly 10 digits)
                if (request.getPhone() != null && !request.getPhone().matches("^\\d{10}$")) {
                        return ResponseEntity.badRequest().body(new AuthenticationResponse("Phone number must be exactly 10 digits"));
                }

                // Check duplicate phone
                if (request.getPhone() != null && !request.getPhone().isBlank()
                                && userRepository.existsByPhone(request.getPhone())) {
                        return ResponseEntity.badRequest().body(
                                        new AuthenticationResponse("Phone number already registered"));
                }

                Role reqRole = parseRole(request.getRole());

                // 3. Validate National ID / Passport (Max 13 chars, only 'v' as letter)
                if (request.getNationalId() != null && !request.getNationalId().isBlank()) {
                        if (request.getNationalId().length() > 13) {
                                return ResponseEntity.badRequest().body(new AuthenticationResponse("National ID / Passport cannot exceed 13 characters"));
                        }
                        // Only numbers and 'v'/'V' allowed
                        if (!request.getNationalId().matches("^[0-9vV]*$")) {
                                return ResponseEntity.badRequest().body(new AuthenticationResponse("National ID can only contain numbers and the letter 'v'"));
                        }
                }

                // Check duplicate National ID (All roles that provide it)
                if (request.getNationalId() != null && !request.getNationalId().isBlank()
                                && userRepository.existsByNationalId(request.getNationalId())) {
                        return ResponseEntity.badRequest().body(
                                        new AuthenticationResponse("National ID / Passport already registered"));
                }

                // Check duplicate Medical License Number (doctors only)
                if (reqRole == Role.DOCTOR
                                && request.getMedicalLicenseNumber() != null
                                && !request.getMedicalLicenseNumber().isBlank()
                                && userRepository.existsByMedicalLicenseNumber(request.getMedicalLicenseNumber())) {
                        return ResponseEntity.badRequest().body(
                                        new AuthenticationResponse("Medical license number already registered"));
                }

                // Check duplicate Company (Suppliers only)
                if (reqRole == Role.SUPPLIER) {
                        if (request.getCompanyRegId() != null
                                        && !request.getCompanyRegId().isBlank()
                                        && userRepository.existsByCompanyRegId(request.getCompanyRegId())) {
                                return ResponseEntity.badRequest().body(
                                                new AuthenticationResponse("Company registration ID already registered"));
                        }
                        if (request.getCompanyName() != null
                                        && !request.getCompanyName().isBlank()
                                        && userRepository.existsByCompanyName(request.getCompanyName())) {
                                return ResponseEntity.badRequest().body(
                                                new AuthenticationResponse("Company name already registered"));
                        }
                }

                // Check age >= 18 from date of birth
                if (request.getDob() != null && !request.getDob().isBlank()) {
                        try {
                                LocalDate birth = LocalDate.parse(request.getDob());
                                int age = Period.between(birth, LocalDate.now()).getYears();
                                if (age < 18) {
                                        return ResponseEntity.badRequest().body(
                                                        new AuthenticationResponse(
                                                                        "You must be at least 18 years old to register"));
                                }
                        } catch (Exception ignored) {
                                // If DOB format is invalid, skip — frontend validates format
                        }
                }

                User user = User.builder()
                                .username(request.getEmail()) // email is the username/login
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(reqRole)
                                .banned(false)
                                .approved(reqRole == Role.PATIENT || reqRole == Role.PHARMACIST || reqRole == Role.LAB_TECH)
                                // Common
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .phone(request.getPhone())
                                // Patient
                                .nationalId(request.getNationalId())
                                .dob(request.getDob())
                                .gender(request.getGender())
                                .address(request.getAddress())
                                .bloodGroup(request.getBloodGroup())
                                .allergies(request.getAllergies())
                                .emergencyContactName(request.getEmergencyContactName())
                                .emergencyContactPhone(request.getEmergencyContactPhone())
                                // Doctor
                                .medicalLicenseNumber(request.getMedicalLicenseNumber())
                                .specialization(request.getSpecialization())
                                .qualifications(request.getQualifications())
                                .yearsOfExperience(request.getYearsOfExperience() != null
                                                ? Integer.parseInt(request.getYearsOfExperience())
                                                : null)
                                // Supplier
                                .companyName(request.getCompanyName())
                                .companyRegId(request.getCompanyRegId())
                                .twoFactorEnabled(true) // Enforce 2FA for all new registrations
                                .build();

                userRepository.save(user);

                // Handle Files
                try {
                        if (profilePic != null && !profilePic.isEmpty()) {
                                String filename = fileStorageService.saveProfilePicture(profilePic);
                                user.setProfilePicturePath(filename);
                        }
                        if (certificate != null && !certificate.isEmpty()) {
                                String filename = fileStorageService.saveCertificate(certificate);
                                user.setCertificatePath(filename);
                        }
                        if (profilePic != null || certificate != null) {
                                userRepository.save(user);
                        }
                } catch (Exception e) {
                        throw new RuntimeException("Could not store files: " + e.getMessage());
                }

                // Notify Admins about new Doctor registration
                if (reqRole == Role.DOCTOR) {
                        userRepository.findAll().stream()
                                        .filter(u -> u.getRole() == Role.ADMIN)
                                        .forEach(admin -> {
                                                notificationRepository.save(new com.carelink.entity.Notification(
                                                                admin,
                                                                "New Doctor Registration",
                                                                "A new doctor, Dr. " + user.getFirstName() + " "
                                                                                + user.getLastName()
                                                                                + ", has registered and is pending approval."));
                                        });
                }

                if (reqRole == Role.SUPPLIER) {
                        // Create Supplier entity record
                        com.carelink.entity.Supplier sProfile = new com.carelink.entity.Supplier();
                        sProfile.setUser(user);
                        sProfile.setCompanyRegId(user.getCompanyRegId());
                        sProfile.setName(user.getCompanyName());
                        sProfile.setEmail(user.getEmail());
                        sProfile.setPhone(user.getPhone());
                        supplierRepository.save(sProfile);

                        userRepository.findAll().stream()
                                        .filter(u -> u.getRole() == Role.ADMIN)
                                        .forEach(admin -> {
                                                notificationRepository.save(new com.carelink.entity.Notification(
                                                                admin,
                                                                "New Supplier Registration",
                                                                "A new supplier, " + user.getCompanyName()
                                                                                + " (Reg ID: " + user.getCompanyRegId()
                                                                                + "), has registered."));
                                        });
                }

                // Two Factor Authentication Check for registration if enabled
                if (user.isTwoFactorEnabled()) {
                        String code = generateVerificationCode();
                        user.setTwoFactorCode(code);
                        user.setTwoFactorExpiry(LocalDateTime.now().plusMinutes(5));
                        userRepository.save(user);

                        emailService.sendTwoFactorCodeEmail(user.getEmail(), code);

                        return ResponseEntity.ok(AuthenticationResponse.builder()
                                        .message("Verification code sent to your email")
                                        .requires2fa(true)
                                        .username(user.getUsername())
                                        .build());
                }

                if (!user.isApproved()) {
                        return ResponseEntity.ok(AuthenticationResponse.builder()
                                        .message("Registration successful. Your account is pending admin approval.")
                                        .role(user.getRole().name())
                                        .username(user.getUsername())
                                        .build());
                }

                var jwt = jwtService.generateToken(user);
                return ResponseEntity.ok(AuthenticationResponse.builder()
                                .token(jwt)
                                .role(user.getRole().name())
                                .username(user.getUsername())
                                .build());
        }

        // Accepts both /authenticate and /login
        @PostMapping({ "/authenticate", "/login" })
        public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
                try {
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getUsername(), request.getPassword()));
                } catch (org.springframework.security.authentication.DisabledException e) {
                        return ResponseEntity.status(403).body(new AuthenticationResponse("Account pending admin approval"));
                } catch (org.springframework.security.authentication.LockedException e) {
                        return ResponseEntity.status(403).body(new AuthenticationResponse("Account is banned"));
                } catch (Exception e) {
                        return ResponseEntity.status(401).body(new AuthenticationResponse("Invalid credentials"));
                }
                var user = userRepository.findByUsername(request.getUsername()).orElseThrow();
                if (!user.isApproved()) {
                        return ResponseEntity.status(403)
                                        .body(new AuthenticationResponse("Account pending admin approval"));
                }
                if (user.isBanned()) {
                        return ResponseEntity.status(403).body(new AuthenticationResponse("Account is banned"));
                }

                // Two Factor Authentication Check
                if (user.isTwoFactorEnabled()) {
                        String code = generateVerificationCode();
                        user.setTwoFactorCode(code);
                        user.setTwoFactorExpiry(LocalDateTime.now().plusMinutes(5));
                        userRepository.save(user);

                        emailService.sendTwoFactorCodeEmail(user.getEmail(), code);

                        return ResponseEntity.ok(AuthenticationResponse.builder()
                                        .message("Verification code sent to your email")
                                        .requires2fa(true)
                                        .username(user.getUsername())
                                        .build());
                }
                var jwt = jwtService.generateToken(user);
                return ResponseEntity.ok(AuthenticationResponse.builder()
                                .token(jwt)
                                .role(user.getRole().name())
                                .username(user.getUsername())
                                .build());
        }

        @PostMapping("/forgot-password")
        public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
                userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
                        String token = UUID.randomUUID().toString();
                        user.setResetToken(token);
                        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
                        userRepository.save(user);
                        emailService.sendResetPasswordEmail(user.getEmail(), token);
                });
                return ResponseEntity.ok(Map.of("message", "If an account exists with that email, a reset link has been sent."));
        }

        @PostMapping("/reset-password")
        public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
                User user = userRepository.findByResetToken(request.getToken()).orElse(null);
                if (user == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired reset token"));
                }

                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                user.setResetToken(null);
                user.setResetTokenExpiry(null);
                userRepository.save(user);

                return ResponseEntity.ok(Map.of("message", "Your password has been successfully reset."));
        }

        @PostMapping("/verify-2fa")
        public ResponseEntity<AuthenticationResponse> verify2fa(@RequestBody TwoFactorRequest request) {
                var user = userRepository.findByUsername(request.getUsername()).orElse(null);
                if (user == null) {
                        return ResponseEntity.status(401).body(new AuthenticationResponse("Invalid user"));
                }

                if (user.getTwoFactorCode() == null || !user.getTwoFactorCode().equals(request.getCode())) {
                        return ResponseEntity.status(401).body(new AuthenticationResponse("Invalid verification code"));
                }

                if (user.getTwoFactorExpiry().isBefore(LocalDateTime.now())) {
                        return ResponseEntity.status(401).body(new AuthenticationResponse("Verification code expired"));
                }

                // Clear the code after successful verification
                user.setTwoFactorCode(null);
                user.setTwoFactorExpiry(null);
                userRepository.save(user);

                if (!user.isApproved()) {
                        return ResponseEntity.ok(AuthenticationResponse.builder()
                                        .message("Account verified! Your profile is pending admin approval.")
                                        .role(user.getRole().name())
                                        .username(user.getUsername())
                                        .build());
                }

                var jwt = jwtService.generateToken(user);
                return ResponseEntity.ok(AuthenticationResponse.builder()
                                .token(jwt)
                                .role(user.getRole().name())
                                .username(user.getUsername())
                                .build());
        }

        private String generateVerificationCode() {
                java.util.Random random = new java.util.Random();
                return String.format("%06d", random.nextInt(999999));
        }

        private Role parseRole(String role) {
                if (role == null || role.isBlank())
                        return Role.PATIENT;
                try {
                        return Role.valueOf(role.toUpperCase());
                } catch (IllegalArgumentException e) {
                        return Role.PATIENT;
                }
        }
}
