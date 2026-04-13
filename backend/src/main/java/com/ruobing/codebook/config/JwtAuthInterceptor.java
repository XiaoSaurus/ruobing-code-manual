package com.ruobing.codebook.config;

import com.ruobing.codebook.common.ForbiddenException;
import com.ruobing.codebook.common.UnauthorizedException;
import com.ruobing.codebook.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class JwtAuthInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    public JwtAuthInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        String token = extractBearerToken(request);
        Claims claims = null;
        if (token != null) {
            try {
                claims = jwtUtil.parseToken(token);
                if (claims.get("uid") != null) {
                    request.setAttribute("auth_uid", Long.valueOf(String.valueOf(claims.get("uid"))));
                }
                request.setAttribute("auth_role", String.valueOf(claims.get("role")));
            } catch (Exception ignored) {
                claims = null;
            }
        }

        boolean requiresAuth = path.startsWith("/api/auth/me")
                || path.startsWith("/api/auth/menus")
                || path.startsWith("/api/auth/app/me")
                || path.startsWith("/api/user/admin")
                || path.startsWith("/api/rbac");

        if (requiresAuth && claims == null) {
            throw new UnauthorizedException("请先登录");
        }

        boolean adminOnly = path.startsWith("/api/user/admin")
                || (path.startsWith("/api/feedback") && ("PUT".equalsIgnoreCase(method) || path.contains("/list")))
                || (path.startsWith("/api/changelog") && !path.endsWith("/list"))
                || (path.startsWith("/api/about") && !"GET".equalsIgnoreCase(method))
                || (path.startsWith("/api/web-design") && !"GET".equalsIgnoreCase(method))
                || (path.startsWith("/api/graduation") && !"GET".equalsIgnoreCase(method))
                || path.startsWith("/api/banner/all")
                || path.startsWith("/api/banner/add")
                || path.startsWith("/api/banner/update")
                || path.startsWith("/api/banner/delete")
                || path.startsWith("/api/rbac");

        if (adminOnly) {
            if (claims == null) {
                throw new UnauthorizedException("请先登录管理员账号");
            }
            String role = String.valueOf(claims.get("role"));
            if (!"admin".equalsIgnoreCase(role)) {
                throw new ForbiddenException("无权限访问该接口");
            }
        }
        return true;
    }

    private static String extractBearerToken(HttpServletRequest request) {
        String auth = request.getHeader("Authorization");
        if (!StringUtils.hasText(auth)) return null;
        String s = auth.trim();
        if (s.startsWith("Bearer ")) {
            String t = s.substring(7).trim();
            return t.isEmpty() ? null : t;
        }
        return null;
    }
}
