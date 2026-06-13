package com.giftconcierge.controller;

import com.giftconcierge.dto.WishlistRequest;
import com.giftconcierge.dto.WishlistResponse;
import com.giftconcierge.security.UserPrincipal;
import com.giftconcierge.service.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlists")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<List<WishlistResponse>> getAll(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(wishlistService.getAllByUser(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WishlistResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(wishlistService.getById(id));
    }

    @PostMapping
    public ResponseEntity<WishlistResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody WishlistRequest request) {
        WishlistResponse response = wishlistService.create(principal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WishlistResponse> update(
            @PathVariable Long id,
            @RequestBody WishlistRequest request) {
        return ResponseEntity.ok(wishlistService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        wishlistService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/public/{shareCode}")
    public ResponseEntity<WishlistResponse> getByShareCode(@PathVariable String shareCode) {
        return ResponseEntity.ok(wishlistService.getByShareCode(shareCode));
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<WishlistResponse> addItem(
            @PathVariable Long id,
            @RequestBody WishlistRequest.WishlistItemRequest itemRequest) {
        return ResponseEntity.ok(wishlistService.addItem(id, itemRequest));
    }

    @PutMapping("/{id}/items/{itemId}/purchase")
    public ResponseEntity<WishlistResponse> purchaseItem(
            @PathVariable Long id,
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(wishlistService.markItemPurchased(id, itemId, principal.getId()));
    }
}
