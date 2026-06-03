package com.configurator.repository;

import com.configurator.model.TokenBlocklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface TokenBlocklistRepository extends JpaRepository<TokenBlocklist, UUID> {
    boolean existsByJti(String jti);
    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}