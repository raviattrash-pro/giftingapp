package com.giftconcierge.repository;

import com.giftconcierge.model.GroupGift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupGiftRepository extends JpaRepository<GroupGift, Long> {

    List<GroupGift> findByOrganizerId(Long organizerId);

    Optional<GroupGift> findByShareLink(String shareLink);
}
