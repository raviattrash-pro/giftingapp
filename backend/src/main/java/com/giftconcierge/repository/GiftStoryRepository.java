package com.giftconcierge.repository;

import com.giftconcierge.model.GiftStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GiftStoryRepository extends JpaRepository<GiftStory, Long> {

    @Query("SELECT gs FROM GiftStory gs ORDER BY gs.createdAt DESC")
    List<GiftStory> findAllOrderByCreatedAtDesc();

    List<GiftStory> findByOrderId(Long orderId);
}
