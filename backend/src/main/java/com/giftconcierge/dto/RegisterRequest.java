package com.giftconcierge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;

    private String avatarUrl;

    public RegisterRequest() {
    }

    public RegisterRequest(String email, String password, String fullName, String phone, String avatarUrl) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
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

    public String getFullName() {
        return this.fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return this.phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return this.avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RegisterRequest that = (RegisterRequest) o;
        return java.util.Objects.equals(email, that.email) &&
                java.util.Objects.equals(password, that.password) &&
                java.util.Objects.equals(fullName, that.fullName) &&
                java.util.Objects.equals(phone, that.phone) &&
                java.util.Objects.equals(avatarUrl, that.avatarUrl);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(email, password, fullName, phone, avatarUrl);
    }

    @Override
    public String toString() {
        return "RegisterRequest(email=" + email + ", password=" + password + ", fullName=" + fullName + ", phone=" + phone + ", avatarUrl=" + avatarUrl + ")";
    }

    public static RegisterRequestBuilder builder() {
        return new RegisterRequestBuilder();
    }

    public static class RegisterRequestBuilder {
        private String email;
        private String password;
        private String fullName;
        private String phone;
        private String avatarUrl;

        RegisterRequestBuilder() {
        }

        public RegisterRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public RegisterRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public RegisterRequestBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public RegisterRequestBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public RegisterRequestBuilder avatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
            return this;
        }

        public RegisterRequest build() {
            return new RegisterRequest(email, password, fullName, phone, avatarUrl);
        }
    }
}
