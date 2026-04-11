package com.ruobing.codebook.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger (SpringDoc OpenAPI 3) 配置类
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("若冰代码手册 API")
                        .version("1.0.0")
                        .description("若冰代码手册后端服务接口文档")
                        .contact(new Contact()
                                .name("XiaoSaurus")
                                .email("XiaoSaurus@aliyun.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
