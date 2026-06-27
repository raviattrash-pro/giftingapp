package com.giftconcierge.controller;

import com.giftconcierge.dto.MessageResponse;
import com.giftconcierge.dto.UserResponse;
import com.giftconcierge.dto.PaymentSettingsDto;
import com.giftconcierge.dto.AdminAnalyticsResponse;
import com.giftconcierge.dto.OrderResponse;
import com.giftconcierge.exception.BadRequestException;
import com.giftconcierge.exception.ResourceNotFoundException;
import com.giftconcierge.model.Gift;
import com.giftconcierge.model.User;
import com.giftconcierge.model.GiftOrder;
import com.giftconcierge.model.PaymentSettings;
import com.giftconcierge.repository.GiftRepository;
import com.giftconcierge.repository.UserRepository;
import com.giftconcierge.repository.PaymentSettingsRepository;
import com.giftconcierge.repository.AppConfigRepository;
import com.giftconcierge.model.AppConfig;
import com.giftconcierge.security.UserPrincipal;
import com.giftconcierge.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.cache.annotation.CacheEvict;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final GiftRepository giftRepository;
    private final PasswordEncoder passwordEncoder;
    private final PaymentSettingsRepository paymentSettingsRepository;
    private final AppConfigRepository appConfigRepository;
    private final OrderService orderService;

    public AdminController(UserRepository userRepository, GiftRepository giftRepository, PasswordEncoder passwordEncoder, PaymentSettingsRepository paymentSettingsRepository, AppConfigRepository appConfigRepository, OrderService orderService) {
        this.userRepository = userRepository;
        this.giftRepository = giftRepository;
        this.passwordEncoder = passwordEncoder;
        this.paymentSettingsRepository = paymentSettingsRepository;
        this.appConfigRepository = appConfigRepository;
        this.orderService = orderService;
    }

    // --- GIFTS CATALOG MANAGEMENT ---

    @PostMapping("/gifts")
    @CacheEvict(value = "gifts", allEntries = true)
    public ResponseEntity<Gift> createGift(@RequestBody Gift gift) {
        if (gift.getStock() == null) {
            gift.setStock(20);
        }
        Gift savedGift = giftRepository.save(gift);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedGift);
    }

    @PutMapping("/gifts/{id}")
    @CacheEvict(value = "gifts", allEntries = true)
    public ResponseEntity<Gift> updateGift(@PathVariable Long id, @RequestBody Gift giftDetails) {
        Gift gift = giftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gift", "id", id));
        
        gift.setName(giftDetails.getName());
        gift.setDescription(giftDetails.getDescription());
        gift.setCategory(giftDetails.getCategory());
        gift.setSubcategory(giftDetails.getSubcategory());
        gift.setPrice(giftDetails.getPrice());
        gift.setImageUrl(giftDetails.getImageUrl());
        gift.setAdditionalImages(giftDetails.getAdditionalImages());
        gift.setEmotionTags(giftDetails.getEmotionTags());
        gift.setIsDigital(giftDetails.getIsDigital());
        gift.setIsExperience(giftDetails.getIsExperience());
        if (giftDetails.getRating() != null) {
            gift.setRating(giftDetails.getRating());
        }
        if (giftDetails.getReviewCount() != null) {
            gift.setReviewCount(giftDetails.getReviewCount());
        }
        if (giftDetails.getStock() != null) {
            if (giftDetails.getStock() < 0) {
                throw new BadRequestException("Stock cannot be negative");
            }
            gift.setStock(giftDetails.getStock());
        }
        if (giftDetails.getLuxuryTax() != null) {
            gift.setLuxuryTax(giftDetails.getLuxuryTax());
        }
        if (giftDetails.getCourierHandling() != null) {
            gift.setCourierHandling(giftDetails.getCourierHandling());
        }
        
        Gift updatedGift = giftRepository.save(gift);
        return ResponseEntity.ok(updatedGift);
    }

    @DeleteMapping("/gifts/{id}")
    @CacheEvict(value = "gifts", allEntries = true)
    public ResponseEntity<MessageResponse> deleteGift(@PathVariable Long id) {
        Gift gift = giftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gift", "id", id));
        giftRepository.delete(gift);
        return ResponseEntity.ok(new MessageResponse("Gift deleted successfully"));
    }

    // --- USER MANAGEMENT ---

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserResponse request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        if (request.getPremium() != null) user.setPremium(request.getPremium());
        if (request.getRole() != null) user.setRole(request.getRole());
        if (request.getMonthlyBudget() != null) user.setMonthlyBudget(request.getMonthlyBudget());
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getTimezone() != null) user.setTimezone(request.getTimezone());
        if (request.getFeatureFlags() != null) user.setFeatureFlags(request.getFeatureFlags());

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(mapToUserResponse(updatedUser));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }

    // --- PASSWORD CHANGE ---

    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, String> request) {
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new BadRequestException("New password cannot be empty");
        }
        
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));
        
        if (oldPassword != null) {
            if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
                throw new BadRequestException("Old password does not match");
            }
        }
        
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Admin password changed successfully"));
    }

    @PutMapping("/payment-settings")
    public ResponseEntity<PaymentSettings> updatePaymentSettings(@RequestBody PaymentSettingsDto request) {
        PaymentSettings settings = paymentSettingsRepository.findById(1L)
                .orElseGet(() -> PaymentSettings.builder().id(1L).build());
        settings.setUpiId(request.getUpiId());
        settings.setQrCodeUrl(request.getQrCodeUrl());
        PaymentSettings saved = paymentSettingsRepository.save(settings);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/app-config")
    public ResponseEntity<Map<String, String>> getAllConfigs() {
        Map<String, String> configs = new HashMap<>();
        appConfigRepository.findAll().forEach(c -> configs.put(c.getConfigKey(), c.getConfigValue()));
        return ResponseEntity.ok(configs);
    }

    @PutMapping("/app-config/{key}")
    public ResponseEntity<AppConfig> updateConfig(@PathVariable String key, @RequestBody Map<String, String> request) {
        String value = request.get("value");
        AppConfig config = appConfigRepository.findByConfigKey(key)
                .orElseGet(() -> {
                    AppConfig c = new AppConfig();
                    c.setConfigKey(key);
                    return c;
                });
        config.setConfigValue(value);
        return ResponseEntity.ok(appConfigRepository.save(config));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrdersForAdmin() {
        return ResponseEntity.ok(orderService.getAllOrderResponses());
    }

    @PostMapping("/orders/{id}/confirm")
    public ResponseEntity<MessageResponse> confirmOrder(@PathVariable Long id) {
        orderService.confirmOrder(id);
        return ResponseEntity.ok(new MessageResponse("Order payment confirmed, stock decremented."));
    }

    @PostMapping("/orders/{id}/reject")
    public ResponseEntity<MessageResponse> rejectOrder(@PathVariable Long id) {
        orderService.rejectOrder(id);
        return ResponseEntity.ok(new MessageResponse("Order payment rejected and cancelled."));
    }

    @PostMapping("/orders/{id}/status")
    public ResponseEntity<MessageResponse> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        if (newStatus == null || newStatus.trim().isEmpty()) {
            throw new BadRequestException("Status is required");
        }
        orderService.updateOrderStatus(id, newStatus.trim().toUpperCase());
        return ResponseEntity.ok(new MessageResponse("Order status updated to " + newStatus));
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsResponse> getDemandAnalytics() {
        List<GiftOrder> orders = orderService.getAllOrders();
        List<Gift> gifts = giftRepository.findAll();

        // 1. Top Demanded Goods (grouped by name, sorted descending)
        Map<String, Long> countMap = orders.stream()
                .collect(Collectors.groupingBy(GiftOrder::getGiftName, Collectors.counting()));

        List<Map<String, Object>> topDemand = countMap.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(entry -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", entry.getKey());
                    m.put("ordersCount", entry.getValue());
                    return m;
                })
                .collect(Collectors.toList());

        // 2. Less Demanded Goods (in catalog but with fewest orders, sorted ascending)
        List<Map<String, Object>> lowDemand = gifts.stream()
                .map(gift -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", gift.getName());
                    m.put("ordersCount", countMap.getOrDefault(gift.getName(), 0L));
                    return m;
                })
                .sorted((a, b) -> Long.compare((Long) a.get("ordersCount"), (Long) b.get("ordersCount")))
                .limit(10)
                .collect(Collectors.toList());

        // 3. Sales By Occasion
        Map<String, BigDecimal> salesByOccasion = new HashMap<>();
        salesByOccasion.put("Birthday", BigDecimal.ZERO);
        salesByOccasion.put("Anniversary", BigDecimal.ZERO);
        salesByOccasion.put("Corporate", BigDecimal.ZERO);
        salesByOccasion.put("Festival", BigDecimal.ZERO);
        salesByOccasion.put("Wedding", BigDecimal.ZERO);

        for (GiftOrder order : orders) {
            String occType = "Corporate"; // default
            if (order.getOccasion() != null && order.getOccasion().getType() != null) {
                occType = order.getOccasion().getType();
            }
            // Normalize occasion type
            String key = "Corporate";
            if (occType.toLowerCase().contains("birth")) key = "Birthday";
            else if (occType.toLowerCase().contains("anniv")) key = "Anniversary";
            else if (occType.toLowerCase().contains("fest")) key = "Festival";
            else if (occType.toLowerCase().contains("wed")) key = "Wedding";

            BigDecimal current = salesByOccasion.getOrDefault(key, BigDecimal.ZERO);
            salesByOccasion.put(key, current.add(order.getAmount()));
        }

        // 4. Sales By Item Category
        Map<String, BigDecimal> salesByItemCategory = new HashMap<>();
        salesByItemCategory.put("softtoy", BigDecimal.ZERO);
        salesByItemCategory.put("showpiece", BigDecimal.ZERO);
        salesByItemCategory.put("wallhanging", BigDecimal.ZERO);
        salesByItemCategory.put("Mug", BigDecimal.ZERO);

        Map<String, String> giftCategoryMap = gifts.stream()
                .collect(Collectors.toMap(Gift::getName, Gift::getCategory, (existing, replacing) -> existing));

        for (GiftOrder order : orders) {
            String cat = giftCategoryMap.getOrDefault(order.getGiftName(), "Other");
            String key = cat;
            if ("Soft Toys".equalsIgnoreCase(cat)) key = "softtoy";
            else if ("Showpieces".equalsIgnoreCase(cat)) key = "showpiece";
            else if ("Wallhangings".equalsIgnoreCase(cat)) key = "wallhanging";
            else if ("Mugs".equalsIgnoreCase(cat)) key = "Mug";

            BigDecimal current = salesByItemCategory.getOrDefault(key, BigDecimal.ZERO);
            salesByItemCategory.put(key, current.add(order.getAmount()));
        }

        AdminAnalyticsResponse response = AdminAnalyticsResponse.builder()
                .topDemand(topDemand)
                .lowDemand(lowDemand)
                .salesByOccasion(salesByOccasion)
                .salesByItemCategory(salesByItemCategory)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/demo-mode")
    public ResponseEntity<Map<String, Object>> setDemoMode(@RequestBody Map<String, Boolean> request) {
        boolean enabled = Boolean.TRUE.equals(request.get("enabled"));
        Map<String, Object> response = new HashMap<>();

        if (!enabled) {
            response.put("enabled", false);
            response.put("message", "Investor demo mode disabled. Existing catalog, users, orders, and feature settings were preserved.");
            return ResponseEntity.ok(response);
        }

        seedDemoCatalogIfNeeded();

        List<User> users = userRepository.findAll();
        for (User user : users) {
            user.setFeatureFlags(defaultFeatureFlags());
            user.setPremium(true);
            if (user.getMonthlyBudget() == null || user.getMonthlyBudget().compareTo(new BigDecimal("10000")) < 0) {
                user.setMonthlyBudget(new BigDecimal("10000"));
            }
        }
        userRepository.saveAll(users);

        List<Gift> gifts = giftRepository.findAll();
        for (Gift gift : gifts) {
            if (gift.getStock() == null || gift.getStock() < 20) {
                gift.setStock(20);
            }
            if (gift.getRating() == null || gift.getRating().compareTo(BigDecimal.ZERO) == 0) {
                gift.setRating(new BigDecimal("4.8"));
            }
            if (gift.getReviewCount() == null || gift.getReviewCount() < 25) {
                gift.setReviewCount(125);
            }
        }
        giftRepository.saveAll(gifts);

        response.put("enabled", true);
        response.put("usersUpdated", users.size());
        response.put("catalogItemsReady", gifts.size());
        response.put("message", "Investor demo mode enabled. All feature toggles are active and catalog inventory is presentation-ready.");
        return ResponseEntity.ok(response);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .timezone(user.getTimezone())
                .monthlyBudget(user.getMonthlyBudget())
                .premium(user.getPremium())
                .role(user.getRole())
                .featureFlags(user.getFeatureFlags())
                .build();
    }

    private Map<String, Boolean> defaultFeatureFlags() {
        Map<String, Boolean> flags = new HashMap<>();
        flags.put("aiAssistant", true);
        flags.put("budgetPlanner", true);
        flags.put("groupGifting", true);
        flags.put("secretSanta", true);
        flags.put("giftStories", true);
        flags.put("futureLocker", true);
        return flags;
    }

    private void seedDemoCatalogIfNeeded() {
        if (giftRepository.count() > 0) {
            return;
        }

        List<Gift> demoGifts = List.of(
                Gift.builder()
                        .name("Executive Crystal Desk Set")
                        .description("Premium crystal desk accessories packaged for executive milestone gifting.")
                        .category("Home & Living")
                        .subcategory("Executive")
                        .price(new BigDecimal("249.00"))
                        .imageUrl("https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&q=80&w=600")
                        .emotionTags("premium,gratitude,achievement,executive")
                        .rating(new BigDecimal("4.9"))
                        .reviewCount(180)
                        .stock(35)
                        .build(),
                Gift.builder()
                        .name("Luxury Wellness Hamper")
                        .description("Curated self-care collection with aromatherapy, tea, and handcrafted keepsakes.")
                        .category("Self Care")
                        .subcategory("Wellness")
                        .price(new BigDecimal("189.00"))
                        .imageUrl("https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600")
                        .emotionTags("relaxing,wellness,thoughtful,gratitude")
                        .rating(new BigDecimal("4.8"))
                        .reviewCount(220)
                        .stock(40)
                        .build(),
                Gift.builder()
                        .name("Artisan Brass Celebration Idol")
                        .description("Elegant handcrafted brass showpiece for festive, cultural, and corporate appreciation moments.")
                        .category("Traditional Gifts")
                        .subcategory("Showpiece")
                        .price(new BigDecimal("129.00"))
                        .imageUrl("https://images.unsplash.com/photo-1608744882201-52a7f7f3dd60?auto=format&fit=crop&q=80&w=600")
                        .emotionTags("traditional,festive,prestige,celebration")
                        .rating(new BigDecimal("4.9"))
                        .reviewCount(145)
                        .stock(32)
                        .build(),
                Gift.builder()
                        .name("Premium Gold-Rimmed Ceramic Mug")
                        .description("Hand-glazed matte coffee mug with a premium gold-plated rim and presentation box.")
                        .category("Mug")
                        .subcategory("Kitchenware")
                        .price(new BigDecimal("39.00"))
                        .imageUrl("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600")
                        .emotionTags("practical,elegant,modern,gratitude")
                        .rating(new BigDecimal("4.7"))
                        .reviewCount(160)
                        .stock(50)
                        .build()
        );

        giftRepository.saveAll(demoGifts);
    }
}
