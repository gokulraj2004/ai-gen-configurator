package com.configurator.service;

import com.configurator.dto.AuthDto;
import com.configurator.model.TokenBlocklist;
import com.configurator.model.User;
import com.configurator.repository.TokenBlocklistRepository;
import com.configurator.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenBlocklistRepository tokenBlocklistRepository;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthDto.AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(mapUserToResponse(user))
                .build();
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthDto.AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(mapUserToResponse(user))
                .build();
    }

    public AuthDto.AuthResponse refresh(AuthDto.RefreshRequest request) {
        String username = jwtService.extractUsername(request.getRefreshToken());
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (!jwtService.isTokenValid(request.getRefreshToken(), user)) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }

        // Blocklist the old refresh token
        blocklistToken(request.getRefreshToken(), user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthDto.AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(mapUserToResponse(user))
                .build();
    }

    public void logout(AuthDto.LogoutRequest request) {
        String refreshToken = request.getRefreshToken();
        try {
            String username = jwtService.extractUsername(refreshToken);
            User user = userRepository.findByEmail(username).orElse(null);
            if (user != null) {
                blocklistToken(refreshToken, user);
            }
        } catch (Exception e) {
            // Token may be invalid/expired, but we still want logout to succeed
        }
    }

    public AuthDto.UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return mapUserToResponse(user);
    }

    private void blocklistToken(String token, User user) {
        String jti = jwtService.extractJti(token);
        Date expiration = jwtService.extractExpiration(token);
        LocalDateTime expiresAt = expiration.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

        TokenBlocklist blocklist = TokenBlocklist.builder()
                .jti(jti)
                .tokenType("refresh")
                .userId(user.getId())
                .expiresAt(expiresAt)
                .build();

        tokenBlocklistRepository.save(blocklist);
    }

    private AuthDto.UserResponse mapUserToResponse(User user) {
        return AuthDto.UserResponse.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .createdAt(user.getCreatedAt().toString())
                .build();
    }
}