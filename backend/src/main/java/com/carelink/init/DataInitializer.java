package com.carelink.init;

import com.carelink.repository.UserRepository;
import com.carelink.entity.User;
import com.carelink.entity.Role;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin@carelink.com").isEmpty()) {
            User admin = User.builder()
                    .username("admin@carelink.com")
                    .email("admin@carelink.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .banned(false)
                    .approved(true)
                    .firstName("System")
                    .lastName("Administrator")
                    .build();
            userRepository.save(admin);
            System.out.println("Admin account seeded successfully.");
        }

        if (userRepository.findByUsername("pharmacy@carelink.com").isEmpty()) {
            User pharmacy = User.builder()
                    .username("pharmacy@carelink.com")
                    .email("pharmacy@carelink.com")
                    .password(passwordEncoder.encode("pharmacy123"))
                    .role(Role.PHARMACIST)
                    .banned(false)
                    .approved(true)
                    .firstName("Central")
                    .lastName("Pharmacy")
                    .build();
            userRepository.save(pharmacy);
            System.out.println("Pharmacy account seeded successfully.");
        }

        if (userRepository.findByUsername("lab@carelink.com").isEmpty()) {
            User lab = User.builder()
                    .username("lab@carelink.com")
                    .email("lab@carelink.com")
                    .password(passwordEncoder.encode("lab123"))
                    .role(Role.LAB_TECH)
                    .banned(false)
                    .approved(true)
                    .firstName("Main")
                    .lastName("Laboratory")
                    .build();
            userRepository.save(lab);
            System.out.println("Laboratory account seeded successfully.");
        }
    }
}
