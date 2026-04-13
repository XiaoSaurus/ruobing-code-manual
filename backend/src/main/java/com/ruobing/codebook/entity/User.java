package com.ruobing.codebook.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user")
public class User {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    /** 鍚庡彴璐﹀彿鐧诲綍鍚嶏紙鍙┖锛屽皬绋嬪簭绾井淇＄敤鎴峰彲鏃狅級 */
    private String username;
    /** 鍚庡彴璐﹀彿瀵嗙爜锛堝綋鍓嶉」鐩部鐢ㄦ槑鏂囧瓨鍌紝鍚庣画寤鸿鏀瑰搱甯岋級 */
    private String password;
    private String openid;
    /** 寰俊寮€鏀惧钩鍙般€岀綉绔欏簲鐢ㄣ€嶆壂鐮佺櫥褰?openid锛屼笌灏忕▼搴?openid 涓嶅悓 */
    private String webOpenid;
    private String nickname;
    private String avatar;
    private Integer gender;   // 鎬у埆: 0鏈缃?1鐢?2濂?
    private String phone;
    private String email;
    /** app_user / admin */
    private String role;
    /** 1鍚敤 0绂佺敤 */
    private Integer status;
    /** 鐪侊紙灏忕▼搴忓湴鍖洪€夋嫨锛?*/
    private String province;
    /** 甯?*/
    private String city;
    /** 鍖?鍘?*/
    private String district;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}

