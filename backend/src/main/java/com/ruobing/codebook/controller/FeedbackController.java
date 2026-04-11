package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.Feedback;
import com.ruobing.codebook.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Tag(name = "用户反馈", description = "用户反馈管理接口")
@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Operation(summary = "提交反馈", description = "用户提交意见反馈")
    @PostMapping
    public Result<?> submit(@RequestBody Feedback feedback) {
        feedbackService.submit(feedback);
        return Result.success();
    }

    @Operation(summary = "获取反馈列表", description = "获取用户反馈列表")
    @GetMapping("/list")
    public Result<?> getList(
            @Parameter(description = "用户ID（可选）") @RequestParam(required = false) Long userId) {
        return Result.success(feedbackService.getList(userId, null));
    }

    @Operation(summary = "回复反馈", description = "管理员回复用户反馈")
    @PutMapping("/{id}/reply")
    public Result<?> reply(
            @Parameter(description = "反馈ID") @PathVariable Long id,
            @RequestBody String reply) {
        feedbackService.reply(id, reply);
        return Result.success();
    }
}
