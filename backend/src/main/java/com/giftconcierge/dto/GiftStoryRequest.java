package com.giftconcierge.dto;

public class GiftStoryRequest {
    private Long orderId;
    private String message;
    private String mediaUrl;
    private String mediaType;

    public GiftStoryRequest() {
    }

    public GiftStoryRequest(Long orderId, String message, String mediaUrl, String mediaType) {
        this.orderId = orderId;
        this.message = message;
        this.mediaUrl = mediaUrl;
        this.mediaType = mediaType;
    }

    public Long getOrderId() {
        return this.orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMediaUrl() {
        return this.mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public String getMediaType() {
        return this.mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GiftStoryRequest that = (GiftStoryRequest) o;
        return java.util.Objects.equals(orderId, that.orderId) &&
                java.util.Objects.equals(message, that.message) &&
                java.util.Objects.equals(mediaUrl, that.mediaUrl) &&
                java.util.Objects.equals(mediaType, that.mediaType);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(orderId, message, mediaUrl, mediaType);
    }

    @Override
    public String toString() {
        return "GiftStoryRequest(orderId=" + orderId + ", message=" + message + ", mediaUrl=" + mediaUrl + ", mediaType=" + mediaType + ")";
    }

    public static GiftStoryRequestBuilder builder() {
        return new GiftStoryRequestBuilder();
    }

    public static class GiftStoryRequestBuilder {
        private Long orderId;
        private String message;
        private String mediaUrl;
        private String mediaType;

        GiftStoryRequestBuilder() {
        }

        public GiftStoryRequestBuilder orderId(Long orderId) {
            this.orderId = orderId;
            return this;
        }

        public GiftStoryRequestBuilder message(String message) {
            this.message = message;
            return this;
        }

        public GiftStoryRequestBuilder mediaUrl(String mediaUrl) {
            this.mediaUrl = mediaUrl;
            return this;
        }

        public GiftStoryRequestBuilder mediaType(String mediaType) {
            this.mediaType = mediaType;
            return this;
        }

        public GiftStoryRequest build() {
            return new GiftStoryRequest(orderId, message, mediaUrl, mediaType);
        }
    }
}
