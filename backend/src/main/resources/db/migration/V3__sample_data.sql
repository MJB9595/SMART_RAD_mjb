-- 샘플 교직원 (공통 password: user1234)
INSERT INTO employee (id, employee_number, name, email, password, phone, staff_category, department_id, position_id,
                       employment_type_id, role, employment_status, hire_date, birth_date, gender, created_at, updated_at, version, deleted) VALUES
    (2, 'FAC001', '김정교', 'prof.kim@tphr.com',  '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2',
     '010-1111-0001', 'FACULTY', 6, 1, 1, 'EMPLOYEE', 'EMPLOYED', '2012-03-01', '1975-05-12', 'M', NOW(), NOW(), 0, FALSE),
    (3, 'FAC002', '이부교', 'assoc.lee@tphr.com', '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2',
     '010-1111-0002', 'FACULTY', 6, 2, 1, 'EMPLOYEE', 'EMPLOYED', '2017-03-01', '1980-09-03', 'F', NOW(), NOW(), 0, FALSE),
    (4, 'FAC003', '박강사', 'lect.park@tphr.com', '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2',
     '010-1111-0003', 'FACULTY', 7, 4, 3, 'EMPLOYEE', 'EMPLOYED', '2025-03-01', '1990-01-20', 'M', NOW(), NOW(), 0, FALSE),
    (5, 'FAC004', '최조교수', 'assist.choi@tphr.com', '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2',
     '010-1111-0004', 'FACULTY', 9, 3, 1, 'EMPLOYEE', 'ON_LEAVE', '2021-09-01', '1985-07-07', 'F', NOW(), NOW(), 0, FALSE),
    (6, 'STA001', '정직원', 'staff.jung@tphr.com', '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2',
     '010-1111-0005', 'STAFF', 3, 7, 1, 'EMPLOYEE', 'EMPLOYED', '2019-01-14', '1992-11-30', 'M', NOW(), NOW(), 0, FALSE),
    (7, 'STA002', '한주임', 'staff.han@tphr.com', '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2',
     '010-1111-0006', 'STAFF', 2, 8, 1, 'EMPLOYEE', 'EMPLOYED', '2022-07-01', '1995-04-18', 'F', NOW(), NOW(), 0, FALSE);
