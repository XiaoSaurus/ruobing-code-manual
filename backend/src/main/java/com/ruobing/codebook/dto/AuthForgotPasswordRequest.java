package com.ruobing.codebook.dto;

import lombok.Data;

@Data
public class AuthForgotPasswordRequest {
    private String username;
    /** 须与账号绑定的邮箱一致 */
    private String email;
    private String newPassword;
}
