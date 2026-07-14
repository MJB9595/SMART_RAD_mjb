-- ③ 휴가 신청 / 잔여일수
CREATE TABLE leave_request (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_number  VARCHAR(30) NOT NULL,
    employee_id      BIGINT NOT NULL,
    leave_type       VARCHAR(20) NOT NULL,   -- 연차/병가/공가/특별/육아
    start_date       DATE NOT NULL,
    end_date         DATE NOT NULL,
    days             DECIMAL(4,1) NOT NULL,
    reason           VARCHAR(500) NULL,
    approval_status  VARCHAR(20) NOT NULL,
    approver_id      BIGINT NULL,
    approved_at      DATETIME NULL,
    created_at       DATETIME NOT NULL,
    updated_at       DATETIME NOT NULL,
    created_by       BIGINT NULL,
    updated_by       BIGINT NULL,
    version          BIGINT NOT NULL DEFAULT 0,
    deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_leave_document_number UNIQUE (document_number),
    CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES employee (id),
    CONSTRAINT fk_leave_approver FOREIGN KEY (approver_id) REFERENCES employee (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_leave_employee ON leave_request (employee_id);

CREATE TABLE leave_balance (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id    BIGINT NOT NULL,
    year           INT NOT NULL,
    total_granted  DECIMAL(4,1) NOT NULL,
    used_days      DECIMAL(4,1) NOT NULL DEFAULT 0,
    remaining      DECIMAL(4,1) NOT NULL,
    created_at     DATETIME NOT NULL,
    updated_at     DATETIME NOT NULL,
    created_by     BIGINT NULL,
    updated_by     BIGINT NULL,
    version        BIGINT NOT NULL DEFAULT 0,
    deleted        BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_leave_balance_employee_year UNIQUE (employee_id, year),
    CONSTRAINT fk_leave_balance_employee FOREIGN KEY (employee_id) REFERENCES employee (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ④ 급여 연계 (기초급여)
CREATE TABLE salary_basic (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id           BIGINT NOT NULL,
    base_pay              DECIMAL(12,0) NOT NULL,
    meal_allowance        DECIMAL(12,0) NOT NULL DEFAULT 0,
    transport_allowance   DECIMAL(12,0) NOT NULL DEFAULT 0,
    position_allowance    DECIMAL(12,0) NOT NULL DEFAULT 0,
    bank_name             VARCHAR(50) NULL,
    account_number        VARCHAR(50) NULL,
    account_holder        VARCHAR(50) NULL,
    effective_date        DATE NOT NULL,
    created_at            DATETIME NOT NULL,
    updated_at            DATETIME NOT NULL,
    created_by            BIGINT NULL,
    updated_by            BIGINT NULL,
    version               BIGINT NOT NULL DEFAULT 0,
    deleted               BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_salary_employee FOREIGN KEY (employee_id) REFERENCES employee (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_salary_employee_effective ON salary_basic (employee_id, effective_date);

-- ⑥ 시스템 관리: RBAC
CREATE TABLE role (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    code         VARCHAR(50) NOT NULL,
    name         VARCHAR(50) NOT NULL,
    description  VARCHAR(200) NULL,
    active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   DATETIME NOT NULL,
    updated_at   DATETIME NOT NULL,
    created_by   BIGINT NULL,
    updated_by   BIGINT NULL,
    version      BIGINT NOT NULL DEFAULT 0,
    deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_role_code UNIQUE (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE permission (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    code       VARCHAR(80) NOT NULL,
    name       VARCHAR(80) NOT NULL,
    resource   VARCHAR(50) NULL,
    action     VARCHAR(30) NULL,
    CONSTRAINT uq_permission_code UNIQUE (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE role_permission (
    role_id        BIGINT NOT NULL,
    permission_id  BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES role (id),
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permission (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE employee_role (
    employee_id  BIGINT NOT NULL,
    role_id      BIGINT NOT NULL,
    PRIMARY KEY (employee_id, role_id),
    CONSTRAINT fk_er_employee FOREIGN KEY (employee_id) REFERENCES employee (id),
    CONSTRAINT fk_er_role FOREIGN KEY (role_id) REFERENCES role (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ⑥ 공통 코드
CREATE TABLE common_code (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    group_code   VARCHAR(50) NOT NULL,
    code         VARCHAR(50) NOT NULL,
    name         VARCHAR(100) NOT NULL,
    sort_order   INT NOT NULL DEFAULT 0,
    parent_code  VARCHAR(50) NULL,
    active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   DATETIME NOT NULL,
    updated_at   DATETIME NOT NULL,
    created_by   BIGINT NULL,
    updated_by   BIGINT NULL,
    version      BIGINT NOT NULL DEFAULT 0,
    deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_common_code UNIQUE (group_code, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ⑥ 감사로그
CREATE TABLE audit_log (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_id     BIGINT NULL,
    action       VARCHAR(50) NOT NULL,
    entity_type  VARCHAR(50) NULL,
    entity_id    BIGINT NULL,
    before_data  TEXT NULL,
    after_data   TEXT NULL,
    ip_address   VARCHAR(45) NULL,
    created_at   DATETIME NOT NULL,
    CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES employee (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_audit_actor ON audit_log (actor_id);
CREATE INDEX idx_audit_entity ON audit_log (entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_log (created_at);

-- RBAC 시드
INSERT INTO role (id, code, name, description, created_at, updated_at, version, deleted, active) VALUES
    (1, 'ROLE_ADMIN',    '시스템관리자', '전체 권한',        NOW(), NOW(), 0, FALSE, TRUE),
    (2, 'ROLE_HR',       '인사담당',     '인사업무 권한',    NOW(), NOW(), 0, FALSE, TRUE),
    (3, 'ROLE_EMPLOYEE', '일반직원',     '본인 조회/신청',   NOW(), NOW(), 0, FALSE, TRUE);

INSERT INTO employee_role (employee_id, role_id) VALUES
    (1, 1), (2, 3), (3, 3), (4, 3), (5, 3), (6, 3), (7, 3);

-- 공통코드 시드 (휴가유형 / 발령유형)
INSERT INTO common_code (group_code, code, name, sort_order, created_at, updated_at, version, deleted, active) VALUES
    ('LEAVE_TYPE', 'ANNUAL',  '연차',   1, NOW(), NOW(), 0, FALSE, TRUE),
    ('LEAVE_TYPE', 'SICK',    '병가',   2, NOW(), NOW(), 0, FALSE, TRUE),
    ('LEAVE_TYPE', 'OFFICIAL','공가',   3, NOW(), NOW(), 0, FALSE, TRUE),
    ('LEAVE_TYPE', 'SPECIAL', '특별휴가', 4, NOW(), NOW(), 0, FALSE, TRUE),
    ('APPOINTMENT_TYPE', 'HIRE',      '임용',   1, NOW(), NOW(), 0, FALSE, TRUE),
    ('APPOINTMENT_TYPE', 'PROMOTION', '승진',   2, NOW(), NOW(), 0, FALSE, TRUE),
    ('APPOINTMENT_TYPE', 'TRANSFER',  '전보',   3, NOW(), NOW(), 0, FALSE, TRUE),
    ('APPOINTMENT_TYPE', 'CONCURRENT','겸직',   4, NOW(), NOW(), 0, FALSE, TRUE);

-- 연차 잔여 샘플
INSERT INTO leave_balance (employee_id, year, total_granted, used_days, remaining, created_at, updated_at, version, deleted) VALUES
    (2, 2026, 15.0, 3.0, 12.0, NOW(), NOW(), 0, FALSE),
    (6, 2026, 15.0, 5.5,  9.5, NOW(), NOW(), 0, FALSE);

-- 기초급여 샘플
INSERT INTO salary_basic (employee_id, base_pay, meal_allowance, transport_allowance, position_allowance,
                           bank_name, account_number, account_holder, effective_date, created_at, updated_at, version, deleted) VALUES
    (2, 5000000, 200000, 150000, 300000, '국민은행', '123456-01-000001', '김정교', '2026-01-01', NOW(), NOW(), 0, FALSE),
    (6, 3000000, 150000, 100000, 100000, '신한은행', '110-000-000001',    '정직원', '2026-01-01', NOW(), NOW(), 0, FALSE);
