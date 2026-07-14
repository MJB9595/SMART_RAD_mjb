-- 교직원 인사관리 핵심 스키마 (기준정보 + 교직원 마스터)
-- 공통 감사 컬럼: created_at/updated_at/created_by/updated_by/version/deleted (+기준정보는 active)

CREATE TABLE department (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name                  VARCHAR(100) NOT NULL,
    org_type              VARCHAR(20) NOT NULL,      -- ACADEMIC(학사) / ADMINISTRATIVE(행정)
    parent_department_id  BIGINT NULL,
    headcount             INT NOT NULL DEFAULT 0,    -- 정원 (부서별 정원현황 통계)
    created_at            DATETIME NOT NULL,
    updated_at            DATETIME NOT NULL,
    created_by            BIGINT NULL,
    updated_by            BIGINT NULL,
    version               BIGINT NOT NULL DEFAULT 0,
    deleted               BOOLEAN NOT NULL DEFAULT FALSE,
    active                BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_department_parent FOREIGN KEY (parent_department_id) REFERENCES department (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE position (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    category    VARCHAR(20) NOT NULL,  -- FACULTY(교원) / STAFF(직원) / COMMON
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL,
    updated_at  DATETIME NOT NULL,
    created_by  BIGINT NULL,
    updated_by  BIGINT NULL,
    version     BIGINT NOT NULL DEFAULT 0,
    deleted     BOOLEAN NOT NULL DEFAULT FALSE,
    active      BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE employment_type (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    created_at  DATETIME NOT NULL,
    updated_at  DATETIME NOT NULL,
    created_by  BIGINT NULL,
    updated_by  BIGINT NULL,
    version     BIGINT NOT NULL DEFAULT 0,
    deleted     BOOLEAN NOT NULL DEFAULT FALSE,
    active      BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE employee (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_number     VARCHAR(20) NOT NULL,
    name                VARCHAR(50) NOT NULL,
    email               VARCHAR(100) NOT NULL,
    password            VARCHAR(255) NOT NULL,
    phone               VARCHAR(20) NULL,
    staff_category      VARCHAR(20) NOT NULL,   -- FACULTY / STAFF
    department_id       BIGINT NOT NULL,
    position_id         BIGINT NOT NULL,
    employment_type_id  BIGINT NOT NULL,
    role                VARCHAR(20) NOT NULL,   -- JWT 인증용 대표권한 (RBAC 상세는 employee_role)
    employment_status   VARCHAR(20) NOT NULL,   -- EMPLOYED / ON_LEAVE / RESIGNED
    hire_date           DATE NOT NULL,          -- 임용일
    resign_date         DATE NULL,
    -- 인사기록카드 확장 인적사항
    birth_date          DATE NULL,
    gender              VARCHAR(10) NULL,
    address             VARCHAR(255) NULL,
    emergency_contact   VARCHAR(50) NULL,
    created_at          DATETIME NOT NULL,
    updated_at          DATETIME NOT NULL,
    created_by          BIGINT NULL,
    updated_by          BIGINT NULL,
    version             BIGINT NOT NULL DEFAULT 0,
    deleted             BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_employee_number UNIQUE (employee_number),
    CONSTRAINT uq_employee_email UNIQUE (email),
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES department (id),
    CONSTRAINT fk_employee_position FOREIGN KEY (position_id) REFERENCES position (id),
    CONSTRAINT fk_employee_employment_type FOREIGN KEY (employment_type_id) REFERENCES employment_type (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_employee_name ON employee (name);
CREATE INDEX idx_employee_staff_category ON employee (staff_category);
