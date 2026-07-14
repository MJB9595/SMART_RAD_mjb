-- ═══════════════════════════════════════════════════════════════
-- 교직원 인사관리 시스템 — ERDCloud Import용 DDL
-- 사용법: https://www.erdcloud.com 접속 → 좌측 하단 Import 버튼 →
--         아래 CREATE TABLE 문을 붙여넣기 (여러 테이블 한번에 붙여넣기 가능)
-- ═══════════════════════════════════════════════════════════════

-- ===== 기준정보 =====
CREATE TABLE department (
    id                   BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    name                 VARCHAR(100) NOT NULL COMMENT '조직명',
    org_type             VARCHAR(20)  NOT NULL COMMENT 'ACADEMIC(학사)/ADMINISTRATIVE(행정)',
    parent_department_id BIGINT       NULL COMMENT '상위조직(자기참조)',
    headcount            INT          NOT NULL DEFAULT 0 COMMENT '정원',
    active               TINYINT(1)   NOT NULL DEFAULT 1,
    created_at           DATETIME     NOT NULL,
    updated_at           DATETIME     NOT NULL,
    created_by           BIGINT       NULL,
    updated_by           BIGINT       NULL,
    version              BIGINT       NOT NULL DEFAULT 0,
    deleted              TINYINT(1)   NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_department_parent FOREIGN KEY (parent_department_id) REFERENCES department (id)
) COMMENT='조직(부서)';

CREATE TABLE position (
    id         BIGINT      NOT NULL AUTO_INCREMENT COMMENT 'PK',
    name       VARCHAR(50) NOT NULL COMMENT '직급명',
    category   VARCHAR(20) NOT NULL COMMENT 'FACULTY/STAFF/COMMON',
    sort_order INT         NOT NULL DEFAULT 0,
    active     TINYINT(1)  NOT NULL DEFAULT 1,
    created_at DATETIME    NOT NULL,
    updated_at DATETIME    NOT NULL,
    version    BIGINT      NOT NULL DEFAULT 0,
    deleted    TINYINT(1)  NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) COMMENT='직급';

CREATE TABLE employment_type (
    id         BIGINT      NOT NULL AUTO_INCREMENT COMMENT 'PK',
    name       VARCHAR(50) NOT NULL COMMENT '임용구분(전임/계약직/조교)',
    active     TINYINT(1)  NOT NULL DEFAULT 1,
    created_at DATETIME    NOT NULL,
    updated_at DATETIME    NOT NULL,
    version    BIGINT      NOT NULL DEFAULT 0,
    deleted    TINYINT(1)  NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) COMMENT='임용구분';

-- ===== ① 인사기록 관리 =====
CREATE TABLE employee (
    id                 BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    employee_number    VARCHAR(20)  NOT NULL COMMENT '사번',
    name               VARCHAR(50)  NOT NULL COMMENT '성명',
    email              VARCHAR(100) NOT NULL COMMENT '로그인 ID',
    password           VARCHAR(255) NOT NULL COMMENT 'BCrypt 해시',
    phone              VARCHAR(20)  NULL,
    staff_category     VARCHAR(20)  NOT NULL COMMENT 'FACULTY(교원)/STAFF(직원)',
    role               VARCHAR(20)  NOT NULL COMMENT 'JWT 대표권한(ADMIN/EMPLOYEE) - 상세는 employee_role',
    department_id      BIGINT       NOT NULL COMMENT '소속',
    position_id        BIGINT       NOT NULL COMMENT '직급',
    employment_type_id BIGINT       NOT NULL COMMENT '임용구분',
    employment_status  VARCHAR(20)  NOT NULL COMMENT 'EMPLOYED/ON_LEAVE/RESIGNED',
    hire_date          DATE         NOT NULL COMMENT '임용일',
    resign_date        DATE         NULL,
    birth_date         DATE         NULL COMMENT '생년월일',
    gender             VARCHAR(10)  NULL,
    address            VARCHAR(255) NULL COMMENT '주소',
    emergency_contact  VARCHAR(50)  NULL COMMENT '비상연락처',
    created_at         DATETIME     NOT NULL,
    updated_at         DATETIME     NOT NULL,
    created_by         BIGINT       NULL,
    updated_by         BIGINT       NULL,
    version            BIGINT       NOT NULL DEFAULT 0,
    deleted            TINYINT(1)   NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_employee_number (employee_number),
    UNIQUE KEY uq_employee_email (email),
    KEY idx_employee_name (name),
    KEY idx_employee_staff_category (staff_category),
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES department (id),
    CONSTRAINT fk_employee_position FOREIGN KEY (position_id) REFERENCES position (id),
    CONSTRAINT fk_employee_employment_type FOREIGN KEY (employment_type_id) REFERENCES employment_type (id)
) COMMENT='교직원(인사기록카드)';

CREATE TABLE education (
    id              BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    employee_id     BIGINT       NOT NULL,
    school_name     VARCHAR(100) NOT NULL COMMENT '학교명',
    major           VARCHAR(100) NULL COMMENT '전공',
    degree          VARCHAR(20)  NULL COMMENT '학사/석사/박사',
    admission_date  DATE         NULL,
    graduation_date DATE         NULL,
    status          VARCHAR(20)  NULL COMMENT '졸업/재학/수료/중퇴',
    created_at      DATETIME     NOT NULL,
    updated_at      DATETIME     NOT NULL,
    version         BIGINT       NOT NULL DEFAULT 0,
    deleted         TINYINT(1)   NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_education_employee (employee_id),
    CONSTRAINT fk_education_employee FOREIGN KEY (employee_id) REFERENCES employee (id)
) COMMENT='학력';

CREATE TABLE career (
    id              BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    employee_id     BIGINT       NOT NULL,
    company_name    VARCHAR(100) NOT NULL COMMENT '기관/회사명',
    department      VARCHAR(100) NULL,
    position        VARCHAR(50)  NULL,
    job_description VARCHAR(500) NULL,
    start_date      DATE         NOT NULL,
    end_date        DATE         NULL,
    created_at      DATETIME     NOT NULL,
    updated_at      DATETIME     NOT NULL,
    version         BIGINT       NOT NULL DEFAULT 0,
    deleted         TINYINT(1)   NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_career_employee (employee_id),
    CONSTRAINT fk_career_employee FOREIGN KEY (employee_id) REFERENCES employee (id)
) COMMENT='경력';

CREATE TABLE certification (
    id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    employee_id   BIGINT       NOT NULL,
    name          VARCHAR(100) NOT NULL COMMENT '자격증명',
    issuer        VARCHAR(100) NULL COMMENT '발급기관',
    cert_number   VARCHAR(100) NULL,
    acquired_date DATE         NULL,
    expiry_date   DATE         NULL COMMENT '갱신 알림 대상',
    created_at    DATETIME     NOT NULL,
    updated_at    DATETIME     NOT NULL,
    version       BIGINT       NOT NULL DEFAULT 0,
    deleted       TINYINT(1)   NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_certification_employee (employee_id),
    CONSTRAINT fk_certification_employee FOREIGN KEY (employee_id) REFERENCES employee (id)
) COMMENT='자격증';

-- ===== ② 인사발령 관리 =====
CREATE TABLE appointment (
    id                 BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    document_number    VARCHAR(30)  NOT NULL COMMENT 'APT-2026-001',
    employee_id        BIGINT       NOT NULL COMMENT '발령대상',
    appointment_type   VARCHAR(30)  NOT NULL COMMENT '임용/승진/전보/겸직/파견/직위해제/퇴임',
    from_department_id BIGINT       NULL COMMENT '발령 전 소속',
    to_department_id   BIGINT       NULL COMMENT '발령 후 소속',
    from_position_id   BIGINT       NULL,
    to_position_id     BIGINT       NULL,
    appointment_date   DATE         NOT NULL,
    reason             VARCHAR(500) NULL,
    approval_status    VARCHAR(20)  NOT NULL COMMENT 'PENDING/APPROVED/REJECTED',
    approver_id        BIGINT       NULL COMMENT '승인자',
    approved_at        DATETIME     NULL,
    registered_by      BIGINT       NOT NULL COMMENT '등록자',
    created_at         DATETIME     NOT NULL,
    updated_at         DATETIME     NOT NULL,
    version            BIGINT       NOT NULL DEFAULT 0,
    deleted            TINYINT(1)   NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_appointment_document_number (document_number),
    KEY idx_appointment_date (appointment_date),
    CONSTRAINT fk_appointment_employee FOREIGN KEY (employee_id) REFERENCES employee (id),
    CONSTRAINT fk_appointment_from_dept FOREIGN KEY (from_department_id) REFERENCES department (id),
    CONSTRAINT fk_appointment_to_dept FOREIGN KEY (to_department_id) REFERENCES department (id),
    CONSTRAINT fk_appointment_from_pos FOREIGN KEY (from_position_id) REFERENCES position (id),
    CONSTRAINT fk_appointment_to_pos FOREIGN KEY (to_position_id) REFERENCES position (id),
    CONSTRAINT fk_appointment_approver FOREIGN KEY (approver_id) REFERENCES employee (id),
    CONSTRAINT fk_appointment_registrar FOREIGN KEY (registered_by) REFERENCES employee (id)
) COMMENT='인사발령';

-- ===== ③ 근태 / 휴가 관리 =====
CREATE TABLE attendance (
    id             BIGINT      NOT NULL AUTO_INCREMENT COMMENT 'PK',
    employee_id    BIGINT      NOT NULL,
    work_date      DATE        NOT NULL,
    check_in_time  TIME        NULL,
    check_out_time TIME        NULL,
    status         VARCHAR(20) NOT NULL COMMENT 'PRESENT/LATE/ABSENT/LEAVE/HALF/BIZTRIP',
    remark         VARCHAR(300) NULL,
    created_at     DATETIME    NOT NULL,
    updated_at     DATETIME    NOT NULL,
    version        BIGINT      NOT NULL DEFAULT 0,
    deleted        TINYINT(1)  NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_attendance_employee_date (employee_id, work_date),
    KEY idx_attendance_work_date (work_date),
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employee (id)
) COMMENT='출퇴근';

CREATE TABLE leave_request (
    id              BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    document_number VARCHAR(30)  NOT NULL COMMENT 'LVE-2026-001',
    employee_id     BIGINT       NOT NULL,
    leave_type      VARCHAR(20)  NOT NULL COMMENT '연차/병가/공가/특별/육아',
    start_date      DATE         NOT NULL,
    end_date        DATE         NOT NULL,
    days            DECIMAL(4,1) NOT NULL COMMENT '반차 0.5 단위',
    reason          VARCHAR(500) NULL,
    approval_status VARCHAR(20)  NOT NULL COMMENT 'PENDING/APPROVED/REJECTED',
    approver_id     BIGINT       NULL,
    approved_at     DATETIME     NULL,
    created_at      DATETIME     NOT NULL,
    updated_at      DATETIME     NOT NULL,
    version         BIGINT       NOT NULL DEFAULT 0,
    deleted         TINYINT(1)   NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_leave_document_number (document_number),
    KEY idx_leave_employee (employee_id),
    CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES employee (id),
    CONSTRAINT fk_leave_approver FOREIGN KEY (approver_id) REFERENCES employee (id)
) COMMENT='휴가신청';

CREATE TABLE leave_balance (
    id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    employee_id   BIGINT       NOT NULL,
    year          INT          NOT NULL COMMENT '기준연도',
    total_granted DECIMAL(4,1) NOT NULL COMMENT '연간 부여일수',
    used_days     DECIMAL(4,1) NOT NULL DEFAULT 0 COMMENT '사용일수',
    remaining     DECIMAL(4,1) NOT NULL COMMENT '잔여일수',
    created_at    DATETIME     NOT NULL,
    updated_at    DATETIME     NOT NULL,
    version       BIGINT       NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_leave_balance_employee_year (employee_id, year),
    CONSTRAINT fk_leave_balance_employee FOREIGN KEY (employee_id) REFERENCES employee (id)
) COMMENT='연차 잔여일수';

-- ===== ④ 급여 연계 관리 =====
CREATE TABLE salary_basic (
    id                  BIGINT        NOT NULL AUTO_INCREMENT COMMENT 'PK',
    employee_id         BIGINT        NOT NULL,
    base_pay            DECIMAL(12,0) NOT NULL COMMENT '기본급',
    meal_allowance      DECIMAL(12,0) NOT NULL DEFAULT 0 COMMENT '식대',
    transport_allowance DECIMAL(12,0) NOT NULL DEFAULT 0 COMMENT '교통비',
    position_allowance  DECIMAL(12,0) NOT NULL DEFAULT 0 COMMENT '직급수당',
    bank_name           VARCHAR(50)   NULL,
    account_number      VARCHAR(50)   NULL,
    account_holder      VARCHAR(50)   NULL,
    effective_date      DATE          NOT NULL COMMENT '적용 시작일',
    created_at          DATETIME      NOT NULL,
    updated_at          DATETIME      NOT NULL,
    version             BIGINT        NOT NULL DEFAULT 0,
    deleted             TINYINT(1)    NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_salary_employee_effective (employee_id, effective_date),
    CONSTRAINT fk_salary_employee FOREIGN KEY (employee_id) REFERENCES employee (id)
) COMMENT='기초급여';

-- ===== ⑥ 시스템 관리 : RBAC =====
CREATE TABLE role (
    id          BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    code        VARCHAR(50)  NOT NULL COMMENT 'ROLE_ADMIN/ROLE_HR/ROLE_EMPLOYEE',
    name        VARCHAR(50)  NOT NULL,
    description VARCHAR(200) NULL,
    active      TINYINT(1)   NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uq_role_code (code)
) COMMENT='역할';

CREATE TABLE permission (
    id       BIGINT      NOT NULL AUTO_INCREMENT COMMENT 'PK',
    code     VARCHAR(80) NOT NULL COMMENT 'EMPLOYEE_READ/APPOINTMENT_APPROVE',
    name     VARCHAR(80) NOT NULL,
    resource VARCHAR(50) NULL,
    action   VARCHAR(30) NULL COMMENT 'READ/WRITE/APPROVE/DELETE',
    PRIMARY KEY (id),
    UNIQUE KEY uq_permission_code (code)
) COMMENT='권한';

CREATE TABLE role_permission (
    role_id       BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES role (id),
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permission (id)
) COMMENT='역할-권한 매핑';

CREATE TABLE employee_role (
    employee_id BIGINT NOT NULL,
    role_id     BIGINT NOT NULL,
    PRIMARY KEY (employee_id, role_id),
    CONSTRAINT fk_er_employee FOREIGN KEY (employee_id) REFERENCES employee (id),
    CONSTRAINT fk_er_role FOREIGN KEY (role_id) REFERENCES role (id)
) COMMENT='사용자-역할 매핑';

-- ===== ⑥ 시스템 관리 : 공통 코드 =====
CREATE TABLE common_code (
    id          BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
    group_code  VARCHAR(50)  NOT NULL COMMENT '코드그룹(LEAVE_TYPE 등)',
    code        VARCHAR(50)  NOT NULL COMMENT '코드값',
    name        VARCHAR(100) NOT NULL COMMENT '표시명',
    sort_order  INT          NOT NULL DEFAULT 0,
    parent_code VARCHAR(50)  NULL COMMENT '계층형 코드',
    active      TINYINT(1)   NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uq_common_code (group_code, code)
) COMMENT='공통코드';

-- ===== ⑥ 시스템 관리 : 감사로그 =====
CREATE TABLE audit_log (
    id          BIGINT      NOT NULL AUTO_INCREMENT COMMENT 'PK',
    actor_id    BIGINT      NULL COMMENT '행위자',
    action      VARCHAR(50) NOT NULL COMMENT 'CREATE/UPDATE/DELETE/LOGIN/APPROVE',
    entity_type VARCHAR(50) NULL COMMENT '대상 엔티티',
    entity_id   BIGINT      NULL COMMENT '대상 PK',
    before_data TEXT        NULL COMMENT '변경 전 JSON',
    after_data  TEXT        NULL COMMENT '변경 후 JSON',
    ip_address  VARCHAR(45) NULL,
    created_at  DATETIME    NOT NULL,
    PRIMARY KEY (id),
    KEY idx_audit_actor (actor_id),
    KEY idx_audit_entity (entity_type, entity_id),
    KEY idx_audit_created (created_at),
    CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES employee (id)
) COMMENT='감사로그';
