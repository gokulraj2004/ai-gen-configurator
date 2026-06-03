package com.configurator.service;

import com.configurator.config.JwtProperties;
import com.configurator.model.User;
import com.configurator.repository.TokenBlocklistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @Mock
    private TokenBlocklistRepository tokenBlocklistRepository;

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        JwtProperties jwtProperties = new JwtProperties();
        jwtProperties.setSecretKey("test-secret-key-that-is-at-least-32-characters-long");
        jwtProperties.setAccessTokenExpireMinutes(30);
        jwtProperties.setRefreshTokenExpireDays(7);

        jwtService = new JwtService(jwtProperties, tokenBlocklistRepository);
    }

    @Test
    void generateAccessTokenAndExtractUsername() {
        User user = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .password("encoded")
                .firstName("Test")
                .lastName("User")
                .build();

        String token = jwtService.generateAccessToken(user);
        assertNotNull(token);

        String username = jwtService.extractUsername(token);
        assertEquals("test@example.com", username);
    }

    @Test
    void tokenIsValidForCorrectUser() {
        User user = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .password("encoded")
                .firstName("Test")
                .lastName("User")
                .build();

        when(tokenBlocklistRepository.existsByJti(anyString())).thenReturn(false);

        String token = jwtService.generateAccessToken(user);
        assertTrue(jwtService.isTokenValid(token, user));
    }

    @Test
    void tokenIsInvalidForDifferentUser() {
        User user1 = User.builder()
                .id(UUID.randomUUID())
                .email("user1@example.com")
                .password("encoded")
                .firstName("User")
                .lastName("One")
                .build();

        User user2 = User.builder()
                .id(UUID.randomUUID())
                .email("user2@example.com")
                .password("encoded")
                .firstName("User")
                .lastName("Two")
                .build();

        when(tokenBlocklistRepository.existsByJti(anyString())).thenReturn(false);

        String token = jwtService.generateAccessToken(user1);
        assertFalse(jwtService.isTokenValid(token, user2));
    }
}