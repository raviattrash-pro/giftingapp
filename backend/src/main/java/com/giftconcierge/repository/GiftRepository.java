package com.giftconcierge.repository;

import com.giftconcierge.model.Gift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface GiftRepository extends JpaRepository<Gift, Long> {

    java.util.Optional<Gift> findByName(String name);

    List<Gift> findByCategory(String category);

    @Query("SELECT g FROM Gift g WHERE LOWER(g.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(g.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Gift> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT g FROM Gift g WHERE LOWER(g.emotionTags) LIKE LOWER(CONCAT('%', :tag, '%'))")
    List<Gift> findByEmotionTag(@Param("tag") String tag);

    @Query("SELECT g FROM Gift g WHERE g.price BETWEEN :minPrice AND :maxPrice")
    List<Gift> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);

    List<Gift> findByCategoryAndPriceLessThanEqual(String category, BigDecimal maxPrice);
}
