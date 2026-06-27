package com.giftconcierge.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "analytics_events")
public class AnalyticsEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "session_id", length = 100)
    private String sessionId;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType; // e.g., PAGE_VIEW, CATEGORY_CLICK, PRODUCT_CLICK

    @Column(name = "path", length = 255)
    private String path;

    @Column(name = "item_id", length = 100)
    private String itemId;

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata; // JSON string

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public AnalyticsEvent() {}

    public AnalyticsEvent(Long userId, String sessionId, String eventType, String path, String itemId, String metadata) {
        this.userId = userId;
        this.sessionId = sessionId;
        this.eventType = eventType;
        this.path = path;
        this.itemId = itemId;
        this.metadata = metadata;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
