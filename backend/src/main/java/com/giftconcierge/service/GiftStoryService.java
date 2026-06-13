package com.giftconcierge.service;

import com.giftconcierge.dto.GiftStoryRequest;
import com.giftconcierge.dto.GiftStoryResponse;
import com.giftconcierge.exception.ResourceNotFoundException;
import com.giftconcierge.model.GiftOrder;
import com.giftconcierge.model.GiftStory;
import com.giftconcierge.repository.GiftOrderRepository;
import com.giftconcierge.repository.GiftStoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GiftStoryService {

    private final GiftStoryRepository giftStoryRepository;
    private final GiftOrderRepository giftOrderRepository;

    public GiftStoryService(GiftStoryRepository giftStoryRepository, GiftOrderRepository giftOrderRepository) {
        this.giftStoryRepository = giftStoryRepository;
        this.giftOrderRepository = giftOrderRepository;
    }

    @Transactional(readOnly = true)
    public List<GiftStoryResponse> getFeed() {
        return giftStoryRepository.findAllOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public GiftStoryResponse create(GiftStoryRequest request) {
        GiftOrder order = giftOrderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("GiftOrder", "id", request.getOrderId()));

        GiftStory story = GiftStory.builder()
                .order(order)
                .message(request.getMessage())
                .mediaUrl(request.getMediaUrl())
                .mediaType(request.getMediaType())
                .likesCount(0)
                .build();

        story = giftStoryRepository.save(story);
        return mapToResponse(story);
    }

    @Transactional
    public GiftStoryResponse like(Long storyId) {
        GiftStory story = giftStoryRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("GiftStory", "id", storyId));
        story.setLikesCount(story.getLikesCount() + 1);
        story = giftStoryRepository.save(story);
        return mapToResponse(story);
    }

    private GiftStoryResponse mapToResponse(GiftStory story) {
        return GiftStoryResponse.builder()
                .id(story.getId())
                .giftName(story.getOrder().getGiftName())
                .recipientName(story.getOrder().getRecipient().getName())
                .senderName(story.getOrder().getUser().getFullName())
                .message(story.getMessage())
                .mediaUrl(story.getMediaUrl())
                .mediaType(story.getMediaType())
                .likesCount(story.getLikesCount())
                .createdAt(story.getCreatedAt())
                .build();
    }
}
