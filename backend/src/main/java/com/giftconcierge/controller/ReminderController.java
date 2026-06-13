package com.giftconcierge.controller;

import com.giftconcierge.dto.ReminderRequest;
import com.giftconcierge.dto.ReminderResponse;
import com.giftconcierge.security.UserPrincipal;
import com.giftconcierge.service.ReminderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @GetMapping
    public ResponseEntity<List<ReminderResponse>> getReminders(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(reminderService.getByUser(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<ReminderResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody ReminderRequest request) {
        ReminderResponse response = reminderService.create(principal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/dismiss")
    public ResponseEntity<Void> dismiss(@PathVariable Long id) {
        reminderService.dismiss(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/smart")
    public ResponseEntity<List<ReminderResponse>> getSmartReminders(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(reminderService.getSmartReminders(principal.getId()));
    }
}
