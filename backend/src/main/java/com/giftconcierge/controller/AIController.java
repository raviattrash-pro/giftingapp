package com.giftconcierge.controller;

import com.giftconcierge.dto.AiChatRequest;
import com.giftconcierge.dto.AiChatResponse;
import com.giftconcierge.dto.GiftRecommendationRequest;
import com.giftconcierge.dto.GiftRecommendationResponse;
import com.giftconcierge.security.UserPrincipal;
import com.giftconcierge.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody AiChatRequest request) {
        return ResponseEntity.ok(aiService.chat(principal.getId(), request));
    }

    @PostMapping("/recommend")
    public ResponseEntity<GiftRecommendationResponse> recommend(
            @RequestBody GiftRecommendationRequest request) {
        return ResponseEntity.ok(aiService.recommend(request));
    }

    @PostMapping("/quiz")
    public ResponseEntity<Map<String, Object>> quiz(@RequestBody Map<String, Object> answers) {
        return ResponseEntity.ok(aiService.quiz(answers));
    }

    @PostMapping("/compatibility")
    public ResponseEntity<Map<String, Object>> compatibility(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(aiService.compatibility(request));
    }

    @PostMapping("/bundle")
    public ResponseEntity<Map<String, Object>> bundle(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(aiService.bundle(request));
    }

    @PostMapping("/predict/{recipientId}")
    public ResponseEntity<Map<String, Object>> predict(@PathVariable Long recipientId) {
        return ResponseEntity.ok(aiService.predict(recipientId));
    }
}
