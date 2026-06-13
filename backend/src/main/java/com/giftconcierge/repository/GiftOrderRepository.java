package com.giftconcierge.repository;

import com.giftconcierge.model.GiftOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GiftOrderRepository extends JpaRepository<GiftOrder, Long> {

    List<GiftOrder> findByUserId(Long userId);

    List<GiftOrder> findByRecipientId(Long recipientId);

    List<GiftOrder> findByUserIdOrderByCreatedAtDesc(Long userId);
}
