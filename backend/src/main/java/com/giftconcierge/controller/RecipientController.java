package com.giftconcierge.controller;

import com.giftconcierge.dto.RecipientRequest;
import com.giftconcierge.dto.RecipientResponse;
import com.giftconcierge.model.GiftHistory;
import com.giftconcierge.model.RelationshipScore;
import com.giftconcierge.security.UserPrincipal;
import com.giftconcierge.service.RecipientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipients")
public class RecipientController {

    private final RecipientService recipientService;

    public RecipientController(RecipientService recipientService) {
        this.recipientService = recipientService;
    }

    @GetMapping
    public ResponseEntity<List<RecipientResponse>> getAll(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(recipientService.getAllByUser(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipientResponse> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(recipientService.getById(id, principal.getId()));
    }

    @PostMapping
    public ResponseEntity<RecipientResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody RecipientRequest request) {
        RecipientResponse response = recipientService.create(principal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipientResponse> update(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody RecipientRequest request) {
        return ResponseEntity.ok(recipientService.update(id, principal.getId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recipientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<RecipientResponse>> search(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String query) {
        return ResponseEntity.ok(recipientService.search(principal.getId(), query));
    }

    @GetMapping("/{id}/gift-history")
    public ResponseEntity<List<GiftHistory>> getGiftHistory(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(recipientService.getGiftHistory(principal.getId(), id));
    }

    @GetMapping("/{id}/score")
    public ResponseEntity<RelationshipScore> getRelationshipScore(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(recipientService.getRelationshipScore(principal.getId(), id));
    }
}
