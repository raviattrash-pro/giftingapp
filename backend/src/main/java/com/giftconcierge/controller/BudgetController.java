package com.giftconcierge.controller;

import com.giftconcierge.dto.BudgetRequest;
import com.giftconcierge.dto.BudgetResponse;
import com.giftconcierge.security.UserPrincipal;
import com.giftconcierge.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<BudgetResponse> getCurrentBudget(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(budgetService.getCurrentBudget(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> setBudget(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.setBudget(principal.getId(), request));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(budgetService.getAnalytics(principal.getId()));
    }
}
