INSERT INTO department (id, name, parent_department_id, created_at, updated_at, deleted, active) VALUES
    (1, '경영지원본부', NULL, NOW(), NOW(), FALSE, TRUE),
    (2, '인사팀', 1, NOW(), NOW(), FALSE, TRUE),
    (3, '개발본부', NULL, NOW(), NOW(), FALSE, TRUE),
    (4, '백엔드팀', 3, NOW(), NOW(), FALSE, TRUE),
    (5, '프론트엔드팀', 3, NOW(), NOW(), FALSE, TRUE);

INSERT INTO position (id, name, sort_order, created_at, updated_at, deleted, active) VALUES
    (1, '사원', 1, NOW(), NOW(), FALSE, TRUE),
    (2, '대리', 2, NOW(), NOW(), FALSE, TRUE),
    (3, '과장', 3, NOW(), NOW(), FALSE, TRUE),
    (4, '차장', 4, NOW(), NOW(), FALSE, TRUE),
    (5, '부장', 5, NOW(), NOW(), FALSE, TRUE);

INSERT INTO employment_type (id, name, created_at, updated_at, deleted, active) VALUES
    (1, '정규직', NOW(), NOW(), FALSE, TRUE),
    (2, '계약직', NOW(), NOW(), FALSE, TRUE),
    (3, '인턴', NOW(), NOW(), FALSE, TRUE);

-- 관리자 계정 (email: admin@tphr.com / password: admin1234)
INSERT INTO employee (id, employee_number, name, email, password, phone, department_id, position_id,
                       employment_type_id, role, employment_status, hire_date, created_at, updated_at, deleted) VALUES
    (1, 'ADM001', '관리자', 'admin@tphr.com', '$2y$10$R0S14r6EejQe.6BTBZFvQe8Bt.UsvH6rtDh0323ZOjk5yf8IsAaJG',
     '010-0000-0000', 2, 5, 1, 'ADMIN', 'EMPLOYED', '2020-01-01', NOW(), NOW(), FALSE);
