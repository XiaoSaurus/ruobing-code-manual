package com.ruobing.codebook.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("sys_menu")
public class SysMenu {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private String path;
    private String title;
    private String icon;
    private Integer sortOrder;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}

