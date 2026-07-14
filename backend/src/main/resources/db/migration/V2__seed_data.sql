-- ══════════════ 마스터 시드 ══════════════
-- 조직 (행정 + 학사)
INSERT INTO `department` (`department_id`, `department_name`, `org_type`, `parent_department_id`, `headcount`, `active`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (1, '대학본부',     'ADMINISTRATIVE', NULL, 0,  TRUE, NOW(), NOW(), 0, FALSE),
  (2, '총무처',       'ADMINISTRATIVE', 1,    5,  TRUE, NOW(), NOW(), 0, FALSE),
  (3, '인사팀',       'ADMINISTRATIVE', 2,    4,  TRUE, NOW(), NOW(), 0, FALSE),
  (4, '교무처',       'ADMINISTRATIVE', 1,    6,  TRUE, NOW(), NOW(), 0, FALSE),
  (5, '공과대학',     'ACADEMIC',       NULL, 0,  TRUE, NOW(), NOW(), 0, FALSE),
  (6, '컴퓨터공학과', 'ACADEMIC',       5,    12, TRUE, NOW(), NOW(), 0, FALSE),
  (7, '전자공학과',   'ACADEMIC',       5,    10, TRUE, NOW(), NOW(), 0, FALSE),
  (8, '인문대학',     'ACADEMIC',       NULL, 0,  TRUE, NOW(), NOW(), 0, FALSE),
  (9, '국어국문학과', 'ACADEMIC',       8,    8,  TRUE, NOW(), NOW(), 0, FALSE);

-- 직급 (교원/직원)
INSERT INTO `position` (`position_id`, `position_name`, `category`, `level`, `active`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (1, '교수',   'FACULTY', 1, TRUE, NOW(), NOW(), 0, FALSE),
  (2, '부교수', 'FACULTY', 2, TRUE, NOW(), NOW(), 0, FALSE),
  (3, '조교수', 'FACULTY', 3, TRUE, NOW(), NOW(), 0, FALSE),
  (4, '강사',   'FACULTY', 4, TRUE, NOW(), NOW(), 0, FALSE),
  (5, '부장',   'STAFF',   5, TRUE, NOW(), NOW(), 0, FALSE),
  (6, '과장',   'STAFF',   6, TRUE, NOW(), NOW(), 0, FALSE),
  (7, '대리',   'STAFF',   7, TRUE, NOW(), NOW(), 0, FALSE),
  (8, '주임',   'STAFF',   8, TRUE, NOW(), NOW(), 0, FALSE);

INSERT INTO `employment_type` (`employment_type_id`, `employment_type_name`, `active`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (1, '전임(정년트랙)',   TRUE, NOW(), NOW(), 0, FALSE),
  (2, '전임(비정년트랙)', TRUE, NOW(), NOW(), 0, FALSE),
  (3, '계약직',           TRUE, NOW(), NOW(), 0, FALSE),
  (4, '조교',             TRUE, NOW(), NOW(), 0, FALSE);

-- 휴가 유형 마스터
INSERT INTO `leave_type` (`leave_type_id`, `leave_type_name`, `paid_yn`, `default_days`, `note`, `active`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (1, '연차',   TRUE,  15.0, '연차유급휴가', TRUE, NOW(), NOW(), 0, FALSE),
  (2, '병가',   FALSE, NULL, '질병휴가',     TRUE, NOW(), NOW(), 0, FALSE),
  (3, '공가',   TRUE,  NULL, '공무휴가',     TRUE, NOW(), NOW(), 0, FALSE),
  (4, '특별휴가', TRUE, NULL, '경조사 등',    TRUE, NOW(), NOW(), 0, FALSE);

-- RBAC
INSERT INTO `role` (`role_id`, `code`, `name`, `description`, `active`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (1, 'ROLE_ADMIN',    '시스템관리자', '전체 권한',      TRUE, NOW(), NOW(), 0, FALSE),
  (2, 'ROLE_HR',       '인사담당',     '인사업무 권한',  TRUE, NOW(), NOW(), 0, FALSE),
  (3, 'ROLE_EMPLOYEE', '일반직원',     '본인 조회/신청', TRUE, NOW(), NOW(), 0, FALSE);

INSERT INTO `permission` (`permission_id`, `code`, `name`, `resource`, `action`) VALUES
  (1, 'EMPLOYEE_READ',       '교직원 조회',   'EMPLOYEE',    'READ'),
  (2, 'EMPLOYEE_WRITE',      '교직원 등록/수정','EMPLOYEE',   'WRITE'),
  (3, 'APPOINTMENT_APPROVE', '발령 승인',     'APPOINTMENT', 'APPROVE'),
  (4, 'LEAVE_APPROVE',       '휴가 승인',     'LEAVE',       'APPROVE'),
  (5, 'PAYROLL_READ',        '급여 조회',     'PAYROLL',     'READ'),
  (6, 'SYSTEM_MANAGE',       '시스템 관리',   'SYSTEM',      'WRITE');

INSERT INTO `role_permission` (`role_id`, `permission_id`) VALUES
  (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),
  (2,1),(2,2),(2,3),(2,4),(2,5),
  (3,1);

INSERT INTO `common_code` (`common_code_id`, `group_code`, `code`, `name`, `sort_order`, `active`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (1, 'LEAVE_TYPE',       'ANNUAL',    '연차', 1, TRUE, NOW(), NOW(), 0, FALSE),
  (2, 'LEAVE_TYPE',       'SICK',      '병가', 2, TRUE, NOW(), NOW(), 0, FALSE),
  (3, 'LEAVE_TYPE',       'OFFICIAL',  '공가', 3, TRUE, NOW(), NOW(), 0, FALSE),
  (4, 'APPOINTMENT_TYPE', 'HIRE',      '임용', 1, TRUE, NOW(), NOW(), 0, FALSE),
  (5, 'APPOINTMENT_TYPE', 'PROMOTION', '승진', 2, TRUE, NOW(), NOW(), 0, FALSE),
  (6, 'APPOINTMENT_TYPE', 'TRANSFER',  '전보', 3, TRUE, NOW(), NOW(), 0, FALSE),
  (7, 'APPOINTMENT_TYPE', 'CONCURRENT','겸직', 4, TRUE, NOW(), NOW(), 0, FALSE);

-- ══════════════ 교직원 (admin / password: admin1234, 샘플 / user1234) ══════════════
INSERT INTO `employee` (`employee_id`, `employee_no`, `department_id`, `position_id`, `employment_type_id`, `name`, `staff_category`, `email`, `password`, `role`, `phone`, `birth_date`, `gender`, `hire_date`, `employee_status_code`, `bank_name`, `account_number`, `account_holder`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (1, 'ADM001', 3, 6, 1, '관리자', 'STAFF',   'admin@tphr.com',      '$2y$10$R0S14r6EejQe.6BTBZFvQe8Bt.UsvH6rtDh0323ZOjk5yf8IsAaJG', 'ADMIN',    '010-0000-0000', '1980-01-01', 'M', '2020-01-01', 'EMPLOYED', NULL, NULL, NULL, NOW(), NOW(), 0, FALSE),
  (2, 'FAC001', 6, 1, 1, '김정교', 'FACULTY', 'prof.kim@tphr.com',   '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2', 'EMPLOYEE', '010-1111-0001', '1975-05-12', 'M', '2012-03-01', 'EMPLOYED', '국민은행', '123456-01-000001', '김정교', NOW(), NOW(), 0, FALSE),
  (3, 'FAC002', 6, 2, 1, '이부교', 'FACULTY', 'assoc.lee@tphr.com',  '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2', 'EMPLOYEE', '010-1111-0002', '1980-09-03', 'F', '2017-03-01', 'EMPLOYED', '신한은행', '110-000-000002', '이부교', NOW(), NOW(), 0, FALSE),
  (4, 'FAC003', 7, 4, 3, '박강사', 'FACULTY', 'lect.park@tphr.com',  '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2', 'EMPLOYEE', '010-1111-0003', '1990-01-20', 'M', '2025-03-01', 'EMPLOYED', NULL, NULL, NULL, NOW(), NOW(), 0, FALSE),
  (5, 'FAC004', 9, 3, 1, '최조교수', 'FACULTY','assist.choi@tphr.com','$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2', 'EMPLOYEE', '010-1111-0004', '1985-07-07', 'F', '2021-09-01', 'ON_LEAVE', NULL, NULL, NULL, NOW(), NOW(), 0, FALSE),
  (6, 'STA001', 3, 7, 1, '정직원', 'STAFF',   'staff.jung@tphr.com', '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2', 'EMPLOYEE', '010-1111-0005', '1992-11-30', 'M', '2019-01-14', 'EMPLOYED', '신한은행', '110-000-000001', '정직원', NOW(), NOW(), 0, FALSE),
  (7, 'STA002', 2, 8, 1, '한주임', 'STAFF',   'staff.han@tphr.com',  '$2y$10$HBrp.B9cw/40BPare6uwg..KV3JkZ9JkaaXIUxgP5lDKen0KVRtb2', 'EMPLOYEE', '010-1111-0006', '1995-04-18', 'F', '2022-07-01', 'EMPLOYED', NULL, NULL, NULL, NOW(), NOW(), 0, FALSE);

INSERT INTO `employee_role` (`employee_id`, `role_id`) VALUES (1,1),(2,3),(3,3),(4,3),(5,3),(6,3),(7,3);

-- 인사기록 샘플
INSERT INTO `employee_education` (`employee_id`, `school_name`, `major`, `degree`, `graduation_date`, `status`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (2, '서울대학교', '컴퓨터공학', '박사', '2010-02-25', '졸업', NOW(), NOW(), 0, FALSE),
  (3, '연세대학교', '전자공학',   '박사', '2015-02-25', '졸업', NOW(), NOW(), 0, FALSE);

INSERT INTO `employee_career` (`employee_id`, `company_name`, `department`, `position`, `start_date`, `end_date`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (2, 'ABC연구소', 'AI연구팀', '선임연구원', '2010-03-01', '2012-02-28', NOW(), NOW(), 0, FALSE);

INSERT INTO `employee_certificate` (`employee_id`, `name`, `issuer`, `acquired_date`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (6, '정보처리기사', '한국산업인력공단', '2018-08-17', NOW(), NOW(), 0, FALSE);

-- 잔여 휴가 (연차=leave_type 1)
INSERT INTO `employee_leave_balance` (`leave_type_id`, `employee_id`, `year`, `total_days`, `used_days`, `remain_days`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (1, 2, 2026, 15.0, 3.0, 12.0, NOW(), NOW(), 0, FALSE),
  (1, 6, 2026, 15.0, 5.5,  9.5, NOW(), NOW(), 0, FALSE);

-- 급여 명세서 샘플
INSERT INTO `payroll` (`employee_id`, `payroll_year_month`, `payment_date`, `total_pay_amount`, `total_deduction_amount`, `real_pay_amount`, `payroll_status_code`, `employee_name_snapshot`, `department_name_snapshot`, `position_name_snapshot`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (2, '202607', '2026-07-25', 5650000, 565000, 5085000, 'CONFIRMED', '김정교', '컴퓨터공학과', '교수', NOW(), NOW(), 0, FALSE),
  (6, '202607', '2026-07-25', 3350000, 335000, 3015000, 'CONFIRMED', '정직원', '인사팀',       '대리', NOW(), NOW(), 0, FALSE);
