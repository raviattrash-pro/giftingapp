package com.giftconcierge.dto;

import java.math.BigDecimal;

public class ContributeRequest {
    private String contributorName;
    private BigDecimal amount;
    private String message;

    public ContributeRequest() {
    }

    public ContributeRequest(String contributorName, BigDecimal amount, String message) {
        this.contributorName = contributorName;
        this.amount = amount;
        this.message = message;
    }

    public String getContributorName() {
        return this.contributorName;
    }

    public void setContributorName(String contributorName) {
        this.contributorName = contributorName;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
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
        ContributeRequest that = (ContributeRequest) o;
        return java.util.Objects.equals(contributorName, that.contributorName) &&
                java.util.Objects.equals(amount, that.amount) &&
                java.util.Objects.equals(message, that.message);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(contributorName, amount, message);
    }

    @Override
    public String toString() {
        return "ContributeRequest(contributorName=" + contributorName + ", amount=" + amount + ", message=" + message + ")";
    }

    public static ContributeRequestBuilder builder() {
        return new ContributeRequestBuilder();
    }

    public static class ContributeRequestBuilder {
        private String contributorName;
        private BigDecimal amount;
        private String message;

        ContributeRequestBuilder() {
        }

        public ContributeRequestBuilder contributorName(String contributorName) {
            this.contributorName = contributorName;
            return this;
        }

        public ContributeRequestBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public ContributeRequestBuilder message(String message) {
            this.message = message;
            return this;
        }

        public ContributeRequest build() {
            return new ContributeRequest(contributorName, amount, message);
        }
    }
}
