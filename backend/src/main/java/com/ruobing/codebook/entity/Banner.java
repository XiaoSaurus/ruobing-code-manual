package com.ruobing.codebook.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("banner")
public class Banner {

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /** 鏍囬 */
    private String title;

    /** 鍓爣棰?鎻忚堪 */
    private String subtitle;

    /** 鍥剧墖URL */
    private String imageUrl;

    /** 閾炬帴绫诲瀷: 1鏃犻摼鎺?2缃戦〉璁捐 3姣曚笟璁捐 4澶栭儴閾炬帴 */
    private Integer linkType;

    /** 鍏宠仈璧勬簮ID(web_design鎴杇raduation_project) */
    private Long linkId;

    /** 澶栭儴閾炬帴URL */
    private String linkUrl;

    /** 鎺掑簭椤哄簭(瓒婂皬瓒婇潬鍓? */
    private Integer sortOrder;

    /** 鐘舵€? 0绂佺敤 1鍚敤 */
    private Integer status;

    /** 鍒涘缓鏃堕棿 */
    private LocalDateTime createTime;

    /** 鏇存柊鏃堕棿 */
    private LocalDateTime updateTime;
}

