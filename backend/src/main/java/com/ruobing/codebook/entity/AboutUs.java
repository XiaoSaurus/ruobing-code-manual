package com.ruobing.codebook.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("about_us")
public class AboutUs {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String content;
    private LocalDateTime updateTime;
}
