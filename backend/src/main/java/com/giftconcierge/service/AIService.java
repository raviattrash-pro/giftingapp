package com.giftconcierge.service;

import com.giftconcierge.dto.AiChatRequest;
import com.giftconcierge.dto.AiChatResponse;
import com.giftconcierge.dto.GiftRecommendationRequest;
import com.giftconcierge.dto.GiftRecommendationResponse;
import com.giftconcierge.model.AiChatHistory;
import com.giftconcierge.model.User;
import com.giftconcierge.repository.AiChatHistoryRepository;
import com.giftconcierge.repository.UserRepository;
import com.giftconcierge.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private static final Logger log = LoggerFactory.getLogger(AIService.class);

    private final AiChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;

    public AIService(AiChatHistoryRepository chatHistoryRepository, UserRepository userRepository) {
        this.chatHistoryRepository = chatHistoryRepository;
        this.userRepository = userRepository;
    }

    // TODO: Integrate with OpenAI API
    // private final WebClient openAiClient;

    @Transactional
    public AiChatResponse chat(Long userId, AiChatRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Save user message
        AiChatHistory userMessage = AiChatHistory.builder()
                .user(user)
                .role("user")
                .message(request.getMessage())
                .build();
        chatHistoryRepository.save(userMessage);

        // TODO: Replace with actual OpenAI API call
        String reply = generateMockReply(request.getMessage());
        List<GiftRecommendationResponse.GiftSuggestion> suggestions = generateMockSuggestions();

        // Save AI response
        AiChatHistory aiMessage = AiChatHistory.builder()
                .user(user)
                .role("assistant")
                .message(reply)
                .giftSuggestions(suggestions.toString())
                .build();
        chatHistoryRepository.save(aiMessage);

        return AiChatResponse.builder()
                .reply(reply)
                .suggestions(suggestions)
                .build();
    }

    public GiftRecommendationResponse recommend(GiftRecommendationRequest request) {
        // TODO: Replace with actual AI-powered recommendations using OpenAI/ML model
        log.info("Generating recommendations for: age={}, gender={}, relationship={}, budget={}",
                request.getRecipientAge(), request.getGender(), request.getRelationship(), request.getBudget());

        List<GiftRecommendationResponse.GiftSuggestion> suggestions = List.of(
                GiftRecommendationResponse.GiftSuggestion.builder()
                        .id(1L).name("Personalized Star Map")
                        .description("A beautiful star map showing the night sky on a special date")
                        .category("Personalized").price(new BigDecimal("49.99"))
                        .imageUrl("/images/star-map.jpg").compatibilityScore(95)
                        .reason("Perfect for sentimental occasions, highly rated for " + request.getRelationship())
                        .emotionTags("romantic,sentimental,unique").build(),
                GiftRecommendationResponse.GiftSuggestion.builder()
                        .id(2L).name("Premium Wireless Earbuds")
                        .description("High-quality noise-cancelling wireless earbuds")
                        .category("Electronics").price(new BigDecimal("79.99"))
                        .imageUrl("/images/earbuds.jpg").compatibilityScore(88)
                        .reason("Great for tech-savvy individuals who enjoy music")
                        .emotionTags("practical,modern,tech").build(),
                GiftRecommendationResponse.GiftSuggestion.builder()
                        .id(3L).name("Gourmet Cooking Class Experience")
                        .description("A hands-on cooking class with a professional chef")
                        .category("Experiences").price(new BigDecimal("120.00"))
                        .imageUrl("/images/cooking-class.jpg").compatibilityScore(85)
                        .reason("Creates lasting memories, perfect for food enthusiasts")
                        .emotionTags("experiential,fun,memorable").build(),
                GiftRecommendationResponse.GiftSuggestion.builder()
                        .id(4L).name("Custom Photo Book")
                        .description("Professionally designed photo book with your favorite memories")
                        .category("Personalized").price(new BigDecimal("39.99"))
                        .imageUrl("/images/photo-book.jpg").compatibilityScore(82)
                        .reason("Nostalgic and personal, celebrates shared memories")
                        .emotionTags("nostalgic,personal,heartwarming").build(),
                GiftRecommendationResponse.GiftSuggestion.builder()
                        .id(5L).name("Luxury Scented Candle Set")
                        .description("Set of 3 hand-poured soy candles in premium scents")
                        .category("Home").price(new BigDecimal("54.99"))
                        .imageUrl("/images/candle-set.jpg").compatibilityScore(78)
                        .reason("Elegant and relaxing, suitable for home decor lovers")
                        .emotionTags("relaxing,elegant,cozy").build()
        );

        return GiftRecommendationResponse.builder()
                .gifts(suggestions)
                .reasoning("Based on the recipient's profile and occasion, we recommend gifts that balance personalization with practicality.")
                .build();
    }

    public Map<String, Object> quiz(Map<String, Object> answers) {
        // TODO: Implement AI-powered gift quiz logic
        return Map.of(
                "personalityType", "Thoughtful Gifter",
                "strengths", List.of("Personal touches", "Timing", "Budget management"),
                "suggestions", List.of("Try experience-based gifts", "Consider subscription services"),
                "score", 85
        );
    }

    public Map<String, Object> compatibility(Map<String, Object> request) {
        // TODO: Implement AI compatibility scoring
        return Map.of(
                "overallScore", 87,
                "breakdown", Map.of(
                        "interestMatch", 90,
                        "budgetFit", 85,
                        "occasionRelevance", 88,
                        "uniqueness", 82
                ),
                "reasoning", "This gift aligns well with the recipient's interests and the occasion."
        );
    }

    public Map<String, Object> bundle(Map<String, Object> request) {
        // TODO: Implement AI gift bundle generation
        return Map.of(
                "bundleName", "Ultimate Relaxation Package",
                "totalPrice", 149.99,
                "items", List.of(
                        Map.of("name", "Luxury Bath Set", "price", 45.99),
                        Map.of("name", "Aromatherapy Candle", "price", 29.99),
                        Map.of("name", "Silk Eye Mask", "price", 24.99),
                        Map.of("name", "Herbal Tea Collection", "price", 19.99)
                ),
                "savings", "15%"
        );
    }

    public Map<String, Object> predict(Long recipientId) {
        // TODO: Implement AI-powered gift prediction based on recipient history
        return Map.of(
                "recipientId", recipientId,
                "predictedPreferences", List.of("Experiences", "Personalized items", "Tech gadgets"),
                "avoidCategories", List.of("Generic gift cards", "Clothing (size unknown)"),
                "budgetSuggestion", 75.00,
                "confidence", 0.82
        );
    }

    private String generateMockReply(String message) {
        if (message.toLowerCase().contains("birthday")) {
            return "For a birthday gift, I'd recommend something personal! Consider a custom photo book, a personalized piece of jewelry, or an experience like a cooking class. What's your budget range?";
        } else if (message.toLowerCase().contains("anniversary")) {
            return "Anniversaries call for something special! A star map of your wedding night sky, a weekend getaway, or a custom illustration of your first date location would be wonderful. What interests does your partner have?";
        } else if (message.toLowerCase().contains("thank")) {
            return "A thoughtful thank-you gift speaks volumes! Consider a gourmet gift basket, a handwritten note with a small plant, or a donation to their favorite charity in their name.";
        }
        return "I'd love to help you find the perfect gift! Could you tell me more about the recipient? Their age, interests, and the occasion would help me give better suggestions.";
    }

    private List<GiftRecommendationResponse.GiftSuggestion> generateMockSuggestions() {
        return List.of(
                GiftRecommendationResponse.GiftSuggestion.builder()
                        .id(1L).name("Personalized Star Map").category("Personalized")
                        .price(new BigDecimal("49.99")).compatibilityScore(92)
                        .reason("Unique and sentimental").build(),
                GiftRecommendationResponse.GiftSuggestion.builder()
                        .id(2L).name("Gourmet Gift Basket").category("Food")
                        .price(new BigDecimal("65.00")).compatibilityScore(85)
                        .reason("Universally appreciated").build()
        );
    }
}
