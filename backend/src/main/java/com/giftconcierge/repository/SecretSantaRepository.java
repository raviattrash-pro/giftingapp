package com.giftconcierge.repository;

import com.giftconcierge.model.SecretSanta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SecretSantaRepository extends JpaRepository<SecretSanta, Long> {

    Optional<SecretSanta> findByJoinCode(String joinCode);
}
