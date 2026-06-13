package com.giftconcierge.repository;

import com.giftconcierge.model.GiftHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GiftHistoryRepository extends JpaRepository<GiftHistory, Long> {

    List<GiftHistory> findByUserIdAndRecipientId(Long userId, Long recipientId);

    List<GiftHistory> findByUserId(Long userId);
}
