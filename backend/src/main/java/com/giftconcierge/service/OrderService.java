package com.giftconcierge.service;

import com.giftconcierge.dto.CheckoutRequest;
import com.giftconcierge.dto.CartItemDto;
import com.giftconcierge.dto.OrderResponse;
import com.giftconcierge.model.Gift;
import com.giftconcierge.model.GiftOrder;
import com.giftconcierge.model.User;
import com.giftconcierge.model.Recipient;
import com.giftconcierge.model.Occasion;
import com.giftconcierge.repository.UserRepository;
import com.giftconcierge.repository.RecipientRepository;
import com.giftconcierge.repository.OccasionRepository;
import com.giftconcierge.repository.GiftOrderRepository;
import com.giftconcierge.repository.GiftRepository;
import com.giftconcierge.exception.ResourceNotFoundException;
import com.giftconcierge.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final UserRepository userRepository;
    private final RecipientRepository recipientRepository;
    private final OccasionRepository occasionRepository;
    private final GiftOrderRepository giftOrderRepository;
    private final GiftRepository giftRepository;
    private final DeliveryService deliveryService;
    private final NotificationService notificationService;

    public OrderService(UserRepository userRepository, RecipientRepository recipientRepository, OccasionRepository occasionRepository, GiftOrderRepository giftOrderRepository, GiftRepository giftRepository, DeliveryService deliveryService, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.recipientRepository = recipientRepository;
        this.occasionRepository = occasionRepository;
        this.giftOrderRepository = giftOrderRepository;
        this.giftRepository = giftRepository;
        this.deliveryService = deliveryService;
        this.notificationService = notificationService;
    }

    @Transactional
    public Map<String, Object> checkout(Long userId, CheckoutRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        String firstOrderIdStr = "";
        
        for (CartItemDto item : request.getItems()) {
            int quantity = item.getQuantity() != null ? item.getQuantity() : 1;
            if (quantity <= 0) {
                throw new BadRequestException("Quantity must be greater than zero");
            }

            // Resolve or create recipient
            Recipient recipient;
            if (item.getRecipientId() != null) {
                recipient = recipientRepository.findById(item.getRecipientId()).orElse(null);
            } else {
                recipient = null;
            }

            // If no recipient was resolved, create one from the checkout form data
            if (recipient == null) {
                String rName = request.getRecipientName();
                if (rName == null || rName.trim().isEmpty()) {
                    rName = "Gift Recipient";
                }
                recipient = Recipient.builder()
                        .user(user)
                        .name(rName)
                        .relationship("Gift Recipient")
                        .build();
                recipient = recipientRepository.save(recipient);
            }

            Occasion occasion = null;
            if (item.getOccasionId() != null) {
                occasion = occasionRepository.findById(item.getOccasionId()).orElse(null);
            }

            Gift gift = resolveGift(item);
            int currentStock = gift.getStock() != null ? gift.getStock() : 0;
            if (currentStock < quantity) {
                throw new BadRequestException("Insufficient stock for " + gift.getName() + ". Available: " + currentStock);
            }

            GiftOrder order = GiftOrder.builder()
                    .user(user)
                    .recipient(recipient)
                    .occasion(occasion)
                    .giftName(gift.getName())
                    .giftDescription(gift.getDescription())
                    .amount(gift.getPrice().multiply(BigDecimal.valueOf(quantity)))
                    .quantity(quantity)
                    .status("PENDING_VERIFICATION")
                    .deliveryType(request.getCourierType())
                    .deliveryAddress(request.getFullAddress())
                    .personalMessage(request.getPersonalMessage() != null ? request.getPersonalMessage() : "")
                    .transactionId(request.getTransactionId())
                    .paymentScreenshot(request.getPaymentScreenshot())
                    .scheduledDate(request.getScheduledDate())
                    .scheduledTime(request.getScheduledTime())
                    .deliveryService(request.getDeliveryService())
                    .deliveryCharge(request.getDeliveryCharge())
                    .adminDeliveryCharge(request.getAdminDeliveryCharge())
                    .build();

            order = giftOrderRepository.save(order);
            if (firstOrderIdStr.isEmpty()) {
                firstOrderIdStr = "ord_" + order.getId();
            }
            
            // Trigger notifications asynchronously
            notificationService.sendOrderConfirmation(order, user);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", firstOrderIdStr);
        response.put("success", true);
        return response;
    }

    @Transactional(readOnly = true)
    public List<GiftOrder> getOrders(Long userId) {
        return giftOrderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrderResponses(Long userId) {
        return giftOrderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GiftOrder> getAllOrders() {
        return giftOrderRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrderResponses() {
        return giftOrderRepository.findAll().stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    @Transactional
    public void confirmOrder(Long orderId) {
        GiftOrder order = giftOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("GiftOrder", "id", orderId));

        if (!"PENDING_VERIFICATION".equals(order.getStatus())) {
            throw new BadRequestException("Order is not in PENDING_VERIFICATION status");
        }

        // Trigger automatic Porter/Rapido delivery booking
        if (order.getDeliveryService() != null && !order.getDeliveryService().trim().isEmpty() &&
                ("PORTER".equalsIgnoreCase(order.getDeliveryService()) || "RAPIDO".equalsIgnoreCase(order.getDeliveryService()))) {
            try {
                Map<String, String> booking = deliveryService.bookDelivery(order);
                order.setTrackingId(booking.get("trackingId"));
                order.setDeliveryService(booking.get("service"));
                // Automatically transition confirmed & booked order to SHIPPED status!
                order.setStatus("SHIPPED");
                log.info("Automatically booked delivery via {} for Order #{}. Tracking ID: {}", 
                        booking.get("service"), order.getId(), booking.get("trackingId"));
            } catch (Exception e) {
                log.error("Failed to automatically book delivery via Porter/Rapido API", e);
                order.setStatus("CONFIRMED");
            }
        } else {
            order.setStatus("CONFIRMED");
        }
        giftOrderRepository.save(order);

        // Decrement stock for the gift
        Optional<Gift> giftOpt = giftRepository.findByName(order.getGiftName());
        if (giftOpt.isPresent()) {
            Gift gift = giftOpt.get();
            int quantity = order.getQuantity() != null ? order.getQuantity() : 1;
            int currentStock = gift.getStock() != null ? gift.getStock() : 0;
            if (currentStock < quantity) {
                throw new BadRequestException("Insufficient stock for " + gift.getName() + ". Available: " + currentStock);
            }
            gift.setStock(currentStock - quantity);
            giftRepository.save(gift);
            log.info("Decremented stock for gift '{}'. New stock: {}", gift.getName(), gift.getStock());
        }
    }

    @Transactional
    public void rejectOrder(Long orderId) {
        GiftOrder order = giftOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("GiftOrder", "id", orderId));

        if (!"PENDING_VERIFICATION".equals(order.getStatus())) {
            throw new BadRequestException("Order is not in PENDING_VERIFICATION status");
        }

        order.setStatus("REJECTED");
        giftOrderRepository.save(order);
    }

    @Transactional
    public void updateOrderStatus(Long orderId, String newStatus) {
        GiftOrder order = giftOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("GiftOrder", "id", orderId));

        // Validate allowed transitions
        String current = order.getStatus();
        boolean valid = false;
        switch (newStatus) {
            case "SHIPPED":
                valid = "CONFIRMED".equals(current);
                break;
            case "IN_TRANSIT":
                valid = "SHIPPED".equals(current);
                break;
            case "OUT_FOR_DELIVERY":
                valid = "IN_TRANSIT".equals(current);
                break;
            case "DELIVERED":
                valid = "OUT_FOR_DELIVERY".equals(current);
                break;
            default:
                throw new BadRequestException("Invalid status: " + newStatus);
        }

        if (!valid) {
            throw new BadRequestException("Cannot transition from " + current + " to " + newStatus);
        }

        order.setStatus(newStatus);
        giftOrderRepository.save(order);
        log.info("Order {} status updated: {} -> {}", orderId, current, newStatus);
    }

    private Gift resolveGift(CartItemDto item) {
        if (item.getGift() == null) {
            throw new BadRequestException("Cart item gift is required");
        }

        if (item.getGift().getId() != null) {
            return giftRepository.findById(item.getGift().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Gift", "id", item.getGift().getId()));
        }

        return giftRepository.findByName(item.getGift().getName())
                .orElseThrow(() -> new ResourceNotFoundException("Gift", "name", item.getGift().getName()));
    }

    private OrderResponse mapToOrderResponse(GiftOrder order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setGiftName(order.getGiftName());
        response.setGiftDescription(order.getGiftDescription());
        response.setAmount(order.getAmount());
        response.setQuantity(order.getQuantity());
        response.setStatus(order.getStatus());
        response.setScheduledDate(order.getScheduledDate());
        response.setScheduledTime(order.getScheduledTime());
        response.setDeliveryService(order.getDeliveryService());
        response.setDeliveryCharge(order.getDeliveryCharge());
        response.setPersonalMessage(order.getPersonalMessage());
        response.setIsAnonymous(order.getIsAnonymous());
        response.setDeliveryType(order.getDeliveryType());
        response.setTrackingId(order.getTrackingId());
        response.setTransactionId(order.getTransactionId());
        response.setPaymentScreenshot(order.getPaymentScreenshot());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setCreatedAt(order.getCreatedAt());

        if (order.getUser() != null) {
            response.setUser(new OrderResponse.SimpleUser(
                    order.getUser().getId(),
                    order.getUser().getEmail(),
                    order.getUser().getFullName()
            ));
        }

        if (order.getRecipient() != null) {
            response.setRecipient(new OrderResponse.SimpleRecipient(
                    order.getRecipient().getId(),
                    order.getRecipient().getName(),
                    order.getRecipient().getRelationship()
            ));
        }

        return response;
    }
}
