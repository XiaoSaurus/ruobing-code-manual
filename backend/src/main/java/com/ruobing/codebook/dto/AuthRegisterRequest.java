package com.ruobing.codebook.dto;

import lombok.Data;

@Data
public class AuthRegisterRequest {
    private String username;
    private String password;
    private String nickname;
    /** 选填，便于后续找回密码 */
    private String email;
}
