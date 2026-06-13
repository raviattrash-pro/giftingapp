package com.giftconcierge.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResponse {

    private List<OccasionResponse> upcomingOccasions;
    private List<RelationshipScoreEntry> relationshipScores;
    private List<RecentActivity> recentActivity;
    private BudgetSummary budgetSummary;

    public DashboardResponse() {
    }

    public DashboardResponse(List<OccasionResponse> upcomingOccasions, List<RelationshipScoreEntry> relationshipScores, List<RecentActivity> recentActivity, BudgetSummary budgetSummary) {
        this.upcomingOccasions = upcomingOccasions;
        this.relationshipScores = relationshipScores;
        this.recentActivity = recentActivity;
        this.budgetSummary = budgetSummary;
    }

    public List<OccasionResponse> getUpcomingOccasions() {
        return this.upcomingOccasions;
    }

    public void setUpcomingOccasions(List<OccasionResponse> upcomingOccasions) {
        this.upcomingOccasions = upcomingOccasions;
    }

    public List<RelationshipScoreEntry> getRelationshipScores() {
        return this.relationshipScores;
    }

    public void setRelationshipScores(List<RelationshipScoreEntry> relationshipScores) {
        this.relationshipScores = relationshipScores;
    }

    public List<RecentActivity> getRecentActivity() {
        return this.recentActivity;
    }

    public void setRecentActivity(List<RecentActivity> recentActivity) {
        this.recentActivity = recentActivity;
    }

    public BudgetSummary getBudgetSummary() {
        return this.budgetSummary;
    }

    public void setBudgetSummary(BudgetSummary budgetSummary) {
        this.budgetSummary = budgetSummary;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DashboardResponse that = (DashboardResponse) o;
        return java.util.Objects.equals(upcomingOccasions, that.upcomingOccasions) &&
                java.util.Objects.equals(relationshipScores, that.relationshipScores) &&
                java.util.Objects.equals(recentActivity, that.recentActivity) &&
                java.util.Objects.equals(budgetSummary, that.budgetSummary);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(upcomingOccasions, relationshipScores, recentActivity, budgetSummary);
    }

    @Override
    public String toString() {
        return "DashboardResponse(upcomingOccasions=" + upcomingOccasions + ", relationshipScores=" + relationshipScores + ", recentActivity=" + recentActivity + ", budgetSummary=" + budgetSummary + ")";
    }

    public static DashboardResponseBuilder builder() {
        return new DashboardResponseBuilder();
    }

    public static class DashboardResponseBuilder {
        private List<OccasionResponse> upcomingOccasions;
        private List<RelationshipScoreEntry> relationshipScores;
        private List<RecentActivity> recentActivity;
        private BudgetSummary budgetSummary;

        DashboardResponseBuilder() {
        }

        public DashboardResponseBuilder upcomingOccasions(List<OccasionResponse> upcomingOccasions) {
            this.upcomingOccasions = upcomingOccasions;
            return this;
        }

        public DashboardResponseBuilder relationshipScores(List<RelationshipScoreEntry> relationshipScores) {
            this.relationshipScores = relationshipScores;
            return this;
        }

        public DashboardResponseBuilder recentActivity(List<RecentActivity> recentActivity) {
            this.recentActivity = recentActivity;
            return this;
        }

        public DashboardResponseBuilder budgetSummary(BudgetSummary budgetSummary) {
            this.budgetSummary = budgetSummary;
            return this;
        }

        public DashboardResponse build() {
            return new DashboardResponse(upcomingOccasions, relationshipScores, recentActivity, budgetSummary);
        }
    }

    public static class RelationshipScoreEntry {
        private Long recipientId;
        private String recipientName;
        private Integer score;
        private String relationship;

        public RelationshipScoreEntry() {
        }

        public RelationshipScoreEntry(Long recipientId, String recipientName, Integer score, String relationship) {
            this.recipientId = recipientId;
            this.recipientName = recipientName;
            this.score = score;
            this.relationship = relationship;
        }

        public Long getRecipientId() {
            return this.recipientId;
        }

        public void setRecipientId(Long recipientId) {
            this.recipientId = recipientId;
        }

        public String getRecipientName() {
            return this.recipientName;
        }

        public void setRecipientName(String recipientName) {
            this.recipientName = recipientName;
        }

        public Integer getScore() {
            return this.score;
        }

        public void setScore(Integer score) {
            this.score = score;
        }

        public String getRelationship() {
            return this.relationship;
        }

        public void setRelationship(String relationship) {
            this.relationship = relationship;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            RelationshipScoreEntry that = (RelationshipScoreEntry) o;
            return java.util.Objects.equals(recipientId, that.recipientId) &&
                    java.util.Objects.equals(recipientName, that.recipientName) &&
                    java.util.Objects.equals(score, that.score) &&
                    java.util.Objects.equals(relationship, that.relationship);
        }

        @Override
        public int hashCode() {
            return java.util.Objects.hash(recipientId, recipientName, score, relationship);
        }

        @Override
        public String toString() {
            return "RelationshipScoreEntry(recipientId=" + recipientId + ", recipientName=" + recipientName + ", score=" + score + ", relationship=" + relationship + ")";
        }

        public static RelationshipScoreEntryBuilder builder() {
            return new RelationshipScoreEntryBuilder();
        }

        public static class RelationshipScoreEntryBuilder {
            private Long recipientId;
            private String recipientName;
            private Integer score;
            private String relationship;

            RelationshipScoreEntryBuilder() {
            }

            public RelationshipScoreEntryBuilder recipientId(Long recipientId) {
                this.recipientId = recipientId;
                return this;
            }

            public RelationshipScoreEntryBuilder recipientName(String recipientName) {
                this.recipientName = recipientName;
                return this;
            }

            public RelationshipScoreEntryBuilder score(Integer score) {
                this.score = score;
                return this;
            }

            public RelationshipScoreEntryBuilder relationship(String relationship) {
                this.relationship = relationship;
                return this;
            }

            public RelationshipScoreEntry build() {
                return new RelationshipScoreEntry(recipientId, recipientName, score, relationship);
            }
        }
    }

    public static class RecentActivity {
        private String type;
        private String description;
        private String timestamp;

        public RecentActivity() {
        }

        public RecentActivity(String type, String description, String timestamp) {
            this.type = type;
            this.description = description;
            this.timestamp = timestamp;
        }

        public String getType() {
            return this.type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getDescription() {
            return this.description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getTimestamp() {
            return this.timestamp;
        }

        public void setTimestamp(String timestamp) {
            this.timestamp = timestamp;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            RecentActivity that = (RecentActivity) o;
            return java.util.Objects.equals(type, that.type) &&
                    java.util.Objects.equals(description, that.description) &&
                    java.util.Objects.equals(timestamp, that.timestamp);
        }

        @Override
        public int hashCode() {
            return java.util.Objects.hash(type, description, timestamp);
        }

        @Override
        public String toString() {
            return "RecentActivity(type=" + type + ", description=" + description + ", timestamp=" + timestamp + ")";
        }

        public static RecentActivityBuilder builder() {
            return new RecentActivityBuilder();
        }

        public static class RecentActivityBuilder {
            private String type;
            private String description;
            private String timestamp;

            RecentActivityBuilder() {
            }

            public RecentActivityBuilder type(String type) {
                this.type = type;
                return this;
            }

            public RecentActivityBuilder description(String description) {
                this.description = description;
                return this;
            }

            public RecentActivityBuilder timestamp(String timestamp) {
                this.timestamp = timestamp;
                return this;
            }

            public RecentActivity build() {
                return new RecentActivity(type, description, timestamp);
            }
        }
    }

    public static class BudgetSummary {
        private BigDecimal monthlyBudget;
        private BigDecimal monthlySpent;
        private BigDecimal monthlyRemaining;
        private BigDecimal yearlySpent;
        private Double spentPercentage;

        public BudgetSummary() {
        }

        public BudgetSummary(BigDecimal monthlyBudget, BigDecimal monthlySpent, BigDecimal monthlyRemaining, BigDecimal yearlySpent, Double spentPercentage) {
            this.monthlyBudget = monthlyBudget;
            this.monthlySpent = monthlySpent;
            this.monthlyRemaining = monthlyRemaining;
            this.yearlySpent = yearlySpent;
            this.spentPercentage = spentPercentage;
        }

        public BigDecimal getMonthlyBudget() {
            return this.monthlyBudget;
        }

        public void setMonthlyBudget(BigDecimal monthlyBudget) {
            this.monthlyBudget = monthlyBudget;
        }

        public BigDecimal getMonthlySpent() {
            return this.monthlySpent;
        }

        public void setMonthlySpent(BigDecimal monthlySpent) {
            this.monthlySpent = monthlySpent;
        }

        public BigDecimal getMonthlyRemaining() {
            return this.monthlyRemaining;
        }

        public void setMonthlyRemaining(BigDecimal monthlyRemaining) {
            this.monthlyRemaining = monthlyRemaining;
        }

        public BigDecimal getYearlySpent() {
            return this.yearlySpent;
        }

        public void setYearlySpent(BigDecimal yearlySpent) {
            this.yearlySpent = yearlySpent;
        }

        public Double getSpentPercentage() {
            return this.spentPercentage;
        }

        public void setSpentPercentage(Double spentPercentage) {
            this.spentPercentage = spentPercentage;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            BudgetSummary that = (BudgetSummary) o;
            return java.util.Objects.equals(monthlyBudget, that.monthlyBudget) &&
                    java.util.Objects.equals(monthlySpent, that.monthlySpent) &&
                    java.util.Objects.equals(monthlyRemaining, that.monthlyRemaining) &&
                    java.util.Objects.equals(yearlySpent, that.yearlySpent) &&
                    java.util.Objects.equals(spentPercentage, that.spentPercentage);
        }

        @Override
        public int hashCode() {
            return java.util.Objects.hash(monthlyBudget, monthlySpent, monthlyRemaining, yearlySpent, spentPercentage);
        }

        @Override
        public String toString() {
            return "BudgetSummary(monthlyBudget=" + monthlyBudget + ", monthlySpent=" + monthlySpent + ", monthlyRemaining=" + monthlyRemaining + ", yearlySpent=" + yearlySpent + ", spentPercentage=" + spentPercentage + ")";
        }

        public static BudgetSummaryBuilder builder() {
            return new BudgetSummaryBuilder();
        }

        public static class BudgetSummaryBuilder {
            private BigDecimal monthlyBudget;
            private BigDecimal monthlySpent;
            private BigDecimal monthlyRemaining;
            private BigDecimal yearlySpent;
            private Double spentPercentage;

            BudgetSummaryBuilder() {
            }

            public BudgetSummaryBuilder monthlyBudget(BigDecimal monthlyBudget) {
                this.monthlyBudget = monthlyBudget;
                return this;
            }

            public BudgetSummaryBuilder monthlySpent(BigDecimal monthlySpent) {
                this.monthlySpent = monthlySpent;
                return this;
            }

            public BudgetSummaryBuilder monthlyRemaining(BigDecimal monthlyRemaining) {
                this.monthlyRemaining = monthlyRemaining;
                return this;
            }

            public BudgetSummaryBuilder yearlySpent(BigDecimal yearlySpent) {
                this.yearlySpent = yearlySpent;
                return this;
            }

            public BudgetSummaryBuilder spentPercentage(Double spentPercentage) {
                this.spentPercentage = spentPercentage;
                return this;
            }

            public BudgetSummary build() {
                return new BudgetSummary(monthlyBudget, monthlySpent, monthlyRemaining, yearlySpent, spentPercentage);
            }
        }
    }
}
