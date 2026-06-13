package com.giftconcierge.repository;

import com.giftconcierge.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByUserIdAndIsSentFalse(Long userId);

    @Query("SELECT r FROM Reminder r WHERE r.isSent = false AND r.sendAt <= :now")
    List<Reminder> findDueReminders(@Param("now") LocalDateTime now);

    List<Reminder> findByUserId(Long userId);

    List<Reminder> findByUserIdAndIsSmartTrue(Long userId);
}
