-- ① 인사기록: 학력 / 경력 / 자격증
CREATE TABLE education (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id      BIGINT NOT NULL,
    school_name      VARCHAR(100) NOT NULL,
    major            VARCHAR(100) NULL,
    degree           VARCHAR(20) NULL,       -- 학사/석사/박사
    admission_date   DATE NULL,
    graduation_date  DATE NULL,
    status           VARCHAR(20) NULL,       -- 졸업/재학/수료/중퇴
    created_at       DATETIME NOT NULL,
    updated_at       DATETIME NOT NULL,
    created_by       BIGINT NULL,
    updated_by       BIGINT NULL,
    version          BIGINT NOT NULL DEFAULT 0,
    deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_education_employee FOREIGN KEY (employee_id) REFERENCES employee (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_education_employee ON education (employee_id);

CREATE TABLE career (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id      BIGINT NOT NULL,
    company_name     VARCHAR(100) NOT NULL,
    department       VARCHAR(100) NULL,
    position         VARCHAR(50) NULL,
    job_description  VARCHAR(500) NULL,
    start_date       DATE NOT NULL,
    end_date         DATE NULL,
    created_at       DATETIME NOT NULL,
    updated_at       DATETIME NOT NULL,
    created_by       BIGINT NULL,
    updated_by       BIGINT NULL,
    version          BIGINT NOT NULL DEFAULT 0,
    deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_career_employee FOREIGN KEY (employee_id) REFERENCES employee (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_career_employee ON career (employee_id);

CREATE TABLE certification (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id    BIGINT NOT NULL,
    name           VARCHAR(100) NOT NULL,
    issuer         VARCHAR(100) NULL,
    cert_number    VARCHAR(100) NULL,
    acquired_date  DATE NULL,
    expiry_date    DATE NULL,
    created_at     DATETIME NOT NULL,
    updated_at     DATETIME NOT NULL,
    created_by     BIGINT NULL,
    updated_by     BIGINT NULL,
    version        BIGINT NOT NULL DEFAULT 0,
    deleted        BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_certification_employee FOREIGN KEY (employee_id) REFERENCES employee (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_certification_employee ON certification (employee_id);

-- ② 인사발령 (등록/승인 + 이력)
CREATE TABLE appointment (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_number     VARCHAR(30) NOT NULL,
    employee_id         BIGINT NOT NULL,
    appointment_type    VARCHAR(30) NOT NULL,   -- 임용/승진/전보/겸직/파견/직위해제/퇴임
    from_department_id  BIGINT NULL,
    to_department_id    BIGINT NULL,
    from_position_id    BIGINT NULL,
    to_position_id      BIGINT NULL,
    appointment_date    DATE NOT NULL,
    reason              VARCHAR(500) NULL,
    approval_status     VARCHAR(20) NOT NULL,   -- PENDING / APPROVED / REJECTED
    approver_id         BIGINT NULL,
    approved_at         DATETIME NULL,
    registered_by       BIGINT NOT NULL,
    created_at          DATETIME NOT NULL,
    updated_at          DATETIME NOT NULL,
    created_by          BIGINT NULL,
    updated_by          BIGINT NULL,
    version             BIGINT NOT NULL DEFAULT 0,
    deleted             BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_appointment_document_number UNIQUE (document_number),
    CONSTRAINT fk_appointment_employee FOREIGN KEY (employee_id) REFERENCES employee (id),
    CONSTRAINT fk_appointment_from_dept FOREIGN KEY (from_department_id) REFERENCES department (id),
    CONSTRAINT fk_appointment_to_dept FOREIGN KEY (to_department_id) REFERENCES department (id),
    CONSTRAINT fk_appointment_from_pos FOREIGN KEY (from_position_id) REFERENCES position (id),
    CONSTRAINT fk_appointment_to_pos FOREIGN KEY (to_position_id) REFERENCES position (id),
    CONSTRAINT fk_appointment_approver FOREIGN KEY (approver_id) REFERENCES employee (id),
    CONSTRAINT fk_appointment_registrar FOREIGN KEY (registered_by) REFERENCES employee (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_appointment_date ON appointment (appointment_date);

-- ③ 근태
CREATE TABLE attendance (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id     BIGINT NOT NULL,
    work_date       DATE NOT NULL,
    check_in_time   TIME NULL,
    check_out_time  TIME NULL,
    status          VARCHAR(20) NOT NULL,   -- PRESENT/LATE/ABSENT/LEAVE/HALF/BIZTRIP
    remark          VARCHAR(300) NULL,
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL,
    created_by      BIGINT NULL,
    updated_by      BIGINT NULL,
    version         BIGINT NOT NULL DEFAULT 0,
    deleted         BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_attendance_employee_date UNIQUE (employee_id, work_date),
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employee (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_attendance_work_date ON attendance (work_date);

-- 문서번호 채번
CREATE TABLE document_sequence (
    prefix    VARCHAR(10) NOT NULL,
    seq_year  INT NOT NULL,
    last_no   INT NOT NULL,
    PRIMARY KEY (prefix, seq_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 학력/경력/자격증 샘플
INSERT INTO education (employee_id, school_name, major, degree, graduation_date, status, created_at, updated_at, version, deleted) VALUES
    (2, '서울대학교', '컴퓨터공학', '박사', '2010-02-25', '졸업', NOW(), NOW(), 0, FALSE),
    (3, '연세대학교', '전자공학',   '박사', '2015-02-25', '졸업', NOW(), NOW(), 0, FALSE);

INSERT INTO career (employee_id, company_name, department, position, start_date, end_date, created_at, updated_at, version, deleted) VALUES
    (2, 'ABC연구소', 'AI연구팀', '선임연구원', '2010-03-01', '2012-02-28', NOW(), NOW(), 0, FALSE);

INSERT INTO certification (employee_id, name, issuer, acquired_date, created_at, updated_at, version, deleted) VALUES
    (6, '정보처리기사', '한국산업인력공단', '2018-08-17', NOW(), NOW(), 0, FALSE);
