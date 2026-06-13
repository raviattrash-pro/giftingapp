package com.giftconcierge.service;

import com.giftconcierge.dto.BudgetResponse;
import com.giftconcierge.dto.DashboardResponse;
import com.giftconcierge.dto.OccasionResponse;
import com.giftconcierge.model.GiftOrder;
import com.giftconcierge.model.RelationshipScore;
import com.giftconcierge.repository.GiftOrderRepository;
import com.giftconcierge.repository.RelationshipScoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final OccasionService occasionService;
    private final BudgetService budgetService;
    private final RelationshipScoreRepository relationshipScoreRepository;
    private final GiftOrderRepository giftOrderRepository;

    public DashboardService(OccasionService occasionService, BudgetService budgetService, RelationshipScoreRepository relationshipScoreRepository, GiftOrderRepository giftOrderRepository) {
        this.occasionService = occasionService;
        this.budgetService = budgetService;
        this.relationshipScoreRepository = relationshipScoreRepository;
        this.giftOrderRepository = giftOrderRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long userId) {
        // Upcoming occasions
        List<OccasionResponse> upcomingOccasions = occasionService.getUpcoming(userId);

        // Relationship scores
        List<DashboardResponse.RelationshipScoreEntry> scores = relationshipScoreRepository
                .findTopByUserId(userId).stream()
                .limit(10)
                .map(rs -> DashboardResponse.RelationshipScoreEntry.builder()
                        .recipientId(rs.getRecipient().getId())
                        .recipientName(rs.getRecipient().getName())
                        .score(rs.getScore())
                        .relationship(rs.getRecipient().getRelationship())
                        .build())
                .collect(Collectors.toList());

        // Recent activity
        List<DashboardResponse.RecentActivity> recentActivity = giftOrderRepository
                .findByUserIdOrderByCreatedAtDesc(userId).stream()
                .limit(5)
                .map(order -> DashboardResponse.RecentActivity.builder()
                        .type("GIFT_SENT")
                        .description("Sent " + order.getGiftName() + " to " + order.getRecipient().getName())
                        .timestamp(order.getCreatedAt().toString())
                        .build())
                .collect(Collectors.toList());

        // Budget summary
        BudgetResponse currentBudget = budgetService.getCurrentBudget(userId);
        BigDecimal yearlySpent = giftOrderRepository.findByUserId(userId).stream()
                .map(GiftOrder::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        DashboardResponse.BudgetSummary budgetSummary = DashboardResponse.BudgetSummary.builder()
                .monthlyBudget(currentBudget.getBudgetLimit())
                .monthlySpent(currentBudget.getSpent())
                .monthlyRemaining(currentBudget.getRemaining())
                .yearlySpent(yearlySpent)
                .spentPercentage(currentBudget.getSpentPercentage())
                .build();

        return DashboardResponse.builder()
                .upcomingOccasions(upcomingOccasions)
                .relationshipScores(scores)
                .recentActivity(recentActivity)
                .budgetSummary(budgetSummary)
                .build();
    }
}
