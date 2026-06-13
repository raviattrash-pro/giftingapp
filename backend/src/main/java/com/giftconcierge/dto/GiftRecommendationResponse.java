package com.giftconcierge.dto;

import java.math.BigDecimal;
import java.util.List;

public class GiftRecommendationResponse {

    private List<GiftSuggestion> gifts;
    private String reasoning;

    public GiftRecommendationResponse() {
    }

    public GiftRecommendationResponse(List<GiftSuggestion> gifts, String reasoning) {
        this.gifts = gifts;
        this.reasoning = reasoning;
    }

    public List<GiftSuggestion> getGifts() {
        return this.gifts;
    }

    public void setGifts(List<GiftSuggestion> gifts) {
        this.gifts = gifts;
    }

    public String getReasoning() {
        return this.reasoning;
    }

    public void setReasoning(String reasoning) {
        this.reasoning = reasoning;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GiftRecommendationResponse that = (GiftRecommendationResponse) o;
        return java.util.Objects.equals(gifts, that.gifts) &&
                java.util.Objects.equals(reasoning, that.reasoning);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(gifts, reasoning);
    }

    @Override
    public String toString() {
        return "GiftRecommendationResponse(gifts=" + gifts + ", reasoning=" + reasoning + ")";
    }

    public static GiftRecommendationResponseBuilder builder() {
        return new GiftRecommendationResponseBuilder();
    }

    public static class GiftRecommendationResponseBuilder {
        private List<GiftSuggestion> gifts;
        private String reasoning;

        GiftRecommendationResponseBuilder() {
        }

        public GiftRecommendationResponseBuilder gifts(List<GiftSuggestion> gifts) {
            this.gifts = gifts;
            return this;
        }

        public GiftRecommendationResponseBuilder reasoning(String reasoning) {
            this.reasoning = reasoning;
            return this;
        }

        public GiftRecommendationResponse build() {
            return new GiftRecommendationResponse(gifts, reasoning);
        }
    }

    public static class GiftSuggestion {
        private Long id;
        private String name;
        private String description;
        private String category;
        private BigDecimal price;
        private String imageUrl;
        private Integer compatibilityScore;
        private String reason;
        private String emotionTags;

        public GiftSuggestion() {
        }

        public GiftSuggestion(Long id, String name, String description, String category, BigDecimal price, String imageUrl, Integer compatibilityScore, String reason, String emotionTags) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.category = category;
            this.price = price;
            this.imageUrl = imageUrl;
            this.compatibilityScore = compatibilityScore;
            this.reason = reason;
            this.emotionTags = emotionTags;
        }

        public Long getId() {
            return this.id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return this.name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return this.description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getCategory() {
            return this.category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public BigDecimal getPrice() {
            return this.price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public String getImageUrl() {
            return this.imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public Integer getCompatibilityScore() {
            return this.compatibilityScore;
        }

        public void setCompatibilityScore(Integer compatibilityScore) {
            this.compatibilityScore = compatibilityScore;
        }

        public String getReason() {
            return this.reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }

        public String getEmotionTags() {
            return this.emotionTags;
        }

        public void setEmotionTags(String emotionTags) {
            this.emotionTags = emotionTags;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            GiftSuggestion that = (GiftSuggestion) o;
            return java.util.Objects.equals(id, that.id) &&
                    java.util.Objects.equals(name, that.name) &&
                    java.util.Objects.equals(description, that.description) &&
                    java.util.Objects.equals(category, that.category) &&
                    java.util.Objects.equals(price, that.price) &&
                    java.util.Objects.equals(imageUrl, that.imageUrl) &&
                    java.util.Objects.equals(compatibilityScore, that.compatibilityScore) &&
                    java.util.Objects.equals(reason, that.reason) &&
                    java.util.Objects.equals(emotionTags, that.emotionTags);
        }

        @Override
        public int hashCode() {
            return java.util.Objects.hash(id, name, description, category, price, imageUrl, compatibilityScore, reason, emotionTags);
        }

        @Override
        public String toString() {
            return "GiftSuggestion(id=" + id + ", name=" + name + ", description=" + description + ", category=" + category + ", price=" + price + ", imageUrl=" + imageUrl + ", compatibilityScore=" + compatibilityScore + ", reason=" + reason + ", emotionTags=" + emotionTags + ")";
        }

        public static GiftSuggestionBuilder builder() {
            return new GiftSuggestionBuilder();
        }

        public static class GiftSuggestionBuilder {
            private Long id;
            private String name;
            private String description;
            private String category;
            private BigDecimal price;
            private String imageUrl;
            private Integer compatibilityScore;
            private String reason;
            private String emotionTags;

            GiftSuggestionBuilder() {
            }

            public GiftSuggestionBuilder id(Long id) {
                this.id = id;
                return this;
            }

            public GiftSuggestionBuilder name(String name) {
                this.name = name;
                return this;
            }

            public GiftSuggestionBuilder description(String description) {
                this.description = description;
                return this;
            }

            public GiftSuggestionBuilder category(String category) {
                this.category = category;
                return this;
            }

            public GiftSuggestionBuilder price(BigDecimal price) {
                this.price = price;
                return this;
            }

            public GiftSuggestionBuilder imageUrl(String imageUrl) {
                this.imageUrl = imageUrl;
                return this;
            }

            public GiftSuggestionBuilder compatibilityScore(Integer compatibilityScore) {
                this.compatibilityScore = compatibilityScore;
                return this;
            }

            public GiftSuggestionBuilder reason(String reason) {
                this.reason = reason;
                return this;
            }

            public GiftSuggestionBuilder emotionTags(String emotionTags) {
                this.emotionTags = emotionTags;
                return this;
            }

            public GiftSuggestion build() {
                return new GiftSuggestion(id, name, description, category, price, imageUrl, compatibilityScore, reason, emotionTags);
            }
        }
    }
}
