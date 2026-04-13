package com.ruobing.codebook.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("feedback")
public class Feedback {
    /** 浠呮彁浜ゆ椂鎼哄甫锛屼笉鍏ュ簱锛涚敤浜庤В鏋愬苟鍐欏叆 userId */
    @TableField(exist = false)
    private String openid;

    @TableId(type = IdType.ASSIGN_ID)
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

