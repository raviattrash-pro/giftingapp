package com.giftconcierge.service;

import com.giftconcierge.dto.WishlistRequest;
import com.giftconcierge.dto.WishlistResponse;
import com.giftconcierge.exception.ResourceNotFoundException;
import com.giftconcierge.model.User;
import com.giftconcierge.model.Wishlist;
import com.giftconcierge.model.WishlistItem;
import com.giftconcierge.repository.UserRepository;
import com.giftconcierge.repository.WishlistItemRepository;
import com.giftconcierge.repository.WishlistRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;

    public WishlistService(WishlistRepository wishlistRepository, WishlistItemRepository wishlistItemRepository, UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<WishlistResponse> getAllByUser(Long userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WishlistResponse getById(Long id) {
        Wishlist wishlist = wishlistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist", "id", id));
        return mapToResponse(wishlist);
    }

    @Transactional(readOnly = true)
    public WishlistResponse getByShareCode(String shareCode) {
        Wishlist wishlist = wishlistRepository.findByShareCode(shareCode)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist", "shareCode", shareCode));
        return mapToResponse(wishlist);
    }

    @Transactional
    public WishlistResponse create(Long userId, WishlistRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String shareCode = Boolean.TRUE.equals(request.getIsPublic()) ? generateShareCode() : null;

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .name(request.getName())
                .type(request.getType())
                .isPublic(request.getIsPublic() != null ? request.getIsPublic() : false)
                .shareCode(shareCode)
                .items(new ArrayList<>())
                .build();

        wishlist = wishlistRepository.save(wishlist);

        if (request.getItems() != null) {
            for (WishlistRequest.WishlistItemRequest itemReq : request.getItems()) {
                WishlistItem item = WishlistItem.builder()
                        .wishlist(wishlist)
                        .name(itemReq.getName())
                        .description(itemReq.getDescription())
                        .url(itemReq.getUrl())
                        .price(itemReq.getPrice())
                        .imageUrl(itemReq.getImageUrl())
                        .isPurchased(false)
                        .build();
                wishlistItemRepository.save(item);
            }
        }

        return mapToResponse(wishlistRepository.findById(wishlist.getId()).get());
    }

    @Transactional
    public WishlistResponse update(Long id, WishlistRequest request) {
        Wishlist wishlist = wishlistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist", "id", id));

        if (request.getName() != null) wishlist.setName(request.getName());
        if (request.getType() != null) wishlist.setType(request.getType());
        if (request.getIsPublic() != null) {
            wishlist.setIsPublic(request.getIsPublic());
            if (Boolean.TRUE.equals(request.getIsPublic()) && wishlist.getShareCode() == null) {
                wishlist.setShareCode(generateShareCode());
            }
        }

        wishlist = wishlistRepository.save(wishlist);
        return mapToResponse(wishlist);
    }

    @Transactional
    public void delete(Long id) {
        if (!wishlistRepository.existsById(id)) {
            throw new ResourceNotFoundException("Wishlist", "id", id);
        }
        wishlistRepository.deleteById(id);
    }

    @Transactional
    public WishlistResponse addItem(Long wishlistId, WishlistRequest.WishlistItemRequest itemRequest) {
        Wishlist wishlist = wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist", "id", wishlistId));

        WishlistItem item = WishlistItem.builder()
                .wishlist(wishlist)
                .name(itemRequest.getName())
                .description(itemRequest.getDescription())
                .url(itemRequest.getUrl())
                .price(itemRequest.getPrice())
                .imageUrl(itemRequest.getImageUrl())
                .isPurchased(false)
                .build();
        wishlistItemRepository.save(item);

        return mapToResponse(wishlistRepository.findById(wishlistId).get());
    }

    @Transactional
    public WishlistResponse markItemPurchased(Long wishlistId, Long itemId, Long purchasedByUserId) {
        WishlistItem item = wishlistItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("WishlistItem", "id", itemId));

        User purchaser = userRepository.findById(purchasedByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", purchasedByUserId));

        item.setIsPurchased(true);
        item.setPurchasedBy(purchaser);
        wishlistItemRepository.save(item);

        return mapToResponse(wishlistRepository.findById(wishlistId).get());
    }

    private String generateShareCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private WishlistResponse mapToResponse(Wishlist wishlist) {
        List<WishlistResponse.WishlistItemResponse> items = wishlist.getItems().stream()
                .map(item -> WishlistResponse.WishlistItemResponse.builder()
                        .id(item.getId())
                        .name(item.getName())
                        .description(item.getDescription())
                        .url(item.getUrl())
                        .price(item.getPrice())
                        .imageUrl(item.getImageUrl())
                        .isPurchased(item.getIsPurchased())
                        .build())
                .collect(Collectors.toList());

        return WishlistResponse.builder()
                .id(wishlist.getId())
                .name(wishlist.getName())
                .type(wishlist.getType())
                .isPublic(wishlist.getIsPublic())
                .shareCode(wishlist.getShareCode())
                .createdAt(wishlist.getCreatedAt())
                .items(items)
                .build();
    }
}
