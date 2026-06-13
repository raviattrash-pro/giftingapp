package com.giftconcierge.dto;

import java.math.BigDecimal;

public class GiftRecommendationRequest {
    private Integer recipientAge;
    private String gender;
    private String relationship;
    private String interests;
    private BigDecimal budget;
    private String occasion;

    public GiftRecommendationRequest() {
    }

    public GiftRecommendationRequest(Integer recipientAge, String gender, String relationship, String interests, BigDecimal budget, String occasion) {
        this.recipientAge = recipientAge;
        this.gender = gender;
        this.relationship = relationship;
        this.interests = interests;
        this.budget = budget;
        this.occasion = occasion;
    }

    public Integer getRecipientAge() {
        return this.recipientAge;
    }

    public void setRecipientAge(Integer recipientAge) {
        this.recipientAge = recipientAge;
    }

    public String getGender() {
        return this.gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getRelationship() {
        return this.relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public String getInterests() {
        return this.interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public BigDecimal getBudget() {
        return this.budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public String getOccasion() {
        return this.occasion;
    }

    public void setOccasion(String occasion) {
        this.occasion = occasion;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GiftRecommendationRequest that = (GiftRecommendationRequest) o;
        return java.util.Objects.equals(recipientAge, that.recipientAge) &&
                java.util.Objects.equals(gender, that.gender) &&
                java.util.Objects.equals(relationship, that.relationship) &&
                java.util.Objects.equals(interests, that.interests) &&
                java.util.Objects.equals(budget, that.budget) &&
                java.util.Objects.equals(occasion, that.occasion);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(recipientAge, gender, relationship, interests, budget, occasion);
    }

    @Override
    public String toString() {
        return "GiftRecommendationRequest(recipientAge=" + recipientAge + ", gender=" + gender + ", relationship=" + relationship + ", interests=" + interests + ", budget=" + budget + ", occasion=" + occasion + ")";
    }

    public static GiftRecommendationRequestBuilder builder() {
        return new GiftRecommendationRequestBuilder();
    }

    public static class GiftRecommendationRequestBuilder {
        private Integer recipientAge;
        private String gender;
        private String relationship;
        private String interests;
        private BigDecimal budget;
        private String occasion;

        GiftRecommendationRequestBuilder() {
        }

        public GiftRecommendationRequestBuilder recipientAge(Integer recipientAge) {
            this.recipientAge = recipientAge;
            return this;
        }

        public GiftRecommendationRequestBuilder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public GiftRecommendationRequestBuilder relationship(String relationship) {
            this.relationship = relationship;
            return this;
        }

        public GiftRecommendationRequestBuilder interests(String interests) {
            this.interests = interests;
            return this;
        }

        public GiftRecommendationRequestBuilder budget(BigDecimal budget) {
            this.budget = budget;
            return this;
        }

        public GiftRecommendationRequestBuilder occasion(String occasion) {
            this.occasion = occasion;
            return this;
        }

        public GiftRecommendationRequest build() {
            return new GiftRecommendationRequest(recipientAge, gender, relationship, interests, budget, occasion);
        }
    }
}
