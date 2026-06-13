package com.giftconcierge.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "group_gifts")
public class GroupGift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Recipient recipient;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "target_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal targetAmount;

    @Column(name = "collected_amount", precision = 10, scale = 2)
    private BigDecimal collectedAmount = BigDecimal.ZERO;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE";

    @Column(name = "share_link", unique = true, length = 100)
    private String shareLink;

    private LocalDate deadline;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "groupGift", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GroupGiftContribution> contributions = new ArrayList<>();

    public GroupGift() {
    }

    public GroupGift(Long id, User organizer, Recipient recipient, String title, String description, BigDecimal targetAmount, BigDecimal collectedAmount, String status, String shareLink, LocalDate deadline, LocalDateTime createdAt, List<GroupGiftContribution> contributions) {
        this.id = id;
        this.organizer = organizer;
        this.recipient = recipient;
        this.title = title;
        this.description = description;
        this.targetAmount = targetAmount;
        this.collectedAmount = collectedAmount;
        this.status = status;
        this.shareLink = shareLink;
        this.deadline = deadline;
        this.createdAt = createdAt;
        this.contributions = contributions;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getOrganizer() {
        return this.organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public Recipient getRecipient() {
        return this.recipient;
    }

    public void setRecipient(Recipient recipient) {
        this.recipient = recipient;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getTargetAmount() {
        return this.targetAmount;
    }

    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }

    public BigDecimal getCollectedAmount() {
        return this.collectedAmount;
    }

    public void setCollectedAmount(BigDecimal collectedAmount) {
        this.collectedAmount = collectedAmount;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getShareLink() {
        return this.shareLink;
    }

    public void setShareLink(String shareLink) {
        this.shareLink = shareLink;
    }

    public LocalDate getDeadline() {
        return this.deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<GroupGiftContribution> getContributions() {
        return this.contributions;
    }

    public void setContributions(List<GroupGiftContribution> contributions) {
        this.contributions = contributions;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GroupGift groupGift = (GroupGift) o;
        return java.util.Objects.equals(id, groupGift.id) &&
                java.util.Objects.equals(title, groupGift.title) &&
                java.util.Objects.equals(description, groupGift.description) &&
                java.util.Objects.equals(targetAmount, groupGift.targetAmount) &&
                java.util.Objects.equals(collectedAmount, groupGift.collectedAmount) &&
                java.util.Objects.equals(status, groupGift.status) &&
                java.util.Objects.equals(shareLink, groupGift.shareLink) &&
                java.util.Objects.equals(deadline, groupGift.deadline) &&
                java.util.Objects.equals(createdAt, groupGift.createdAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, title, description, targetAmount, collectedAmount, status, shareLink, deadline, createdAt);
    }

    @Override
    public String toString() {
        return "GroupGift(id=" + id + ", title=" + title + ", description=" + description + ", targetAmount=" + targetAmount + ", collectedAmount=" + collectedAmount + ", status=" + status + ", shareLink=" + shareLink + ", deadline=" + deadline + ", createdAt=" + createdAt + ")";
    }

    public static GroupGiftBuilder builder() {
        return new GroupGiftBuilder();
    }

    public static class GroupGiftBuilder {
        private Long id;
        private User organizer;
        private Recipient recipient;
        private String title;
        private String description;
        private BigDecimal targetAmount;
        private BigDecimal collectedAmount = BigDecimal.ZERO;
        private String status = "ACTIVE";
        private String shareLink;
        private LocalDate deadline;
        private LocalDateTime createdAt;
        private List<GroupGiftContribution> contributions = new ArrayList<>();

        GroupGiftBuilder() {
        }

        public GroupGiftBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public GroupGiftBuilder organizer(User organizer) {
            this.organizer = organizer;
            return this;
        }

        public GroupGiftBuilder recipient(Recipient recipient) {
            this.recipient = recipient;
            return this;
        }

        public GroupGiftBuilder title(String title) {
            this.title = title;
            return this;
        }

        public GroupGiftBuilder description(String description) {
            this.description = description;
            return this;
        }

        public GroupGiftBuilder targetAmount(BigDecimal targetAmount) {
            this.targetAmount = targetAmount;
            return this;
        }

        public GroupGiftBuilder collectedAmount(BigDecimal collectedAmount) {
            this.collectedAmount = collectedAmount;
            return this;
        }

        public GroupGiftBuilder status(String status) {
            this.status = status;
            return this;
        }

        public GroupGiftBuilder shareLink(String shareLink) {
            this.shareLink = shareLink;
            return this;
        }

        public GroupGiftBuilder deadline(LocalDate deadline) {
            this.deadline = deadline;
            return this;
        }

        public GroupGiftBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public GroupGiftBuilder contributions(List<GroupGiftContribution> contributions) {
            this.contributions = contributions;
            return this;
        }

        public GroupGift build() {
            return new GroupGift(id, organizer, recipient, title, description, targetAmount, collectedAmount, status, shareLink, deadline, createdAt, contributions);
        }
    }
}
