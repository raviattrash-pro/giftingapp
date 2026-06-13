package com.giftconcierge.dto;

import java.time.LocalDateTime;

public class ReminderResponse {

    private Long id;
    private Long occasionId;
    private String occasionType;
    private String recipientName;
    private String type;
    private Integer daysBefore;
    private String message;
    private Boolean isSmart;
    private Boolean isSent;
    private LocalDateTime sendAt;

    public ReminderResponse() {
    }

    public ReminderResponse(Long id, Long occasionId, String occasionType, String recipientName, String type, Integer daysBefore, String message, Boolean isSmart, Boolean isSent, LocalDateTime sendAt) {
        this.id = id;
        this.occasionId = occasionId;
        this.occasionType = occasionType;
        this.recipientName = recipientName;
        this.type = type;
        this.daysBefore = daysBefore;
        this.message = message;
        this.isSmart = isSmart;
        this.isSent = isSent;
        this.sendAt = sendAt;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOccasionId() {
        return this.occasionId;
    }

    public void setOccasionId(Long occasionId) {
        this.occasionId = occasionId;
    }

    public String getOccasionType() {
        return this.occasionType;
    }

    public void setOccasionType(String occasionType) {
        this.occasionType = occasionType;
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

    public Integer getDaysBefore() {
        return this.daysBefore;
    }

    public void setDaysBefore(Integer daysBefore) {
        this.daysBefore = daysBefore;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIsSmart() {
        return this.isSmart;
    }

    public void setIsSmart(Boolean isSmart) {
        this.isSmart = isSmart;
    }

    public Boolean getIsSent() {
        return this.isSent;
    }

    public void setIsSent(Boolean isSent) {
        this.isSent = isSent;
    }

    public LocalDateTime getSendAt() {
        return this.sendAt;
    }

    public void setSendAt(LocalDateTime sendAt) {
        this.sendAt = sendAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReminderResponse that = (ReminderResponse) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(occasionId, that.occasionId) &&
                java.util.Objects.equals(occasionType, that.occasionType) &&
                java.util.Objects.equals(recipientName, that.recipientName) &&
                java.util.Objects.equals(type, that.type) &&
                java.util.Objects.equals(daysBefore, that.daysBefore) &&
                java.util.Objects.equals(message, that.message) &&
                java.util.Objects.equals(isSmart, that.isSmart) &&
                java.util.Objects.equals(isSent, that.isSent) &&
                java.util.Objects.equals(sendAt, that.sendAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, occasionId, occasionType, recipientName, type, daysBefore, message, isSmart, isSent, sendAt);
    }

    @Override
    public String toString() {
        return "ReminderResponse(id=" + id + ", occasionId=" + occasionId + ", occasionType=" + occasionType + ", recipientName=" + recipientName + ", type=" + type + ", daysBefore=" + daysBefore + ", message=" + message + ", isSmart=" + isSmart + ", isSent=" + isSent + ", sendAt=" + sendAt + ")";
    }

    public static ReminderResponseBuilder builder() {
        return new ReminderResponseBuilder();
    }

    public static class ReminderResponseBuilder {
        private Long id;
        private Long occasionId;
        private String occasionType;
        private String recipientName;
        private String type;
        private Integer daysBefore;
        private String message;
        private Boolean isSmart;
        private Boolean isSent;
        private LocalDateTime sendAt;

        ReminderResponseBuilder() {
        }

        public ReminderResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ReminderResponseBuilder occasionId(Long occasionId) {
            this.occasionId = occasionId;
            return this;
        }

        public ReminderResponseBuilder occasionType(String occasionType) {
            this.occasionType = occasionType;
            return this;
        }

        public ReminderResponseBuilder recipientName(String recipientName) {
            this.recipientName = recipientName;
            return this;
        }

        public ReminderResponseBuilder type(String type) {
            this.type = type;
            return this;
        }

        public ReminderResponseBuilder daysBefore(Integer daysBefore) {
            this.daysBefore = daysBefore;
            return this;
        }

        public ReminderResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public ReminderResponseBuilder isSmart(Boolean isSmart) {
            this.isSmart = isSmart;
            return this;
        }

        public ReminderResponseBuilder isSent(Boolean isSent) {
            this.isSent = isSent;
            return this;
        }

        public ReminderResponseBuilder sendAt(LocalDateTime sendAt) {
            this.sendAt = sendAt;
            return this;
        }

        public ReminderResponse build() {
            return new ReminderResponse(id, occasionId, occasionType, recipientName, type, daysBefore, message, isSmart, isSent, sendAt);
        }
    }
}
