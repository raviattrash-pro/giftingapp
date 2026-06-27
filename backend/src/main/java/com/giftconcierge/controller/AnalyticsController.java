package com.giftconcierge.controller;

import com.giftconcierge.model.AnalyticsEvent;
import com.giftconcierge.repository.AnalyticsEventRepository;
import com.giftconcierge.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsEventRepository analyticsEventRepository;

    public AnalyticsController(AnalyticsEventRepository analyticsEventRepository) {
        this.analyticsEventRepository = analyticsEventRepository;
    }

    @PostMapping("/event")
    public ResponseEntity<?> recordEvent(@AuthenticationPrincipal UserPrincipal user,
                                         @RequestBody Map<String, String> payload) {
        try {
            Long userId = user != null ? user.getId() : null;
            String sessionId = payload.get("sessionId");
            String eventType = payload.get("eventType");
            String path = payload.get("path");
            String itemId = payload.get("itemId");
            String metadata = payload.get("metadata");

            if (eventType == null || eventType.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "eventType is required"));
            }

            AnalyticsEvent event = new AnalyticsEvent(userId, sessionId, eventType, path, itemId, metadata);
            analyticsEventRepository.save(event);

            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
