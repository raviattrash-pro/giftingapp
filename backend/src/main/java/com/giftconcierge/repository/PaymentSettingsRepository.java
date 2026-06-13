package com.giftconcierge.repository;

import com.giftconcierge.model.PaymentSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentSettingsRepository extends JpaRepository<PaymentSettings, Long> {
}
