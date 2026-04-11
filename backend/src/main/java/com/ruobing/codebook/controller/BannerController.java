package com.ruobing.codebook.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.Banner;
import com.ruobing.codebook.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/banner")
@CrossOrigin(origins = "*")
public class BannerController {

    @Autowired
    private BannerRepository bannerRepository;

    // ========== 公开接口 ==========

    /** 获取轮播图列表 */
    @GetMapping("/list")
    public Result<List<Banner>> list() {
        LambdaQueryWrapper<Banner> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Banner::getStatus, 1).orderByAsc(Banner::getSortOrder);
        List<Banner> banners = bannerRepository.selectList(wrapper);
        return Result.success(banners);
    }

    // ========== 管理接口 ==========

    /** 获取所有轮播图（含禁用的） */
    @GetMapping("/all")
    public Result<List<Banner>> all() {
        List<Banner> banners = bannerRepository.selectList(
            new LambdaQueryWrapper<Banner>().orderByAsc(Banner::getSortOrder)
        );
        return Result.success(banners);
    }

    /** 添加轮播图 */
    @PostMapping("/add")
    public Result<String> add(@RequestBody Banner banner) {
        if (banner.getSortOrder() == null) banner.setSortOrder(0);
        if (banner.getStatus() == null) banner.setStatus(1);
        if (banner.getLinkType() == null) banner.setLinkType(1);
        bannerRepository.insert(banner);
        return Result.success("添加成功");
    }

    /** 更新轮播图 */
    @PostMapping("/update")
    public Result<String> update(@RequestBody Banner banner) {
        if (banner.getId() == null) return Result.error("ID不能为空");
        bannerRepository.updateById(banner);
        return Result.success("更新成功");
    }

    /** 删除轮播图 */
    @PostMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Long id) {
        bannerRepository.deleteById(id);
        return Result.success("删除成功");
    }
}
