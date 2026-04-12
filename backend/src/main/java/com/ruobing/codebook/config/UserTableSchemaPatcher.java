package com.ruobing.codebook.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 旧库缺少 province/city/district/gender 时，在 DataSource 就绪后自动 ALTER，避免 Flyway/SQL 版本差异导致迁移未执行。
 */
@Component
@Order(0)
public class UserTableSchemaPatcher implements BeanPostProcessor {

    private static final Logger log = LoggerFactory.getLogger(UserTableSchemaPatcher.class);

    private static final AtomicBoolean PATCHED = new AtomicBoolean(false);

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (!(bean instanceof DataSource)) {
            return bean;
        }
        if (!PATCHED.compareAndSet(false, true)) {
            return bean;
        }
        try {
            patch((DataSource) bean);
        } catch (Exception e) {
            log.error("自动补齐 user 表字段失败，请手动执行 database/fix_user_region_columns.sql", e);
            throw new IllegalStateException("user 表结构升级失败: " + e.getMessage(), e);
        }
        return bean;
    }

    private void patch(DataSource dataSource) throws SQLException {
        try (Connection conn = dataSource.getConnection()) {
            String schema = currentDatabase(conn);
            if (schema == null || schema.isEmpty()) {
                log.warn("无法取得当前库名，跳过 user 表字段补齐");
                return;
            }
            ensureColumn(conn, schema, "user", "gender", "TINYINT NOT NULL DEFAULT 0 COMMENT '0未设置 1男 2女'");
            ensureColumn(conn, schema, "user", "province", "VARCHAR(64) DEFAULT NULL COMMENT '省'");
            ensureColumn(conn, schema, "user", "city", "VARCHAR(64) DEFAULT NULL COMMENT '市'");
            ensureColumn(conn, schema, "user", "district", "VARCHAR(64) DEFAULT NULL COMMENT '区/县'");
        }
    }

    private static String currentDatabase(Connection conn) throws SQLException {
        try (Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery("SELECT DATABASE()")) {
            if (rs.next()) {
                return rs.getString(1);
            }
        }
        return null;
    }

    private static void ensureColumn(Connection conn, String schema, String table, String column, String definition)
            throws SQLException {
        String check = "SELECT COUNT(*) FROM information_schema.COLUMNS "
                + "WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?";
        try (PreparedStatement ps = conn.prepareStatement(check)) {
            ps.setString(1, schema);
            ps.setString(2, table);
            ps.setString(3, column);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next() && rs.getInt(1) > 0) {
                    return;
                }
            }
        }
        String alter = "ALTER TABLE `" + table + "` ADD COLUMN `" + column + "` " + definition;
        try (Statement st = conn.createStatement()) {
            st.execute(alter);
            log.info("已自动为库 [{}] 表 [{}] 增加字段 [{}]", schema, table, column);
        } catch (SQLException e) {
            if (e.getMessage() != null && e.getMessage().contains("Duplicate column")) {
                log.debug("字段已存在，跳过: {}.{}", table, column);
                return;
            }
            throw e;
        }
    }
}
