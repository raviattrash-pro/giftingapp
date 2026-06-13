package com.giftconcierge.dto;

public class AiChatRequest {
    private String message;

    public AiChatRequest() {
    }

    public AiChatRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AiChatRequest that = (AiChatRequest) o;
        return java.util.Objects.equals(message, that.message);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(message);
    }

    @Override
    public String toString() {
        return "AiChatRequest(message=" + message + ")";
    }

    public static AiChatRequestBuilder builder() {
        return new AiChatRequestBuilder();
    }

    public static class AiChatRequestBuilder {
        private String message;

        AiChatRequestBuilder() {
        }

        public AiChatRequestBuilder message(String message) {
            this.message = message;
            return this;
        }

        public AiChatRequest build() {
            return new AiChatRequest(message);
        }
    }
}
