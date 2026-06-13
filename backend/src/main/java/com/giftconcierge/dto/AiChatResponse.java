package com.giftconcierge.dto;

import java.util.List;

public class AiChatResponse {
    private String reply;
    private List<GiftRecommendationResponse.GiftSuggestion> suggestions;

    public AiChatResponse() {
    }

    public AiChatResponse(String reply, List<GiftRecommendationResponse.GiftSuggestion> suggestions) {
        this.reply = reply;
        this.suggestions = suggestions;
    }

    public String getReply() {
        return this.reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public List<GiftRecommendationResponse.GiftSuggestion> getSuggestions() {
        return this.suggestions;
    }

    public void setSuggestions(List<GiftRecommendationResponse.GiftSuggestion> suggestions) {
        this.suggestions = suggestions;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AiChatResponse that = (AiChatResponse) o;
        return java.util.Objects.equals(reply, that.reply) &&
                java.util.Objects.equals(suggestions, that.suggestions);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(reply, suggestions);
    }

    @Override
    public String toString() {
        return "AiChatResponse(reply=" + reply + ", suggestions=" + suggestions + ")";
    }

    public static AiChatResponseBuilder builder() {
        return new AiChatResponseBuilder();
    }

    public static class AiChatResponseBuilder {
        private String reply;
        private List<GiftRecommendationResponse.GiftSuggestion> suggestions;

        AiChatResponseBuilder() {
        }

        public AiChatResponseBuilder reply(String reply) {
            this.reply = reply;
            return this;
        }

        public AiChatResponseBuilder suggestions(List<GiftRecommendationResponse.GiftSuggestion> suggestions) {
            this.suggestions = suggestions;
            return this;
        }

        public AiChatResponse build() {
            return new AiChatResponse(reply, suggestions);
        }
    }
}
