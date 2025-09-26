package Fin.model;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTManager {
    public final String SEC_KEY = "ABCDEFGHIJKLMNOP12345677abcdefgh";
    public final SecretKey key = Keys.hmacShaKeyFor(SEC_KEY.getBytes());

    // ✅ Generate token with email as subject
    public String generateToken(String email) {
        return Jwts.builder()
            .setSubject(email) // 👈 standard claim for the user's identity
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
            .signWith(key)
            .compact();
    }

    // ✅ Validate token and return email
    public String validateJWT(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

            Date expiry = claims.getExpiration();
            if (expiry == null || expiry.before(new Date())) {
                throw new Exception("401");
            }

            return claims.getSubject(); // 👈 this gives us the email directly

        } catch (Exception e) {
            return "401::Invalid Token";
        }
    }
}