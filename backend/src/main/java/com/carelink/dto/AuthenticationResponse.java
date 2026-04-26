package com.carelink.dto;

public class AuthenticationResponse {
    private String token;
    private String role;
    private String username;
    private String message;
    private boolean requires2fa;

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

    public AuthenticationResponse(String message, boolean requires2fa) {
        this.message = message;
        this.requires2fa = requires2fa;
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

    public boolean isRequires2fa() {
        return requires2fa;
    }

    public void setRequires2fa(boolean requires2fa) {
        this.requires2fa = requires2fa;
    }

    public static AuthenticationResponseBuilder builder() {
        return new AuthenticationResponseBuilder();
    }

    public static class AuthenticationResponseBuilder {
        private String token;
        private String role;
        private String username;
        private String message;
        private boolean requires2fa;

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

        public AuthenticationResponseBuilder requires2fa(boolean t) {
            this.requires2fa = t;
            return this;
        }

        public AuthenticationResponse build() {
            AuthenticationResponse res = new AuthenticationResponse(token, role, username, message);
            res.setRequires2fa(this.requires2fa);
            return res;
        }
    }
}
