package com.giftconcierge.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "relationship_scores")
public class RelationshipScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Recipient recipient;

    @Column(nullable = false)
    private Integer score;

    @Column(name = "gifting_frequency_score")
    private Integer giftingFrequencyScore;

    @Column(name = "event_participation_score")
    private Integer eventParticipationScore;

    @Column(name = "interaction_score")
    private Integer interactionScore;

    @Column(name = "last_calculated")
    private LocalDateTime lastCalculated;

    public RelationshipScore() {
    }

    public RelationshipScore(Long id, User user, Recipient recipient, Integer score, Integer giftingFrequencyScore, Integer eventParticipationScore, Integer interactionScore, LocalDateTime lastCalculated) {
        this.id = id;
        this.user = user;
        this.recipient = recipient;
        this.score = score;
        this.giftingFrequencyScore = giftingFrequencyScore;
        this.eventParticipationScore = eventParticipationScore;
        this.interactionScore = interactionScore;
        this.lastCalculated = lastCalculated;
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

    public Integer getScore() {
        return this.score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getGiftingFrequencyScore() {
        return this.giftingFrequencyScore;
    }

    public void setGiftingFrequencyScore(Integer giftingFrequencyScore) {
        this.giftingFrequencyScore = giftingFrequencyScore;
    }

    public Integer getEventParticipationScore() {
        return this.eventParticipationScore;
    }

    public void setEventParticipationScore(Integer eventParticipationScore) {
        this.eventParticipationScore = eventParticipationScore;
    }

    public Integer getInteractionScore() {
        return this.interactionScore;
    }

    public void setInteractionScore(Integer interactionScore) {
        this.interactionScore = interactionScore;
    }

    public LocalDateTime getLastCalculated() {
        return this.lastCalculated;
    }

    public void setLastCalculated(LocalDateTime lastCalculated) {
        this.lastCalculated = lastCalculated;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RelationshipScore that = (RelationshipScore) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(score, that.score) &&
                java.util.Objects.equals(giftingFrequencyScore, that.giftingFrequencyScore) &&
                java.util.Objects.equals(eventParticipationScore, that.eventParticipationScore) &&
                java.util.Objects.equals(interactionScore, that.interactionScore) &&
                java.util.Objects.equals(lastCalculated, that.lastCalculated);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, score, giftingFrequencyScore, eventParticipationScore, interactionScore, lastCalculated);
    }

    @Override
    public String toString() {
        return "RelationshipScore(id=" + id + ", score=" + score + ", giftingFrequencyScore=" + giftingFrequencyScore + ", eventParticipationScore=" + eventParticipationScore + ", interactionScore=" + interactionScore + ", lastCalculated=" + lastCalculated + ")";
    }

    public static RelationshipScoreBuilder builder() {
        return new RelationshipScoreBuilder();
    }

    public static class RelationshipScoreBuilder {
        private Long id;
        private User user;
        private Recipient recipient;
        private Integer score;
        private Integer giftingFrequencyScore;
        private Integer eventParticipationScore;
        private Integer interactionScore;
        private LocalDateTime lastCalculated;

        RelationshipScoreBuilder() {
        }

        public RelationshipScoreBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public RelationshipScoreBuilder user(User user) {
            this.user = user;
            return this;
        }

        public RelationshipScoreBuilder recipient(Recipient recipient) {
            this.recipient = recipient;
            return this;
        }

        public RelationshipScoreBuilder score(Integer score) {
            this.score = score;
            return this;
        }

        public RelationshipScoreBuilder giftingFrequencyScore(Integer giftingFrequencyScore) {
            this.giftingFrequencyScore = giftingFrequencyScore;
            return this;
        }

        public RelationshipScoreBuilder eventParticipationScore(Integer eventParticipationScore) {
            this.eventParticipationScore = eventParticipationScore;
            return this;
        }

        public RelationshipScoreBuilder interactionScore(Integer interactionScore) {
            this.interactionScore = interactionScore;
            return this;
        }

        public RelationshipScoreBuilder lastCalculated(LocalDateTime lastCalculated) {
            this.lastCalculated = lastCalculated;
            return this;
        }

        public RelationshipScore build() {
            return new RelationshipScore(id, user, recipient, score, giftingFrequencyScore, eventParticipationScore, interactionScore, lastCalculated);
        }
    }
}
