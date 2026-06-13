package com.giftconcierge.controller;

import com.giftconcierge.dto.ContributeRequest;
import com.giftconcierge.dto.GroupGiftRequest;
import com.giftconcierge.dto.GroupGiftResponse;
import com.giftconcierge.security.UserPrincipal;
import com.giftconcierge.service.GroupGiftService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/group-gifts")
public class GroupGiftController {

    private final GroupGiftService groupGiftService;

    public GroupGiftController(GroupGiftService groupGiftService) {
        this.groupGiftService = groupGiftService;
    }

    @PostMapping
    public ResponseEntity<GroupGiftResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody GroupGiftRequest request) {
        GroupGiftResponse response = groupGiftService.create(principal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<GroupGiftResponse>> getMyGroupGifts(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(groupGiftService.getByOrganizer(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupGiftResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(groupGiftService.getById(id));
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<GroupGiftResponse> contribute(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "id") Long userId,
            @RequestBody ContributeRequest request) {
        return ResponseEntity.ok(groupGiftService.contribute(id, userId, request));
    }

    @GetMapping("/public/{shareLink}")
    public ResponseEntity<GroupGiftResponse> getByShareLink(@PathVariable String shareLink) {
        return ResponseEntity.ok(groupGiftService.getByShareLink(shareLink));
    }
}
