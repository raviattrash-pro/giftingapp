package com.giftconcierge.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "auth_provider", length = 20)
    private String authProvider = "LOCAL";

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(length = 20)
    private String phone;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(length = 50)
    private String timezone;

    @Column(name = "monthly_budget", precision = 10, scale = 2)
    private BigDecimal monthlyBudget;

    @Column(nullable = false)
    private Boolean premium = false;

    @Column(length = 20, nullable = false)
    private String role = "USER";

    @Column(name = "feature_flags")
    @Convert(converter = FeatureFlagsConverter.class)
    private Map<String, Boolean> featureFlags;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @Column(name = "otp_code", length = 10)
    private String otpCode;

    @Column(name = "otp_expiry_time")
    private LocalDateTime otpExpiryTime;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Recipient> recipients = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Address> addresses = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Wishlist> wishlists = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GiftOrder> giftOrders = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Budget> budgets = new ArrayList<>();

    public User() {
    }

    public User(Long id, String email, String passwordHash, String authProvider, String fullName, String phone, String avatarUrl, String timezone, BigDecimal monthlyBudget, Boolean premium, String role, Map<String, Boolean> featureFlags, Boolean isVerified, String otpCode, LocalDateTime otpExpiryTime, LocalDateTime createdAt, LocalDateTime updatedAt, List<Recipient> recipients, List<Address> addresses, List<Wishlist> wishlists, List<GiftOrder> giftOrders, List<Budget> budgets) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.authProvider = authProvider;
        this.fullName = fullName;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.timezone = timezone;
        this.monthlyBudget = monthlyBudget;
        this.premium = premium;
        this.role = role;
        this.featureFlags = featureFlags;
        this.isVerified = isVerified;
        this.otpCode = otpCode;
        this.otpExpiryTime = otpExpiryTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.recipients = recipients;
        this.addresses = addresses;
        this.wishlists = wishlists;
        this.giftOrders = giftOrders;
        this.budgets = budgets;
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

    public String getPasswordHash() {
        return this.passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getAuthProvider() {
        return this.authProvider;
    }

    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
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

    public String getTimezone() {
        return this.timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public BigDecimal getMonthlyBudget() {
        return this.monthlyBudget;
    }

    public void setMonthlyBudget(BigDecimal monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
    }

    public Boolean getPremium() {
        return this.premium;
    }

    public void setPremium(Boolean premium) {
        this.premium = premium;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Map<String, Boolean> getFeatureFlags() {
        return this.featureFlags;
    }

    public void setFeatureFlags(Map<String, Boolean> featureFlags) {
        this.featureFlags = featureFlags;
    }

    public Boolean getIsVerified() {
        return this.isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getOtpCode() {
        return this.otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public LocalDateTime getOtpExpiryTime() {
        return this.otpExpiryTime;
    }

    public void setOtpExpiryTime(LocalDateTime otpExpiryTime) {
        this.otpExpiryTime = otpExpiryTime;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<Recipient> getRecipients() {
        return this.recipients;
    }

    public void setRecipients(List<Recipient> recipients) {
        this.recipients = recipients;
    }

    public List<Address> getAddresses() {
        return this.addresses;
    }

    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }

    public List<Wishlist> getWishlists() {
        return this.wishlists;
    }

    public void setWishlists(List<Wishlist> wishlists) {
        this.wishlists = wishlists;
    }

    public List<GiftOrder> getGiftOrders() {
        return this.giftOrders;
    }

    public void setGiftOrders(List<GiftOrder> giftOrders) {
        this.giftOrders = giftOrders;
    }

    public List<Budget> getBudgets() {
        return this.budgets;
    }

    public void setBudgets(List<Budget> budgets) {
        this.budgets = budgets;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return java.util.Objects.equals(id, user.id) &&
                java.util.Objects.equals(email, user.email) &&
                java.util.Objects.equals(passwordHash, user.passwordHash) &&
                java.util.Objects.equals(fullName, user.fullName) &&
                java.util.Objects.equals(phone, user.phone) &&
                java.util.Objects.equals(avatarUrl, user.avatarUrl) &&
                java.util.Objects.equals(timezone, user.timezone) &&
                java.util.Objects.equals(monthlyBudget, user.monthlyBudget) &&
                java.util.Objects.equals(premium, user.premium) &&
                java.util.Objects.equals(role, user.role) &&
                java.util.Objects.equals(featureFlags, user.featureFlags) &&
                java.util.Objects.equals(isVerified, user.isVerified) &&
                java.util.Objects.equals(otpCode, user.otpCode) &&
                java.util.Objects.equals(otpExpiryTime, user.otpExpiryTime) &&
                java.util.Objects.equals(createdAt, user.createdAt) &&
                java.util.Objects.equals(updatedAt, user.updatedAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, email, passwordHash, fullName, phone, avatarUrl, timezone, monthlyBudget, premium, role, featureFlags, isVerified, otpCode, otpExpiryTime, createdAt, updatedAt);
    }

    @Override
    public String toString() {
        return "User(id=" + id + ", email=" + email + ", passwordHash=" + passwordHash + ", fullName=" + fullName + ", phone=" + phone + ", avatarUrl=" + avatarUrl + ", timezone=" + timezone + ", monthlyBudget=" + monthlyBudget + ", premium=" + premium + ", role=" + role + ", featureFlags=" + featureFlags + ", isVerified=" + isVerified + ", otpCode=" + otpCode + ", otpExpiryTime=" + otpExpiryTime + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + ")";
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String email;
        private String passwordHash;
        private String authProvider = "LOCAL";
        private String fullName;
        private String phone;
        private String avatarUrl;
        private String timezone;
        private BigDecimal monthlyBudget;
        private Boolean premium = false;
        private String role = "USER";
        private Map<String, Boolean> featureFlags;
        private Boolean isVerified = false;
        private String otpCode;
        private LocalDateTime otpExpiryTime;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<Recipient> recipients = new ArrayList<>();
        private List<Address> addresses = new ArrayList<>();
        private List<Wishlist> wishlists = new ArrayList<>();
        private List<GiftOrder> giftOrders = new ArrayList<>();
        private List<Budget> budgets = new ArrayList<>();

        UserBuilder() {
        }

        public UserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder passwordHash(String passwordHash) {
            this.passwordHash = passwordHash;
            return this;
        }

        public UserBuilder authProvider(String authProvider) {
            this.authProvider = authProvider;
            return this;
        }

        public UserBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public UserBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public UserBuilder avatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
            return this;
        }

        public UserBuilder timezone(String timezone) {
            this.timezone = timezone;
            return this;
        }

        public UserBuilder monthlyBudget(BigDecimal monthlyBudget) {
            this.monthlyBudget = monthlyBudget;
            return this;
        }

        public UserBuilder premium(Boolean premium) {
            this.premium = premium;
            return this;
        }

        public UserBuilder role(String role) {
            this.role = role;
            return this;
        }

        public UserBuilder featureFlags(Map<String, Boolean> featureFlags) {
            this.featureFlags = featureFlags;
            return this;
        }

        public UserBuilder isVerified(Boolean isVerified) {
            this.isVerified = isVerified;
            return this;
        }

        public UserBuilder otpCode(String otpCode) {
            this.otpCode = otpCode;
            return this;
        }

        public UserBuilder otpExpiryTime(LocalDateTime otpExpiryTime) {
            this.otpExpiryTime = otpExpiryTime;
            return this;
        }

        public UserBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public UserBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public UserBuilder recipients(List<Recipient> recipients) {
            this.recipients = recipients;
            return this;
        }

        public UserBuilder addresses(List<Address> addresses) {
            this.addresses = addresses;
            return this;
        }

        public UserBuilder wishlists(List<Wishlist> wishlists) {
            this.wishlists = wishlists;
            return this;
        }

        public UserBuilder giftOrders(List<GiftOrder> giftOrders) {
            this.giftOrders = giftOrders;
            return this;
        }

        public UserBuilder budgets(List<Budget> budgets) {
            this.budgets = budgets;
            return this;
        }

        public User build() {
            return new User(id, email, passwordHash, authProvider, fullName, phone, avatarUrl, timezone, monthlyBudget, premium, role, featureFlags, isVerified, otpCode, otpExpiryTime, createdAt, updatedAt, recipients, addresses, wishlists, giftOrders, budgets);
        }
    }
}
