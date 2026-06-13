package com.giftconcierge.repository;

import com.giftconcierge.model.FutureGiftLocker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FutureGiftLockerRepository extends JpaRepository<FutureGiftLocker, Long> {

    List<FutureGiftLocker> findByUserIdAndStatus(Long userId, String status);

    List<FutureGiftLocker> findByUserId(Long userId);
}
