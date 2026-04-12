package com.ruobing.codebook.common;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public Result<?> handleRuntime(RuntimeException e) {
        // 微信登录等业务异常，不打印堆栈，只返回友好信息
        return Result.error(e.getMessage() != null ? e.getMessage() : "操作失败");
    }

    @ExceptionHandler(Exception.class)
    public Result<?> handleGeneral(Exception e) {
        e.printStackTrace();
        return Result.error("服务器内部错误");
    }
}
