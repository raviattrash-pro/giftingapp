package com.giftconcierge.service;

import com.giftconcierge.dto.OccasionRequest;
import com.giftconcierge.dto.OccasionResponse;
import com.giftconcierge.exception.ResourceNotFoundException;
import com.giftconcierge.model.Occasion;
import com.giftconcierge.model.Recipient;
import com.giftconcierge.model.User;
import com.giftconcierge.repository.OccasionRepository;
import com.giftconcierge.repository.RecipientRepository;
import com.giftconcierge.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OccasionService {

    private final OccasionRepository occasionRepository;
    private final RecipientRepository recipientRepository;
    private final UserRepository userRepository;

    public OccasionService(OccasionRepository occasionRepository, RecipientRepository recipientRepository, UserRepository userRepository) {
        this.occasionRepository = occasionRepository;
        this.recipientRepository = recipientRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<OccasionResponse> getAllByUser(Long userId) {
        return occasionRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OccasionResponse getById(Long id) {
        Occasion occasion = occasionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Occasion", "id", id));
        return mapToResponse(occasion);
    }

    @Transactional
    public OccasionResponse create(Long userId, OccasionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Recipient recipient = recipientRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient", "id", request.getRecipientId()));

        Occasion occasion = Occasion.builder()
                .user(user)
                .recipient(recipient)
                .type(request.getType())
                .customName(request.getCustomName())
                .eventDate(request.getEventDate())
                .isRecurring(request.getIsRecurring() != null ? request.getIsRecurring() : false)
                .recurrencePattern(request.getRecurrencePattern())
                .notes(request.getNotes())
                .autoGiftEnabled(request.getAutoGiftEnabled() != null ? request.getAutoGiftEnabled() : false)
                .autoGiftBudget(request.getAutoGiftBudget())
                .build();

        occasion = occasionRepository.save(occasion);
        return mapToResponse(occasion);
    }

    @Transactional
    public OccasionResponse update(Long id, OccasionRequest request) {
        Occasion occasion = occasionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Occasion", "id", id));

        if (request.getType() != null) occasion.setType(request.getType());
        if (request.getCustomName() != null) occasion.setCustomName(request.getCustomName());
        if (request.getEventDate() != null) occasion.setEventDate(request.getEventDate());
        if (request.getIsRecurring() != null) occasion.setIsRecurring(request.getIsRecurring());
        if (request.getRecurrencePattern() != null) occasion.setRecurrencePattern(request.getRecurrencePattern());
        if (request.getNotes() != null) occasion.setNotes(request.getNotes());
        if (request.getAutoGiftEnabled() != null) occasion.setAutoGiftEnabled(request.getAutoGiftEnabled());
        if (request.getAutoGiftBudget() != null) occasion.setAutoGiftBudget(request.getAutoGiftBudget());

        occasion = occasionRepository.save(occasion);
        return mapToResponse(occasion);
    }

    @Transactional
    public void delete(Long id) {
        if (!occasionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Occasion", "id", id);
        }
        occasionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<OccasionResponse> getUpcoming(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysLater = today.plusDays(30);
        return occasionRepository.findUpcomingByUserId(userId, today, thirtyDaysLater).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OccasionResponse> getCalendarData(Long userId, int month, int year) {
        return occasionRepository.findByUserIdAndMonthAndYear(userId, month, year).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private OccasionResponse mapToResponse(Occasion occasion) {
        long daysUntil = ChronoUnit.DAYS.between(LocalDate.now(), occasion.getEventDate());

        return OccasionResponse.builder()
                .id(occasion.getId())
                .recipientId(occasion.getRecipient().getId())
                .recipientName(occasion.getRecipient().getName())
                .type(occasion.getType())
                .customName(occasion.getCustomName())
                .eventDate(occasion.getEventDate())
                .isRecurring(occasion.getIsRecurring())
                .recurrencePattern(occasion.getRecurrencePattern())
                .notes(occasion.getNotes())
                .autoGiftEnabled(occasion.getAutoGiftEnabled())
                .autoGiftBudget(occasion.getAutoGiftBudget())
                .daysUntil(daysUntil)
                .build();
    }
}
