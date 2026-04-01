package com.ruobing.codebook.service;

import com.ruobing.codebook.entity.User;
import com.ruobing.codebook.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getByOpenid(String openid) {
        return userRepository.selectOne(
            new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<User>()
                .eq("openid", openid)
        );
    }

    public User createOrUpdate(String openid, String nickname, String avatar) {
        User user = getByOpenid(openid);
        if (user == null) {
            user = new User();
            user.setOpenid(openid);
            user.setNickname(nickname);
            user.setAvatar(avatar);
            userRepository.insert(user);
        } else {
            if (nickname != null) user.setNickname(nickname);
            if (avatar != null) user.setAvatar(avatar);
            userRepository.updateById(user);
        }
        return user;
    }

    public User getById(Long id) {
        return userRepository.selectById(id);
    }

    public void updateInfo(User user) {
        userRepository.updateById(user);
    }
}
