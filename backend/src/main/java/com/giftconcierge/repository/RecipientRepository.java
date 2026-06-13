package com.giftconcierge.repository;

import com.giftconcierge.model.Recipient;
import com.giftconcierge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipientRepository extends JpaRepository<Recipient, Long> {

    List<Recipient> findByUserId(Long userId);

    long countByUser(User user);
    List<Recipient> findByUserIdAndRelationship(Long userId, String relationship);

    @Query("SELECT r FROM Recipient r WHERE r.user.id = :userId AND r.name LIKE %:query%")
    List<Recipient> searchByName(@Param("userId") Long userId, @Param("query") String query);

    @Query(value = "SELECT * FROM recipients WHERE user_id = :userId AND birthday IS NOT NULL " +
            "AND (DATE_FORMAT(birthday, '%m-%d') BETWEEN DATE_FORMAT(CURDATE(), '%m-%d') " +
            "AND DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 30 DAY), '%m-%d'))", nativeQuery = true)
    List<Recipient> findUpcomingBirthdays(@Param("userId") Long userId);
}
