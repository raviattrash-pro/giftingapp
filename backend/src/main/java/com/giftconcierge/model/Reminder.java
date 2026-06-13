package com.giftconcierge.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "occasion_id", nullable = false)
    private Occasion occasion;

    @Column(length = 30)
    private String type;

    @Column(name = "days_before")
    private Integer daysBefore;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_smart")
    private Boolean isSmart = false;

    @Column(name = "is_sent")
    private Boolean isSent = false;

    @Column(name = "send_at")
    private LocalDateTime sendAt;

    public Reminder() {
    }

    public Reminder(Long id, User user, Occasion occasion, String type, Integer daysBefore, String message, Boolean isSmart, Boolean isSent, LocalDateTime sendAt) {
        this.id = id;
        this.user = user;
        this.occasion = occasion;
        this.type = type;
        this.daysBefore = daysBefore;
        this.message = message;
        this.isSmart = isSmart;
        this.isSent = isSent;
        this.sendAt = sendAt;
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

    public Occasion getOccasion() {
        return this.occasion;
    }

    public void setOccasion(Occasion occasion) {
        this.occasion = occasion;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getDaysBefore() {
        return this.daysBefore;
    }

    public void setDaysBefore(Integer daysBefore) {
        this.daysBefore = daysBefore;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIsSmart() {
        return this.isSmart;
    }

    public void setIsSmart(Boolean isSmart) {
        this.isSmart = isSmart;
    }

    public Boolean getIsSent() {
        return this.isSent;
    }

    public void setIsSent(Boolean isSent) {
        this.isSent = isSent;
    }

    public LocalDateTime getSendAt() {
        return this.sendAt;
    }

    public void setSendAt(LocalDateTime sendAt) {
        this.sendAt = sendAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Reminder reminder = (Reminder) o;
        return java.util.Objects.equals(id, reminder.id) &&
                java.util.Objects.equals(type, reminder.type) &&
                java.util.Objects.equals(daysBefore, reminder.daysBefore) &&
                java.util.Objects.equals(message, reminder.message) &&
                java.util.Objects.equals(isSmart, reminder.isSmart) &&
                java.util.Objects.equals(isSent, reminder.isSent) &&
                java.util.Objects.equals(sendAt, reminder.sendAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, type, daysBefore, message, isSmart, isSent, sendAt);
    }

    @Override
    public String toString() {
        return "Reminder(id=" + id + ", type=" + type + ", daysBefore=" + daysBefore + ", message=" + message + ", isSmart=" + isSmart + ", isSent=" + isSent + ", sendAt=" + sendAt + ")";
    }

    public static ReminderBuilder builder() {
        return new ReminderBuilder();
    }

    public static class ReminderBuilder {
        private Long id;
        private User user;
        private Occasion occasion;
        private String type;
        private Integer daysBefore;
        private String message;
        private Boolean isSmart = false;
        private Boolean isSent = false;
        private LocalDateTime sendAt;

        ReminderBuilder() {
        }

        public ReminderBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ReminderBuilder user(User user) {
            this.user = user;
            return this;
        }

        public ReminderBuilder occasion(Occasion occasion) {
            this.occasion = occasion;
            return this;
        }

        public ReminderBuilder type(String type) {
            this.type = type;
            return this;
        }

        public ReminderBuilder daysBefore(Integer daysBefore) {
            this.daysBefore = daysBefore;
            return this;
        }

        public ReminderBuilder message(String message) {
            this.message = message;
            return this;
        }

        public ReminderBuilder isSmart(Boolean isSmart) {
            this.isSmart = isSmart;
            return this;
        }

        public ReminderBuilder isSent(Boolean isSent) {
            this.isSent = isSent;
            return this;
        }

        public ReminderBuilder sendAt(LocalDateTime sendAt) {
            this.sendAt = sendAt;
            return this;
        }

        public Reminder build() {
            return new Reminder(id, user, occasion, type, daysBefore, message, isSmart, isSent, sendAt);
        }
    }
}
