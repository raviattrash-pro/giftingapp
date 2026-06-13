package com.giftconcierge.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class OccasionResponse {

    private Long id;
    private Long recipientId;
    private String recipientName;
    private String type;
    private String customName;
    private LocalDate eventDate;
    private Boolean isRecurring;
    private String recurrencePattern;
    private String notes;
    private Boolean autoGiftEnabled;
    private BigDecimal autoGiftBudget;
    private Long daysUntil;

    public OccasionResponse() {
    }

    public OccasionResponse(Long id, Long recipientId, String recipientName, String type, String customName, LocalDate eventDate, Boolean isRecurring, String recurrencePattern, String notes, Boolean autoGiftEnabled, BigDecimal autoGiftBudget, Long daysUntil) {
        this.id = id;
        this.recipientId = recipientId;
        this.recipientName = recipientName;
        this.type = type;
        this.customName = customName;
        this.eventDate = eventDate;
        this.isRecurring = isRecurring;
        this.recurrencePattern = recurrencePattern;
        this.notes = notes;
        this.autoGiftEnabled = autoGiftEnabled;
        this.autoGiftBudget = autoGiftBudget;
        this.daysUntil = daysUntil;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRecipientId() {
        return this.recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public String getRecipientName() {
        return this.recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
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

    public Long getDaysUntil() {
        return this.daysUntil;
    }

    public void setDaysUntil(Long daysUntil) {
        this.daysUntil = daysUntil;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OccasionResponse that = (OccasionResponse) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(recipientId, that.recipientId) &&
                java.util.Objects.equals(recipientName, that.recipientName) &&
                java.util.Objects.equals(type, that.type) &&
                java.util.Objects.equals(customName, that.customName) &&
                java.util.Objects.equals(eventDate, that.eventDate) &&
                java.util.Objects.equals(isRecurring, that.isRecurring) &&
                java.util.Objects.equals(recurrencePattern, that.recurrencePattern) &&
                java.util.Objects.equals(notes, that.notes) &&
                java.util.Objects.equals(autoGiftEnabled, that.autoGiftEnabled) &&
                java.util.Objects.equals(autoGiftBudget, that.autoGiftBudget) &&
                java.util.Objects.equals(daysUntil, that.daysUntil);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, recipientId, recipientName, type, customName, eventDate, isRecurring, recurrencePattern, notes, autoGiftEnabled, autoGiftBudget, daysUntil);
    }

    @Override
    public String toString() {
        return "OccasionResponse(id=" + id + ", recipientId=" + recipientId + ", recipientName=" + recipientName + ", type=" + type + ", customName=" + customName + ", eventDate=" + eventDate + ", isRecurring=" + isRecurring + ", recurrencePattern=" + recurrencePattern + ", notes=" + notes + ", autoGiftEnabled=" + autoGiftEnabled + ", autoGiftBudget=" + autoGiftBudget + ", daysUntil=" + daysUntil + ")";
    }

    public static OccasionResponseBuilder builder() {
        return new OccasionResponseBuilder();
    }

    public static class OccasionResponseBuilder {
        private Long id;
        private Long recipientId;
        private String recipientName;
        private String type;
        private String customName;
        private LocalDate eventDate;
        private Boolean isRecurring;
        private String recurrencePattern;
        private String notes;
        private Boolean autoGiftEnabled;
        private BigDecimal autoGiftBudget;
        private Long daysUntil;

        OccasionResponseBuilder() {
        }

        public OccasionResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public OccasionResponseBuilder recipientId(Long recipientId) {
            this.recipientId = recipientId;
            return this;
        }

        public OccasionResponseBuilder recipientName(String recipientName) {
            this.recipientName = recipientName;
            return this;
        }

        public OccasionResponseBuilder type(String type) {
            this.type = type;
            return this;
        }

        public OccasionResponseBuilder customName(String customName) {
            this.customName = customName;
            return this;
        }

        public OccasionResponseBuilder eventDate(LocalDate eventDate) {
            this.eventDate = eventDate;
            return this;
        }

        public OccasionResponseBuilder isRecurring(Boolean isRecurring) {
            this.isRecurring = isRecurring;
            return this;
        }

        public OccasionResponseBuilder recurrencePattern(String recurrencePattern) {
            this.recurrencePattern = recurrencePattern;
            return this;
        }

        public OccasionResponseBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public OccasionResponseBuilder autoGiftEnabled(Boolean autoGiftEnabled) {
            this.autoGiftEnabled = autoGiftEnabled;
            return this;
        }

        public OccasionResponseBuilder autoGiftBudget(BigDecimal autoGiftBudget) {
            this.autoGiftBudget = autoGiftBudget;
            return this;
        }

        public OccasionResponseBuilder daysUntil(Long daysUntil) {
            this.daysUntil = daysUntil;
            return this;
        }

        public OccasionResponse build() {
            return new OccasionResponse(id, recipientId, recipientName, type, customName, eventDate, isRecurring, recurrencePattern, notes, autoGiftEnabled, autoGiftBudget, daysUntil);
        }
    }
}
