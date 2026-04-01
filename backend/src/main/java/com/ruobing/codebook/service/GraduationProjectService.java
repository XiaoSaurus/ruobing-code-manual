package com.ruobing.codebook.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ruobing.codebook.common.PageResult;
import com.ruobing.codebook.entity.GraduationProject;
import com.ruobing.codebook.repository.GraduationProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GraduationProjectService {

    @Autowired
    private GraduationProjectRepository graduationProjectRepository;

    public PageResult<GraduationProject> getList(String keyword, String sortBy, Integer page, Integer pageSize) {
        Page<GraduationProject> pageParam = new Page<>(page, pageSize);
        QueryWrapper<GraduationProject> wrapper = new QueryWrapper<>();
        wrapper.eq("status", true);

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

        Page<GraduationProject> result = graduationProjectRepository.selectPage(pageParam, wrapper);
        return PageResult.of(result.getTotal(), page, pageSize, result.getRecords());
    }

    public List<GraduationProject> getHotList() {
        QueryWrapper<GraduationProject> wrapper = new QueryWrapper<>();
        wrapper.eq("status", true).eq("is_hot", true).orderByDesc("views").last("LIMIT 10");
        return graduationProjectRepository.selectList(wrapper);
    }

    public List<GraduationProject> getLatestList() {
        QueryWrapper<GraduationProject> wrapper = new QueryWrapper<>();
        wrapper.eq("status", true).eq("is_latest", true).orderByDesc("create_time").last("LIMIT 10");
        return graduationProjectRepository.selectList(wrapper);
    }

    public GraduationProject getDetail(Long id) {
        GraduationProject item = graduationProjectRepository.selectById(id);
        if (item != null) {
            item.setViews(item.getViews() + 1);
            graduationProjectRepository.updateById(item);
        }
        return item;
    }

    public void save(GraduationProject project) {
        if (project.getId() != null) {
            graduationProjectRepository.updateById(project);
        } else {
            graduationProjectRepository.insert(project);
        }
    }

    public void delete(Long id) {
        graduationProjectRepository.deleteById(id);
    }
}
