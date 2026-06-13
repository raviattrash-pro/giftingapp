package com.giftconcierge.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class GroupGiftRequest {
    private Long recipientId;
    private String title;
    private String description;
    private BigDecimal targetAmount;
    private LocalDate deadline;

    public GroupGiftRequest() {
    }

    public GroupGiftRequest(Long recipientId, String title, String description, BigDecimal targetAmount, LocalDate deadline) {
        this.recipientId = recipientId;
        this.title = title;
        this.description = description;
        this.targetAmount = targetAmount;
        this.deadline = deadline;
    }

    public Long getRecipientId() {
        return this.recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getTargetAmount() {
        return this.targetAmount;
    }

    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }

    public LocalDate getDeadline() {
        return this.deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GroupGiftRequest that = (GroupGiftRequest) o;
        return java.util.Objects.equals(recipientId, that.recipientId) &&
                java.util.Objects.equals(title, that.title) &&
                java.util.Objects.equals(description, that.description) &&
                java.util.Objects.equals(targetAmount, that.targetAmount) &&
                java.util.Objects.equals(deadline, that.deadline);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(recipientId, title, description, targetAmount, deadline);
    }

    @Override
    public String toString() {
        return "GroupGiftRequest(recipientId=" + recipientId + ", title=" + title + ", description=" + description + ", targetAmount=" + targetAmount + ", deadline=" + deadline + ")";
    }

    public static GroupGiftRequestBuilder builder() {
        return new GroupGiftRequestBuilder();
    }

    public static class GroupGiftRequestBuilder {
        private Long recipientId;
        private String title;
        private String description;
        private BigDecimal targetAmount;
        private LocalDate deadline;

        GroupGiftRequestBuilder() {
        }

        public GroupGiftRequestBuilder recipientId(Long recipientId) {
            this.recipientId = recipientId;
            return this;
        }

        public GroupGiftRequestBuilder title(String title) {
            this.title = title;
            return this;
        }

        public GroupGiftRequestBuilder description(String description) {
            this.description = description;
            return this;
        }

        public GroupGiftRequestBuilder targetAmount(BigDecimal targetAmount) {
            this.targetAmount = targetAmount;
            return this;
        }

        public GroupGiftRequestBuilder deadline(LocalDate deadline) {
            this.deadline = deadline;
            return this;
        }

        public GroupGiftRequest build() {
            return new GroupGiftRequest(recipientId, title, description, targetAmount, deadline);
        }
    }
}
