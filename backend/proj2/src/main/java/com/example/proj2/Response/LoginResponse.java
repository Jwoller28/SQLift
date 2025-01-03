package com.example.proj2.Response;

public class LoginResponse {
    private String token;

    private long expiresIn;

    public LoginResponse() {
    }

    public String getToken() {
        return token;
    }

    public LoginResponse(String token) {
        this.token = token;
    }

    public LoginResponse(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public LoginResponse(String token, long expiresIn) {
        this.token = token;
        this.expiresIn = expiresIn;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }
}
