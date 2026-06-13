package com.giftconcierge.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

public class OrderResponse {
    private Long id;
    private SimpleUser user;
    private SimpleRecipient recipient;
    private String giftName;
    private String giftDescription;
    private BigDecimal amount;
    private Integer quantity;
    private String status;
    private LocalDate scheduledDate;
    private LocalTime scheduledTime;
    private String deliveryService;
    private BigDecimal deliveryCharge;
    private String personalMessage;
    private Boolean isAnonymous;
    private String deliveryType;
    private String trackingId;
    private String transactionId;
    private String paymentScreenshot;
    private String deliveryAddress;
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SimpleUser getUser() {
        return user;
    }

    public void setUser(SimpleUser user) {
        this.user = user;
    }

    public SimpleRecipient getRecipient() {
        return recipient;
    }

    public void setRecipient(SimpleRecipient recipient) {
        this.recipient = recipient;
    }

    public String getGiftName() {
        return giftName;
    }

    public void setGiftName(String giftName) {
        this.giftName = giftName;
    }

    public String getGiftDescription() {
        return giftDescription;
    }

    public void setGiftDescription(String giftDescription) {
        this.giftDescription = giftDescription;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public LocalTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getDeliveryService() {
        return deliveryService;
    }

    public void setDeliveryService(String deliveryService) {
        this.deliveryService = deliveryService;
    }

    public BigDecimal getDeliveryCharge() {
        return deliveryCharge;
    }

    public void setDeliveryCharge(BigDecimal deliveryCharge) {
        this.deliveryCharge = deliveryCharge;
    }

    public String getPersonalMessage() {
        return personalMessage;
    }

    public void setPersonalMessage(String personalMessage) {
        this.personalMessage = personalMessage;
    }

    public Boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(Boolean anonymous) {
        isAnonymous = anonymous;
    }

    public String getDeliveryType() {
        return deliveryType;
    }

    public void setDeliveryType(String deliveryType) {
        this.deliveryType = deliveryType;
    }

    public String getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getPaymentScreenshot() {
        return paymentScreenshot;
    }

    public void setPaymentScreenshot(String paymentScreenshot) {
        this.paymentScreenshot = paymentScreenshot;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class SimpleUser {
        private Long id;
        private String email;
        private String fullName;

        public SimpleUser(Long id, String email, String fullName) {
            this.id = id;
            this.email = email;
            this.fullName = fullName;
        }

        public Long getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public String getFullName() {
            return fullName;
        }
    }

    public static class SimpleRecipient {
        private Long id;
        private String name;
        private String relationship;

        public SimpleRecipient(Long id, String name, String relationship) {
            this.id = id;
            this.name = name;
            this.relationship = relationship;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getRelationship() {
            return relationship;
        }
    }
}
