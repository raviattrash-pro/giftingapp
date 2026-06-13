package com.giftconcierge.dto;

import java.math.BigDecimal;

public class BudgetResponse {
    private Long id;
    private String period;
    private BigDecimal budgetLimit;
    private BigDecimal spent;
    private BigDecimal remaining;
    private Double spentPercentage;
    private Integer month;
    private Integer year;

    public BudgetResponse() {
    }

    public BudgetResponse(Long id, String period, BigDecimal budgetLimit, BigDecimal spent, BigDecimal remaining, Double spentPercentage, Integer month, Integer year) {
        this.id = id;
        this.period = period;
        this.budgetLimit = budgetLimit;
        this.spent = spent;
        this.remaining = remaining;
        this.spentPercentage = spentPercentage;
        this.month = month;
        this.year = year;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getSpent() {
        return this.spent;
    }

    public void setSpent(BigDecimal spent) {
        this.spent = spent;
    }

    public BigDecimal getRemaining() {
        return this.remaining;
    }

    public void setRemaining(BigDecimal remaining) {
        this.remaining = remaining;
    }

    public Double getSpentPercentage() {
        return this.spentPercentage;
    }

    public void setSpentPercentage(Double spentPercentage) {
        this.spentPercentage = spentPercentage;
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
        BudgetResponse that = (BudgetResponse) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(period, that.period) &&
                java.util.Objects.equals(budgetLimit, that.budgetLimit) &&
                java.util.Objects.equals(spent, that.spent) &&
                java.util.Objects.equals(remaining, that.remaining) &&
                java.util.Objects.equals(spentPercentage, that.spentPercentage) &&
                java.util.Objects.equals(month, that.month) &&
                java.util.Objects.equals(year, that.year);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, period, budgetLimit, spent, remaining, spentPercentage, month, year);
    }

    @Override
    public String toString() {
        return "BudgetResponse(id=" + id + ", period=" + period + ", budgetLimit=" + budgetLimit + ", spent=" + spent + ", remaining=" + remaining + ", spentPercentage=" + spentPercentage + ", month=" + month + ", year=" + year + ")";
    }

    public static BudgetResponseBuilder builder() {
        return new BudgetResponseBuilder();
    }

    public static class BudgetResponseBuilder {
        private Long id;
        private String period;
        private BigDecimal budgetLimit;
        private BigDecimal spent;
        private BigDecimal remaining;
        private Double spentPercentage;
        private Integer month;
        private Integer year;

        BudgetResponseBuilder() {
        }

        public BudgetResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BudgetResponseBuilder period(String period) {
            this.period = period;
            return this;
        }

        public BudgetResponseBuilder budgetLimit(BigDecimal budgetLimit) {
            this.budgetLimit = budgetLimit;
            return this;
        }

        public BudgetResponseBuilder spent(BigDecimal spent) {
            this.spent = spent;
            return this;
        }

        public BudgetResponseBuilder remaining(BigDecimal remaining) {
            this.remaining = remaining;
            return this;
        }

        public BudgetResponseBuilder spentPercentage(Double spentPercentage) {
            this.spentPercentage = spentPercentage;
            return this;
        }

        public BudgetResponseBuilder month(Integer month) {
            this.month = month;
            return this;
        }

        public BudgetResponseBuilder year(Integer year) {
            this.year = year;
            return this;
        }

        public BudgetResponse build() {
            return new BudgetResponse(id, period, budgetLimit, spent, remaining, spentPercentage, month, year);
        }
    }
}
