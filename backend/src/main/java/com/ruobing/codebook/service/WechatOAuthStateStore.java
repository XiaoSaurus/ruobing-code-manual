package com.ruobing.codebook.service;

import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 微信 OAuth2 state 防 CSRF，一次性使用。
 */
@Component
public class WechatOAuthStateStore {

    private static final long TTL_MS = 600_000;

    private final ConcurrentHashMap<String, Long> expiry = new ConcurrentHashMap<>();

    public String createState() {
        String s = UUID.randomUUID().toString().replace("-", "");
        expiry.put(s, System.currentTimeMillis() + TTL_MS);
        return s;
    }

    public boolean validateAndRemove(String state) {
        if (state == null || state.isEmpty()) {
            return false;
        }
        Long exp = expiry.remove(state.trim());
        return exp != null && System.currentTimeMillis() < exp;
    }
}
