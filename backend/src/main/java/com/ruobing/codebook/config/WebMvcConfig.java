package com.ruobing.codebook.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final JwtAuthInterceptor jwtAuthInterceptor;

    public WebMvcConfig(JwtAuthInterceptor jwtAuthInterceptor) {
        this.jwtAuthInterceptor = jwtAuthInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtAuthInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/",
                        "/error",
                        "/doc.html", "/doc.html/**", "/swagger-ui/**", "/v3/api-docs/**", "/webjars/**",
                        "/api/auth/login", "/api/auth/register", "/api/auth/forgot-password",
                        "/api/auth/app/sms/send", "/api/auth/app/sms/login",
                        "/api/auth/wechat/**", "/api/auth/oauth/**",
                        "/api/user/**", "/api/meta/**", "/api/dict/**",
                        "/api/web-design/list", "/api/web-design/hot", "/api/web-design/latest", "/api/web-design/*",
                        "/api/graduation/list", "/api/graduation/hot", "/api/graduation/latest", "/api/graduation/*",
                        "/api/about", "/api/changelog/list", "/api/banner/list",
                        "/api/feedback", "/api/feedback/mine"
                );
    }
}
