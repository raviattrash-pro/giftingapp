package com.giftconcierge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LoginRequest that = (LoginRequest) o;
        return java.util.Objects.equals(email, that.email) &&
                java.util.Objects.equals(password, that.password);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(email, password);
    }

    @Override
    public String toString() {
        return "LoginRequest(email=" + email + ", password=" + password + ")";
    }

    public static LoginRequestBuilder builder() {
        return new LoginRequestBuilder();
    }

    public static class LoginRequestBuilder {
        private String email;
        private String password;

        LoginRequestBuilder() {
        }

        public LoginRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public LoginRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public LoginRequest build() {
            return new LoginRequest(email, password);
        }
    }
}
