package com.routewise.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;
import java.util.function.Function;

/**
 * Issues and validates the JWTs used to authenticate API requests.
 *
 * The subject claim contains the user's UUID.
 * The token also contains the user's email.
 */
@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMs;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public JwtService(
            @Value("${routewise.jwt.secret}") String secret,
            @Value("${routewise.jwt.expiration-ms}") long expirationMs
    ) {

        /*
         * HS256 requires a key of at least 256 bits (32 bytes).
         *
         * If a short development secret is provided,
         * we expand it to 32 bytes.
         */
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);

        if (keyBytes.length < 32) {

            byte[] padded = new byte[32];

            for (int i = 0; i < 32; i++) {
                padded[i] = keyBytes[i % keyBytes.length];
            }

            keyBytes = padded;
        }

        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }


    // ============================================================
    // GENERATE TOKEN
    // ============================================================

    public String generateToken(
            UUID userId,
            String email
    ) {

        Date now = new Date();

        Date expiry = new Date(
                now.getTime() + expirationMs
        );

        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .issuedAt(now)
                .expiration(expiry)

                // JJWT automatically selects the appropriate
                // HMAC algorithm from the SecretKey.
                .signWith(signingKey)

                .compact();
    }


    // ============================================================
    // EXTRACT USER ID
    // ============================================================

    public UUID extractUserId(String token) {

        String subject = extractClaim(
                token,
                Claims::getSubject
        );

        return UUID.fromString(subject);
    }


    // ============================================================
    // EXTRACT EMAIL
    // ============================================================

    public String extractEmail(String token) {

        return extractClaim(
                token,
                claims -> claims.get(
                        "email",
                        String.class
                )
        );
    }


    // ============================================================
    // VALIDATE TOKEN
    // ============================================================

    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ) {

        try {

            String email = extractEmail(token);

            return email != null
                    && email.equalsIgnoreCase(
                            userDetails.getUsername()
                    )
                    && !isTokenExpired(token);

        } catch (Exception ex) {

            return false;
        }
    }


    // ============================================================
    // CHECK TOKEN EXPIRATION
    // ============================================================

    private boolean isTokenExpired(String token) {

        Date expiration = extractClaim(
                token,
                Claims::getExpiration
        );

        return expiration.before(new Date());
    }


    // ============================================================
    // GENERIC CLAIM EXTRACTION
    // ============================================================

    private <T> T extractClaim(
            String token,
            Function<Claims, T> resolver
    ) {

        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return resolver.apply(claims);
    }
}