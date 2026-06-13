package com.giftconcierge.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "group_gift_contributions")
public class GroupGiftContribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_gift_id", nullable = false)
    private GroupGift groupGift;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contributor_id")
    private User contributor;

    @Column(name = "contributor_name", length = 100)
    private String contributorName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "payment_status", length = 30)
    private String paymentStatus = "PENDING";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public GroupGiftContribution() {
    }

    public GroupGiftContribution(Long id, GroupGift groupGift, User contributor, String contributorName, BigDecimal amount, String message, String paymentStatus, LocalDateTime createdAt) {
        this.id = id;
        this.groupGift = groupGift;
        this.contributor = contributor;
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

    public GroupGift getGroupGift() {
        return this.groupGift;
    }

    public void setGroupGift(GroupGift groupGift) {
        this.groupGift = groupGift;
    }

    public User getContributor() {
        return this.contributor;
    }

    public void setContributor(User contributor) {
        this.contributor = contributor;
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
        GroupGiftContribution that = (GroupGiftContribution) o;
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
        return "GroupGiftContribution(id=" + id + ", contributorName=" + contributorName + ", amount=" + amount + ", message=" + message + ", paymentStatus=" + paymentStatus + ", createdAt=" + createdAt + ")";
    }

    public static GroupGiftContributionBuilder builder() {
        return new GroupGiftContributionBuilder();
    }

    public static class GroupGiftContributionBuilder {
        private Long id;
        private GroupGift groupGift;
        private User contributor;
        private String contributorName;
        private BigDecimal amount;
        private String message;
        private String paymentStatus = "PENDING";
        private LocalDateTime createdAt;

        GroupGiftContributionBuilder() {
        }

        public GroupGiftContributionBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public GroupGiftContributionBuilder groupGift(GroupGift groupGift) {
            this.groupGift = groupGift;
            return this;
        }

        public GroupGiftContributionBuilder contributor(User contributor) {
            this.contributor = contributor;
            return this;
        }

        public GroupGiftContributionBuilder contributorName(String contributorName) {
            this.contributorName = contributorName;
            return this;
        }

        public GroupGiftContributionBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public GroupGiftContributionBuilder message(String message) {
            this.message = message;
            return this;
        }

        public GroupGiftContributionBuilder paymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
            return this;
        }

        public GroupGiftContributionBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public GroupGiftContribution build() {
            return new GroupGiftContribution(id, groupGift, contributor, contributorName, amount, message, paymentStatus, createdAt);
        }
    }
}
