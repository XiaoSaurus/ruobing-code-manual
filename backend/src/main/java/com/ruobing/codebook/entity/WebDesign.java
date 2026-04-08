package com.ruobing.codebook.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("web_design")
public class WebDesign {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String description;
    private String content;
    private String coverImage;
    private String tags;
    private Integer views;
    private Integer likes;
    private Integer favorites;
    private Integer sortOrder;
    private Boolean isHot;
    private Boolean isLatest;
    private Boolean status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
