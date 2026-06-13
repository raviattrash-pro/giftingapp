package com.giftconcierge.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class GroupGiftResponse {

    private Long id;
    private String organizerName;
    private String recipientName;
    private String title;
    private String description;
    private BigDecimal targetAmount;
    private BigDecimal collectedAmount;
    private String status;
    private String shareLink;
    private LocalDate deadline;
    private LocalDateTime createdAt;
    private Integer contributorCount;
    private Double progressPercentage;
    private List<ContributionResponse> contributions;

    public GroupGiftResponse() {
    }

    public GroupGiftResponse(Long id, String organizerName, String recipientName, String title, String description, BigDecimal targetAmount, BigDecimal collectedAmount, String status, String shareLink, LocalDate deadline, LocalDateTime createdAt, Integer contributorCount, Double progressPercentage, List<ContributionResponse> contributions) {
        this.id = id;
        this.organizerName = organizerName;
        this.recipientName = recipientName;
        this.title = title;
        this.description = description;
        this.targetAmount = targetAmount;
        this.collectedAmount = collectedAmount;
        this.status = status;
        this.shareLink = shareLink;
        this.deadline = deadline;
        this.createdAt = createdAt;
        this.contributorCount = contributorCount;
        this.progressPercentage = progressPercentage;
        this.contributions = contributions;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrganizerName() {
        return this.organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }

    public String getRecipientName() {
        return this.recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
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

    public BigDecimal getCollectedAmount() {
        return this.collectedAmount;
    }

    public void setCollectedAmount(BigDecimal collectedAmount) {
        this.collectedAmount = collectedAmount;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getShareLink() {
        return this.shareLink;
    }

    public void setShareLink(String shareLink) {
        this.shareLink = shareLink;
    }

    public LocalDate getDeadline() {
        return this.deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getContributorCount() {
        return this.contributorCount;
    }

    public void setContributorCount(Integer contributorCount) {
        this.contributorCount = contributorCount;
    }

    public Double getProgressPercentage() {
        return this.progressPercentage;
    }

    public void setProgressPercentage(Double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public List<ContributionResponse> getContributions() {
        return this.contributions;
    }

    public void setContributions(List<ContributionResponse> contributions) {
        this.contributions = contributions;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GroupGiftResponse that = (GroupGiftResponse) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(organizerName, that.organizerName) &&
                java.util.Objects.equals(recipientName, that.recipientName) &&
                java.util.Objects.equals(title, that.title) &&
                java.util.Objects.equals(description, that.description) &&
                java.util.Objects.equals(targetAmount, that.targetAmount) &&
                java.util.Objects.equals(collectedAmount, that.collectedAmount) &&
                java.util.Objects.equals(status, that.status) &&
                java.util.Objects.equals(shareLink, that.shareLink) &&
                java.util.Objects.equals(deadline, that.deadline) &&
                java.util.Objects.equals(createdAt, that.createdAt) &&
                java.util.Objects.equals(contributorCount, that.contributorCount) &&
                java.util.Objects.equals(progressPercentage, that.progressPercentage) &&
                java.util.Objects.equals(contributions, that.contributions);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, organizerName, recipientName, title, description, targetAmount, collectedAmount, status, shareLink, deadline, createdAt, contributorCount, progressPercentage, contributions);
    }

    @Override
    public String toString() {
        return "GroupGiftResponse(id=" + id + ", organizerName=" + organizerName + ", recipientName=" + recipientName + ", title=" + title + ", description=" + description + ", targetAmount=" + targetAmount + ", collectedAmount=" + collectedAmount + ", status=" + status + ", shareLink=" + shareLink + ", deadline=" + deadline + ", createdAt=" + createdAt + ", contributorCount=" + contributorCount + ", progressPercentage=" + progressPercentage + ", contributions=" + contributions + ")";
    }

    public static GroupGiftResponseBuilder builder() {
        return new GroupGiftResponseBuilder();
    }

    public static class GroupGiftResponseBuilder {
        private Long id;
        private String organizerName;
        private String recipientName;
        private String title;
        private String description;
        private BigDecimal targetAmount;
        private BigDecimal collectedAmount;
        private String status;
        private String shareLink;
        private LocalDate deadline;
        private LocalDateTime createdAt;
        private Integer contributorCount;
        private Double progressPercentage;
        private List<ContributionResponse> contributions;

        GroupGiftResponseBuilder() {
        }

        public GroupGiftResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public GroupGiftResponseBuilder organizerName(String organizerName) {
            this.organizerName = organizerName;
            return this;
        }

        public GroupGiftResponseBuilder recipientName(String recipientName) {
            this.recipientName = recipientName;
            return this;
        }

        public GroupGiftResponseBuilder title(String title) {
            this.title = title;
            return this;
        }

        public GroupGiftResponseBuilder description(String description) {
            this.description = description;
            return this;
        }

        public GroupGiftResponseBuilder targetAmount(BigDecimal targetAmount) {
            this.targetAmount = targetAmount;
            return this;
        }

        public GroupGiftResponseBuilder collectedAmount(BigDecimal collectedAmount) {
            this.collectedAmount = collectedAmount;
            return this;
        }

        public GroupGiftResponseBuilder status(String status) {
            this.status = status;
            return this;
        }

        public GroupGiftResponseBuilder shareLink(String shareLink) {
            this.shareLink = shareLink;
            return this;
        }

        public GroupGiftResponseBuilder deadline(LocalDate deadline) {
            this.deadline = deadline;
            return this;
        }

        public GroupGiftResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public GroupGiftResponseBuilder contributorCount(Integer contributorCount) {
            this.contributorCount = contributorCount;
            return this;
        }

        public GroupGiftResponseBuilder progressPercentage(Double progressPercentage) {
            this.progressPercentage = progressPercentage;
            return this;
        }

        public GroupGiftResponseBuilder contributions(List<ContributionResponse> contributions) {
            this.contributions = contributions;
            return this;
        }

        public GroupGiftResponse build() {
            return new GroupGiftResponse(id, organizerName, recipientName, title, description, targetAmount, collectedAmount, status, shareLink, deadline, createdAt, contributorCount, progressPercentage, contributions);
        }
    }

    public static class ContributionResponse {
        private Long id;
        private String contributorName;
        private BigDecimal amount;
        private String message;
        private String paymentStatus;
        private LocalDateTime createdAt;

        public ContributionResponse() {
        }

        public ContributionResponse(Long id, String contributorName, BigDecimal amount, String message, String paymentStatus, LocalDateTime createdAt) {
            this.id = id;
            this.contributorName = contributorName;
            this.amount = amount;
            this.message = message;
            this.paymentStatus = paymentStatus;
            this.createdAt = createdAt;
        }

        public Long getId() {
            return this.id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getContributorName() {
            return this.contributorName;
        }

        public void setContributorName(String contributorName) {
            this.contributorName = contributorName;
        }

        public BigDecimal getAmount() {
            return this.amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getMessage() {
            return this.message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getPaymentStatus() {
            return this.paymentStatus;
        }

        public void setPaymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
        }

        public LocalDateTime getCreatedAt() {
            return this.createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ContributionResponse that = (ContributionResponse) o;
            return java.util.Objects.equals(id, that.id) &&
                    java.util.Objects.equals(contributorName, that.contributorName) &&
                    java.util.Objects.equals(amount, that.amount) &&
                    java.util.Objects.equals(message, that.message) &&
                    java.util.Objects.equals(paymentStatus, that.paymentStatus) &&
                    java.util.Objects.equals(createdAt, that.createdAt);
        }

        @Override
        public int hashCode() {
            return java.util.Objects.hash(id, contributorName, amount, message, paymentStatus, createdAt);
        }

        @Override
        public String toString() {
            return "ContributionResponse(id=" + id + ", contributorName=" + contributorName + ", amount=" + amount + ", message=" + message + ", paymentStatus=" + paymentStatus + ", createdAt=" + createdAt + ")";
        }

        public static ContributionResponseBuilder builder() {
            return new ContributionResponseBuilder();
        }

        public static class ContributionResponseBuilder {
            private Long id;
            private String contributorName;
            private BigDecimal amount;
            private String message;
            private String paymentStatus;
            private LocalDateTime createdAt;

            ContributionResponseBuilder() {
            }

            public ContributionResponseBuilder id(Long id) {
                this.id = id;
                return this;
            }

            public ContributionResponseBuilder contributorName(String contributorName) {
                this.contributorName = contributorName;
                return this;
            }

            public ContributionResponseBuilder amount(BigDecimal amount) {
                this.amount = amount;
                return this;
            }

            public ContributionResponseBuilder message(String message) {
                this.message = message;
                return this;
            }

            public ContributionResponseBuilder paymentStatus(String paymentStatus) {
                this.paymentStatus = paymentStatus;
                return this;
            }

            public ContributionResponseBuilder createdAt(LocalDateTime createdAt) {
                this.createdAt = createdAt;
                return this;
            }

            public ContributionResponse build() {
                return new ContributionResponse(id, contributorName, amount, message, paymentStatus, createdAt);
            }
        }
    }
}
