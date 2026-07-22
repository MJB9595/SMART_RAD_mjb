-- 승인 자리(슬롯): 관리자가 사번/이메일/비밀번호 없이 미리 정의하는 직위·권한.
-- 회원가입 신청 승인 시 신청건과 매칭되어 교직원 계정으로 채워진다.
CREATE TABLE `approval_slot` (
  `approval_slot_id`   BIGINT      NOT NULL AUTO_INCREMENT COMMENT '승인 자리 PK',
  `staff_category`     VARCHAR(20) NOT NULL COMMENT 'FACULTY/STAFF',
  `department_id`      BIGINT      NOT NULL,
  `position_id`        BIGINT      NOT NULL,
  `employment_type_id` BIGINT      NOT NULL,
  `role`               VARCHAR(20) NOT NULL COMMENT 'ADMIN/EMPLOYEE',
  `hire_date`          DATE        NULL COMMENT '예정 임용일',
  `label`              VARCHAR(100) NULL COMMENT '자리 라벨/메모',
  `status`             VARCHAR(20) NOT NULL DEFAULT 'OPEN' COMMENT 'OPEN/FILLED',
  `filled_employee_id` BIGINT      NULL COMMENT '채운 교직원 PK',
  `created_at`         DATETIME    NOT NULL,
  `updated_at`         DATETIME    NOT NULL,
  `created_by`         BIGINT      NULL,
  `updated_by`         BIGINT      NULL,
  `version`            BIGINT      NOT NULL DEFAULT 0,
  `deleted`            BOOLEAN     NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`approval_slot_id`),
  KEY `idx_slot_status` (`status`, `deleted`),
  CONSTRAINT `fk_slot_department`      FOREIGN KEY (`department_id`)      REFERENCES `department` (`department_id`),
  CONSTRAINT `fk_slot_position`        FOREIGN KEY (`position_id`)        REFERENCES `position` (`position_id`),
  CONSTRAINT `fk_slot_employment_type` FOREIGN KEY (`employment_type_id`) REFERENCES `employment_type` (`employment_type_id`)
) COMMENT='승인 자리(슬롯)';
