package com.giftconcierge.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "future_gift_locker")
public class FutureGiftLocker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Recipient recipient;

    @Column(name = "gift_name", nullable = false)
    private String giftName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(length = 30)
    private String type;

    @Column(name = "digital_content", columnDefinition = "TEXT")
    private String digitalContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "occasion_id")
    private Occasion occasion;

    @Column(nullable = false, length = 30)
    private String status = "STORED";

    @Column(name = "purchased_at")
    private LocalDateTime purchasedAt;

    @Column(name = "scheduled_send_at")
    private LocalDateTime scheduledSendAt;

    public FutureGiftLocker() {
    }

    public FutureGiftLocker(Long id, User user, Recipient recipient, String giftName, String description, BigDecimal price, String type, String digitalContent, Occasion occasion, String status, LocalDateTime purchasedAt, LocalDateTime scheduledSendAt) {
        this.id = id;
        this.user = user;
        this.recipient = recipient;
        this.giftName = giftName;
        this.description = description;
        this.price = price;
        this.type = type;
        this.digitalContent = digitalContent;
        this.occasion = occasion;
        this.status = status;
        this.purchasedAt = purchasedAt;
        this.scheduledSendAt = scheduledSendAt;
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

    public String getGiftName() {
        return this.giftName;
    }

    public void setGiftName(String giftName) {
        this.giftName = giftName;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDigitalContent() {
        return this.digitalContent;
    }

    public void setDigitalContent(String digitalContent) {
        this.digitalContent = digitalContent;
    }

    public Occasion getOccasion() {
        return this.occasion;
    }

    public void setOccasion(Occasion occasion) {
        this.occasion = occasion;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getPurchasedAt() {
        return this.purchasedAt;
    }

    public void setPurchasedAt(LocalDateTime purchasedAt) {
        this.purchasedAt = purchasedAt;
    }

    public LocalDateTime getScheduledSendAt() {
        return this.scheduledSendAt;
    }

    public void setScheduledSendAt(LocalDateTime scheduledSendAt) {
        this.scheduledSendAt = scheduledSendAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FutureGiftLocker that = (FutureGiftLocker) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(giftName, that.giftName) &&
                java.util.Objects.equals(description, that.description) &&
                java.util.Objects.equals(price, that.price) &&
                java.util.Objects.equals(type, that.type) &&
                java.util.Objects.equals(digitalContent, that.digitalContent) &&
                java.util.Objects.equals(status, that.status) &&
                java.util.Objects.equals(purchasedAt, that.purchasedAt) &&
                java.util.Objects.equals(scheduledSendAt, that.scheduledSendAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, giftName, description, price, type, digitalContent, status, purchasedAt, scheduledSendAt);
    }

    @Override
    public String toString() {
        return "FutureGiftLocker(id=" + id + ", giftName=" + giftName + ", description=" + description + ", price=" + price + ", type=" + type + ", digitalContent=" + digitalContent + ", status=" + status + ", purchasedAt=" + purchasedAt + ", scheduledSendAt=" + scheduledSendAt + ")";
    }

    public static FutureGiftLockerBuilder builder() {
        return new FutureGiftLockerBuilder();
    }

    public static class FutureGiftLockerBuilder {
        private Long id;
        private User user;
        private Recipient recipient;
        private String giftName;
        private String description;
        private BigDecimal price;
        private String type;
        private String digitalContent;
        private Occasion occasion;
        private String status = "STORED";
        private LocalDateTime purchasedAt;
        private LocalDateTime scheduledSendAt;

        FutureGiftLockerBuilder() {
        }

        public FutureGiftLockerBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public FutureGiftLockerBuilder user(User user) {
            this.user = user;
            return this;
        }

        public FutureGiftLockerBuilder recipient(Recipient recipient) {
            this.recipient = recipient;
            return this;
        }

        public FutureGiftLockerBuilder giftName(String giftName) {
            this.giftName = giftName;
            return this;
        }

        public FutureGiftLockerBuilder description(String description) {
            this.description = description;
            return this;
        }

        public FutureGiftLockerBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public FutureGiftLockerBuilder type(String type) {
            this.type = type;
            return this;
        }

        public FutureGiftLockerBuilder digitalContent(String digitalContent) {
            this.digitalContent = digitalContent;
            return this;
        }

        public FutureGiftLockerBuilder occasion(Occasion occasion) {
            this.occasion = occasion;
            return this;
        }

        public FutureGiftLockerBuilder status(String status) {
            this.status = status;
            return this;
        }

        public FutureGiftLockerBuilder purchasedAt(LocalDateTime purchasedAt) {
            this.purchasedAt = purchasedAt;
            return this;
        }

        public FutureGiftLockerBuilder scheduledSendAt(LocalDateTime scheduledSendAt) {
            this.scheduledSendAt = scheduledSendAt;
            return this;
        }

        public FutureGiftLocker build() {
            return new FutureGiftLocker(id, user, recipient, giftName, description, price, type, digitalContent, occasion, status, purchasedAt, scheduledSendAt);
        }
    }
}
