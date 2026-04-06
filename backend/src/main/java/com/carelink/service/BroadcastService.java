package com.carelink.service;

import com.carelink.dto.BroadcastRequest;
import com.carelink.entity.Role;
import com.carelink.entity.User;
import com.carelink.repository.UserRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class BroadcastService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public BroadcastService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Async
    public void sendBroadcast(BroadcastRequest request) {
        List<User> recipients;
        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            recipients = userRepository.findAll();
        } else {
            recipients = userRepository.findAll().stream()
                    .filter(u -> request.getRoles().contains(u.getRole()))
                    .toList();
        }

        for (User user : recipients) {
            String toEmail = user.getEmail();
            if (toEmail != null && !toEmail.isBlank()) {
                try {
                    emailService.sendBroadcastEmail(
                            toEmail,
                            request.getSubject(),
                            request.getTitle(),
                            request.getMessage()
                    );
                } catch (Exception e) {
                    System.err.println("Failed to send broadcast to " + toEmail + ": " + e.getMessage());
                }
            }
        }
    }
}
