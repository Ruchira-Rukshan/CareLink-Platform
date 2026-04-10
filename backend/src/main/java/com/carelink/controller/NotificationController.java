package com.carelink.controller;

import com.carelink.dto.NotificationResponse;
import com.carelink.entity.Notification;
import com.carelink.entity.User;
import com.carelink.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(@AuthenticationPrincipal User user) {
        if (user == null)
            return ResponseEntity.status(401).build();

        List<NotificationResponse> list = notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
                .stream()
                .map(NotificationResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@AuthenticationPrincipal User user) {
        if (user == null)
            return ResponseEntity.status(401).build();
        long count = notificationRepository.countByRecipientAndIsReadFalse(user);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null)
            return ResponseEntity.status(401).build();

        Notification n = notificationRepository.findById(id).orElse(null);
        if (n == null || !n.getRecipient().getId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }

        n.setRead(true);
        notificationRepository.save(n);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(@AuthenticationPrincipal User user) {
        if (user == null)
            return ResponseEntity.status(401).build();

        List<Notification> unread = notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
                .stream()
                .filter(n -> !n.isRead())
                .collect(Collectors.toList());

        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return ResponseEntity.ok().build();
    }
}
