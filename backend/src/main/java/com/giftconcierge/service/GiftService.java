package com.giftconcierge.service;

import com.giftconcierge.model.Gift;
import com.giftconcierge.repository.GiftRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

@Service
public class GiftService {

    private final GiftRepository giftRepository;

    public GiftService(GiftRepository giftRepository) {
        this.giftRepository = giftRepository;
    }

    @Transactional(readOnly = true)
    public List<Gift> getAllGifts() {
        return giftRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Gift getById(Long id) {
        return giftRepository.findById(id)
                .orElseThrow(() -> new com.giftconcierge.exception.ResourceNotFoundException("Gift", "id", id));
    }

    @Transactional(readOnly = true)
    public List<Gift> getByCategory(String category) {
        return giftRepository.findByCategory(category);
    }

    @Transactional(readOnly = true)
    public List<Gift> search(String keyword) {
        return giftRepository.searchByKeyword(keyword);
    }

    @Transactional(readOnly = true)
    public List<Gift> searchCatalog(String keyword, String category, BigDecimal maxPrice, String emotion) {
        return giftRepository.findAll().stream()
                .filter(gift -> keyword == null || keyword.isBlank() ||
                        contains(gift.getName(), keyword) || contains(gift.getDescription(), keyword))
                .filter(gift -> category == null || category.isBlank() ||
                        equalsIgnoreCase(gift.getCategory(), category))
                .filter(gift -> maxPrice == null ||
                        (gift.getPrice() != null && gift.getPrice().compareTo(maxPrice) <= 0))
                .filter(gift -> emotion == null || emotion.isBlank() ||
                        contains(gift.getEmotionTags(), emotion))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Gift> getByEmotionTag(String tag) {
        return giftRepository.findByEmotionTag(tag);
    }

    @Transactional(readOnly = true)
    public List<Gift> getByPriceRange(BigDecimal min, BigDecimal max) {
        return giftRepository.findByPriceRange(min, max);
    }

    @Transactional(readOnly = true)
    public List<Gift> getEmergencyGifts() {
        // Emergency gifts: digital or low-cost items that can be sent immediately
        return giftRepository.findByPriceRange(BigDecimal.ZERO, new BigDecimal("50.00"));
    }

    private boolean contains(String value, String term) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(term.toLowerCase(Locale.ROOT));
    }

    private boolean equalsIgnoreCase(String value, String expected) {
        return value != null && value.equalsIgnoreCase(expected);
    }
}
