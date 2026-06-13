package com.giftconcierge.controller;

import com.giftconcierge.model.Gift;
import com.giftconcierge.service.GiftService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/gifts")
public class GiftController {

    private final GiftService giftService;

    public GiftController(GiftService giftService) {
        this.giftService = giftService;
    }

    @GetMapping
    public ResponseEntity<List<Gift>> browse(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        if (category != null) {
            return ResponseEntity.ok(giftService.getByCategory(category));
        }
        if (minPrice != null && maxPrice != null) {
            return ResponseEntity.ok(giftService.getByPriceRange(minPrice, maxPrice));
        }
        return ResponseEntity.ok(giftService.getAllGifts());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Gift>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal budget,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String emotion) {
        return ResponseEntity.ok(giftService.searchCatalog(keyword, category, budget != null ? budget : maxPrice, emotion));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gift> getById(@PathVariable Long id) {
        return ResponseEntity.ok(giftService.getById(id));
    }

    @GetMapping("/emergency")
    public ResponseEntity<List<Gift>> getEmergencyGifts() {
        return ResponseEntity.ok(giftService.getEmergencyGifts());
    }

    @GetMapping("/emotions")
    public ResponseEntity<List<Gift>> getByEmotion(@RequestParam String tag) {
        return ResponseEntity.ok(giftService.getByEmotionTag(tag));
    }
}
