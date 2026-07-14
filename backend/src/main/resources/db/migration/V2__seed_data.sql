-- 조직: 행정조직(ADMINISTRATIVE) + 학사조직(ACADEMIC)
INSERT INTO department (id, name, org_type, parent_department_id, headcount, created_at, updated_at, version, deleted, active) VALUES
    (1, '대학본부',     'ADMINISTRATIVE', NULL, 0,  NOW(), NOW(), 0, FALSE, TRUE),
    (2, '총무처',       'ADMINISTRATIVE', 1,    5,  NOW(), NOW(), 0, FALSE, TRUE),
    (3, '인사팀',       'ADMINISTRATIVE', 2,    4,  NOW(), NOW(), 0, FALSE, TRUE),
    (4, '교무처',       'ADMINISTRATIVE', 1,    6,  NOW(), NOW(), 0, FALSE, TRUE),
    (5, '공과대학',     'ACADEMIC',       NULL, 0,  NOW(), NOW(), 0, FALSE, TRUE),
    (6, '컴퓨터공학과', 'ACADEMIC',       5,    12, NOW(), NOW(), 0, FALSE, TRUE),
    (7, '전자공학과',   'ACADEMIC',       5,    10, NOW(), NOW(), 0, FALSE, TRUE),
    (8, '인문대학',     'ACADEMIC',       NULL, 0,  NOW(), NOW(), 0, FALSE, TRUE),
    (9, '국어국문학과', 'ACADEMIC',       8,    8,  NOW(), NOW(), 0, FALSE, TRUE);

-- 직급: 교원(FACULTY) / 직원(STAFF) 이원화
INSERT INTO position (id, name, category, sort_order, created_at, updated_at, version, deleted, active) VALUES
    (1, '교수',   'FACULTY', 1, NOW(), NOW(), 0, FALSE, TRUE),
    (2, '부교수', 'FACULTY', 2, NOW(), NOW(), 0, FALSE, TRUE),
    (3, '조교수', 'FACULTY', 3, NOW(), NOW(), 0, FALSE, TRUE),
    (4, '강사',   'FACULTY', 4, NOW(), NOW(), 0, FALSE, TRUE),
    (5, '부장',   'STAFF',   5, NOW(), NOW(), 0, FALSE, TRUE),
    (6, '과장',   'STAFF',   6, NOW(), NOW(), 0, FALSE, TRUE),
    (7, '대리',   'STAFF',   7, NOW(), NOW(), 0, FALSE, TRUE),
    (8, '주임',   'STAFF',   8, NOW(), NOW(), 0, FALSE, TRUE);

INSERT INTO employment_type (id, name, created_at, updated_at, version, deleted, active) VALUES
    (1, '전임(정년트랙)',   NOW(), NOW(), 0, FALSE, TRUE),
    (2, '전임(비정년트랙)', NOW(), NOW(), 0, FALSE, TRUE),
    (3, '계약직',           NOW(), NOW(), 0, FALSE, TRUE),
    (4, '조교',             NOW(), NOW(), 0, FALSE, TRUE);

-- 관리자 계정 (email: admin@tphr.com / password: admin1234)
INSERT INTO employee (id, employee_number, name, email, password, phone, staff_category, department_id, position_id,
                       employment_type_id, role, employment_status, hire_date, created_at, updated_at, version, deleted) VALUES
    (1, 'ADM001', '관리자', 'admin@tphr.com', '$2y$10$R0S14r6EejQe.6BTBZFvQe8Bt.UsvH6rtDh0323ZOjk5yf8IsAaJG',
     '010-0000-0000', 'STAFF', 3, 6, 1, 'ADMIN', 'EMPLOYED', '2020-01-01', NOW(), NOW(), 0, FALSE);
