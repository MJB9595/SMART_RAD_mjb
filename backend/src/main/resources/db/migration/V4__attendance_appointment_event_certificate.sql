CREATE TABLE attendance (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id     BIGINT NOT NULL,
    work_date       DATE NOT NULL,
    check_in_time   TIME NULL,
    check_out_time  TIME NULL,
    status          VARCHAR(20) NOT NULL,
    created_at      DATETIME NOT NULL,
    updated_at      DATETIME NOT NULL,
    deleted         BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_attendance_employee_date UNIQUE (employee_id, work_date),
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employee (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_attendance_work_date ON attendance (work_date);

CREATE TABLE employee_appointment (
    id                     BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_number        VARCHAR(30) NOT NULL,
    employee_id            BIGINT NOT NULL,
    appointment_type       VARCHAR(20) NOT NULL,
    from_department_id     BIGINT NULL,
    to_department_id       BIGINT NULL,
    from_position_id       BIGINT NULL,
    to_position_id         BIGINT NULL,
    appointment_date       DATE NOT NULL,
    reason                 VARCHAR(500) NULL,
    registered_by          BIGINT NOT NULL,
    created_at             DATETIME NOT NULL,
    updated_at             DATETIME NOT NULL,
    deleted                BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_appointment_document_number UNIQUE (document_number),
    CONSTRAINT fk_appointment_employee FOREIGN KEY (employee_id) REFERENCES employee (id),
    CONSTRAINT fk_appointment_from_department FOREIGN KEY (from_department_id) REFERENCES department (id),
    CONSTRAINT fk_appointment_to_department FOREIGN KEY (to_department_id) REFERENCES department (id),
    CONSTRAINT fk_appointment_from_position FOREIGN KEY (from_position_id) REFERENCES position (id),
    CONSTRAINT fk_appointment_to_position FOREIGN KEY (to_position_id) REFERENCES position (id),
    CONSTRAINT fk_appointment_registered_by FOREIGN KEY (registered_by) REFERENCES employee (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE employee_event_support (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_number   VARCHAR(30) NOT NULL,
    employee_id       BIGINT NOT NULL,
    event_type        VARCHAR(20) NOT NULL,
    amount            DECIMAL(12, 0) NOT NULL,
    event_date        DATE NOT NULL,
    description       VARCHAR(500) NULL,
    approval_status   VARCHAR(20) NOT NULL,
    approver_id       BIGINT NULL,
    approved_at       DATETIME NULL,
    created_at        DATETIME NOT NULL,
    updated_at        DATETIME NOT NULL,
    deleted           BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_event_support_document_number UNIQUE (document_number),
    CONSTRAINT fk_event_support_employee FOREIGN KEY (employee_id) REFERENCES employee (id),
    CONSTRAINT fk_event_support_approver FOREIGN KEY (approver_id) REFERENCES employee (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE employee_certificate_issue (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_number    VARCHAR(30) NOT NULL,
    employee_id        BIGINT NOT NULL,
    certificate_type   VARCHAR(20) NOT NULL,
    purpose            VARCHAR(200) NULL,
    issue_status       VARCHAR(20) NOT NULL,
    approval_status    VARCHAR(20) NOT NULL,
    approver_id        BIGINT NULL,
    approved_at        DATETIME NULL,
    issued_at          DATETIME NULL,
    created_at         DATETIME NOT NULL,
    updated_at         DATETIME NOT NULL,
    deleted            BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_certificate_issue_document_number UNIQUE (document_number),
    CONSTRAINT fk_certificate_issue_employee FOREIGN KEY (employee_id) REFERENCES employee (id),
    CONSTRAINT fk_certificate_issue_approver FOREIGN KEY (approver_id) REFERENCES employee (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE document_sequence (
    prefix    VARCHAR(10) NOT NULL,
    seq_year  INT NOT NULL,
    last_no   INT NOT NULL,
    PRIMARY KEY (prefix, seq_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
