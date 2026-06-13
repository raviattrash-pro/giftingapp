package com.giftconcierge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 6)
    private String code;

    @NotBlank
    @Size(min = 6)
    private String newPassword;

    public ResetPasswordRequest() {
    }

    public ResetPasswordRequest(String email, String code, String newPassword) {
        this.email = email;
        this.code = code;
        this.newPassword = newPassword;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNewPassword() {
        return this.newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ResetPasswordRequest that = (ResetPasswordRequest) o;
        return java.util.Objects.equals(email, that.email) &&
                java.util.Objects.equals(code, that.code) &&
                java.util.Objects.equals(newPassword, that.newPassword);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(email, code, newPassword);
    }

    @Override
    public String toString() {
        return "ResetPasswordRequest(email=" + email + ", code=" + code + ", newPassword=" + newPassword + ")";
    }
}
