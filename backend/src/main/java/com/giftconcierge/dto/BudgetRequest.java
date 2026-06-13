package com.giftconcierge.dto;

import java.math.BigDecimal;

public class BudgetRequest {
    private String period;
    private BigDecimal budgetLimit;
    private Integer month;
    private Integer year;

    public BudgetRequest() {
    }

    public BudgetRequest(String period, BigDecimal budgetLimit, Integer month, Integer year) {
        this.period = period;
        this.budgetLimit = budgetLimit;
        this.month = month;
        this.year = year;
    }

    public String getPeriod() {
        return this.period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public BigDecimal getBudgetLimit() {
        return this.budgetLimit;
    }

    public void setBudgetLimit(BigDecimal budgetLimit) {
        this.budgetLimit = budgetLimit;
    }

    public Integer getMonth() {
        return this.month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return this.year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BudgetRequest that = (BudgetRequest) o;
        return java.util.Objects.equals(period, that.period) &&
                java.util.Objects.equals(budgetLimit, that.budgetLimit) &&
                java.util.Objects.equals(month, that.month) &&
                java.util.Objects.equals(year, that.year);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(period, budgetLimit, month, year);
    }

    @Override
    public String toString() {
        return "BudgetRequest(period=" + period + ", budgetLimit=" + budgetLimit + ", month=" + month + ", year=" + year + ")";
    }

    public static BudgetRequestBuilder builder() {
        return new BudgetRequestBuilder();
    }

    public static class BudgetRequestBuilder {
        private String period;
        private BigDecimal budgetLimit;
        private Integer month;
        private Integer year;

        BudgetRequestBuilder() {
        }

        public BudgetRequestBuilder period(String period) {
            this.period = period;
            return this;
        }

        public BudgetRequestBuilder budgetLimit(BigDecimal budgetLimit) {
            this.budgetLimit = budgetLimit;
            return this;
        }

        public BudgetRequestBuilder month(Integer month) {
            this.month = month;
            return this;
        }

        public BudgetRequestBuilder year(Integer year) {
            this.year = year;
            return this;
        }

        public BudgetRequest build() {
            return new BudgetRequest(period, budgetLimit, month, year);
        }
    }
}
