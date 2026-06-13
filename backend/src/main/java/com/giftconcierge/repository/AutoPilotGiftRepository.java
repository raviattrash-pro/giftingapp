package com.giftconcierge.repository;

import com.giftconcierge.model.AutoPilotGift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutoPilotGiftRepository extends JpaRepository<AutoPilotGift, Long> {

    List<AutoPilotGift> findByUserIdAndIsActiveTrue(Long userId);

    List<AutoPilotGift> findByUserId(Long userId);
}
