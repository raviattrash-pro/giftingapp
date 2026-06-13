package com.giftconcierge.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class CheckoutRequest {
    private List<CartItemDto> items;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String courierType;
    private BigDecimal grandTotal;
    private String transactionId;
    private String paymentScreenshot;
    private String recipientName;
    private String recipientPhone;
    private String recipientEmail;
    private String personalMessage;
    private LocalDate scheduledDate;
    private LocalTime scheduledTime;
    private String deliveryService;
    private BigDecimal deliveryCharge;
    private BigDecimal adminDeliveryCharge;

    public CheckoutRequest() {
    }

    public CheckoutRequest(List<CartItemDto> items, String address, String city, String state, String pincode, String courierType, BigDecimal grandTotal, String transactionId, String paymentScreenshot, String recipientName, String recipientPhone, String recipientEmail, String personalMessage, LocalDate scheduledDate, LocalTime scheduledTime, String deliveryService, BigDecimal deliveryCharge, BigDecimal adminDeliveryCharge) {
        this.items = items;
        this.address = address;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.courierType = courierType;
        this.grandTotal = grandTotal;
        this.transactionId = transactionId;
        this.paymentScreenshot = paymentScreenshot;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.recipientEmail = recipientEmail;
        this.personalMessage = personalMessage;
        this.scheduledDate = scheduledDate;
        this.scheduledTime = scheduledTime;
        this.deliveryService = deliveryService;
        this.deliveryCharge = deliveryCharge;
        this.adminDeliveryCharge = adminDeliveryCharge;
    }

    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) { this.items = items; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getCourierType() { return courierType; }
    public void setCourierType(String courierType) { this.courierType = courierType; }

    public BigDecimal getGrandTotal() { return grandTotal; }
    public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getPaymentScreenshot() { return paymentScreenshot; }
    public void setPaymentScreenshot(String paymentScreenshot) { this.paymentScreenshot = paymentScreenshot; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getRecipientPhone() { return recipientPhone; }
    public void setRecipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; }

    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }

    public String getPersonalMessage() { return personalMessage; }
    public void setPersonalMessage(String personalMessage) { this.personalMessage = personalMessage; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalTime scheduledTime) { this.scheduledTime = scheduledTime; }

    public String getDeliveryService() { return deliveryService; }
    public void setDeliveryService(String deliveryService) { this.deliveryService = deliveryService; }

    public BigDecimal getDeliveryCharge() { return deliveryCharge; }
    public void setDeliveryCharge(BigDecimal deliveryCharge) { this.deliveryCharge = deliveryCharge; }

    public BigDecimal getAdminDeliveryCharge() { return adminDeliveryCharge; }
    public void setAdminDeliveryCharge(BigDecimal adminDeliveryCharge) { this.adminDeliveryCharge = adminDeliveryCharge; }

    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        if (address != null) sb.append(address);
        if (city != null && !city.isEmpty()) sb.append(", ").append(city);
        if (state != null && !state.isEmpty()) sb.append(", ").append(state);
        if (pincode != null && !pincode.isEmpty()) sb.append(" - ").append(pincode);
        return sb.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CheckoutRequest that = (CheckoutRequest) o;
        return java.util.Objects.equals(items, that.items) &&
                java.util.Objects.equals(address, that.address) &&
                java.util.Objects.equals(grandTotal, that.grandTotal) &&
                java.util.Objects.equals(transactionId, that.transactionId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(items, address, grandTotal, transactionId);
    }

    @Override
    public String toString() {
        return "CheckoutRequest(items=" + items + ", address=" + address + ", recipientName=" + recipientName + ", grandTotal=" + grandTotal + ")";
    }

    public static CheckoutRequestBuilder builder() {
        return new CheckoutRequestBuilder();
    }

    public static class CheckoutRequestBuilder {
        private List<CartItemDto> items;
        private String address;
        private String city;
        private String state;
        private String pincode;
        private String courierType;
        private BigDecimal grandTotal;
        private String transactionId;
        private String paymentScreenshot;
        private String recipientName;
        private String recipientPhone;
        private String recipientEmail;
        private String personalMessage;
        private LocalDate scheduledDate;
        private LocalTime scheduledTime;
        private String deliveryService;
        private BigDecimal deliveryCharge;
        private BigDecimal adminDeliveryCharge;

        CheckoutRequestBuilder() {}

        public CheckoutRequestBuilder items(List<CartItemDto> items) { this.items = items; return this; }
        public CheckoutRequestBuilder address(String address) { this.address = address; return this; }
        public CheckoutRequestBuilder city(String city) { this.city = city; return this; }
        public CheckoutRequestBuilder state(String state) { this.state = state; return this; }
        public CheckoutRequestBuilder pincode(String pincode) { this.pincode = pincode; return this; }
        public CheckoutRequestBuilder courierType(String courierType) { this.courierType = courierType; return this; }
        public CheckoutRequestBuilder grandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; return this; }
        public CheckoutRequestBuilder transactionId(String transactionId) { this.transactionId = transactionId; return this; }
        public CheckoutRequestBuilder paymentScreenshot(String paymentScreenshot) { this.paymentScreenshot = paymentScreenshot; return this; }
        public CheckoutRequestBuilder recipientName(String recipientName) { this.recipientName = recipientName; return this; }
        public CheckoutRequestBuilder recipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; return this; }
        public CheckoutRequestBuilder recipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; return this; }
        public CheckoutRequestBuilder personalMessage(String personalMessage) { this.personalMessage = personalMessage; return this; }
        public CheckoutRequestBuilder scheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; return this; }
        public CheckoutRequestBuilder scheduledTime(LocalTime scheduledTime) { this.scheduledTime = scheduledTime; return this; }
        public CheckoutRequestBuilder deliveryService(String deliveryService) { this.deliveryService = deliveryService; return this; }
        public CheckoutRequestBuilder deliveryCharge(BigDecimal deliveryCharge) { this.deliveryCharge = deliveryCharge; return this; }
        public CheckoutRequestBuilder adminDeliveryCharge(BigDecimal adminDeliveryCharge) { this.adminDeliveryCharge = adminDeliveryCharge; return this; }

        public CheckoutRequest build() {
            return new CheckoutRequest(items, address, city, state, pincode, courierType, grandTotal, transactionId, paymentScreenshot, recipientName, recipientPhone, recipientEmail, personalMessage, scheduledDate, scheduledTime, deliveryService, deliveryCharge, adminDeliveryCharge);
        }
    }
}
