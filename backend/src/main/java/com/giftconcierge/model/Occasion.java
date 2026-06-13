package com.giftconcierge.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "occasions")
public class Occasion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Recipient recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(name = "custom_name", length = 100)
    private String customName;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "is_recurring")
    private Boolean isRecurring = false;

    @Column(name = "recurrence_pattern", length = 50)
    private String recurrencePattern;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "auto_gift_enabled")
    private Boolean autoGiftEnabled = false;

    @Column(name = "auto_gift_budget", precision = 10, scale = 2)
    private BigDecimal autoGiftBudget;

    public Occasion() {
    }

    public Occasion(Long id, Recipient recipient, User user, String type, String customName, LocalDate eventDate, Boolean isRecurring, String recurrencePattern, String notes, Boolean autoGiftEnabled, BigDecimal autoGiftBudget) {
        this.id = id;
        this.recipient = recipient;
        this.user = user;
        this.type = type;
        this.customName = customName;
        this.eventDate = eventDate;
        this.isRecurring = isRecurring;
        this.recurrencePattern = recurrencePattern;
        this.notes = notes;
        this.autoGiftEnabled = autoGiftEnabled;
        this.autoGiftBudget = autoGiftBudget;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Recipient getRecipient() {
        return this.recipient;
    }

    public void setRecipient(Recipient recipient) {
        this.recipient = recipient;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCustomName() {
        return this.customName;
    }

    public void setCustomName(String customName) {
        this.customName = customName;
    }

    public LocalDate getEventDate() {
        return this.eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public Boolean getIsRecurring() {
        return this.isRecurring;
    }

    public void setIsRecurring(Boolean isRecurring) {
        this.isRecurring = isRecurring;
    }

    public String getRecurrencePattern() {
        return this.recurrencePattern;
    }

    public void setRecurrencePattern(String recurrencePattern) {
        this.recurrencePattern = recurrencePattern;
    }

    public String getNotes() {
        return this.notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getAutoGiftEnabled() {
        return this.autoGiftEnabled;
    }

    public void setAutoGiftEnabled(Boolean autoGiftEnabled) {
        this.autoGiftEnabled = autoGiftEnabled;
    }

    public BigDecimal getAutoGiftBudget() {
        return this.autoGiftBudget;
    }

    public void setAutoGiftBudget(BigDecimal autoGiftBudget) {
        this.autoGiftBudget = autoGiftBudget;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Occasion occasion = (Occasion) o;
        return java.util.Objects.equals(id, occasion.id) &&
                java.util.Objects.equals(type, occasion.type) &&
                java.util.Objects.equals(customName, occasion.customName) &&
                java.util.Objects.equals(eventDate, occasion.eventDate) &&
                java.util.Objects.equals(isRecurring, occasion.isRecurring) &&
                java.util.Objects.equals(recurrencePattern, occasion.recurrencePattern) &&
                java.util.Objects.equals(notes, occasion.notes) &&
                java.util.Objects.equals(autoGiftEnabled, occasion.autoGiftEnabled) &&
                java.util.Objects.equals(autoGiftBudget, occasion.autoGiftBudget);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, type, customName, eventDate, isRecurring, recurrencePattern, notes, autoGiftEnabled, autoGiftBudget);
    }

    @Override
    public String toString() {
        return "Occasion(id=" + id + ", type=" + type + ", customName=" + customName + ", eventDate=" + eventDate + ", isRecurring=" + isRecurring + ", recurrencePattern=" + recurrencePattern + ", notes=" + notes + ", autoGiftEnabled=" + autoGiftEnabled + ", autoGiftBudget=" + autoGiftBudget + ")";
    }

    public static OccasionBuilder builder() {
        return new OccasionBuilder();
    }

    public static class OccasionBuilder {
        private Long id;
        private Recipient recipient;
        private User user;
        private String type;
        private String customName;
        private LocalDate eventDate;
        private Boolean isRecurring = false;
        private String recurrencePattern;
        private String notes;
        private Boolean autoGiftEnabled = false;
        private BigDecimal autoGiftBudget;

        OccasionBuilder() {
        }

        public OccasionBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public OccasionBuilder recipient(Recipient recipient) {
            this.recipient = recipient;
            return this;
        }

        public OccasionBuilder user(User user) {
            this.user = user;
            return this;
        }

        public OccasionBuilder type(String type) {
            this.type = type;
            return this;
        }

        public OccasionBuilder customName(String customName) {
            this.customName = customName;
            return this;
        }

        public OccasionBuilder eventDate(LocalDate eventDate) {
            this.eventDate = eventDate;
            return this;
        }

        public OccasionBuilder isRecurring(Boolean isRecurring) {
            this.isRecurring = isRecurring;
            return this;
        }

        public OccasionBuilder recurrencePattern(String recurrencePattern) {
            this.recurrencePattern = recurrencePattern;
            return this;
        }

        public OccasionBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public OccasionBuilder autoGiftEnabled(Boolean autoGiftEnabled) {
            this.autoGiftEnabled = autoGiftEnabled;
            return this;
        }

        public OccasionBuilder autoGiftBudget(BigDecimal autoGiftBudget) {
            this.autoGiftBudget = autoGiftBudget;
            return this;
        }

        public Occasion build() {
            return new Occasion(id, recipient, user, type, customName, eventDate, isRecurring, recurrencePattern, notes, autoGiftEnabled, autoGiftBudget);
        }
    }
}
