-- ═══════════════════════════════════════════════════════════════════════
-- 교직원 인사관리 시스템 — 통합 ERD (ERDCloud Import용)
--  · 예시 스코프(급여 명세서 / 인사기록카드 6종 / 휴가정책) 반영
--  · 데이터 무결성: 모든 PK AUTO_INCREMENT + 명시적 FOREIGN KEY + version(낙관락)
--  · ERDCloud 자동 관계추론: PK를 <테이블>_id 로 통일 → FK 컬럼과 이름 매칭
--  사용법: erdcloud.com → 좌측 하단 Import → 아래 전체 붙여넣기
-- ═══════════════════════════════════════════════════════════════════════

-- ══════════════ 기준정보 ══════════════
CREATE TABLE `department` (
  `department_id`        BIGINT       NOT NULL AUTO_INCREMENT COMMENT '조직 PK',
  `department_name`      VARCHAR(100) NOT NULL COMMENT '조직명',
  `org_type`             VARCHAR(20)  NOT NULL COMMENT 'ACADEMIC(학사)/ADMINISTRATIVE(행정)',
  `parent_department_id` BIGINT       NULL COMMENT '상위조직(자기참조)',
  `headcount`            INT          NOT NULL DEFAULT 0 COMMENT '정원',
  `active`               BOOLEAN      NOT NULL DEFAULT TRUE,
  `created_at`           DATETIME     NOT NULL,
  `updated_at`           DATETIME     NOT NULL,
  `created_by`           BIGINT       NULL,
  `updated_by`           BIGINT       NULL,
  `version`              BIGINT       NOT NULL DEFAULT 0,
  `deleted`              BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`department_id`)
) COMMENT='부서/조직';

CREATE TABLE `position` (
  `position_id`   BIGINT       NOT NULL AUTO_INCREMENT COMMENT '직급 PK',
  `position_name` VARCHAR(100) NOT NULL COMMENT '직급명',
  `category`      VARCHAR(20)  NOT NULL COMMENT 'FACULTY/STAFF/COMMON',
  `level`         INT          NOT NULL DEFAULT 0 COMMENT '직급 레벨',
  `active`        BOOLEAN      NOT NULL DEFAULT TRUE,
  `created_at`    DATETIME     NOT NULL,
  `updated_at`    DATETIME     NOT NULL,
  `created_by`    BIGINT       NULL,
  `updated_by`    BIGINT       NULL,
  `version`       BIGINT       NOT NULL DEFAULT 0,
  `deleted`       BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`position_id`)
) COMMENT='직급';

CREATE TABLE `employment_type` (
  `employment_type_id`   BIGINT       NOT NULL AUTO_INCREMENT COMMENT '임용구분 PK',
  `employment_type_name` VARCHAR(100) NOT NULL COMMENT '임용구분명',
  `active`               BOOLEAN      NOT NULL DEFAULT TRUE,
  `created_at`           DATETIME     NOT NULL,
  `updated_at`           DATETIME     NOT NULL,
  `created_by`           BIGINT       NULL,
  `updated_by`           BIGINT       NULL,
  `version`              BIGINT       NOT NULL DEFAULT 0,
  `deleted`              BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`employment_type_id`)
) COMMENT='임용구분';

-- ══════════════ ① 인사기록 (교직원 마스터 + 6종 상세) ══════════════
CREATE TABLE `employee` (
  `employee_id`         BIGINT       NOT NULL AUTO_INCREMENT COMMENT '교직원 PK',
  `employee_no`         VARCHAR(30)  NOT NULL COMMENT '사번',
  `department_id`       BIGINT       NOT NULL COMMENT '소속',
  `position_id`         BIGINT       NOT NULL COMMENT '직급',
  `employment_type_id`  BIGINT       NOT NULL COMMENT '임용구분',
  `name`                VARCHAR(100) NOT NULL COMMENT '성명',
  `staff_category`      VARCHAR(20)  NOT NULL COMMENT 'FACULTY(교원)/STAFF(직원)',
  `email`               VARCHAR(100) NOT NULL COMMENT '로그인 ID',
  `password`            VARCHAR(255) NOT NULL COMMENT 'BCrypt',
  `role`                VARCHAR(20)  NOT NULL COMMENT 'JWT 대표권한',
  `phone`               VARCHAR(30)  NULL,
  `birth_date`          DATE         NULL,
  `gender`              VARCHAR(10)  NULL,
  `address`             VARCHAR(255) NULL,
  `emergency_contact`   VARCHAR(50)  NULL,
  `hire_date`           DATE         NOT NULL COMMENT '임용일',
  `resignation_date`    DATE         NULL,
  `employee_status_code` VARCHAR(30) NOT NULL COMMENT 'EMPLOYED/ON_LEAVE/RESIGNED',
  `bank_name`           VARCHAR(100) NULL,
  `account_number`      VARCHAR(100) NULL,
  `account_holder`      VARCHAR(100) NULL,
  `created_at`          DATETIME     NOT NULL,
  `updated_at`          DATETIME     NOT NULL,
  `created_by`          BIGINT       NULL,
  `updated_by`          BIGINT       NULL,
  `version`             BIGINT       NOT NULL DEFAULT 0,
  `deleted`             BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `uq_employee_no` (`employee_no`),
  UNIQUE KEY `uq_employee_email` (`email`)
) COMMENT='교직원(인사기록카드)';

CREATE TABLE `employee_education` (
  `employee_education_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '학력 PK',
  `employee_id`           BIGINT       NOT NULL,
  `school_name`           VARCHAR(200) NOT NULL COMMENT '학교명',
  `major`                 VARCHAR(200) NULL COMMENT '전공',
  `degree`                VARCHAR(100) NULL COMMENT '학위',
  `admission_date`        DATE         NULL COMMENT '입학일',
  `graduation_date`       DATE         NULL COMMENT '졸업일',
  `status`                VARCHAR(50)  NULL COMMENT '졸업/재학/수료/중퇴',
  `created_at`            DATETIME     NOT NULL,
  `updated_at`            DATETIME     NOT NULL,
  `created_by`            BIGINT       NULL,
  `updated_by`            BIGINT       NULL,
  `version`               BIGINT       NOT NULL DEFAULT 0,
  `deleted`               BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`employee_education_id`)
) COMMENT='학력사항';

CREATE TABLE `employee_career` (
  `employee_career_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '경력 PK',
  `employee_id`        BIGINT       NOT NULL,
  `company_name`       VARCHAR(200) NOT NULL COMMENT '기관/회사명',
  `department`         VARCHAR(100) NULL COMMENT '부서',
  `position`           VARCHAR(100) NULL COMMENT '직위',
  `job_description`    VARCHAR(500) NULL COMMENT '담당업무',
  `start_date`         DATE         NOT NULL COMMENT '시작일',
  `end_date`           DATE         NULL COMMENT '종료일',
  `created_at`         DATETIME     NOT NULL,
  `updated_at`         DATETIME     NOT NULL,
  `created_by`         BIGINT       NULL,
  `updated_by`         BIGINT       NULL,
  `version`            BIGINT       NOT NULL DEFAULT 0,
  `deleted`            BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`employee_career_id`)
) COMMENT='경력사항';

CREATE TABLE `employee_certificate` (
  `employee_certificate_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '자격증 PK',
  `employee_id`             BIGINT       NOT NULL,
  `name`                    VARCHAR(200) NOT NULL COMMENT '자격증명',
  `issuer`                  VARCHAR(100) NULL COMMENT '발급기관',
  `cert_number`             VARCHAR(100) NULL COMMENT '자격번호',
  `acquired_date`           DATE         NULL COMMENT '취득일',
  `expiry_date`             DATE         NULL COMMENT '만료일',
  `created_at`              DATETIME     NOT NULL,
  `updated_at`              DATETIME     NOT NULL,
  `created_by`              BIGINT       NULL,
  `updated_by`              BIGINT       NULL,
  `version`                 BIGINT       NOT NULL DEFAULT 0,
  `deleted`                 BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`employee_certificate_id`)
) COMMENT='자격증정보';

CREATE TABLE `employee_family` (
  `employee_family_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '가족 PK',
  `employee_id`        BIGINT       NOT NULL,
  `family_name`        VARCHAR(100) NOT NULL COMMENT '가족성명',
  `family_relation`    VARCHAR(50)  NOT NULL COMMENT '관계(부/모/배우자 등)',
  `birth_date`         DATE         NULL,
  `job`                VARCHAR(100) NULL,
  `living_together`    BOOLEAN      NULL COMMENT '동거여부',
  `dependent`          BOOLEAN      NULL COMMENT '부양여부',
  `disabled`           BOOLEAN      NULL COMMENT '장애여부',
  `created_at`         DATETIME     NOT NULL,
  `updated_at`         DATETIME     NOT NULL,
  `created_by`         BIGINT       NULL,
  `updated_by`         BIGINT       NULL,
  `version`            BIGINT       NOT NULL DEFAULT 0,
  `deleted`            BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`employee_family_id`)
) COMMENT='가족사항';

CREATE TABLE `employee_military` (
  `employee_military_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '병역 PK',
  `employee_id`          BIGINT       NOT NULL,
  `military_type`        VARCHAR(100) NULL COMMENT '군별',
  `military_rank`        VARCHAR(100) NULL COMMENT '계급',
  `discharge_type`       VARCHAR(100) NULL COMMENT '병역구분(만기/면제 등)',
  `enlistment_date`      DATE         NULL,
  `discharge_date`       DATE         NULL,
  `exemption_reason`     VARCHAR(200) NULL COMMENT '면제사유',
  `created_at`           DATETIME     NOT NULL,
  `updated_at`           DATETIME     NOT NULL,
  `created_by`           BIGINT       NULL,
  `updated_by`           BIGINT       NULL,
  `version`              BIGINT       NOT NULL DEFAULT 0,
  `deleted`              BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`employee_military_id`)
) COMMENT='병역정보';

CREATE TABLE `employee_language` (
  `employee_language_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '어학 PK',
  `employee_id`          BIGINT       NOT NULL,
  `language_name`        VARCHAR(100) NOT NULL COMMENT '언어',
  `reading_level`        VARCHAR(50)  NULL,
  `writing_level`        VARCHAR(50)  NULL,
  `speaking_level`       VARCHAR(50)  NULL,
  `test_name`            VARCHAR(100) NULL COMMENT '시험명',
  `test_score`           VARCHAR(100) NULL COMMENT '점수',
  `issued_date`          DATE         NULL,
  `issuer`               VARCHAR(100) NULL,
  `created_at`           DATETIME     NOT NULL,
  `updated_at`           DATETIME     NOT NULL,
  `created_by`           BIGINT       NULL,
  `updated_by`           BIGINT       NULL,
  `version`              BIGINT       NOT NULL DEFAULT 0,
  `deleted`              BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`employee_language_id`)
) COMMENT='어학정보';

CREATE TABLE `employee_oauth` (
  `employee_oauth_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '소셜계정 PK',
  `employee_id`       BIGINT       NOT NULL,
  `provider`          VARCHAR(20)  NOT NULL COMMENT 'KAKAO/GOOGLE/NAVER',
  `provider_user_id`  VARCHAR(100) NOT NULL COMMENT '소셜 고유 ID',
  `provider_email`    VARCHAR(255) NULL,
  `created_at`        DATETIME     NOT NULL,
  `updated_at`        DATETIME     NOT NULL,
  PRIMARY KEY (`employee_oauth_id`)
) COMMENT='소셜회원정보';

-- ══════════════ ② 인사발령 ══════════════
CREATE TABLE `employee_appointment` (
  `employee_appointment_id` BIGINT        NOT NULL AUTO_INCREMENT COMMENT '발령 PK',
  `document_number`         VARCHAR(30)   NOT NULL COMMENT 'APT-2026-001',
  `employee_id`             BIGINT        NOT NULL COMMENT '발령대상',
  `appointment_type`        VARCHAR(50)   NOT NULL COMMENT 'HIRE/PROMOTION/TRANSFER/CONCURRENT',
  `appointment_date`        DATE          NOT NULL,
  `effective_date`          DATE          NULL COMMENT '발효일',
  `from_department_id`      BIGINT        NULL,
  `to_department_id`        BIGINT        NULL,
  `from_position_id`        BIGINT        NULL,
  `to_position_id`          BIGINT        NULL,
  `reason`                  VARCHAR(500)  NULL,
  `approval_status`         VARCHAR(20)   NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING/APPROVED/REJECTED',
  `approver_id`             BIGINT        NULL,
  `approved_at`             DATETIME      NULL,
  `registered_by`           BIGINT        NOT NULL COMMENT '등록자',
  `created_at`              DATETIME      NOT NULL,
  `updated_at`              DATETIME      NOT NULL,
  `created_by`              BIGINT        NULL,
  `updated_by`              BIGINT        NULL,
  `version`                 BIGINT        NOT NULL DEFAULT 0,
  `deleted`                 BOOLEAN       NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`employee_appointment_id`),
  UNIQUE KEY `uq_appointment_document_number` (`document_number`)
) COMMENT='인사발령';

-- ══════════════ ③ 근태 ══════════════
CREATE TABLE `attendance` (
  `attendance_id`          BIGINT      NOT NULL AUTO_INCREMENT COMMENT '근태 PK',
  `employee_id`            BIGINT      NOT NULL,
  `work_date`              DATE        NOT NULL,
  `check_in_time`          TIME        NULL,
  `check_out_time`         TIME        NULL,
  `work_minutes`           INT         NULL,
  `overtime_minutes`       INT         NULL,
  `night_work_minutes`     INT         NULL,
  `late_minutes`           INT         NULL,
  `early_leave_minutes`    INT         NULL,
  `attendance_status_code` VARCHAR(30) NOT NULL COMMENT 'PRESENT/LATE/ABSENT/LEAVE ...',
  `remark`                 VARCHAR(300) NULL,
  `created_at`             DATETIME    NOT NULL,
  `updated_at`             DATETIME    NOT NULL,
  `created_by`             BIGINT      NULL,
  `updated_by`             BIGINT      NULL,
  `version`                BIGINT      NOT NULL DEFAULT 0,
  `deleted`                BOOLEAN     NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`attendance_id`),
  UNIQUE KEY `uq_attendance_employee_date` (`employee_id`, `work_date`)
) COMMENT='근태';

-- ══════════════ ④ 휴가 (유형/정책/신청/잔여) ══════════════
CREATE TABLE `leave_type` (
  `leave_type_id`   BIGINT       NOT NULL AUTO_INCREMENT COMMENT '휴가유형 PK',
  `leave_type_name` VARCHAR(100) NOT NULL COMMENT '휴가유형명',
  `paid_yn`         BOOLEAN      NOT NULL COMMENT '유급여부',
  `default_days`    DECIMAL(4,1) NULL COMMENT '기본부여일수',
  `note`            VARCHAR(255) NULL,
  `active`          BOOLEAN      NOT NULL DEFAULT TRUE,
  `created_at`      DATETIME     NOT NULL,
  `updated_at`      DATETIME     NOT NULL,
  `created_by`      BIGINT       NULL,
  `updated_by`      BIGINT       NULL,
  `version`         BIGINT       NOT NULL DEFAULT 0,
  `deleted`         BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`leave_type_id`)
) COMMENT='휴가마스터';

CREATE TABLE `leave_policy` (
  `leave_policy_id`     BIGINT       NOT NULL AUTO_INCREMENT COMMENT '휴가정책 PK',
  `position_id`         BIGINT       NULL COMMENT '적용 직급(NULL=전체)',
  `annual_leave_days`   DECIMAL(4,1) NOT NULL COMMENT '연차일수',
  `max_carry_over_days` DECIMAL(4,1) NULL COMMENT '이월한도',
  `half_day_allowed`    BOOLEAN      NULL COMMENT '반차허용',
  `note`                VARCHAR(255) NULL,
  `created_at`          DATETIME     NOT NULL,
  `updated_at`          DATETIME     NOT NULL,
  `version`             BIGINT       NOT NULL DEFAULT 0,
  `deleted`             BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`leave_policy_id`)
) COMMENT='직급별휴가정책';

CREATE TABLE `leave_request` (
  `leave_request_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '휴가신청 PK',
  `document_number`  VARCHAR(30)  NOT NULL COMMENT 'LVE-2026-001',
  `leave_type_id`    BIGINT       NOT NULL,
  `employee_id`      BIGINT       NOT NULL,
  `start_date`       DATE         NOT NULL,
  `end_date`         DATE         NOT NULL,
  `leave_days`       DECIMAL(4,1) NOT NULL,
  `reason`           TEXT         NULL,
  `status`           VARCHAR(30)  NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING/APPROVED/REJECTED',
  `approver_id`      BIGINT       NULL,
  `approved_at`      DATETIME     NULL,
  `created_at`       DATETIME     NOT NULL,
  `updated_at`       DATETIME     NOT NULL,
  `created_by`       BIGINT       NULL,
  `updated_by`       BIGINT       NULL,
  `version`          BIGINT       NOT NULL DEFAULT 0,
  `deleted`          BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`leave_request_id`),
  UNIQUE KEY `uq_leave_document_number` (`document_number`)
) COMMENT='휴가신청내역';

CREATE TABLE `employee_leave_balance` (
  `employee_leave_balance_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '잔여휴가 PK',
  `leave_type_id`             BIGINT       NOT NULL,
  `employee_id`               BIGINT       NOT NULL,
  `year`                      INT          NOT NULL COMMENT '기준연도',
  `total_days`                DECIMAL(5,1) NOT NULL COMMENT '부여일수',
  `used_days`                 DECIMAL(5,1) NOT NULL DEFAULT 0 COMMENT '사용일수',
  `remain_days`               DECIMAL(5,1) NOT NULL COMMENT '잔여일수',
  `expire_date`               DATE         NULL,
  `created_at`                DATETIME     NOT NULL,
  `updated_at`                DATETIME     NOT NULL,
  `created_by`                BIGINT       NULL,
  `updated_by`                BIGINT       NULL,
  `version`                   BIGINT       NOT NULL DEFAULT 0,
  `deleted`                   BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`employee_leave_balance_id`),
  UNIQUE KEY `uq_balance_emp_type_year` (`employee_id`, `leave_type_id`, `year`)
) COMMENT='잔여휴가';

-- ══════════════ ⑤ 급여 (수당마스터/사원수당/급여항목/명세서/명세상세) ══════════════
CREATE TABLE `allowance` (
  `allowance_id`   BIGINT       NOT NULL AUTO_INCREMENT COMMENT '수당 PK',
  `allowance_name` VARCHAR(100) NOT NULL COMMENT '수당명',
  `taxable`        BOOLEAN      NOT NULL COMMENT '과세여부',
  `fixed`          BOOLEAN      NOT NULL COMMENT '고정여부',
  `active`         BOOLEAN      NOT NULL DEFAULT TRUE,
  `created_at`     DATETIME     NOT NULL,
  `updated_at`     DATETIME     NOT NULL,
  `version`        BIGINT       NOT NULL DEFAULT 0,
  `deleted`        BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`allowance_id`)
) COMMENT='수당마스터';

CREATE TABLE `employee_allowance` (
  `employee_allowance_id` BIGINT        NOT NULL AUTO_INCREMENT COMMENT '사원수당 PK',
  `employee_id`           BIGINT        NOT NULL,
  `allowance_id`          BIGINT        NOT NULL,
  `amount`                DECIMAL(15,2) NOT NULL COMMENT '금액',
  `start_date`            DATE          NULL,
  `end_date`              DATE          NULL,
  `active`                BOOLEAN       NOT NULL DEFAULT TRUE,
  `created_at`            DATETIME      NOT NULL,
  `updated_at`            DATETIME      NOT NULL,
  `version`               BIGINT        NOT NULL DEFAULT 0,
  `deleted`               BOOLEAN       NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`employee_allowance_id`)
) COMMENT='사원별 수당';

CREATE TABLE `payroll_item_master` (
  `payroll_item_master_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '급여항목 PK',
  `item_name`              VARCHAR(100) NOT NULL COMMENT '항목명',
  `item_type_code`         VARCHAR(30)  NOT NULL COMMENT 'PAY(지급)/DEDUCT(공제)',
  `taxable`                BOOLEAN      NOT NULL COMMENT '과세여부',
  `fixed`                  BOOLEAN      NOT NULL COMMENT '고정여부',
  `active`                 BOOLEAN      NOT NULL DEFAULT TRUE,
  `created_at`             DATETIME     NOT NULL,
  `updated_at`             DATETIME     NOT NULL,
  `version`                BIGINT       NOT NULL DEFAULT 0,
  `deleted`                BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`payroll_item_master_id`)
) COMMENT='급여항목마스터';

CREATE TABLE `payroll` (
  `payroll_id`               BIGINT        NOT NULL AUTO_INCREMENT COMMENT '급여명세서 PK',
  `employee_id`              BIGINT        NOT NULL,
  `payroll_year_month`       VARCHAR(6)    NOT NULL COMMENT '급여년월(YYYYMM)',
  `payment_date`             DATE          NULL COMMENT '지급일',
  `total_pay_amount`         DECIMAL(15,2) NOT NULL COMMENT '지급총액',
  `total_deduction_amount`   DECIMAL(15,2) NOT NULL COMMENT '공제총액',
  `real_pay_amount`          DECIMAL(15,2) NOT NULL COMMENT '실지급액',
  `payroll_status_code`      VARCHAR(30)   NULL COMMENT 'DRAFT/CONFIRMED/PAID',
  `employee_name_snapshot`   VARCHAR(100)  NULL COMMENT '당시 성명 스냅샷',
  `department_name_snapshot` VARCHAR(100)  NULL COMMENT '당시 소속 스냅샷',
  `position_name_snapshot`   VARCHAR(100)  NULL COMMENT '당시 직급 스냅샷',
  `created_at`               DATETIME      NOT NULL,
  `updated_at`               DATETIME      NOT NULL,
  `created_by`               BIGINT        NULL,
  `updated_by`               BIGINT        NULL,
  `version`                  BIGINT        NOT NULL DEFAULT 0,
  `deleted`                  BOOLEAN       NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`payroll_id`),
  UNIQUE KEY `uq_payroll_emp_month` (`employee_id`, `payroll_year_month`)
) COMMENT='급여명세서';

CREATE TABLE `payroll_detail` (
  `payroll_detail_id`      BIGINT        NOT NULL AUTO_INCREMENT COMMENT '급여상세 PK',
  `payroll_id`             BIGINT        NOT NULL,
  `payroll_item_master_id` BIGINT        NOT NULL,
  `item_name_snapshot`     VARCHAR(100)  NOT NULL COMMENT '항목명 스냅샷',
  `item_type_code`         VARCHAR(30)   NOT NULL COMMENT 'PAY/DEDUCT',
  `amount`                 DECIMAL(15,2) NOT NULL,
  `created_at`             DATETIME      NOT NULL,
  `updated_at`             DATETIME      NOT NULL,
  `version`                BIGINT        NOT NULL DEFAULT 0,
  `deleted`                BOOLEAN       NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`payroll_detail_id`)
) COMMENT='급여명세상세';

-- ══════════════ ⑥ 복지/증명 ══════════════
CREATE TABLE `employee_event_support` (
  `employee_event_support_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '경조비 PK',
  `employee_id`               BIGINT       NOT NULL,
  `document_number`           VARCHAR(30)  NOT NULL COMMENT 'ES-2026-001',
  `event_type`                VARCHAR(100) NOT NULL COMMENT '결혼/출산/사망 등',
  `family_relation`           VARCHAR(100) NULL,
  `target_name`               VARCHAR(100) NOT NULL COMMENT '대상자',
  `application_date`          DATE         NOT NULL,
  `event_date`                DATE         NOT NULL,
  `requested_amount`          DECIMAL(12,0) NOT NULL COMMENT '신청금액',
  `event_location`            VARCHAR(255) NULL,
  `bank_name`                 VARCHAR(100) NULL,
  `account_number`            VARCHAR(100) NULL,
  `account_holder`            VARCHAR(100) NULL,
  `approval_status`           VARCHAR(50)  NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING/APPROVED/REJECTED/PAID',
  `approver_id`               BIGINT       NULL,
  `approved_at`               DATETIME     NULL,
  `memo`                      VARCHAR(1000) NULL,
  `created_at`                DATETIME     NOT NULL,
  `updated_at`                DATETIME     NOT NULL,
  `created_by`                BIGINT       NULL,
  `updated_by`                BIGINT       NULL,
  `version`                   BIGINT       NOT NULL DEFAULT 0,
  `deleted`                   BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`employee_event_support_id`),
  UNIQUE KEY `uq_event_support_document_number` (`document_number`)
) COMMENT='경조사비';

CREATE TABLE `employee_certificate_issue` (
  `employee_certificate_issue_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '증명서발급 PK',
  `employee_id`                   BIGINT       NOT NULL,
  `document_number`               VARCHAR(30)  NOT NULL COMMENT 'CERT-2026-001',
  `certificate_type`              VARCHAR(100) NOT NULL COMMENT '재직/경력/급여 등',
  `application_date`              DATE         NOT NULL,
  `purpose`                       VARCHAR(500) NULL,
  `issue_status`                  VARCHAR(50)  NOT NULL DEFAULT 'WAITING' COMMENT 'WAITING/ISSUED/REJECTED',
  `issued_at`                     DATETIME     NULL,
  `approval_status`               VARCHAR(50)  NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING/APPROVED/REJECTED',
  `approver_id`                   BIGINT       NULL,
  `approved_at`                   DATETIME     NULL,
  `memo`                          VARCHAR(1000) NULL,
  `created_at`                    DATETIME     NOT NULL,
  `updated_at`                    DATETIME     NOT NULL,
  `created_by`                    BIGINT       NULL,
  `updated_by`                    BIGINT       NULL,
  `version`                       BIGINT       NOT NULL DEFAULT 0,
  `deleted`                       BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`employee_certificate_issue_id`),
  UNIQUE KEY `uq_cert_issue_document_number` (`document_number`)
) COMMENT='증명서발급';

-- ══════════════ ⑦ 공통/시스템 ══════════════
CREATE TABLE `file_attachment` (
  `file_attachment_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '첨부파일 PK',
  `ref_type`           VARCHAR(50)  NOT NULL COMMENT '업무유형(APPOINTMENT/EVENT ...)',
  `ref_id`             BIGINT       NOT NULL COMMENT '업무데이터 PK',
  `original_name`      VARCHAR(255) NOT NULL,
  `stored_name`        VARCHAR(255) NOT NULL,
  `file_path`          VARCHAR(500) NOT NULL,
  `extension`          VARCHAR(20)  NULL,
  `content_type`       VARCHAR(100) NULL,
  `file_size`          BIGINT       NOT NULL,
  `created_by`         BIGINT       NULL,
  `created_at`         DATETIME     NOT NULL,
  PRIMARY KEY (`file_attachment_id`)
) COMMENT='첨부파일';

CREATE TABLE `common_code` (
  `common_code_id` BIGINT       NOT NULL AUTO_INCREMENT COMMENT '공통코드 PK',
  `group_code`     VARCHAR(50)  NOT NULL COMMENT '코드그룹',
  `code`           VARCHAR(50)  NOT NULL COMMENT '코드값',
  `name`           VARCHAR(100) NOT NULL COMMENT '표시명',
  `sort_order`     INT          NOT NULL DEFAULT 0,
  `parent_code`    VARCHAR(50)  NULL,
  `active`         BOOLEAN      NOT NULL DEFAULT TRUE,
  `created_at`     DATETIME     NOT NULL,
  `updated_at`     DATETIME     NOT NULL,
  `created_by`     BIGINT       NULL,
  `updated_by`     BIGINT       NULL,
  `version`        BIGINT       NOT NULL DEFAULT 0,
  `deleted`        BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`common_code_id`),
  UNIQUE KEY `uq_common_code` (`group_code`, `code`)
) COMMENT='공통코드';

CREATE TABLE `role` (
  `role_id`     BIGINT       NOT NULL AUTO_INCREMENT COMMENT '역할 PK',
  `code`        VARCHAR(50)  NOT NULL COMMENT 'ROLE_ADMIN 등',
  `name`        VARCHAR(50)  NOT NULL,
  `description` VARCHAR(200) NULL,
  `active`      BOOLEAN      NOT NULL DEFAULT TRUE,
  `created_at`  DATETIME     NOT NULL,
  `updated_at`  DATETIME     NOT NULL,
  `created_by`  BIGINT       NULL,
  `updated_by`  BIGINT       NULL,
  `version`     BIGINT       NOT NULL DEFAULT 0,
  `deleted`     BOOLEAN      NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `uq_role_code` (`code`)
) COMMENT='역할';

CREATE TABLE `permission` (
  `permission_id` BIGINT      NOT NULL AUTO_INCREMENT COMMENT '권한 PK',
  `code`          VARCHAR(80) NOT NULL COMMENT 'EMPLOYEE_READ 등',
  `name`          VARCHAR(80) NOT NULL,
  `resource`      VARCHAR(50) NULL,
  `action`        VARCHAR(30) NULL,
  PRIMARY KEY (`permission_id`),
  UNIQUE KEY `uq_permission_code` (`code`)
) COMMENT='권한';

CREATE TABLE `role_permission` (
  `role_id`       BIGINT NOT NULL,
  `permission_id` BIGINT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`)
) COMMENT='역할-권한 매핑';

CREATE TABLE `employee_role` (
  `employee_id` BIGINT NOT NULL,
  `role_id`     BIGINT NOT NULL,
  PRIMARY KEY (`employee_id`, `role_id`)
) COMMENT='사용자-역할 매핑';

CREATE TABLE `audit_log` (
  `audit_log_id` BIGINT      NOT NULL AUTO_INCREMENT COMMENT '감사로그 PK',
  `actor_id`     BIGINT      NULL COMMENT '행위자(employee)',
  `action`       VARCHAR(50) NOT NULL COMMENT 'CREATE/UPDATE/APPROVE ...',
  `entity_type`  VARCHAR(50) NULL,
  `entity_id`    BIGINT      NULL,
  `before_data`  TEXT        NULL,
  `after_data`   TEXT        NULL,
  `ip_address`   VARCHAR(45) NULL,
  `created_at`   DATETIME    NOT NULL,
  PRIMARY KEY (`audit_log_id`)
) COMMENT='감사로그';

CREATE TABLE `document_sequence` (
  `prefix`   VARCHAR(10) NOT NULL,
  `seq_year` INT         NOT NULL,
  `last_no`  INT         NOT NULL,
  PRIMARY KEY (`prefix`, `seq_year`)
) COMMENT='문서번호 채번';

-- ══════════════ 외래키(FK) 제약 — 관계선 + 데이터 무결성 ══════════════
ALTER TABLE `department` ADD CONSTRAINT `fk_department_parent` FOREIGN KEY (`parent_department_id`) REFERENCES `department` (`department_id`);

ALTER TABLE `employee` ADD CONSTRAINT `fk_employee_department`      FOREIGN KEY (`department_id`)      REFERENCES `department` (`department_id`);
ALTER TABLE `employee` ADD CONSTRAINT `fk_employee_position`        FOREIGN KEY (`position_id`)        REFERENCES `position` (`position_id`);
ALTER TABLE `employee` ADD CONSTRAINT `fk_employee_employment_type` FOREIGN KEY (`employment_type_id`) REFERENCES `employment_type` (`employment_type_id`);

ALTER TABLE `employee_education`   ADD CONSTRAINT `fk_education_employee`   FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_career`      ADD CONSTRAINT `fk_career_employee`      FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_certificate` ADD CONSTRAINT `fk_certificate_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_family`      ADD CONSTRAINT `fk_family_employee`      FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_military`    ADD CONSTRAINT `fk_military_employee`    FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_language`    ADD CONSTRAINT `fk_language_employee`    FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_oauth`       ADD CONSTRAINT `fk_oauth_employee`       FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`);

ALTER TABLE `employee_appointment` ADD CONSTRAINT `fk_appointment_employee`   FOREIGN KEY (`employee_id`)        REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_appointment` ADD CONSTRAINT `fk_appointment_from_dept`  FOREIGN KEY (`from_department_id`) REFERENCES `department` (`department_id`);
ALTER TABLE `employee_appointment` ADD CONSTRAINT `fk_appointment_to_dept`    FOREIGN KEY (`to_department_id`)   REFERENCES `department` (`department_id`);
ALTER TABLE `employee_appointment` ADD CONSTRAINT `fk_appointment_from_pos`   FOREIGN KEY (`from_position_id`)   REFERENCES `position` (`position_id`);
ALTER TABLE `employee_appointment` ADD CONSTRAINT `fk_appointment_to_pos`     FOREIGN KEY (`to_position_id`)     REFERENCES `position` (`position_id`);
ALTER TABLE `employee_appointment` ADD CONSTRAINT `fk_appointment_approver`   FOREIGN KEY (`approver_id`)        REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_appointment` ADD CONSTRAINT `fk_appointment_registrar`  FOREIGN KEY (`registered_by`)      REFERENCES `employee` (`employee_id`);

ALTER TABLE `attendance` ADD CONSTRAINT `fk_attendance_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`);

ALTER TABLE `leave_policy`           ADD CONSTRAINT `fk_leave_policy_position` FOREIGN KEY (`position_id`)   REFERENCES `position` (`position_id`);
ALTER TABLE `leave_request`          ADD CONSTRAINT `fk_leave_type`            FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type` (`leave_type_id`);
ALTER TABLE `leave_request`          ADD CONSTRAINT `fk_leave_employee`        FOREIGN KEY (`employee_id`)   REFERENCES `employee` (`employee_id`);
ALTER TABLE `leave_request`          ADD CONSTRAINT `fk_leave_approver`        FOREIGN KEY (`approver_id`)   REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_leave_balance` ADD CONSTRAINT `fk_balance_type`          FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type` (`leave_type_id`);
ALTER TABLE `employee_leave_balance` ADD CONSTRAINT `fk_balance_employee`      FOREIGN KEY (`employee_id`)   REFERENCES `employee` (`employee_id`);

ALTER TABLE `employee_allowance` ADD CONSTRAINT `fk_emp_allowance_employee` FOREIGN KEY (`employee_id`)  REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_allowance` ADD CONSTRAINT `fk_emp_allowance_allowance` FOREIGN KEY (`allowance_id`) REFERENCES `allowance` (`allowance_id`);
ALTER TABLE `payroll`            ADD CONSTRAINT `fk_payroll_employee`       FOREIGN KEY (`employee_id`)  REFERENCES `employee` (`employee_id`);
ALTER TABLE `payroll_detail`     ADD CONSTRAINT `fk_detail_payroll`        FOREIGN KEY (`payroll_id`)   REFERENCES `payroll` (`payroll_id`);
ALTER TABLE `payroll_detail`     ADD CONSTRAINT `fk_detail_item`           FOREIGN KEY (`payroll_item_master_id`) REFERENCES `payroll_item_master` (`payroll_item_master_id`);

ALTER TABLE `employee_event_support`      ADD CONSTRAINT `fk_event_employee`     FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_event_support`      ADD CONSTRAINT `fk_event_approver`     FOREIGN KEY (`approver_id`) REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_certificate_issue`  ADD CONSTRAINT `fk_certissue_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_certificate_issue`  ADD CONSTRAINT `fk_certissue_approver` FOREIGN KEY (`approver_id`) REFERENCES `employee` (`employee_id`);

ALTER TABLE `role_permission` ADD CONSTRAINT `fk_rp_role`       FOREIGN KEY (`role_id`)       REFERENCES `role` (`role_id`);
ALTER TABLE `role_permission` ADD CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`permission_id`);
ALTER TABLE `employee_role`   ADD CONSTRAINT `fk_er_employee`   FOREIGN KEY (`employee_id`)   REFERENCES `employee` (`employee_id`);
ALTER TABLE `employee_role`   ADD CONSTRAINT `fk_er_role`       FOREIGN KEY (`role_id`)       REFERENCES `role` (`role_id`);

ALTER TABLE `audit_log` ADD CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_id`) REFERENCES `employee` (`employee_id`);
