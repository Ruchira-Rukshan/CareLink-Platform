package com.carelink.dto;

public class AuthenticationResponse {
    private String token;
    private String role;
    private String username;
    private String message;

    public AuthenticationResponse() {
    }

    public AuthenticationResponse(String message) {
        this.message = message;
    }

    public AuthenticationResponse(String token, String role, String username) {
        this.token = token;
        this.role = role;
        this.username = username;
    }

    public AuthenticationResponse(String token, String role, String username, String message) {
        this.token = token;
        this.role = role;
        this.username = username;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String v) {
        this.token = v;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String v) {
        this.role = v;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String v) {
        this.username = v;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String v) {
        this.message = v;
    }

    public static AuthenticationResponseBuilder builder() {
        return new AuthenticationResponseBuilder();
    }

    public static class AuthenticationResponseBuilder {
        private String token;
        private String role;
        private String username;
        private String message;

        public AuthenticationResponseBuilder token(String t) {
            this.token = t;
            return this;
        }

        public AuthenticationResponseBuilder role(String t) {
            this.role = t;
            return this;
        }

        public AuthenticationResponseBuilder username(String t) {
            this.username = t;
            return this;
        }

        public AuthenticationResponseBuilder message(String t) {
            this.message = t;
            return this;
        }

        public AuthenticationResponse build() {
            return new AuthenticationResponse(token, role, username, message);
        }
    }
}
