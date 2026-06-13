package com.giftconcierge.service;

import com.giftconcierge.dto.ContributeRequest;
import com.giftconcierge.dto.GroupGiftRequest;
import com.giftconcierge.dto.GroupGiftResponse;
import com.giftconcierge.exception.BadRequestException;
import com.giftconcierge.exception.ResourceNotFoundException;
import com.giftconcierge.model.GroupGift;
import com.giftconcierge.model.GroupGiftContribution;
import com.giftconcierge.model.Recipient;
import com.giftconcierge.model.User;
import com.giftconcierge.repository.GroupGiftContributionRepository;
import com.giftconcierge.repository.GroupGiftRepository;
import com.giftconcierge.repository.RecipientRepository;
import com.giftconcierge.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GroupGiftService {

    private final GroupGiftRepository groupGiftRepository;
    private final GroupGiftContributionRepository contributionRepository;
    private final RecipientRepository recipientRepository;
    private final UserRepository userRepository;

    public GroupGiftService(GroupGiftRepository groupGiftRepository, GroupGiftContributionRepository contributionRepository, RecipientRepository recipientRepository, UserRepository userRepository) {
        this.groupGiftRepository = groupGiftRepository;
        this.contributionRepository = contributionRepository;
        this.recipientRepository = recipientRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<GroupGiftResponse> getByOrganizer(Long organizerId) {
        return groupGiftRepository.findByOrganizerId(organizerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GroupGiftResponse getById(Long id) {
        GroupGift gift = groupGiftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GroupGift", "id", id));
        return mapToResponse(gift);
    }

    @Transactional(readOnly = true)
    public GroupGiftResponse getByShareLink(String shareLink) {
        GroupGift gift = groupGiftRepository.findByShareLink(shareLink)
                .orElseThrow(() -> new ResourceNotFoundException("GroupGift", "shareLink", shareLink));
        return mapToResponse(gift);
    }

    @Transactional
    public GroupGiftResponse create(Long organizerId, GroupGiftRequest request) {
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", organizerId));
        Recipient recipient = recipientRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient", "id", request.getRecipientId()));

        GroupGift groupGift = GroupGift.builder()
                .organizer(organizer)
                .recipient(recipient)
                .title(request.getTitle())
                .description(request.getDescription())
                .targetAmount(request.getTargetAmount())
                .collectedAmount(BigDecimal.ZERO)
                .status("ACTIVE")
                .shareLink(UUID.randomUUID().toString().substring(0, 12))
                .deadline(request.getDeadline())
                .build();

        groupGift = groupGiftRepository.save(groupGift);
        return mapToResponse(groupGift);
    }

    @Transactional
    public GroupGiftResponse contribute(Long groupGiftId, Long userId, ContributeRequest request) {
        GroupGift groupGift = groupGiftRepository.findById(groupGiftId)
                .orElseThrow(() -> new ResourceNotFoundException("GroupGift", "id", groupGiftId));

        if (!"ACTIVE".equals(groupGift.getStatus())) {
            throw new BadRequestException("This group gift is no longer accepting contributions");
        }

        User contributor = userId != null ? userRepository.findById(userId).orElse(null) : null;

        GroupGiftContribution contribution = GroupGiftContribution.builder()
                .groupGift(groupGift)
                .contributor(contributor)
                .contributorName(request.getContributorName())
                .amount(request.getAmount())
                .message(request.getMessage())
                .paymentStatus("COMPLETED")
                .build();
        contributionRepository.save(contribution);

        groupGift.setCollectedAmount(groupGift.getCollectedAmount().add(request.getAmount()));
        if (groupGift.getCollectedAmount().compareTo(groupGift.getTargetAmount()) >= 0) {
            groupGift.setStatus("FUNDED");
        }
        groupGiftRepository.save(groupGift);

        return mapToResponse(groupGift);
    }

    private GroupGiftResponse mapToResponse(GroupGift gift) {
        List<GroupGiftResponse.ContributionResponse> contributions = gift.getContributions().stream()
                .map(c -> GroupGiftResponse.ContributionResponse.builder()
                        .id(c.getId())
                        .contributorName(c.getContributorName())
                        .amount(c.getAmount())
                        .message(c.getMessage())
                        .paymentStatus(c.getPaymentStatus())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        double progress = gift.getTargetAmount().compareTo(BigDecimal.ZERO) > 0
                ? gift.getCollectedAmount().divide(gift.getTargetAmount(), 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100")).doubleValue()
                : 0.0;

        return GroupGiftResponse.builder()
                .id(gift.getId())
                .organizerName(gift.getOrganizer().getFullName())
                .recipientName(gift.getRecipient().getName())
                .title(gift.getTitle())
                .description(gift.getDescription())
                .targetAmount(gift.getTargetAmount())
                .collectedAmount(gift.getCollectedAmount())
                .status(gift.getStatus())
                .shareLink(gift.getShareLink())
                .deadline(gift.getDeadline())
                .createdAt(gift.getCreatedAt())
                .contributorCount(contributions.size())
                .progressPercentage(progress)
                .contributions(contributions)
                .build();
    }
}
