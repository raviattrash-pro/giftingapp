package com.giftconcierge.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

public class ApiError {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private List<String> details;

    public ApiError() {
    }

    public ApiError(int status, String message) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.message = message;
    }

    public ApiError(int status, String message, List<String> details) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.message = message;
        this.details = details;
    }

    public ApiError(LocalDateTime timestamp, int status, String message, List<String> details) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.details = details;
    }

    public LocalDateTime getTimestamp() {
        return this.timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return this.status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getDetails() {
        return this.details;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ApiError apiError = (ApiError) o;
        return status == apiError.status &&
                java.util.Objects.equals(timestamp, apiError.timestamp) &&
                java.util.Objects.equals(message, apiError.message) &&
                java.util.Objects.equals(details, apiError.details);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(timestamp, status, message, details);
    }

    @Override
    public String toString() {
        return "ApiError(timestamp=" + timestamp + ", status=" + status + ", message=" + message + ", details=" + details + ")";
    }

    public static ApiErrorBuilder builder() {
        return new ApiErrorBuilder();
    }

    public static class ApiErrorBuilder {
        private LocalDateTime timestamp;
        private int status;
        private String message;
        private List<String> details;

        ApiErrorBuilder() {
        }

        public ApiErrorBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public ApiErrorBuilder status(int status) {
            this.status = status;
            return this;
        }

        public ApiErrorBuilder message(String message) {
            this.message = message;
            return this;
        }

        public ApiErrorBuilder details(List<String> details) {
            this.details = details;
            return this;
        }

        public ApiError build() {
            return new ApiError(timestamp, status, message, details);
        }
    }
}
