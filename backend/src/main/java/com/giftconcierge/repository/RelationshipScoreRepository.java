package com.giftconcierge.repository;

import com.giftconcierge.model.RelationshipScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RelationshipScoreRepository extends JpaRepository<RelationshipScore, Long> {

    Optional<RelationshipScore> findByUserIdAndRecipientId(Long userId, Long recipientId);

    @Query("SELECT rs FROM RelationshipScore rs WHERE rs.user.id = :userId ORDER BY rs.score DESC")
    List<RelationshipScore> findTopByUserId(@Param("userId") Long userId);

    List<RelationshipScore> findByUserId(Long userId);
}
