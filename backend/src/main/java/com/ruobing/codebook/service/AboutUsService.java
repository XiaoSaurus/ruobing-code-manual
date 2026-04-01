package com.ruobing.codebook.service;

import com.ruobing.codebook.entity.AboutUs;
import com.ruobing.codebook.repository.AboutUsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AboutUsService {

    @Autowired
    private AboutUsRepository aboutUsRepository;

    public AboutUs get() {
        List<AboutUs> list = aboutUsRepository.selectList(null);
        return list.isEmpty() ? null : list.get(0);
    }

    public void update(AboutUs aboutUs) {
        aboutUsRepository.updateById(aboutUs);
    }
}
