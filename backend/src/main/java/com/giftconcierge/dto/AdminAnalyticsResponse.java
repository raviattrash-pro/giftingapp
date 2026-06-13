package com.giftconcierge.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminAnalyticsResponse {
    private List<Map<String, Object>> topDemand;
    private List<Map<String, Object>> lowDemand;
    private Map<String, BigDecimal> salesByOccasion;
    private Map<String, BigDecimal> salesByItemCategory;

    public AdminAnalyticsResponse() {
    }

    public AdminAnalyticsResponse(List<Map<String, Object>> topDemand, List<Map<String, Object>> lowDemand, Map<String, BigDecimal> salesByOccasion, Map<String, BigDecimal> salesByItemCategory) {
        this.topDemand = topDemand;
        this.lowDemand = lowDemand;
        this.salesByOccasion = salesByOccasion;
        this.salesByItemCategory = salesByItemCategory;
    }

    public List<Map<String, Object>> getTopDemand() {
        return this.topDemand;
    }

    public void setTopDemand(List<Map<String, Object>> topDemand) {
        this.topDemand = topDemand;
    }

    public List<Map<String, Object>> getLowDemand() {
        return this.lowDemand;
    }

    public void setLowDemand(List<Map<String, Object>> lowDemand) {
        this.lowDemand = lowDemand;
    }

    public Map<String, BigDecimal> getSalesByOccasion() {
        return this.salesByOccasion;
    }

    public void setSalesByOccasion(Map<String, BigDecimal> salesByOccasion) {
        this.salesByOccasion = salesByOccasion;
    }

    public Map<String, BigDecimal> getSalesByItemCategory() {
        return this.salesByItemCategory;
    }

    public void setSalesByItemCategory(Map<String, BigDecimal> salesByItemCategory) {
        this.salesByItemCategory = salesByItemCategory;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AdminAnalyticsResponse that = (AdminAnalyticsResponse) o;
        return java.util.Objects.equals(topDemand, that.topDemand) &&
                java.util.Objects.equals(lowDemand, that.lowDemand) &&
                java.util.Objects.equals(salesByOccasion, that.salesByOccasion) &&
                java.util.Objects.equals(salesByItemCategory, that.salesByItemCategory);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(topDemand, lowDemand, salesByOccasion, salesByItemCategory);
    }

    @Override
    public String toString() {
        return "AdminAnalyticsResponse(" +
                "topDemand=" + topDemand +
                ", lowDemand=" + lowDemand +
                ", salesByOccasion=" + salesByOccasion +
                ", salesByItemCategory=" + salesByItemCategory +
                ")";
    }

    public static AdminAnalyticsResponseBuilder builder() {
        return new AdminAnalyticsResponseBuilder();
    }

    public static class AdminAnalyticsResponseBuilder {
        private List<Map<String, Object>> topDemand;
        private List<Map<String, Object>> lowDemand;
        private Map<String, BigDecimal> salesByOccasion;
        private Map<String, BigDecimal> salesByItemCategory;

        AdminAnalyticsResponseBuilder() {
        }

        public AdminAnalyticsResponseBuilder topDemand(List<Map<String, Object>> topDemand) {
            this.topDemand = topDemand;
            return this;
        }

        public AdminAnalyticsResponseBuilder lowDemand(List<Map<String, Object>> lowDemand) {
            this.lowDemand = lowDemand;
            return this;
        }

        public AdminAnalyticsResponseBuilder salesByOccasion(Map<String, BigDecimal> salesByOccasion) {
            this.salesByOccasion = salesByOccasion;
            return this;
        }

        public AdminAnalyticsResponseBuilder salesByItemCategory(Map<String, BigDecimal> salesByItemCategory) {
            this.salesByItemCategory = salesByItemCategory;
            return this;
        }

        public AdminAnalyticsResponse build() {
            return new AdminAnalyticsResponse(topDemand, lowDemand, salesByOccasion, salesByItemCategory);
        }
    }
}
