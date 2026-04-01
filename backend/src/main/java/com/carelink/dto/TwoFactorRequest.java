package com.carelink.dto;

public class TwoFactorRequest {
    private String username;
    private String code;

    public TwoFactorRequest() {
    }

    public TwoFactorRequest(String username, String code) {
        this.username = username;
        this.code = code;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
