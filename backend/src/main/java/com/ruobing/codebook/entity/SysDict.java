package com.ruobing.codebook.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("sys_dict")
public class SysDict {

    @TableId(type = IdType.AUTO)
    private Long id;
    /** 唯一键，如 legal_user_agreement */
    private String dictKey;
    /** 文本内容（可存 HTML） */
    private String dictValue;
    private String remark;
    private LocalDateTime updateTime;
}
