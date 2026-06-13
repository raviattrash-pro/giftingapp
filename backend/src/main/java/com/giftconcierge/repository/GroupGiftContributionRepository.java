package com.giftconcierge.repository;

import com.giftconcierge.model.GroupGiftContribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupGiftContributionRepository extends JpaRepository<GroupGiftContribution, Long> {

    List<GroupGiftContribution> findByGroupGiftId(Long groupGiftId);
}
