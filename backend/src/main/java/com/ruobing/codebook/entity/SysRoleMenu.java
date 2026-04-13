package com.ruobing.codebook.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("sys_role_menu")
public class SysRoleMenu {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private String roleCode;
    private Long menuId;
    private LocalDateTime createTime;
}

