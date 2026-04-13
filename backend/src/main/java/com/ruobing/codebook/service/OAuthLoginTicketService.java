package com.ruobing.codebook.service;

import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 微信回调后向前端传递一次性 ticket，避免 JWT 暴露在地址栏过长或泄露。
 */
@Component
public class OAuthLoginTicketService {

    private static final long TTL_MS = 120_000;

    private static final class Ticket {
        final long userId;
        final long expiresAt;

        Ticket(long userId, long expiresAt) {
            this.userId = userId;
            this.expiresAt = expiresAt;
        }
    }

    private final ConcurrentHashMap<String, Ticket> store = new ConcurrentHashMap<>();

    public String issue(long userId) {
        String t = UUID.randomUUID().toString().replace("-", "");
        store.put(t, new Ticket(userId, System.currentTimeMillis() + TTL_MS));
        return t;
    }

    /**
     * @return userId，无效或过期返回 null
     */
    public Long redeem(String ticket) {
        if (ticket == null || ticket.isEmpty()) {
            return null;
        }
        Ticket info = store.remove(ticket.trim());
        if (info == null || System.currentTimeMillis() > info.expiresAt) {
            return null;
        }
        return info.userId;
    }
}
