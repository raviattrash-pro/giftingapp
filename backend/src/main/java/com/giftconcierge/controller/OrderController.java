package com.giftconcierge.controller;

import com.giftconcierge.dto.CheckoutRequest;
import com.giftconcierge.dto.OrderResponse;
import com.giftconcierge.model.GiftOrder;
import com.giftconcierge.security.UserPrincipal;
import com.giftconcierge.service.OrderService;
import com.giftconcierge.service.DeliveryService;
import com.giftconcierge.model.PaymentSettings;
import com.giftconcierge.repository.PaymentSettingsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final PaymentSettingsRepository paymentSettingsRepository;
    private final DeliveryService deliveryService;

    public OrderController(OrderService orderService, PaymentSettingsRepository paymentSettingsRepository, DeliveryService deliveryService) {
        this.orderService = orderService;
        this.paymentSettingsRepository = paymentSettingsRepository;
        this.deliveryService = deliveryService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> checkout(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(orderService.checkout(principal.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(orderService.getOrderResponses(principal.getId()));
    }

    @GetMapping("/delivery-quote")
    public ResponseEntity<Map<String, Object>> getDeliveryQuote(
            @RequestParam(required = false, defaultValue = "") String address,
            @RequestParam(required = false, defaultValue = "") String city,
            @RequestParam(required = false, defaultValue = "") String pincode,
            @RequestParam String scheduledTime,
            @RequestParam(required = false) Double orderValue) {
        LocalTime time = LocalTime.NOON;
        try {
            if (scheduledTime != null && !scheduledTime.trim().isEmpty()) {
                time = LocalTime.parse(scheduledTime.trim());
            }
        } catch (Exception e) {
            // fallback
        }
        return ResponseEntity.ok(deliveryService.getDeliveryQuotes(address, city, pincode, time, orderValue));
    }

    @GetMapping("/copy-logo-trigger")
    public ResponseEntity<Map<String, Object>> copyLogoTrigger() {
        try {
            java.io.File source = new java.io.File(System.getProperty("user.home"), "Downloads\\logo.jpeg");
            java.io.File dest = new java.io.File("d:\\corporategifting\\frontend\\public\\logo.jpg");
            if (source.exists()) {
                java.nio.file.Files.copy(source.toPath(), dest.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                return ResponseEntity.ok(Map.of("success", true, "message", "Logo copied successfully"));
            }
            return ResponseEntity.ok(Map.of("success", false, "message", "Source logo file not found"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/payment-settings")
    public ResponseEntity<PaymentSettings> getPaymentSettings() {
        PaymentSettings settings = paymentSettingsRepository.findById(1L)
                .orElseGet(() -> PaymentSettings.builder()
                        .id(1L)
                        .upiId("gifting@upi")
                        .qrCodeUrl("https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=400")
                        .build());
        return ResponseEntity.ok(settings);
    }
}
