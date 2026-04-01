package com.ruobing.codebook;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.ruobing.codebook.repository")
public class CodebookApplication {
    public static void main(String[] args) {
        SpringApplication.run(CodebookApplication.class, args);
    }
}
