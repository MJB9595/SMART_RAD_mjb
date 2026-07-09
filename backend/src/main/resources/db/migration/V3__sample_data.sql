-- 샘플 사원 데이터 (email 공통 password: user1234)
INSERT INTO employee (id, employee_number, name, email, password, phone, department_id, position_id,
                       employment_type_id, role, employment_status, hire_date, created_at, updated_at, deleted) VALUES
    (2, 'EMP001', '김민준', 'minjun.kim@tphr.com', '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2',
     '010-1111-0001', 4, 3, 1, 'EMPLOYEE', 'EMPLOYED', '2021-03-02', NOW(), NOW(), FALSE),
    (3, 'EMP002', '이서연', 'seoyeon.lee@tphr.com', '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2',
     '010-1111-0002', 4, 1, 1, 'EMPLOYEE', 'EMPLOYED', '2023-07-10', NOW(), NOW(), FALSE),
    (4, 'EMP003', '박도윤', 'doyun.park@tphr.com', '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2',
     '010-1111-0003', 5, 2, 1, 'EMPLOYEE', 'EMPLOYED', '2022-01-17', NOW(), NOW(), FALSE),
    (5, 'EMP004', '최지우', 'jiwoo.choi@tphr.com', '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2',
     '010-1111-0004', 5, 1, 2, 'EMPLOYEE', 'EMPLOYED', '2024-05-20', NOW(), NOW(), FALSE),
    (6, 'EMP005', '정하은', 'haeun.jeong@tphr.com', '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2',
     '010-1111-0005', 2, 2, 1, 'EMPLOYEE', 'EMPLOYED', '2022-09-01', NOW(), NOW(), FALSE),
    (7, 'EMP006', '강서준', 'seojun.kang@tphr.com', '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2',
     '010-1111-0006', 1, 4, 1, 'EMPLOYEE', 'ON_LEAVE', '2019-11-11', NOW(), NOW(), FALSE);
