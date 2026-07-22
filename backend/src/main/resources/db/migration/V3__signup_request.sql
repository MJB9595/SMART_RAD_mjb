-- 회원가입 신청 (관리자 승인 시 교직원 계정으로 전환)
CREATE TABLE `signup_request` (
  `signup_request_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '회원가입 신청 PK',
  `name`         VARCHAR(50)  NOT NULL COMMENT '신청자 이름',
  `email`        VARCHAR(100) NOT NULL COMMENT '이메일(아이디)',
  `password`     VARCHAR(255) NOT NULL COMMENT 'BCrypt 해시',
  `school`       VARCHAR(100) NOT NULL COMMENT '학교명',
  `status`       VARCHAR(20)  NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING/APPROVED/REJECTED',
  `requested_at` DATETIME     NOT NULL COMMENT '신청 일시',
  `processed_at` DATETIME     NULL     COMMENT '처리 일시',
  `processed_by` BIGINT       NULL     COMMENT '처리자(교직원 PK)',
  `created_at`   DATETIME     NOT NULL,
  `updated_at`   DATETIME     NOT NULL,
  `created_by`   BIGINT       NULL,
  `updated_by`   BIGINT       NULL,
  `version`      BIGINT       NOT NULL DEFAULT 0,
  `deleted`      BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`signup_request_id`),
  KEY `idx_signup_status` (`status`, `deleted`)
) COMMENT='회원가입 신청';
