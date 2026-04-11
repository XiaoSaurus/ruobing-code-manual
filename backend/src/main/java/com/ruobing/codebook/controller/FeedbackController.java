package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.Feedback;
import com.ruobing.codebook.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public Result<?> submit(@RequestBody Feedback feedback) {
        feedbackService.submit(feedback);
        return Result.success();
    }

    @GetMapping("/list")
    public Result<?> getList(@RequestParam(required = false) Long userId) {
        return Result.success(feedbackService.getList(userId, null));
    }

    @PutMapping("/{id}/reply")
    public Result<?> reply(@PathVariable Long id, @RequestBody String reply) {
        feedbackService.reply(id, reply);
        return Result.success();
    }
}
