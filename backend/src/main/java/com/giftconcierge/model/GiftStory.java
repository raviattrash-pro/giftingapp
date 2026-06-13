package com.giftconcierge.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "gift_stories")
public class GiftStory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private GiftOrder order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id")
    private User recipientUser;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "media_url", length = 500)
    private String mediaUrl;

    @Column(name = "media_type", length = 30)
    private String mediaType;

    @Column(name = "likes_count")
    private Integer likesCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public GiftStory() {
    }

    public GiftStory(Long id, GiftOrder order, User recipientUser, String message, String mediaUrl, String mediaType, Integer likesCount, LocalDateTime createdAt) {
        this.id = id;
        this.order = order;
        this.recipientUser = recipientUser;
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

    public GiftOrder getOrder() {
        return this.order;
    }

    public void setOrder(GiftOrder order) {
        this.order = order;
    }

    public User getRecipientUser() {
        return this.recipientUser;
    }

    public void setRecipientUser(User recipientUser) {
        this.recipientUser = recipientUser;
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
        GiftStory that = (GiftStory) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(message, that.message) &&
                java.util.Objects.equals(mediaUrl, that.mediaUrl) &&
                java.util.Objects.equals(mediaType, that.mediaType) &&
                java.util.Objects.equals(likesCount, that.likesCount) &&
                java.util.Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, message, mediaUrl, mediaType, likesCount, createdAt);
    }

    @Override
    public String toString() {
        return "GiftStory(id=" + id + ", message=" + message + ", mediaUrl=" + mediaUrl + ", mediaType=" + mediaType + ", likesCount=" + likesCount + ", createdAt=" + createdAt + ")";
    }

    public static GiftStoryBuilder builder() {
        return new GiftStoryBuilder();
    }

    public static class GiftStoryBuilder {
        private Long id;
        private GiftOrder order;
        private User recipientUser;
        private String message;
        private String mediaUrl;
        private String mediaType;
        private Integer likesCount = 0;
        private LocalDateTime createdAt;

        GiftStoryBuilder() {
        }

        public GiftStoryBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public GiftStoryBuilder order(GiftOrder order) {
            this.order = order;
            return this;
        }

        public GiftStoryBuilder recipientUser(User recipientUser) {
            this.recipientUser = recipientUser;
            return this;
        }

        public GiftStoryBuilder message(String message) {
            this.message = message;
            return this;
        }

        public GiftStoryBuilder mediaUrl(String mediaUrl) {
            this.mediaUrl = mediaUrl;
            return this;
        }

        public GiftStoryBuilder mediaType(String mediaType) {
            this.mediaType = mediaType;
            return this;
        }

        public GiftStoryBuilder likesCount(Integer likesCount) {
            this.likesCount = likesCount;
            return this;
        }

        public GiftStoryBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public GiftStory build() {
            return new GiftStory(id, order, recipientUser, message, mediaUrl, mediaType, likesCount, createdAt);
        }
    }
}
