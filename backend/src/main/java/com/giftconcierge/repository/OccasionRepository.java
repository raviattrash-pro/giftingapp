package com.giftconcierge.repository;

import com.giftconcierge.model.Occasion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OccasionRepository extends JpaRepository<Occasion, Long> {

    List<Occasion> findByUserId(Long userId);

    @Query("SELECT o FROM Occasion o WHERE o.user.id = :userId AND o.eventDate >= :startDate AND o.eventDate <= :endDate ORDER BY o.eventDate ASC")
    List<Occasion> findUpcomingByUserId(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT o FROM Occasion o WHERE o.user.id = :userId AND MONTH(o.eventDate) = :month AND YEAR(o.eventDate) = :year")
    List<Occasion> findByUserIdAndMonthAndYear(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);
}
