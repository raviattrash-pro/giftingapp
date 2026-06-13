package com.giftconcierge.dto;

public class CartItemDto {
    private GiftDto gift;
    private Integer quantity;
    private Long recipientId;
    private Long occasionId;

    public CartItemDto() {
    }

    public CartItemDto(GiftDto gift, Integer quantity, Long recipientId, Long occasionId) {
        this.gift = gift;
        this.quantity = quantity;
        this.recipientId = recipientId;
        this.occasionId = occasionId;
    }

    public GiftDto getGift() {
        return this.gift;
    }

    public void setGift(GiftDto gift) {
        this.gift = gift;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Long getRecipientId() {
        return this.recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public Long getOccasionId() {
        return this.occasionId;
    }

    public void setOccasionId(Long occasionId) {
        this.occasionId = occasionId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CartItemDto that = (CartItemDto) o;
        return java.util.Objects.equals(gift, that.gift) &&
                java.util.Objects.equals(quantity, that.quantity) &&
                java.util.Objects.equals(recipientId, that.recipientId) &&
                java.util.Objects.equals(occasionId, that.occasionId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(gift, quantity, recipientId, occasionId);
    }

    @Override
    public String toString() {
        return "CartItemDto(gift=" + gift + ", quantity=" + quantity + ", recipientId=" + recipientId + ", occasionId=" + occasionId + ")";
    }

    public static CartItemDtoBuilder builder() {
        return new CartItemDtoBuilder();
    }

    public static class CartItemDtoBuilder {
        private GiftDto gift;
        private Integer quantity;
        private Long recipientId;
        private Long occasionId;

        CartItemDtoBuilder() {
        }

        public CartItemDtoBuilder gift(GiftDto gift) {
            this.gift = gift;
            return this;
        }

        public CartItemDtoBuilder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public CartItemDtoBuilder recipientId(Long recipientId) {
            this.recipientId = recipientId;
            return this;
        }

        public CartItemDtoBuilder occasionId(Long occasionId) {
            this.occasionId = occasionId;
            return this;
        }

        public CartItemDto build() {
            return new CartItemDto(gift, quantity, recipientId, occasionId);
        }
    }
}
