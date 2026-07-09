CREATE TABLE department (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name                  VARCHAR(100) NOT NULL,
    parent_department_id  BIGINT NULL,
    created_at            DATETIME NOT NULL,
    updated_at            DATETIME NOT NULL,
    deleted               BOOLEAN NOT NULL DEFAULT FALSE,
    active                BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_department_parent FOREIGN KEY (parent_department_id) REFERENCES department (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE position (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL,
    updated_at  DATETIME NOT NULL,
    deleted     BOOLEAN NOT NULL DEFAULT FALSE,
    active      BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE employment_type (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    created_at  DATETIME NOT NULL,
    updated_at  DATETIME NOT NULL,
    deleted     BOOLEAN NOT NULL DEFAULT FALSE,
    active      BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE employee (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_number      VARCHAR(20) NOT NULL,
    name                 VARCHAR(50) NOT NULL,
    email                VARCHAR(100) NOT NULL,
    password             VARCHAR(255) NOT NULL,
    phone                VARCHAR(20) NULL,
    department_id        BIGINT NOT NULL,
    position_id          BIGINT NOT NULL,
    employment_type_id   BIGINT NOT NULL,
    role                 VARCHAR(20) NOT NULL,
    employment_status    VARCHAR(20) NOT NULL,
    hire_date            DATE NOT NULL,
    resign_date          DATE NULL,
    created_at           DATETIME NOT NULL,
    updated_at           DATETIME NOT NULL,
    deleted              BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_employee_number UNIQUE (employee_number),
    CONSTRAINT uq_employee_email UNIQUE (email),
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES department (id),
    CONSTRAINT fk_employee_position FOREIGN KEY (position_id) REFERENCES position (id),
    CONSTRAINT fk_employee_employment_type FOREIGN KEY (employment_type_id) REFERENCES employment_type (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
