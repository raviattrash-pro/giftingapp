package com.giftconcierge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequest {
    @NotBlank
    @Email
    private String email;

    public ForgotPasswordRequest() {
    }

    public ForgotPasswordRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ForgotPasswordRequest that = (ForgotPasswordRequest) o;
        return java.util.Objects.equals(email, that.email);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(email);
    }

    @Override
    public String toString() {
        return "ForgotPasswordRequest(email=" + email + ")";
    }
}
