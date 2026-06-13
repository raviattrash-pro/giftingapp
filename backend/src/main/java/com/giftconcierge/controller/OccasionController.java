package com.giftconcierge.controller;

import com.giftconcierge.dto.OccasionRequest;
import com.giftconcierge.dto.OccasionResponse;
import com.giftconcierge.security.UserPrincipal;
import com.giftconcierge.service.OccasionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/occasions")
public class OccasionController {

    private final OccasionService occasionService;

    public OccasionController(OccasionService occasionService) {
        this.occasionService = occasionService;
    }

    @GetMapping
    public ResponseEntity<List<OccasionResponse>> getAll(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(occasionService.getAllByUser(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OccasionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(occasionService.getById(id));
    }

    @PostMapping
    public ResponseEntity<OccasionResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody OccasionRequest request) {
        OccasionResponse response = occasionService.create(principal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OccasionResponse> update(
            @PathVariable Long id,
            @RequestBody OccasionRequest request) {
        return ResponseEntity.ok(occasionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        occasionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<OccasionResponse>> getUpcoming(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(occasionService.getUpcoming(principal.getId()));
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<OccasionResponse>> getCalendar(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(occasionService.getCalendarData(principal.getId(), month, year));
    }
}
