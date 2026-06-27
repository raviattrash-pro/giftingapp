package com.giftconcierge.service;

import com.giftconcierge.dto.RecipientRequest;
import com.giftconcierge.dto.RecipientResponse;
import com.giftconcierge.exception.ResourceNotFoundException;
import com.giftconcierge.model.GiftHistory;
import com.giftconcierge.model.Recipient;
import com.giftconcierge.model.RelationshipScore;
import com.giftconcierge.model.User;
import com.giftconcierge.repository.GiftHistoryRepository;
import com.giftconcierge.repository.RecipientRepository;
import com.giftconcierge.repository.RelationshipScoreRepository;
import com.giftconcierge.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipientService {

    private final RecipientRepository recipientRepository;
    private final UserRepository userRepository;
    private final RelationshipScoreRepository relationshipScoreRepository;
    private final GiftHistoryRepository giftHistoryRepository;

    public RecipientService(RecipientRepository recipientRepository, UserRepository userRepository, RelationshipScoreRepository relationshipScoreRepository, GiftHistoryRepository giftHistoryRepository) {
        this.recipientRepository = recipientRepository;
        this.userRepository = userRepository;
        this.relationshipScoreRepository = relationshipScoreRepository;
        this.giftHistoryRepository = giftHistoryRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "recipients", key = "#userId")
    public List<RecipientResponse> getAllByUser(Long userId) {
        return recipientRepository.findByUserId(userId).stream()
                .map(r -> mapToResponse(r, userId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RecipientResponse getById(Long id, Long userId) {
        Recipient recipient = recipientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient", "id", id));
        return mapToResponse(recipient, userId);
    }

    @Transactional
    @CacheEvict(value = "recipients", key = "#userId")
    public RecipientResponse create(Long userId, RecipientRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Recipient recipient = Recipient.builder()
                .user(user)
                .name(request.getName())
                .birthday(request.getBirthday())
                .anniversary(request.getAnniversary())
                .relationship(request.getRelationship())
                .gender(request.getGender())
                .age(request.getAge())
                .interests(request.getInterests())
                .favoriteBrands(request.getFavoriteBrands())
                .hobbies(request.getHobbies())
                .clothingSize(request.getClothingSize())
                .preferredColors(request.getPreferredColors())
                .allergies(request.getAllergies())
                .notes(request.getNotes())
                .avatarUrl(request.getAvatarUrl())
                .build();

        recipient = recipientRepository.save(recipient);

        // Initialize relationship score
        RelationshipScore score = RelationshipScore.builder()
                .user(user)
                .recipient(recipient)
                .score(50)
                .giftingFrequencyScore(50)
                .eventParticipationScore(50)
                .interactionScore(50)
                .lastCalculated(LocalDateTime.now())
                .build();
        relationshipScoreRepository.save(score);

        return mapToResponse(recipient, userId);
    }

    @Transactional
    @CacheEvict(value = "recipients", key = "#userId")
    public RecipientResponse update(Long id, Long userId, RecipientRequest request) {
        Recipient recipient = recipientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient", "id", id));

        if (request.getName() != null) recipient.setName(request.getName());
        if (request.getBirthday() != null) recipient.setBirthday(request.getBirthday());
        if (request.getAnniversary() != null) recipient.setAnniversary(request.getAnniversary());
        if (request.getRelationship() != null) recipient.setRelationship(request.getRelationship());
        if (request.getGender() != null) recipient.setGender(request.getGender());
        if (request.getAge() != null) recipient.setAge(request.getAge());
        if (request.getInterests() != null) recipient.setInterests(request.getInterests());
        if (request.getFavoriteBrands() != null) recipient.setFavoriteBrands(request.getFavoriteBrands());
        if (request.getHobbies() != null) recipient.setHobbies(request.getHobbies());
        if (request.getClothingSize() != null) recipient.setClothingSize(request.getClothingSize());
        if (request.getPreferredColors() != null) recipient.setPreferredColors(request.getPreferredColors());
        if (request.getAllergies() != null) recipient.setAllergies(request.getAllergies());
        if (request.getNotes() != null) recipient.setNotes(request.getNotes());
        if (request.getAvatarUrl() != null) recipient.setAvatarUrl(request.getAvatarUrl());

        recipient = recipientRepository.save(recipient);
        return mapToResponse(recipient, userId);
    }

    @Transactional
    @CacheEvict(value = "recipients", allEntries = true)
    public void delete(Long id) {
        if (!recipientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Recipient", "id", id);
        }
        recipientRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<RecipientResponse> search(Long userId, String query) {
        return recipientRepository.searchByName(userId, query).stream()
                .map(r -> mapToResponse(r, userId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GiftHistory> getGiftHistory(Long userId, Long recipientId) {
        return giftHistoryRepository.findByUserIdAndRecipientId(userId, recipientId);
    }

    @Transactional(readOnly = true)
    public RelationshipScore getRelationshipScore(Long userId, Long recipientId) {
        return relationshipScoreRepository.findByUserIdAndRecipientId(userId, recipientId)
                .orElse(RelationshipScore.builder().score(50).build());
    }

    private RecipientResponse mapToResponse(Recipient recipient, Long userId) {
        Integer score = relationshipScoreRepository
                .findByUserIdAndRecipientId(userId, recipient.getId())
                .map(RelationshipScore::getScore)
                .orElse(50);

        return RecipientResponse.builder()
                .id(recipient.getId())
                .name(recipient.getName())
                .birthday(recipient.getBirthday())
                .anniversary(recipient.getAnniversary())
                .relationship(recipient.getRelationship())
                .gender(recipient.getGender())
                .age(recipient.getAge())
                .interests(recipient.getInterests())
                .favoriteBrands(recipient.getFavoriteBrands())
                .hobbies(recipient.getHobbies())
                .clothingSize(recipient.getClothingSize())
                .preferredColors(recipient.getPreferredColors())
                .allergies(recipient.getAllergies())
                .notes(recipient.getNotes())
                .avatarUrl(recipient.getAvatarUrl())
                .relationshipScore(score)
                .createdAt(recipient.getCreatedAt())
                .build();
    }
}
