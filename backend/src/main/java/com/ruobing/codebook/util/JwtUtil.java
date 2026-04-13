package com.ruobing.codebook.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String createToken(Long userId, String username, String role) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expiration);
        Map<String, Object> claims = new HashMap<>();
        claims.put("uid", userId);
        claims.put("username", username);
        claims.put("role", role);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    /**
     * Web 端 C 端用户（user 表）JWT，role 固定为 app_user。
     */
    public String createAppUserToken(Long userId, String subject) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expiration);
        Map<String, Object> claims = new HashMap<>();
        claims.put("uid", userId);
        claims.put("username", subject != null ? subject : "");
        claims.put("role", "app_user");
        claims.put("principal", "app");
        String sub = subject != null && !subject.isEmpty() ? subject : ("u" + userId);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(sub)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    }
}
