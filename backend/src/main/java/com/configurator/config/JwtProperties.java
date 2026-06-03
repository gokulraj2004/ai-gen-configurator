package com.configurator.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
public class JwtProperties {

    private String secretKey;
    private int accessTokenExpireMinutes = 30;
    private int refreshTokenExpireDays = 7;

    @PostConstruct
    public void validate() {
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException("JWT_SECRET_KEY must be set. Please configure app.jwt.secret-key or set the JWT_SECRET_KEY environment variable.");
        }
        if (secretKey.length() < 32) {
            throw new IllegalStateException("JWT_SECRET_KEY must be at least 32 characters long.");
        }
    }
}