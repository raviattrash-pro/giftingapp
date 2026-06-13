package com.giftconcierge.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "gift_orders")
public class GiftOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Recipient recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "occasion_id")
    private Occasion occasion;

    @Column(name = "gift_name", nullable = false)
    private String giftName;

    @Column(name = "gift_description", columnDefinition = "TEXT")
    private String giftDescription;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(nullable = false, length = 30)
    private String status = "PENDING";

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Column(name = "scheduled_time")
    private LocalTime scheduledTime;

    @Column(name = "personal_message", columnDefinition = "TEXT")
    private String personalMessage;

    @Column(name = "is_anonymous")
    private Boolean isAnonymous = false;

    @Column(name = "delivery_type", length = 30)
    private String deliveryType;

    @Column(name = "delivery_service", length = 30)
    private String deliveryService;

    @Column(name = "delivery_charge", precision = 10, scale = 2)
    private BigDecimal deliveryCharge;

    @Column(name = "admin_delivery_charge", precision = 10, scale = 2)
    private BigDecimal adminDeliveryCharge;

    @Column(name = "tracking_id", length = 100)
    private String trackingId;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Column(name = "payment_screenshot", columnDefinition = "LONGTEXT")
    private String paymentScreenshot;

    @Column(name = "delivery_address", columnDefinition = "TEXT")
    private String deliveryAddress;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public GiftOrder() {
    }

    public GiftOrder(Long id, User user, Recipient recipient, Occasion occasion, String giftName, String giftDescription, BigDecimal amount, Integer quantity, String status, LocalDate scheduledDate, LocalTime scheduledTime, String personalMessage, Boolean isAnonymous, String deliveryType, String deliveryService, BigDecimal deliveryCharge, BigDecimal adminDeliveryCharge, String trackingId, String transactionId, String paymentScreenshot, String deliveryAddress, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.recipient = recipient;
        this.occasion = occasion;
        this.giftName = giftName;
        this.giftDescription = giftDescription;
        this.amount = amount;
        this.quantity = quantity;
        this.status = status;
        this.scheduledDate = scheduledDate;
        this.scheduledTime = scheduledTime;
        this.personalMessage = personalMessage;
        this.isAnonymous = isAnonymous;
        this.deliveryType = deliveryType;
        this.deliveryService = deliveryService;
        this.deliveryCharge = deliveryCharge;
        this.adminDeliveryCharge = adminDeliveryCharge;
        this.trackingId = trackingId;
        this.transactionId = transactionId;
        this.paymentScreenshot = paymentScreenshot;
        this.deliveryAddress = deliveryAddress;
        this.createdAt = createdAt;
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

    public Occasion getOccasion() {
        return this.occasion;
    }

    public void setOccasion(Occasion occasion) {
        this.occasion = occasion;
    }

    public String getGiftName() {
        return this.giftName;
    }

    public void setGiftName(String giftName) {
        this.giftName = giftName;
    }

    public String getGiftDescription() {
        return this.giftDescription;
    }

    public void setGiftDescription(String giftDescription) {
        this.giftDescription = giftDescription;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getScheduledDate() {
        return this.scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public LocalTime getScheduledTime() {
        return this.scheduledTime;
    }

    public void setScheduledTime(LocalTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getPersonalMessage() {
        return this.personalMessage;
    }

    public void setPersonalMessage(String personalMessage) {
        this.personalMessage = personalMessage;
    }

    public Boolean getIsAnonymous() {
        return this.isAnonymous;
    }

    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }

    public String getDeliveryType() {
        return this.deliveryType;
    }

    public void setDeliveryType(String deliveryType) {
        this.deliveryType = deliveryType;
    }

    public String getDeliveryService() {
        return this.deliveryService;
    }

    public void setDeliveryService(String deliveryService) {
        this.deliveryService = deliveryService;
    }

    public BigDecimal getDeliveryCharge() {
        return this.deliveryCharge;
    }

    public void setDeliveryCharge(BigDecimal deliveryCharge) {
        this.deliveryCharge = deliveryCharge;
    }

    public BigDecimal getAdminDeliveryCharge() {
        return this.adminDeliveryCharge;
    }

    public void setAdminDeliveryCharge(BigDecimal adminDeliveryCharge) {
        this.adminDeliveryCharge = adminDeliveryCharge;
    }

    public String getTrackingId() {
        return this.trackingId;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    public String getTransactionId() {
        return this.transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getPaymentScreenshot() {
        return this.paymentScreenshot;
    }

    public void setPaymentScreenshot(String paymentScreenshot) {
        this.paymentScreenshot = paymentScreenshot;
    }

    public String getDeliveryAddress() {
        return this.deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
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
        GiftOrder giftOrder = (GiftOrder) o;
        return java.util.Objects.equals(id, giftOrder.id) &&
                java.util.Objects.equals(giftName, giftOrder.giftName) &&
                java.util.Objects.equals(giftDescription, giftOrder.giftDescription) &&
                java.util.Objects.equals(amount, giftOrder.amount) &&
                java.util.Objects.equals(quantity, giftOrder.quantity) &&
                java.util.Objects.equals(status, giftOrder.status) &&
                java.util.Objects.equals(scheduledDate, giftOrder.scheduledDate) &&
                java.util.Objects.equals(scheduledTime, giftOrder.scheduledTime) &&
                java.util.Objects.equals(personalMessage, giftOrder.personalMessage) &&
                java.util.Objects.equals(isAnonymous, giftOrder.isAnonymous) &&
                java.util.Objects.equals(deliveryType, giftOrder.deliveryType) &&
                java.util.Objects.equals(deliveryService, giftOrder.deliveryService) &&
                java.util.Objects.equals(deliveryCharge, giftOrder.deliveryCharge) &&
                java.util.Objects.equals(adminDeliveryCharge, giftOrder.adminDeliveryCharge) &&
                java.util.Objects.equals(trackingId, giftOrder.trackingId) &&
                java.util.Objects.equals(transactionId, giftOrder.transactionId) &&
                java.util.Objects.equals(paymentScreenshot, giftOrder.paymentScreenshot) &&
                java.util.Objects.equals(createdAt, giftOrder.createdAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, giftName, giftDescription, amount, quantity, status, scheduledDate, scheduledTime, personalMessage, isAnonymous, deliveryType, deliveryService, deliveryCharge, adminDeliveryCharge, trackingId, transactionId, paymentScreenshot, createdAt);
    }

    @Override
    public String toString() {
        return "GiftOrder(id=" + id + ", giftName=" + giftName + ", giftDescription=" + giftDescription + ", amount=" + amount + ", quantity=" + quantity + ", status=" + status + ", scheduledDate=" + scheduledDate + ", scheduledTime=" + scheduledTime + ", personalMessage=" + personalMessage + ", isAnonymous=" + isAnonymous + ", deliveryType=" + deliveryType + ", deliveryService=" + deliveryService + ", deliveryCharge=" + deliveryCharge + ", adminDeliveryCharge=" + adminDeliveryCharge + ", trackingId=" + trackingId + ", transactionId=" + transactionId + ", paymentScreenshot=" + paymentScreenshot + ", createdAt=" + createdAt + ")";
    }

    public static GiftOrderBuilder builder() {
        return new GiftOrderBuilder();
    }

    public static class GiftOrderBuilder {
        private Long id;
        private User user;
        private Recipient recipient;
        private Occasion occasion;
        private String giftName;
        private String giftDescription;
        private BigDecimal amount;
        private Integer quantity = 1;
        private String status = "PENDING";
        private LocalDate scheduledDate;
        private LocalTime scheduledTime;
        private String personalMessage;
        private Boolean isAnonymous = false;
        private String deliveryType;
        private String deliveryService;
        private BigDecimal deliveryCharge;
        private BigDecimal adminDeliveryCharge;
        private String trackingId;
        private String transactionId;
        private String paymentScreenshot;
        private String deliveryAddress;
        private LocalDateTime createdAt;

        GiftOrderBuilder() {
        }

        public GiftOrderBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public GiftOrderBuilder user(User user) {
            this.user = user;
            return this;
        }

        public GiftOrderBuilder recipient(Recipient recipient) {
            this.recipient = recipient;
            return this;
        }

        public GiftOrderBuilder occasion(Occasion occasion) {
            this.occasion = occasion;
            return this;
        }

        public GiftOrderBuilder giftName(String giftName) {
            this.giftName = giftName;
            return this;
        }

        public GiftOrderBuilder giftDescription(String giftDescription) {
            this.giftDescription = giftDescription;
            return this;
        }

        public GiftOrderBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public GiftOrderBuilder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public GiftOrderBuilder status(String status) {
            this.status = status;
            return this;
        }

        public GiftOrderBuilder scheduledDate(LocalDate scheduledDate) {
            this.scheduledDate = scheduledDate;
            return this;
        }

        public GiftOrderBuilder scheduledTime(LocalTime scheduledTime) {
            this.scheduledTime = scheduledTime;
            return this;
        }

        public GiftOrderBuilder personalMessage(String personalMessage) {
            this.personalMessage = personalMessage;
            return this;
        }

        public GiftOrderBuilder isAnonymous(Boolean isAnonymous) {
            this.isAnonymous = isAnonymous;
            return this;
        }

        public GiftOrderBuilder deliveryType(String deliveryType) {
            this.deliveryType = deliveryType;
            return this;
        }

        public GiftOrderBuilder deliveryService(String deliveryService) {
            this.deliveryService = deliveryService;
            return this;
        }

        public GiftOrderBuilder deliveryCharge(BigDecimal deliveryCharge) {
            this.deliveryCharge = deliveryCharge;
            return this;
        }

        public GiftOrderBuilder adminDeliveryCharge(BigDecimal adminDeliveryCharge) {
            this.adminDeliveryCharge = adminDeliveryCharge;
            return this;
        }

        public GiftOrderBuilder trackingId(String trackingId) {
            this.trackingId = trackingId;
            return this;
        }

        public GiftOrderBuilder transactionId(String transactionId) {
            this.transactionId = transactionId;
            return this;
        }

        public GiftOrderBuilder paymentScreenshot(String paymentScreenshot) {
            this.paymentScreenshot = paymentScreenshot;
            return this;
        }

        public GiftOrderBuilder deliveryAddress(String deliveryAddress) {
            this.deliveryAddress = deliveryAddress;
            return this;
        }

        public GiftOrderBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public GiftOrder build() {
            return new GiftOrder(id, user, recipient, occasion, giftName, giftDescription, amount, quantity, status, scheduledDate, scheduledTime, personalMessage, isAnonymous, deliveryType, deliveryService, deliveryCharge, adminDeliveryCharge, trackingId, transactionId, paymentScreenshot, deliveryAddress, createdAt);
        }
    }
}
