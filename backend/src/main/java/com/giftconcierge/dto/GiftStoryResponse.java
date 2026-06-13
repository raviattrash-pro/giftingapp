package com.giftconcierge.dto;

import java.time.LocalDateTime;

public class GiftStoryResponse {
    private Long id;
    private String giftName;
    private String recipientName;
    private String senderName;
    private String message;
    private String mediaUrl;
    private String mediaType;
    private Integer likesCount;
    private LocalDateTime createdAt;

    public GiftStoryResponse() {
    }

    public GiftStoryResponse(Long id, String giftName, String recipientName, String senderName, String message, String mediaUrl, String mediaType, Integer likesCount, LocalDateTime createdAt) {
        this.id = id;
        this.giftName = giftName;
        this.recipientName = recipientName;
        this.senderName = senderName;
        this.message = message;
        this.mediaUrl = mediaUrl;
        this.mediaType = mediaType;
        this.likesCount = likesCount;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGiftName() {
        return this.giftName;
    }

    public void setGiftName(String giftName) {
        this.giftName = giftName;
    }

    public String getRecipientName() {
        return this.recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getSenderName() {
        return this.senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
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

    public Integer getLikesCount() {
        return this.likesCount;
    }

    public void setLikesCount(Integer likesCount) {
        this.likesCount = likesCount;
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
        GiftStoryResponse that = (GiftStoryResponse) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(giftName, that.giftName) &&
                java.util.Objects.equals(recipientName, that.recipientName) &&
                java.util.Objects.equals(senderName, that.senderName) &&
                java.util.Objects.equals(message, that.message) &&
                java.util.Objects.equals(mediaUrl, that.mediaUrl) &&
                java.util.Objects.equals(mediaType, that.mediaType) &&
                java.util.Objects.equals(likesCount, that.likesCount) &&
                java.util.Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, giftName, recipientName, senderName, message, mediaUrl, mediaType, likesCount, createdAt);
    }

    @Override
    public String toString() {
        return "GiftStoryResponse(id=" + id + ", giftName=" + giftName + ", recipientName=" + recipientName + ", senderName=" + senderName + ", message=" + message + ", mediaUrl=" + mediaUrl + ", mediaType=" + mediaType + ", likesCount=" + likesCount + ", createdAt=" + createdAt + ")";
    }

    public static GiftStoryResponseBuilder builder() {
        return new GiftStoryResponseBuilder();
    }

    public static class GiftStoryResponseBuilder {
        private Long id;
        private String giftName;
        private String recipientName;
        private String senderName;
        private String message;
        private String mediaUrl;
        private String mediaType;
        private Integer likesCount;
        private LocalDateTime createdAt;

        GiftStoryResponseBuilder() {
        }

        public GiftStoryResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public GiftStoryResponseBuilder giftName(String giftName) {
            this.giftName = giftName;
            return this;
        }

        public GiftStoryResponseBuilder recipientName(String recipientName) {
            this.recipientName = recipientName;
            return this;
        }

        public GiftStoryResponseBuilder senderName(String senderName) {
            this.senderName = senderName;
            return this;
        }

        public GiftStoryResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public GiftStoryResponseBuilder mediaUrl(String mediaUrl) {
            this.mediaUrl = mediaUrl;
            return this;
        }

        public GiftStoryResponseBuilder mediaType(String mediaType) {
            this.mediaType = mediaType;
            return this;
        }

        public GiftStoryResponseBuilder likesCount(Integer likesCount) {
            this.likesCount = likesCount;
            return this;
        }

        public GiftStoryResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public GiftStoryResponse build() {
            return new GiftStoryResponse(id, giftName, recipientName, senderName, message, mediaUrl, mediaType, likesCount, createdAt);
        }
    }
}
