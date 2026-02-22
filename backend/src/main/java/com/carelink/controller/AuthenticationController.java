package com.carelink.controller;

import com.carelink.security.JwtService;
import com.carelink.repository.UserRepository;
import com.carelink.dto.AuthenticationRequest;
import com.carelink.dto.RegisterRequest;
import com.carelink.dto.AuthenticationResponse;
import com.carelink.entity.User;
import com.carelink.entity.Role;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthenticationController(
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService,
                        AuthenticationManager authenticationManager) {
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
                this.authenticationManager = authenticationManager;
        }

        @PostMapping("/register")
        public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
                // Check duplicate email / username
                if (userRepository.findByUsername(request.getEmail()).isPresent()) {
                        return ResponseEntity.badRequest().body(
                                        new AuthenticationResponse("Email already registered"));
                }

                Role reqRole = parseRole(request.getRole());
                User user = User.builder()
                                .username(request.getEmail()) // email is the username/login
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(reqRole)
                                .banned(false)
                                .approved(reqRole != Role.DOCTOR)
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
                                .build();

                userRepository.save(user);
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
                var jwt = jwtService.generateToken(user);
                return ResponseEntity.ok(AuthenticationResponse.builder()
                                .token(jwt)
                                .role(user.getRole().name())
                                .username(user.getUsername())
                                .build());
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
