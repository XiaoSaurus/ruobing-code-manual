package com.ruobing.codebook.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;

/**
 * 启动时校验微信小程序 AppID 是否已配置（不打印 AppSecret）。
 */
@Configuration
public class WxMiniProgramConfig {

    private static final Logger log = LoggerFactory.getLogger(WxMiniProgramConfig.class);

    @Value("${wxapp.appid:}")
    private String appid;

    @Value("${wxapp.secret:}")
    private String secret;

    @PostConstruct
    public void logWxStatus() {
        if (!StringUtils.hasText(appid)) {
            log.warn("[wxapp] 未配置 appid，小程序登录将使用本地调试 openid");
            return;
        }
        if (!StringUtils.hasText(secret)) {
            log.warn("[wxapp] 未配置 secret，小程序登录将使用本地调试 openid（appid={})", appid);
            return;
        }
        log.info("[wxapp] 已配置小程序 AppID={}，将调用 jscode2session 换取真实 openid", appid);
    }
}
