package com.ruobing.codebook.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String openid;
    private String nickname;
    private String avatar;
    private Integer gender;   // 性别: 0未设置 1男 2女
    private String phone;
    private String email;
    /** 省（小程序地区选择） */
    private String province;
    /** 市 */
    private String city;
    /** 区/县 */
    private String district;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
