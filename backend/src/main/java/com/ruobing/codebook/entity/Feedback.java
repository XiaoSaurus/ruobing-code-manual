package com.ruobing.codebook.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("feedback")
public class Feedback {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String content;
    private String contact;
    private String images;
    private Boolean status;
    private String reply;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
