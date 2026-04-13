-- Mock 反馈数据（开发/演示用）
-- 使用前请先：USE ruobing_codebook;
-- 关联用户：与未配置微信 AppSecret 时登录使用的 openid 一致（debug_openid_stable），便于本地联调「反馈记录」页。

USE ruobing_codebook;

-- 若无该用户则插入一条，避免外键失败
INSERT INTO `user` (`openid`, `nickname`, `gender`)
SELECT 'debug_openid_stable', 'Mock用户', 0
FROM (SELECT 1 AS _) AS t
WHERE NOT EXISTS (SELECT 1 FROM `user` WHERE `openid` = 'debug_openid_stable');

INSERT INTO `feedback` (`user_id`, `content`, `contact`, `status`, `reply`, `create_time`, `update_time`)
VALUES
(
  (SELECT `id` FROM `user` WHERE `openid` = 'debug_openid_stable' LIMIT 1),
  '希望小程序能增加代码片段一键复制优化，有时长代码滚动不太方便。',
  NULL,
  0,
  NULL,
  '2026-04-08 10:20:00',
  '2026-04-08 10:20:00'
),
(
  (SELECT `id` FROM `user` WHERE `openid` = 'debug_openid_stable' LIMIT 1),
  '毕业设计栏目能否支持按学校筛选？',
  'student@example.com',
  1,
  '感谢建议，后续版本会考虑增加筛选维度。',
  '2026-04-09 14:05:00',
  '2026-04-10 09:30:00'
),
(
  (SELECT `id` FROM `user` WHERE `openid` = 'debug_openid_stable' LIMIT 1),
  '主题切换很赞，深色模式下部分标题对比度可以再高一点。',
  '13800138000',
  0,
  NULL,
  '2026-04-10 16:40:00',
  '2026-04-10 16:40:00'
),
(
  (SELECT `id` FROM `user` WHERE `openid` = 'debug_openid_stable' LIMIT 1),
  '反馈入口藏得有点深，能否在首页也放一个入口？',
  NULL,
  1,
  '已记录，产品会评估首页信息架构。',
  '2026-04-11 11:00:00',
  '2026-04-11 18:00:00'
),
(
  (SELECT `id` FROM `user` WHERE `openid` = 'debug_openid_stable' LIMIT 1),
  '网页设计详情页加载大图时偶尔会闪一下，能否加骨架屏？',
  NULL,
  0,
  NULL,
  '2026-04-12 09:15:00',
  '2026-04-12 09:15:00'
),
(
  (SELECT `id` FROM `user` WHERE `openid` = 'debug_openid_stable' LIMIT 1),
  '更新日志能否支持 RSS 或邮件订阅？',
  'rss@example.com',
  1,
  '感谢关注，订阅能力在规划中。',
  '2026-04-12 20:00:00',
  '2026-04-12 21:10:00'
);
