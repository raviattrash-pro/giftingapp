package com.giftconcierge.service;

import com.giftconcierge.dto.BudgetRequest;
import com.giftconcierge.dto.BudgetResponse;
import com.giftconcierge.exception.ResourceNotFoundException;
import com.giftconcierge.model.Budget;
import com.giftconcierge.model.User;
import com.giftconcierge.repository.BudgetRepository;
import com.giftconcierge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public BudgetService(BudgetRepository budgetRepository, UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public BudgetResponse getCurrentBudget(Long userId) {
        LocalDate now = LocalDate.now();
        Budget budget = budgetRepository.findByUserIdAndMonthAndYear(userId, now.getMonthValue(), now.getYear())
                .orElse(Budget.builder()
                        .budgetLimit(BigDecimal.ZERO)
                        .spent(BigDecimal.ZERO)
                        .month(now.getMonthValue())
                        .year(now.getYear())
                        .build());
        return mapToResponse(budget);
    }

    @Transactional
    public BudgetResponse setBudget(Long userId, BudgetRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        int month = request.getMonth() != null ? request.getMonth() : LocalDate.now().getMonthValue();
        int year = request.getYear() != null ? request.getYear() : LocalDate.now().getYear();

        Budget budget = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .orElse(Budget.builder()
                        .user(user)
                        .month(month)
                        .year(year)
                        .spent(BigDecimal.ZERO)
                        .build());

        budget.setBudgetLimit(request.getBudgetLimit());
        budget.setPeriod(request.getPeriod() != null ? request.getPeriod() : "MONTHLY");
        budget = budgetRepository.save(budget);

        return mapToResponse(budget);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAnalytics(Long userId) {
        int currentYear = LocalDate.now().getYear();
        List<Budget> yearBudgets = budgetRepository.findByUserIdAndYear(userId, currentYear);

        BigDecimal totalSpent = yearBudgets.stream()
                .map(Budget::getSpent)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalBudget = yearBudgets.stream()
                .map(Budget::getBudgetLimit)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Map<String, Object>> monthlyBreakdown = yearBudgets.stream()
                .map(b -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("month", b.getMonth());
                    m.put("budgetLimit", b.getBudgetLimit());
                    m.put("spent", b.getSpent());
                    m.put("remaining", b.getBudgetLimit().subtract(b.getSpent()));
                    return m;
                })
                .collect(Collectors.toList());

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("yearlySpent", totalSpent);
        analytics.put("yearlyBudget", totalBudget);
        analytics.put("averageMonthlySpend", yearBudgets.isEmpty() ? BigDecimal.ZERO :
                totalSpent.divide(new BigDecimal(yearBudgets.size()), 2, RoundingMode.HALF_UP));
        analytics.put("monthlyBreakdown", monthlyBreakdown);
        analytics.put("year", currentYear);

        return analytics;
    }

    private BudgetResponse mapToResponse(Budget budget) {
        BigDecimal remaining = budget.getBudgetLimit().subtract(budget.getSpent());
        double percentage = budget.getBudgetLimit().compareTo(BigDecimal.ZERO) > 0
                ? budget.getSpent().divide(budget.getBudgetLimit(), 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100")).doubleValue()
                : 0.0;

        return BudgetResponse.builder()
                .id(budget.getId())
                .period(budget.getPeriod())
                .budgetLimit(budget.getBudgetLimit())
                .spent(budget.getSpent())
                .remaining(remaining)
                .spentPercentage(percentage)
                .month(budget.getMonth())
                .year(budget.getYear())
                .build();
    }
}
