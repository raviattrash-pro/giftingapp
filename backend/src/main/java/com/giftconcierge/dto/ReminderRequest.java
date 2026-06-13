package com.giftconcierge.dto;

public class ReminderRequest {

    private Long occasionId;
    private String type;
    private Integer daysBefore;
    private String message;
    private Boolean isSmart;

    public ReminderRequest() {
    }

    public ReminderRequest(Long occasionId, String type, Integer daysBefore, String message, Boolean isSmart) {
        this.occasionId = occasionId;
        this.type = type;
        this.daysBefore = daysBefore;
        this.message = message;
        this.isSmart = isSmart;
    }

    public Long getOccasionId() {
        return this.occasionId;
    }

    public void setOccasionId(Long occasionId) {
        this.occasionId = occasionId;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReminderRequest that = (ReminderRequest) o;
        return java.util.Objects.equals(occasionId, that.occasionId) &&
                java.util.Objects.equals(type, that.type) &&
                java.util.Objects.equals(daysBefore, that.daysBefore) &&
                java.util.Objects.equals(message, that.message) &&
                java.util.Objects.equals(isSmart, that.isSmart);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(occasionId, type, daysBefore, message, isSmart);
    }

    @Override
    public String toString() {
        return "ReminderRequest(occasionId=" + occasionId + ", type=" + type + ", daysBefore=" + daysBefore + ", message=" + message + ", isSmart=" + isSmart + ")";
    }

    public static ReminderRequestBuilder builder() {
        return new ReminderRequestBuilder();
    }

    public static class ReminderRequestBuilder {
        private Long occasionId;
        private String type;
        private Integer daysBefore;
        private String message;
        private Boolean isSmart;

        ReminderRequestBuilder() {
        }

        public ReminderRequestBuilder occasionId(Long occasionId) {
            this.occasionId = occasionId;
            return this;
        }

        public ReminderRequestBuilder type(String type) {
            this.type = type;
            return this;
        }

        public ReminderRequestBuilder daysBefore(Integer daysBefore) {
            this.daysBefore = daysBefore;
            return this;
        }

        public ReminderRequestBuilder message(String message) {
            this.message = message;
            return this;
        }

        public ReminderRequestBuilder isSmart(Boolean isSmart) {
            this.isSmart = isSmart;
            return this;
        }

        public ReminderRequest build() {
            return new ReminderRequest(occasionId, type, daysBefore, message, isSmart);
        }
    }
}
