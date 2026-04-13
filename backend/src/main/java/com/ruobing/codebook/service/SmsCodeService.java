package com.ruobing.codebook.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.security.SecureRandom;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 手机号登录验证码（内存存储，单实例可用；多节点需 Redis）。
 * 生产环境请接入短信服务商，并在 {@link #sendCode} 中调用下发接口。
 */
@Service
public class SmsCodeService {

    private static final Logger log = LoggerFactory.getLogger(SmsCodeService.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    @Value("${user.sms.code-ttl-millis:300000}")
    private long codeTtlMillis;

    @Value("${user.sms.resend-interval-millis:60000}")
    private long resendIntervalMillis;

    /**
     * 仅开发/测试：配置后可用该码通过校验（无需先点发送，或发送后也可用）。
     * 生产环境勿配置。
     */
    @Value("${user.sms.dev-bypass-code:}")
    private String devBypassCode;

    private static final class Entry {
        final String code;
        final long expireAt;
        long lastSentAt;

        Entry(String code, long expireAt, long lastSentAt) {
            this.code = code;
            this.expireAt = expireAt;
            this.lastSentAt = lastSentAt;
        }
    }

    private final ConcurrentHashMap<String, Entry> store = new ConcurrentHashMap<>();

    public void sendCode(String phone) {
        long now = System.currentTimeMillis();
        Entry prev = store.get(phone);
        if (prev != null && now - prev.lastSentAt < resendIntervalMillis) {
            throw new IllegalArgumentException("发送过于频繁，请稍后再试");
        }
        String code;
        if (StringUtils.hasText(devBypassCode)) {
            code = devBypassCode.trim();
        } else {
            code = String.format("%06d", RANDOM.nextInt(1_000_000));
        }
        long expire = now + codeTtlMillis;
        store.put(phone, new Entry(code, expire, now));
        // TODO: 接入腾讯云/阿里云短信，向 phone 下发 code
        log.info("[sms] 验证码已生成 phone={} code={}", phone, code);
    }

    public void verify(String phone, String inputCode) {
        if (!StringUtils.hasText(phone) || !StringUtils.hasText(inputCode)) {
            throw new IllegalArgumentException("请输入手机号和验证码");
        }
        String c = inputCode.trim();
        if (StringUtils.hasText(devBypassCode) && devBypassCode.trim().equals(c)) {
            return;
        }
        Entry e = store.get(phone);
        long now = System.currentTimeMillis();
        if (e == null || now > e.expireAt) {
            throw new IllegalArgumentException("验证码无效或已过期，请重新获取");
        }
        if (!e.code.equals(c)) {
            throw new IllegalArgumentException("验证码错误");
        }
        store.remove(phone);
    }
}
