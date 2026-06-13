package com.giftconcierge.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 20)
    private String period;

    @Column(name = "budget_limit", nullable = false, precision = 10, scale = 2)
    private BigDecimal budgetLimit;

    @Column(precision = 10, scale = 2)
    private BigDecimal spent = BigDecimal.ZERO;

    private Integer month;

    private Integer year;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Budget() {
    }

    public Budget(Long id, User user, String period, BigDecimal budgetLimit, BigDecimal spent, Integer month, Integer year, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.period = period;
        this.budgetLimit = budgetLimit;
        this.spent = spent;
        this.month = month;
        this.year = year;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Budget budget = (Budget) o;
        return java.util.Objects.equals(id, budget.id) &&
                java.util.Objects.equals(period, budget.period) &&
                java.util.Objects.equals(budgetLimit, budget.budgetLimit) &&
                java.util.Objects.equals(spent, budget.spent) &&
                java.util.Objects.equals(month, budget.month) &&
                java.util.Objects.equals(year, budget.year) &&
                java.util.Objects.equals(createdAt, budget.createdAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, period, budgetLimit, spent, month, year, createdAt);
    }

    @Override
    public String toString() {
        return "Budget(id=" + id + ", period=" + period + ", budgetLimit=" + budgetLimit + ", spent=" + spent + ", month=" + month + ", year=" + year + ", createdAt=" + createdAt + ")";
    }

    public static BudgetBuilder builder() {
        return new BudgetBuilder();
    }

    public static class BudgetBuilder {
        private Long id;
        private User user;
        private String period;
        private BigDecimal budgetLimit;
        private BigDecimal spent = BigDecimal.ZERO;
        private Integer month;
        private Integer year;
        private LocalDateTime createdAt;

        BudgetBuilder() {
        }

        public BudgetBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BudgetBuilder user(User user) {
            this.user = user;
            return this;
        }

        public BudgetBuilder period(String period) {
            this.period = period;
            return this;
        }

        public BudgetBuilder budgetLimit(BigDecimal budgetLimit) {
            this.budgetLimit = budgetLimit;
            return this;
        }

        public BudgetBuilder spent(BigDecimal spent) {
            this.spent = spent;
            return this;
        }

        public BudgetBuilder month(Integer month) {
            this.month = month;
            return this;
        }

        public BudgetBuilder year(Integer year) {
            this.year = year;
            return this;
        }

        public BudgetBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Budget build() {
            return new Budget(id, user, period, budgetLimit, spent, month, year, createdAt);
        }
    }
}
