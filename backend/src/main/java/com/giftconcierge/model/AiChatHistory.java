package com.giftconcierge.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_chat_history")
public class AiChatHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "gift_suggestions", columnDefinition = "TEXT")
    private String giftSuggestions;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public AiChatHistory() {
    }

    public AiChatHistory(Long id, User user, String role, String message, String giftSuggestions, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.role = role;
        this.message = message;
        this.giftSuggestions = giftSuggestions;
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

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getGiftSuggestions() {
        return this.giftSuggestions;
    }

    public void setGiftSuggestions(String giftSuggestions) {
        this.giftSuggestions = giftSuggestions;
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
        AiChatHistory that = (AiChatHistory) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(role, that.role) &&
                java.util.Objects.equals(message, that.message) &&
                java.util.Objects.equals(giftSuggestions, that.giftSuggestions) &&
                java.util.Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, role, message, giftSuggestions, createdAt);
    }

    @Override
    public String toString() {
        return "AiChatHistory(id=" + id + ", role=" + role + ", message=" + message + ", giftSuggestions=" + giftSuggestions + ", createdAt=" + createdAt + ")";
    }

    public static AiChatHistoryBuilder builder() {
        return new AiChatHistoryBuilder();
    }

    public static class AiChatHistoryBuilder {
        private Long id;
        private User user;
        private String role;
        private String message;
        private String giftSuggestions;
        private LocalDateTime createdAt;

        AiChatHistoryBuilder() {
        }

        public AiChatHistoryBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AiChatHistoryBuilder user(User user) {
            this.user = user;
            return this;
        }

        public AiChatHistoryBuilder role(String role) {
            this.role = role;
            return this;
        }

        public AiChatHistoryBuilder message(String message) {
            this.message = message;
            return this;
        }

        public AiChatHistoryBuilder giftSuggestions(String giftSuggestions) {
            this.giftSuggestions = giftSuggestions;
            return this;
        }

        public AiChatHistoryBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public AiChatHistory build() {
            return new AiChatHistory(id, user, role, message, giftSuggestions, createdAt);
        }
    }
}
