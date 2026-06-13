package com.giftconcierge.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "gift_history")
public class GiftHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Recipient recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private GiftOrder order;

    @Column(name = "gift_name", nullable = false)
    private String giftName;

    @Column(length = 50)
    private String category;

    @Column(precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "occasion_type", length = 50)
    private String occasionType;

    @Column(name = "gift_date")
    private LocalDate giftDate;

    @Column(name = "compatibility_score")
    private Integer compatibilityScore;

    @Column(name = "ai_reasoning", columnDefinition = "TEXT")
    private String aiReasoning;

    public GiftHistory() {
    }

    public GiftHistory(Long id, User user, Recipient recipient, GiftOrder order, String giftName, String category, BigDecimal amount, String occasionType, LocalDate giftDate, Integer compatibilityScore, String aiReasoning) {
        this.id = id;
        this.user = user;
        this.recipient = recipient;
        this.order = order;
        this.giftName = giftName;
        this.category = category;
        this.amount = amount;
        this.occasionType = occasionType;
        this.giftDate = giftDate;
        this.compatibilityScore = compatibilityScore;
        this.aiReasoning = aiReasoning;
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

    public Recipient getRecipient() {
        return this.recipient;
    }

    public void setRecipient(Recipient recipient) {
        this.recipient = recipient;
    }

    public GiftOrder getOrder() {
        return this.order;
    }

    public void setOrder(GiftOrder order) {
        this.order = order;
    }

    public String getGiftName() {
        return this.giftName;
    }

    public void setGiftName(String giftName) {
        this.giftName = giftName;
    }

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getOccasionType() {
        return this.occasionType;
    }

    public void setOccasionType(String occasionType) {
        this.occasionType = occasionType;
    }

    public LocalDate getGiftDate() {
        return this.giftDate;
    }

    public void setGiftDate(LocalDate giftDate) {
        this.giftDate = giftDate;
    }

    public Integer getCompatibilityScore() {
        return this.compatibilityScore;
    }

    public void setCompatibilityScore(Integer compatibilityScore) {
        this.compatibilityScore = compatibilityScore;
    }

    public String getAiReasoning() {
        return this.aiReasoning;
    }

    public void setAiReasoning(String aiReasoning) {
        this.aiReasoning = aiReasoning;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GiftHistory that = (GiftHistory) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(giftName, that.giftName) &&
                java.util.Objects.equals(category, that.category) &&
                java.util.Objects.equals(amount, that.amount) &&
                java.util.Objects.equals(occasionType, that.occasionType) &&
                java.util.Objects.equals(giftDate, that.giftDate) &&
                java.util.Objects.equals(compatibilityScore, that.compatibilityScore) &&
                java.util.Objects.equals(aiReasoning, that.aiReasoning);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, giftName, category, amount, occasionType, giftDate, compatibilityScore, aiReasoning);
    }

    @Override
    public String toString() {
        return "GiftHistory(id=" + id + ", giftName=" + giftName + ", category=" + category + ", amount=" + amount + ", occasionType=" + occasionType + ", giftDate=" + giftDate + ", compatibilityScore=" + compatibilityScore + ", aiReasoning=" + aiReasoning + ")";
    }

    public static GiftHistoryBuilder builder() {
        return new GiftHistoryBuilder();
    }

    public static class GiftHistoryBuilder {
        private Long id;
        private User user;
        private Recipient recipient;
        private GiftOrder order;
        private String giftName;
        private String category;
        private BigDecimal amount;
        private String occasionType;
        private LocalDate giftDate;
        private Integer compatibilityScore;
        private String aiReasoning;

        GiftHistoryBuilder() {
        }

        public GiftHistoryBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public GiftHistoryBuilder user(User user) {
            this.user = user;
            return this;
        }

        public GiftHistoryBuilder recipient(Recipient recipient) {
            this.recipient = recipient;
            return this;
        }

        public GiftHistoryBuilder order(GiftOrder order) {
            this.order = order;
            return this;
        }

        public GiftHistoryBuilder giftName(String giftName) {
            this.giftName = giftName;
            return this;
        }

        public GiftHistoryBuilder category(String category) {
            this.category = category;
            return this;
        }

        public GiftHistoryBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public GiftHistoryBuilder occasionType(String occasionType) {
            this.occasionType = occasionType;
            return this;
        }

        public GiftHistoryBuilder giftDate(LocalDate giftDate) {
            this.giftDate = giftDate;
            return this;
        }

        public GiftHistoryBuilder compatibilityScore(Integer compatibilityScore) {
            this.compatibilityScore = compatibilityScore;
            return this;
        }

        public GiftHistoryBuilder aiReasoning(String aiReasoning) {
            this.aiReasoning = aiReasoning;
            return this;
        }

        public GiftHistory build() {
            return new GiftHistory(id, user, recipient, order, giftName, category, amount, occasionType, giftDate, compatibilityScore, aiReasoning);
        }
    }
}
