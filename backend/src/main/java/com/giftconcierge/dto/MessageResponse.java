package com.giftconcierge.dto;

public class MessageResponse {
    private String message;

    public MessageResponse() {
    }

    public MessageResponse(String message) {
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
        MessageResponse that = (MessageResponse) o;
        return java.util.Objects.equals(message, that.message);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(message);
    }

    @Override
    public String toString() {
        return "MessageResponse(message=" + message + ")";
    }
}
