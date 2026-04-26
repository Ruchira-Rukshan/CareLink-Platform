package com.carelink.dto;

import com.carelink.entity.Role;
import java.util.List;

public class BroadcastRequest {
    private String subject;
    private String title;
    private String message;
    private List<Role> roles;

    public BroadcastRequest() {}

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<Role> getRoles() { return roles; }
    public void setRoles(List<Role> roles) { this.roles = roles; }
}
