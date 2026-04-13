package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.User;
import com.ruobing.codebook.service.PortalAuthService;
import com.ruobing.codebook.service.UserService;
import com.ruobing.codebook.service.WechatOAuthStateStore;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Web 端 C 端登录：手机号验证码、微信开放平台网站扫码（与小程序 /user 接口并存）。
 */
@Tag(name = "Web 访客登录", description = "手机号验证码 / 微信网站应用扫码")
@RestController
@RequestMapping("/auth")
public class WebPortalAuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PortalAuthService portalAuthService;

    @Autowired
    private WechatOAuthStateStore wechatOAuthStateStore;

    @Value("${wxweb.appid:}")
    private String wxWebAppId;

    @Value("${wxweb.redirect-uri:}")
    private String wxWebRedirectUri;

    @Value("${frontend.oauth-return-base:http://localhost:3000}")
    private String frontendOAuthReturnBase;

    @Operation(summary = "发送登录验证码")
    @PostMapping("/app/sms/send")
    public Result<?> appSmsSend(@RequestBody Map<String, String> body) {
        String phone = body != null ? body.get("phone") : null;
        userService.sendLoginSms(phone);
        return Result.success();
    }

    @Operation(summary = "手机号验证码登录", description = "返回 JWT（role=app_user）与用户信息")
    @PostMapping("/app/sms/login")
    public Result<?> appSmsLogin(@RequestBody Map<String, String> body) {
        String phone = body != null ? body.get("phone") : null;
        String code = body != null ? body.get("code") : null;
        return Result.success(portalAuthService.loginBySms(phone, code));
    }

    @Operation(summary = "微信扫码授权跳转 URL", description = "前端 window.location 打开；回调至后端 /auth/wechat/callback")
    @GetMapping("/wechat/authorize-url")
    public Result<?> wechatAuthorizeUrl() {
        if (!StringUtils.hasText(wxWebAppId) || !StringUtils.hasText(wxWebRedirectUri)) {
            return Result.error(503, "未配置微信网站应用 wxweb.appid / wxweb.redirect-uri");
        }
        String state = wechatOAuthStateStore.createState();
        String encodedRedirect = URLEncoder.encode(wxWebRedirectUri.trim(), StandardCharsets.UTF_8);
        String url = "https://open.weixin.qq.com/connect/qrconnect?appid=" + wxWebAppId.trim()
                + "&redirect_uri=" + encodedRedirect
                + "&response_type=code&scope=snsapi_login&state=" + state
                + "#wechat_redirect";
        Map<String, Object> data = new HashMap<>();
        data.put("url", url);
        return Result.success(data);
    }

    @Operation(summary = "微信 OAuth 回调", description = "微信服务器重定向，勿前端直接调用")
    @GetMapping("/wechat/callback")
    public RedirectView wechatCallback(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "state", required = false) String state) {
        String base = frontendOAuthReturnBase.replaceAll("/$", "");
        if (!StringUtils.hasText(code) || !wechatOAuthStateStore.validateAndRemove(state)) {
            return new RedirectView(base + "/login?error=wechat");
        }
        try {
            User u = userService.loginOrRegisterByWechatWeb(code);
            String ticket = portalAuthService.issueTicketAfterWechat(u);
            return new RedirectView(base + "/login?ticket=" + URLEncoder.encode(ticket, StandardCharsets.UTF_8));
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "wechat";
            String q = URLEncoder.encode(msg.length() > 120 ? msg.substring(0, 120) : msg, StandardCharsets.UTF_8);
            return new RedirectView(base + "/login?error=wechat&reason=" + q);
        }
    }

    @Operation(summary = "用一次性 ticket 换取 token", description = "扫码回调后前端带上 ticket 调用")
    @PostMapping("/oauth/ticket")
    public Result<?> exchangeTicket(@RequestBody Map<String, String> body) {
        String ticket = body != null ? body.get("ticket") : null;
        return Result.success(portalAuthService.exchangeOAuthTicket(ticket));
    }

    @Operation(summary = "当前访客用户资料")
    @GetMapping("/app/me")
    public Result<?> appMe(javax.servlet.http.HttpServletRequest request) {
        Long uid = (Long) request.getAttribute("auth_uid");
        return Result.success(portalAuthService.me(uid));
    }

    @Operation(summary = "更新当前访客用户资料")
    @PutMapping("/app/me/profile")
    public Result<?> appUpdateMe(@RequestBody Map<String, String> body, javax.servlet.http.HttpServletRequest request) {
        Long uid = (Long) request.getAttribute("auth_uid");
        return Result.success(portalAuthService.updateMyProfile(
                uid,
                body == null ? null : body.get("nickname"),
                body == null ? null : body.get("avatar"),
                body == null ? null : body.get("email")
        ));
    }
}
