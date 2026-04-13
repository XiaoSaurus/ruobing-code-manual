package com.ruobing.codebook.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.*;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
@Order(2)
public class RbacSchemaPatcher implements BeanPostProcessor {

    private static final Logger log = LoggerFactory.getLogger(RbacSchemaPatcher.class);
    private static final AtomicBoolean PATCHED = new AtomicBoolean(false);

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (!(bean instanceof DataSource)) return bean;
        if (!PATCHED.compareAndSet(false, true)) return bean;
        try {
            patch((DataSource) bean);
        } catch (Exception e) {
            log.error("RBAC 表自动补齐失败", e);
        }
        return bean;
    }

    private void patch(DataSource ds) throws Exception {
        try (Connection conn = ds.getConnection()) {
            createRoleTable(conn);
            createMenuTable(conn);
            createRoleMenuTable(conn);
            seedRoles(conn);
            seedMenus(conn);
            seedRoleMenus(conn);
        }
    }

    private static void createRoleTable(Connection conn) throws SQLException {
        String sql = "CREATE TABLE IF NOT EXISTS `sys_role` ("
                + "`id` BIGINT PRIMARY KEY AUTO_INCREMENT,"
                + "`role_code` VARCHAR(32) NOT NULL,"
                + "`role_name` VARCHAR(64) NOT NULL,"
                + "`status` TINYINT NOT NULL DEFAULT 1,"
                + "`create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,"
                + "`update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,"
                + "UNIQUE KEY `uk_sys_role_code` (`role_code`)"
                + ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
        try (Statement st = conn.createStatement()) { st.execute(sql); }
    }

    private static void createMenuTable(Connection conn) throws SQLException {
        String sql = "CREATE TABLE IF NOT EXISTS `sys_menu` ("
                + "`id` BIGINT PRIMARY KEY AUTO_INCREMENT,"
                + "`path` VARCHAR(128) NOT NULL,"
                + "`title` VARCHAR(64) NOT NULL,"
                + "`icon` VARCHAR(64) DEFAULT NULL,"
                + "`sort_order` INT NOT NULL DEFAULT 0,"
                + "`status` TINYINT NOT NULL DEFAULT 1,"
                + "`create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,"
                + "`update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,"
                + "UNIQUE KEY `uk_sys_menu_path` (`path`)"
                + ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
        try (Statement st = conn.createStatement()) { st.execute(sql); }
    }

    private static void createRoleMenuTable(Connection conn) throws SQLException {
        String sql = "CREATE TABLE IF NOT EXISTS `sys_role_menu` ("
                + "`id` BIGINT PRIMARY KEY AUTO_INCREMENT,"
                + "`role_code` VARCHAR(32) NOT NULL,"
                + "`menu_id` BIGINT NOT NULL,"
                + "`create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,"
                + "UNIQUE KEY `uk_sys_role_menu` (`role_code`,`menu_id`)"
                + ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
        try (Statement st = conn.createStatement()) { st.execute(sql); }
    }

    private static void seedRoles(Connection conn) throws SQLException {
        insertRoleIfMissing(conn, "admin", "管理员");
        insertRoleIfMissing(conn, "editor", "编辑");
        insertRoleIfMissing(conn, "app_user", "访客");
    }

    private static void insertRoleIfMissing(Connection conn, String code, String name) throws SQLException {
        String check = "SELECT COUNT(*) FROM sys_role WHERE role_code=?";
        try (PreparedStatement ps = conn.prepareStatement(check)) {
            ps.setString(1, code);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next() && rs.getInt(1) > 0) return;
            }
        }
        try (PreparedStatement ps = conn.prepareStatement("INSERT INTO sys_role(role_code,role_name,status) VALUES(?,?,1)")) {
            ps.setString(1, code);
            ps.setString(2, name);
            ps.executeUpdate();
        }
    }

    private static void seedMenus(Connection conn) throws SQLException {
        insertMenuIfMissing(conn, "/home", "首页", "HomeFilled", 10);
        insertMenuIfMissing(conn, "/web-design", "网页设计", "Document", 20);
        insertMenuIfMissing(conn, "/graduation", "毕业设计", "School", 30);
        insertMenuIfMissing(conn, "/feedback", "用户反馈", "ChatDotRound", 40);
        insertMenuIfMissing(conn, "/changelog", "更新日志", "List", 50);
        insertMenuIfMissing(conn, "/user-admin", "用户管理", "UserFilled", 60);
        insertMenuIfMissing(conn, "/rbac", "角色权限", "Lock", 70);
        insertMenuIfMissing(conn, "/profile", "个人资料", "User", 80);
        insertMenuIfMissing(conn, "/about", "关于我们", "InfoFilled", 90);
    }

    private static void insertMenuIfMissing(Connection conn, String path, String title, String icon, int sort) throws SQLException {
        String check = "SELECT COUNT(*) FROM sys_menu WHERE path=?";
        try (PreparedStatement ps = conn.prepareStatement(check)) {
            ps.setString(1, path);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next() && rs.getInt(1) > 0) return;
            }
        }
        try (PreparedStatement ps = conn.prepareStatement("INSERT INTO sys_menu(path,title,icon,sort_order,status) VALUES(?,?,?,?,1)")) {
            ps.setString(1, path);
            ps.setString(2, title);
            ps.setString(3, icon);
            ps.setInt(4, sort);
            ps.executeUpdate();
        }
    }

    private static void seedRoleMenus(Connection conn) throws SQLException {
        bindRoleMenuByPath(conn, "admin", "/home");
        bindRoleMenuByPath(conn, "admin", "/web-design");
        bindRoleMenuByPath(conn, "admin", "/graduation");
        bindRoleMenuByPath(conn, "admin", "/feedback");
        bindRoleMenuByPath(conn, "admin", "/changelog");
        bindRoleMenuByPath(conn, "admin", "/user-admin");
        bindRoleMenuByPath(conn, "admin", "/rbac");
        bindRoleMenuByPath(conn, "admin", "/profile");
        bindRoleMenuByPath(conn, "admin", "/about");

        bindRoleMenuByPath(conn, "editor", "/home");
        bindRoleMenuByPath(conn, "editor", "/web-design");
        bindRoleMenuByPath(conn, "editor", "/graduation");
        bindRoleMenuByPath(conn, "editor", "/profile");
        bindRoleMenuByPath(conn, "editor", "/about");

        bindRoleMenuByPath(conn, "app_user", "/home");
        bindRoleMenuByPath(conn, "app_user", "/web-design");
        bindRoleMenuByPath(conn, "app_user", "/graduation");
        bindRoleMenuByPath(conn, "app_user", "/profile");
        bindRoleMenuByPath(conn, "app_user", "/about");
    }

    private static void bindRoleMenuByPath(Connection conn, String roleCode, String path) throws SQLException {
        Long menuId = null;
        try (PreparedStatement ps = conn.prepareStatement("SELECT id FROM sys_menu WHERE path=? LIMIT 1")) {
            ps.setString(1, path);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) menuId = rs.getLong(1);
            }
        }
        if (menuId == null) return;
        try (PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) FROM sys_role_menu WHERE role_code=? AND menu_id=?")) {
            ps.setString(1, roleCode);
            ps.setLong(2, menuId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next() && rs.getInt(1) > 0) return;
            }
        }
        try (PreparedStatement ps = conn.prepareStatement("INSERT INTO sys_role_menu(role_code,menu_id) VALUES(?,?)")) {
            ps.setString(1, roleCode);
            ps.setLong(2, menuId);
            ps.executeUpdate();
        }
    }
}
