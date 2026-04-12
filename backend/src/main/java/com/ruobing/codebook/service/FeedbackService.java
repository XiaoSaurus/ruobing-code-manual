package com.ruobing.codebook.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ruobing.codebook.entity.Feedback;
import com.ruobing.codebook.entity.User;
import com.ruobing.codebook.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserService userService;

    public void submit(Feedback feedback) {
        if (StringUtils.hasText(feedback.getOpenid())) {
            User u = userService.getByOpenid(feedback.getOpenid());
            if (u != null) {
                feedback.setUserId(u.getId());
            }
        }
        feedbackRepository.insert(feedback);
    }

    public List<Feedback> listByOpenid(String openid) {
        if (!StringUtils.hasText(openid)) {
            return Collections.emptyList();
        }
        User u = userService.getByOpenid(openid);
        if (u == null) {
            return Collections.emptyList();
        }
        return getList(u.getId(), null);
    }

    public List<Feedback> getList(Long userId, Integer status) {
        LambdaQueryWrapper<Feedback> w = new LambdaQueryWrapper<>();
        if (userId != null) {
            w.eq(Feedback::getUserId, userId);
        }
        if (status != null) {
            w.eq(Feedback::getStatus, status == 1);
        }
        w.orderByDesc(Feedback::getCreateTime);
        return feedbackRepository.selectList(w);
    }

    public void reply(Long id, String reply) {
        Feedback feedback = feedbackRepository.selectById(id);
        if (feedback != null) {
            feedback.setStatus(true);
            feedback.setReply(reply);
            feedbackRepository.updateById(feedback);
        }
    }
}
