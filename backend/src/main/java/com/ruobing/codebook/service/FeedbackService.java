package com.ruobing.codebook.service;

import com.ruobing.codebook.entity.Feedback;
import com.ruobing.codebook.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public void submit(Feedback feedback) {
        feedbackRepository.insert(feedback);
    }

    public List<Feedback> getList(Long userId, Integer status) {
        return feedbackRepository.selectList(null);
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
