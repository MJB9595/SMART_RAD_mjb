-- 화면 시연용 샘플 시드: 수당 / 휴가정책 / 경조비 / 증명서 / 월근태.
-- (기존 프론트에 하드코딩돼 있던 목데이터를 실제 DB 시드로 이관)

-- 수당 마스터
INSERT INTO `allowance` (`allowance_name`, `taxable`, `fixed`, `active`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  ('직책수당',     TRUE,  TRUE,  TRUE, NOW(), NOW(), 0, FALSE),
  ('가족수당',     TRUE,  TRUE,  TRUE, NOW(), NOW(), 0, FALSE),
  ('식대',         FALSE, TRUE,  TRUE, NOW(), NOW(), 0, FALSE),
  ('초과근무수당', TRUE,  FALSE, TRUE, NOW(), NOW(), 0, FALSE),
  ('연구보조비',   FALSE, TRUE,  TRUE, NOW(), NOW(), 0, FALSE);

-- 직급별 휴가 정책 (position_id: 1교수 2부교수 3조교수 4강사 5부장 6과장 7대리 8주임)
INSERT INTO `leave_policy` (`position_id`, `annual_leave_days`, `max_carry_over_days`, `half_day_allowed`, `note`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (1, 25, 5, TRUE, '연구년 휴가 별도 산정', NOW(), NOW(), 0, FALSE),
  (2, 22, 5, TRUE, '', NOW(), NOW(), 0, FALSE),
  (3, 20, 5, TRUE, '', NOW(), NOW(), 0, FALSE),
  (4, 15, 3, TRUE, '시간강사 별도 규정', NOW(), NOW(), 0, FALSE),
  (5, 20, 5, TRUE, '', NOW(), NOW(), 0, FALSE),
  (6, 18, 3, TRUE, '', NOW(), NOW(), 0, FALSE),
  (7, 15, 3, TRUE, '근속 2년마다 1일 추가', NOW(), NOW(), 0, FALSE),
  (8, 15, 3, TRUE, '', NOW(), NOW(), 0, FALSE);

-- 경조비 신청 (employee_id: 2김정교 3이부교)
INSERT INTO `employee_event_support`
  (`employee_id`, `document_number`, `event_type`, `family_relation`, `target_name`, `application_date`, `event_date`, `requested_amount`, `event_location`, `approval_status`, `approver_id`, `approved_at`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (2, 'ES-2026-001', '결혼', '본인',   '김정교', '2026-07-18', '2026-07-20', 500000, '서울웨딩홀', 'APPROVED', 1, NOW(), NOW(), NOW(), 0, FALSE),
  (3, 'ES-2026-002', '출산', '배우자', '이부교', '2026-08-10', '2026-08-15', 300000, NULL,        'PENDING',  NULL, NULL, NOW(), NOW(), 0, FALSE);

-- 증명서 발급 (employee_id: 2김정교 6정직원)
INSERT INTO `employee_certificate_issue`
  (`employee_id`, `document_number`, `certificate_type`, `application_date`, `purpose`, `issue_status`, `issued_at`, `approval_status`, `approver_id`, `approved_at`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (2, 'CERT-2026-001', '재직증명서', '2026-07-14', '은행 제출용 (대출)', 'ISSUED',  NOW(), 'APPROVED', 1, NOW(), NOW(), NOW(), 0, FALSE),
  (6, 'CERT-2026-002', '경력증명서', '2026-07-15', '개인 소장용',        'WAITING', NULL,  'PENDING',  NULL, NULL, NOW(), NOW(), 0, FALSE);

-- 월근태 샘플 (2026-07) — 김정교(2), 정직원(6)
INSERT INTO `attendance` (`employee_id`, `work_date`, `check_in_time`, `check_out_time`, `attendance_status_code`, `created_at`, `updated_at`, `version`, `deleted`) VALUES
  (2, '2026-07-01', '09:00', '18:00', 'PRESENT', NOW(), NOW(), 0, FALSE),
  (2, '2026-07-02', '09:05', '18:00', 'PRESENT', NOW(), NOW(), 0, FALSE),
  (2, '2026-07-03', '09:40', '18:00', 'LATE',    NOW(), NOW(), 0, FALSE),
  (2, '2026-07-06', NULL,    NULL,    'ANNUAL_LEAVE', NOW(), NOW(), 0, FALSE),
  (6, '2026-07-01', '08:55', '18:00', 'PRESENT', NOW(), NOW(), 0, FALSE),
  (6, '2026-07-02', '08:58', '18:00', 'PRESENT', NOW(), NOW(), 0, FALSE),
  (6, '2026-07-03', '09:00', '18:00', 'PRESENT', NOW(), NOW(), 0, FALSE);
