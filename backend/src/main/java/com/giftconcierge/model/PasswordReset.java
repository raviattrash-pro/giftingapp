package com.giftconcierge.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "password_resets")
public class PasswordReset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 6)
    private String code;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    public PasswordReset() {
    }

    public PasswordReset(Long id, String email, String code, LocalDateTime expiresAt) {
        this.id = id;
        this.email = email;
        this.code = code;
        this.expiresAt = expiresAt;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getExpiresAt() {
        return this.expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PasswordReset that = (PasswordReset) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(email, that.email) &&
                java.util.Objects.equals(code, that.code) &&
                java.util.Objects.equals(expiresAt, that.expiresAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, email, code, expiresAt);
    }

    @Override
    public String toString() {
        return "PasswordReset(id=" + id + ", email=" + email + ", code=" + code + ", expiresAt=" + expiresAt + ")";
    }

    public static PasswordResetBuilder builder() {
        return new PasswordResetBuilder();
    }

    public static class PasswordResetBuilder {
        private Long id;
        private String email;
        private String code;
        private LocalDateTime expiresAt;

        PasswordResetBuilder() {
        }

        public PasswordResetBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PasswordResetBuilder email(String email) {
            this.email = email;
            return this;
        }

        public PasswordResetBuilder code(String code) {
            this.code = code;
            return this;
        }

        public PasswordResetBuilder expiresAt(LocalDateTime expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        public PasswordReset build() {
            return new PasswordReset(id, email, code, expiresAt);
        }
    }
}
