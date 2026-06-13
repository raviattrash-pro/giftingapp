package com.giftconcierge.repository;

import com.giftconcierge.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByUserIdAndMonthAndYear(Long userId, Integer month, Integer year);

    List<Budget> findByUserId(Long userId);

    List<Budget> findByUserIdAndYear(Long userId, Integer year);
}
