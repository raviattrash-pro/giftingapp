package com.giftconcierge.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "auto_pilot_gifts")
public class AutoPilotGift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Recipient recipient;

    @Column(name = "occasion_type", length = 50)
    private String occasionType;

    @Column(precision = 10, scale = 2)
    private BigDecimal budget;

    @Column(columnDefinition = "TEXT")
    private String preferences;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "requires_approval")
    private Boolean requiresApproval = true;

    @Column(name = "last_triggered")
    private LocalDateTime lastTriggered;

    public AutoPilotGift() {
    }

    public AutoPilotGift(Long id, User user, Recipient recipient, String occasionType, BigDecimal budget, String preferences, Boolean isActive, Boolean requiresApproval, LocalDateTime lastTriggered) {
        this.id = id;
        this.user = user;
        this.recipient = recipient;
        this.occasionType = occasionType;
        this.budget = budget;
        this.preferences = preferences;
        this.isActive = isActive;
        this.requiresApproval = requiresApproval;
        this.lastTriggered = lastTriggered;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Recipient getRecipient() {
        return this.recipient;
    }

    public void setRecipient(Recipient recipient) {
        this.recipient = recipient;
    }

    public String getOccasionType() {
        return this.occasionType;
    }

    public void setOccasionType(String occasionType) {
        this.occasionType = occasionType;
    }

    public BigDecimal getBudget() {
        return this.budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public String getPreferences() {
        return this.preferences;
    }

    public void setPreferences(String preferences) {
        this.preferences = preferences;
    }

    public Boolean getIsActive() {
        return this.isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getRequiresApproval() {
        return this.requiresApproval;
    }

    public void setRequiresApproval(Boolean requiresApproval) {
        this.requiresApproval = requiresApproval;
    }

    public LocalDateTime getLastTriggered() {
        return this.lastTriggered;
    }

    public void setLastTriggered(LocalDateTime lastTriggered) {
        this.lastTriggered = lastTriggered;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AutoPilotGift that = (AutoPilotGift) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(occasionType, that.occasionType) &&
                java.util.Objects.equals(budget, that.budget) &&
                java.util.Objects.equals(preferences, that.preferences) &&
                java.util.Objects.equals(isActive, that.isActive) &&
                java.util.Objects.equals(requiresApproval, that.requiresApproval) &&
                java.util.Objects.equals(lastTriggered, that.lastTriggered);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, occasionType, budget, preferences, isActive, requiresApproval, lastTriggered);
    }

    @Override
    public String toString() {
        return "AutoPilotGift(id=" + id + ", occasionType=" + occasionType + ", budget=" + budget + ", preferences=" + preferences + ", isActive=" + isActive + ", requiresApproval=" + requiresApproval + ", lastTriggered=" + lastTriggered + ")";
    }

    public static AutoPilotGiftBuilder builder() {
        return new AutoPilotGiftBuilder();
    }

    public static class AutoPilotGiftBuilder {
        private Long id;
        private User user;
        private Recipient recipient;
        private String occasionType;
        private BigDecimal budget;
        private String preferences;
        private Boolean isActive = true;
        private Boolean requiresApproval = true;
        private LocalDateTime lastTriggered;

        AutoPilotGiftBuilder() {
        }

        public AutoPilotGiftBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AutoPilotGiftBuilder user(User user) {
            this.user = user;
            return this;
        }

        public AutoPilotGiftBuilder recipient(Recipient recipient) {
            this.recipient = recipient;
            return this;
        }

        public AutoPilotGiftBuilder occasionType(String occasionType) {
            this.occasionType = occasionType;
            return this;
        }

        public AutoPilotGiftBuilder budget(BigDecimal budget) {
            this.budget = budget;
            return this;
        }

        public AutoPilotGiftBuilder preferences(String preferences) {
            this.preferences = preferences;
            return this;
        }

        public AutoPilotGiftBuilder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public AutoPilotGiftBuilder requiresApproval(Boolean requiresApproval) {
            this.requiresApproval = requiresApproval;
            return this;
        }

        public AutoPilotGiftBuilder lastTriggered(LocalDateTime lastTriggered) {
            this.lastTriggered = lastTriggered;
            return this;
        }

        public AutoPilotGift build() {
            return new AutoPilotGift(id, user, recipient, occasionType, budget, preferences, isActive, requiresApproval, lastTriggered);
        }
    }
}
