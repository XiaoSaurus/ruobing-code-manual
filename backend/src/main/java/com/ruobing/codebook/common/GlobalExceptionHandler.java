package com.ruobing.codebook.common;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public Result<?> handleIllegalArgument(IllegalArgumentException e) {
        return Result.error(400, e.getMessage() != null ? e.getMessage() : "请求无效");
    }

    @ExceptionHandler(UnauthorizedException.class)
    public Result<?> handleUnauthorized(UnauthorizedException e) {
        return Result.error(401, e.getMessage() != null ? e.getMessage() : "未登录");
    }

    @ExceptionHandler(ForbiddenException.class)
    public Result<?> handleForbidden(ForbiddenException e) {
        return Result.error(403, e.getMessage() != null ? e.getMessage() : "无权限");
    }

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
