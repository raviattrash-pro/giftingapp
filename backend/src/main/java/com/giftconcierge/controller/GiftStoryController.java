package com.giftconcierge.controller;

import com.giftconcierge.dto.GiftStoryRequest;
import com.giftconcierge.dto.GiftStoryResponse;
import com.giftconcierge.service.GiftStoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
public class GiftStoryController {

    private final GiftStoryService giftStoryService;

    public GiftStoryController(GiftStoryService giftStoryService) {
        this.giftStoryService = giftStoryService;
    }

    @GetMapping("/feed")
    public ResponseEntity<List<GiftStoryResponse>> getFeed() {
        return ResponseEntity.ok(giftStoryService.getFeed());
    }

    @PostMapping
    public ResponseEntity<GiftStoryResponse> create(@RequestBody GiftStoryRequest request) {
        GiftStoryResponse response = giftStoryService.create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<GiftStoryResponse> like(@PathVariable Long id) {
        return ResponseEntity.ok(giftStoryService.like(id));
    }
}
