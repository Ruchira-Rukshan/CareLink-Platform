package com.carelink.dto;

import com.carelink.entity.Notification;
import java.time.LocalDateTime;

public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;

    public NotificationResponse(Notification n) {
        this.id = n.getId();
        this.title = n.getTitle();
        this.message = n.getMessage();
        this.isRead = n.isRead();
        this.createdAt = n.getCreatedAt();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public boolean isRead() {
        return isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
