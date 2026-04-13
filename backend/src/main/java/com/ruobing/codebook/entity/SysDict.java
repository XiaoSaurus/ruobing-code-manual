package com.ruobing.codebook.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("sys_dict")
public class SysDict {

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    /** 鍞竴閿紝濡?legal_user_agreement */
    private String dictKey;
    /** 鏂囨湰鍐呭锛堝彲瀛?HTML锛?*/
    private String dictValue;
    private String remark;
    private LocalDateTime updateTime;
}

