package com.ruobing.codebook.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ruobing.codebook.common.PageResult;
import com.ruobing.codebook.entity.WebDesign;
import com.ruobing.codebook.repository.WebDesignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WebDesignService {

    @Autowired
    private WebDesignRepository webDesignRepository;

    public PageResult<WebDesign> getList(String keyword, String sortBy, Integer page, Integer pageSize) {
        Page<WebDesign> pageParam = new Page<>(page, pageSize);
        QueryWrapper<WebDesign> wrapper = new QueryWrapper<>();
        wrapper.eq("status", 1);

        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like("title", keyword).or().like("tags", keyword));
        }

        if ("views".equals(sortBy)) {
            wrapper.orderByDesc("views");
        } else if ("likes".equals(sortBy)) {
            wrapper.orderByDesc("likes");
        } else if ("latest".equals(sortBy)) {
            wrapper.orderByDesc("create_time");
        } else {
            wrapper.orderByDesc("sort_order");
        }

        Page<WebDesign> result = webDesignRepository.selectPage(pageParam, wrapper);
        return PageResult.of(result.getTotal(), page, pageSize, result.getRecords());
    }

    public List<WebDesign> getHotList() {
        QueryWrapper<WebDesign> wrapper = new QueryWrapper<>();
        wrapper.eq("status", 1).eq("is_hot", 1).orderByDesc("views");
        wrapper.last("LIMIT 10");
        return webDesignRepository.selectList(wrapper);
    }

    public List<WebDesign> getLatestList() {
        QueryWrapper<WebDesign> wrapper = new QueryWrapper<>();
        wrapper.eq("status", 1).eq("is_latest", 1).orderByDesc("create_time");
        wrapper.last("LIMIT 10");
        return webDesignRepository.selectList(wrapper);
    }

    public WebDesign getDetail(Long id) {
        WebDesign item = webDesignRepository.selectById(id);
        if (item != null) {
            item.setViews(item.getViews() + 1);
            webDesignRepository.updateById(item);
        }
        return item;
    }

    public void save(WebDesign webDesign) {
        if (webDesign.getId() != null) {
            webDesignRepository.updateById(webDesign);
        } else {
            webDesignRepository.insert(webDesign);
        }
    }

    public void delete(Long id) {
        webDesignRepository.deleteById(id);
    }
}
