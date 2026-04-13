package com.ruobing.codebook.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("changelog")
public class Changelog {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private String version;
    private String title;
    private String content;
    private String type;
    private LocalDateTime createTime;
}

