package com.giftconcierge.dto;

import java.math.BigDecimal;
import java.util.Map;

public class UserResponse {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String timezone;
    private BigDecimal monthlyBudget;
    private Boolean premium;
    private String role;
    private Map<String, Boolean> featureFlags;

    public UserResponse() {
    }

    public UserResponse(Long id, String email, String fullName, String phone, String avatarUrl, String timezone, BigDecimal monthlyBudget, Boolean premium, String role, Map<String, Boolean> featureFlags) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.timezone = timezone;
        this.monthlyBudget = monthlyBudget;
        this.premium = premium;
        this.role = role;
        this.featureFlags = featureFlags;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserResponse that = (UserResponse) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(email, that.email) &&
                java.util.Objects.equals(fullName, that.fullName) &&
                java.util.Objects.equals(phone, that.phone) &&
                java.util.Objects.equals(avatarUrl, that.avatarUrl) &&
                java.util.Objects.equals(timezone, that.timezone) &&
                java.util.Objects.equals(monthlyBudget, that.monthlyBudget) &&
                java.util.Objects.equals(premium, that.premium) &&
                java.util.Objects.equals(role, that.role) &&
                java.util.Objects.equals(featureFlags, that.featureFlags);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, email, fullName, phone, avatarUrl, timezone, monthlyBudget, premium, role, featureFlags);
    }

    @Override
    public String toString() {
        return "UserResponse(id=" + id + ", email=" + email + ", fullName=" + fullName + ", phone=" + phone + ", avatarUrl=" + avatarUrl + ", timezone=" + timezone + ", monthlyBudget=" + monthlyBudget + ", premium=" + premium + ", role=" + role + ", featureFlags=" + featureFlags + ")";
    }

    public static UserResponseBuilder builder() {
        return new UserResponseBuilder();
    }

    public static class UserResponseBuilder {
        private Long id;
        private String email;
        private String fullName;
        private String phone;
        private String avatarUrl;
        private String timezone;
        private BigDecimal monthlyBudget;
        private Boolean premium;
        private String role;
        private Map<String, Boolean> featureFlags;

        UserResponseBuilder() {
        }

        public UserResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserResponseBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public UserResponseBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public UserResponseBuilder avatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
            return this;
        }

        public UserResponseBuilder timezone(String timezone) {
            this.timezone = timezone;
            return this;
        }

        public UserResponseBuilder monthlyBudget(BigDecimal monthlyBudget) {
            this.monthlyBudget = monthlyBudget;
            return this;
        }

        public UserResponseBuilder premium(Boolean premium) {
            this.premium = premium;
            return this;
        }

        public UserResponseBuilder role(String role) {
            this.role = role;
            return this;
        }

        public UserResponseBuilder featureFlags(Map<String, Boolean> featureFlags) {
            this.featureFlags = featureFlags;
            return this;
        }

        public UserResponse build() {
            return new UserResponse(id, email, fullName, phone, avatarUrl, timezone, monthlyBudget, premium, role, featureFlags);
        }
    }
}
