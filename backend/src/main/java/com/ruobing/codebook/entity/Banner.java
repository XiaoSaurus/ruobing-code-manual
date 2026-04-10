package com.ruobing.codebook.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("banner")
public class Banner {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 标题 */
    private String title;

    /** 副标题/描述 */
    private String subtitle;

    /** 图片URL */
    private String imageUrl;

    /** 链接类型: 1无链接 2网页设计 3毕业设计 4外部链接 */
    private Integer linkType;

    /** 关联资源ID(web_design或graduation_project) */
    private Long linkId;

    /** 外部链接URL */
    private String linkUrl;

    /** 排序顺序(越小越靠前) */
    private Integer sortOrder;

    /** 状态: 0禁用 1启用 */
    private Integer status;

    /** 创建时间 */
    private LocalDateTime createTime;

    /** 更新时间 */
    private LocalDateTime updateTime;
}
