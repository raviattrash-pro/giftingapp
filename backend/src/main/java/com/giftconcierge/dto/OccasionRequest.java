package com.giftconcierge.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class OccasionRequest {

    private Long recipientId;
    private String type;
    private String customName;
    private LocalDate eventDate;
    private Boolean isRecurring;
    private String recurrencePattern;
    private String notes;
    private Boolean autoGiftEnabled;
    private BigDecimal autoGiftBudget;

    public OccasionRequest() {
    }

    public OccasionRequest(Long recipientId, String type, String customName, LocalDate eventDate, Boolean isRecurring, String recurrencePattern, String notes, Boolean autoGiftEnabled, BigDecimal autoGiftBudget) {
        this.recipientId = recipientId;
        this.type = type;
        this.customName = customName;
        this.eventDate = eventDate;
        this.isRecurring = isRecurring;
        this.recurrencePattern = recurrencePattern;
        this.notes = notes;
        this.autoGiftEnabled = autoGiftEnabled;
        this.autoGiftBudget = autoGiftBudget;
    }

    public Long getRecipientId() {
        return this.recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
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
        OccasionRequest that = (OccasionRequest) o;
        return java.util.Objects.equals(recipientId, that.recipientId) &&
                java.util.Objects.equals(type, that.type) &&
                java.util.Objects.equals(customName, that.customName) &&
                java.util.Objects.equals(eventDate, that.eventDate) &&
                java.util.Objects.equals(isRecurring, that.isRecurring) &&
                java.util.Objects.equals(recurrencePattern, that.recurrencePattern) &&
                java.util.Objects.equals(notes, that.notes) &&
                java.util.Objects.equals(autoGiftEnabled, that.autoGiftEnabled) &&
                java.util.Objects.equals(autoGiftBudget, that.autoGiftBudget);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(recipientId, type, customName, eventDate, isRecurring, recurrencePattern, notes, autoGiftEnabled, autoGiftBudget);
    }

    @Override
    public String toString() {
        return "OccasionRequest(recipientId=" + recipientId + ", type=" + type + ", customName=" + customName + ", eventDate=" + eventDate + ", isRecurring=" + isRecurring + ", recurrencePattern=" + recurrencePattern + ", notes=" + notes + ", autoGiftEnabled=" + autoGiftEnabled + ", autoGiftBudget=" + autoGiftBudget + ")";
    }

    public static OccasionRequestBuilder builder() {
        return new OccasionRequestBuilder();
    }

    public static class OccasionRequestBuilder {
        private Long recipientId;
        private String type;
        private String customName;
        private LocalDate eventDate;
        private Boolean isRecurring;
        private String recurrencePattern;
        private String notes;
        private Boolean autoGiftEnabled;
        private BigDecimal autoGiftBudget;

        OccasionRequestBuilder() {
        }

        public OccasionRequestBuilder recipientId(Long recipientId) {
            this.recipientId = recipientId;
            return this;
        }

        public OccasionRequestBuilder type(String type) {
            this.type = type;
            return this;
        }

        public OccasionRequestBuilder customName(String customName) {
            this.customName = customName;
            return this;
        }

        public OccasionRequestBuilder eventDate(LocalDate eventDate) {
            this.eventDate = eventDate;
            return this;
        }

        public OccasionRequestBuilder isRecurring(Boolean isRecurring) {
            this.isRecurring = isRecurring;
            return this;
        }

        public OccasionRequestBuilder recurrencePattern(String recurrencePattern) {
            this.recurrencePattern = recurrencePattern;
            return this;
        }

        public OccasionRequestBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public OccasionRequestBuilder autoGiftEnabled(Boolean autoGiftEnabled) {
            this.autoGiftEnabled = autoGiftEnabled;
            return this;
        }

        public OccasionRequestBuilder autoGiftBudget(BigDecimal autoGiftBudget) {
            this.autoGiftBudget = autoGiftBudget;
            return this;
        }

        public OccasionRequest build() {
            return new OccasionRequest(recipientId, type, customName, eventDate, isRecurring, recurrencePattern, notes, autoGiftEnabled, autoGiftBudget);
        }
    }
}
