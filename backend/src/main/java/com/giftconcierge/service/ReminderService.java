package com.giftconcierge.service;

import com.giftconcierge.dto.ReminderRequest;
import com.giftconcierge.dto.ReminderResponse;
import com.giftconcierge.exception.ResourceNotFoundException;
import com.giftconcierge.model.Occasion;
import com.giftconcierge.model.Reminder;
import com.giftconcierge.model.User;
import com.giftconcierge.repository.OccasionRepository;
import com.giftconcierge.repository.ReminderRepository;
import com.giftconcierge.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final OccasionRepository occasionRepository;
    private final UserRepository userRepository;

    public ReminderService(ReminderRepository reminderRepository, OccasionRepository occasionRepository, UserRepository userRepository) {
        this.reminderRepository = reminderRepository;
        this.occasionRepository = occasionRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ReminderResponse> getByUser(Long userId) {
        return reminderRepository.findByUserIdAndIsSentFalse(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReminderResponse> getSmartReminders(Long userId) {
        return reminderRepository.findByUserIdAndIsSmartTrue(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReminderResponse create(Long userId, ReminderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Occasion occasion = occasionRepository.findById(request.getOccasionId())
                .orElseThrow(() -> new ResourceNotFoundException("Occasion", "id", request.getOccasionId()));

        LocalDateTime sendAt = occasion.getEventDate()
                .minusDays(request.getDaysBefore() != null ? request.getDaysBefore() : 7)
                .atStartOfDay();

        Reminder reminder = Reminder.builder()
                .user(user)
                .occasion(occasion)
                .type(request.getType() != null ? request.getType() : "EMAIL")
                .daysBefore(request.getDaysBefore() != null ? request.getDaysBefore() : 7)
                .message(request.getMessage())
                .isSmart(request.getIsSmart() != null ? request.getIsSmart() : false)
                .isSent(false)
                .sendAt(sendAt)
                .build();

        reminder = reminderRepository.save(reminder);
        return mapToResponse(reminder);
    }

    @Transactional
    public void dismiss(Long reminderId) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", reminderId));
        reminder.setIsSent(true);
        reminderRepository.save(reminder);
    }

    private ReminderResponse mapToResponse(Reminder reminder) {
        return ReminderResponse.builder()
                .id(reminder.getId())
                .occasionId(reminder.getOccasion().getId())
                .occasionType(reminder.getOccasion().getType())
                .recipientName(reminder.getOccasion().getRecipient().getName())
                .type(reminder.getType())
                .daysBefore(reminder.getDaysBefore())
                .message(reminder.getMessage())
                .isSmart(reminder.getIsSmart())
                .isSent(reminder.getIsSent())
                .sendAt(reminder.getSendAt())
                .build();
    }
}
