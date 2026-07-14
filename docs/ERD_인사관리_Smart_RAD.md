# 인사관리_Smart_RAD_part2 — ERD 명세서

> 출처: [ERDCloud](https://www.erdcloud.com/d/fEP8zzCkJjroBGjE6) · 테이블 수: **32개**

## 목차

- [department](#department)
- [employee_appointment](#employee-appointment)
- [employee_event_support](#employee-event-support)
- [position](#position)
- [attendance](#attendance)
- [employee_certificate_issue](#employee-certificate-issue)
- [employment_type](#employment-type)
- [employee](#employee)
- [leave_type](#leave-type)
- [file_attachment](#file-attachment)
- [leave_policy](#leave-policy)
- [common_code](#common-code)
- [employee_education](#employee-education)
- [leave_request](#leave-request)
- [role](#role)
- [employee_career](#employee-career)
- [permission](#permission)
- [employee_leave_balance](#employee-leave-balance)
- [role_permission](#role-permission)
- [employee_role](#employee-role)
- [employee_certificate](#employee-certificate)
- [allowance](#allowance)
- [audit_log](#audit-log)
- [employee_family](#employee-family)
- [employee_allowance](#employee-allowance)
- [document_sequence](#document-sequence)
- [payroll_item_master](#payroll-item-master)
- [employee_military](#employee-military)
- [payroll](#payroll)
- [employee_language](#employee-language)
- [payroll_detail](#payroll-detail)
- [employee_oauth](#employee-oauth)

## 관계 요약 (Foreign Keys)

| 자식 테이블 | 자식 컬럼 | → | 부모 테이블 | 부모 컬럼 |
|---|---|:-:|---|---|
| department | parent_department_id | → | department | department_id |
| employee_appointment | employee_id | → | employee | employee_id |
| employee_appointment | from_department_id | → | department | department_id |
| employee_appointment | to_department_id | → | department | department_id |
| employee_appointment | from_position_id | → | position | position_id |
| employee_appointment | to_position_id | → | position | position_id |
| employee_appointment | approver_id | → | employee | employee_id |
| employee_appointment | registered_by | → | employee | employee_id |
| employee_event_support | employee_id | → | employee | employee_id |
| employee_event_support | approver_id | → | employee | employee_id |
| attendance | employee_id | → | employee | employee_id |
| employee_certificate_issue | employee_id | → | employee | employee_id |
| employee_certificate_issue | approver_id | → | employee | employee_id |
| employee | department_id | → | department | department_id |
| employee | position_id | → | position | position_id |
| employee | employment_type_id | → | employment_type | employment_type_id |
| leave_policy | position_id | → | position | position_id |
| employee_education | employee_id | → | employee | employee_id |
| leave_request | leave_type_id | → | leave_type | leave_type_id |
| leave_request | employee_id | → | employee | employee_id |
| leave_request | approver_id | → | employee | employee_id |
| employee_career | employee_id | → | employee | employee_id |
| employee_leave_balance | leave_type_id | → | leave_type | leave_type_id |
| employee_leave_balance | employee_id | → | employee | employee_id |
| role_permission | role_id | → | role | role_id |
| role_permission | permission_id | → | permission | permission_id |
| employee_role | employee_id | → | employee | employee_id |
| employee_role | role_id | → | role | role_id |
| employee_certificate | employee_id | → | employee | employee_id |
| audit_log | actor_id | → | employee | employee_id |
| employee_family | employee_id | → | employee | employee_id |
| employee_allowance | employee_id | → | employee | employee_id |
| employee_allowance | allowance_id | → | allowance | allowance_id |
| employee_military | employee_id | → | employee | employee_id |
| payroll | employee_id | → | employee | employee_id |
| employee_language | employee_id | → | employee | employee_id |
| payroll_detail | payroll_id | → | payroll | payroll_id |
| payroll_detail | payroll_item_master_id | → | payroll_item_master | payroll_item_master_id |
| employee_oauth | employee_id | → | employee | employee_id |

*총 39개의 외래키 관계*

---

## 테이블 상세

### department

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| department_id | BIGINT | PK |  |  | 조직 PK |
| department_name | VARCHAR(100) |  |  |  | 조직명 |
| org_type | VARCHAR(20) |  |  |  | ACADEMIC(학사)/ADMINISTRATIVE(행정) |
| parent_department_id | BIGINT | FK | Y |  | 상위조직(자기참조) → `department.department_id` |
| headcount | INT |  |  | 0 | 정원 |
| active | BOOLEAN |  |  | TRUE |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### employee_appointment

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_appointment_id | BIGINT | PK |  |  | 발령 PK |
| document_number | VARCHAR(30) |  |  |  | APT-2026-001 |
| employee_id | BIGINT | FK |  |  | 발령대상 → `employee.employee_id` |
| appointment_type | VARCHAR(50) |  |  |  | HIRE/PROMOTION/TRANSFER/CONCURRENT |
| appointment_date | DATE |  |  |  |  |
| effective_date | DATE |  | Y |  | 발효일 |
| from_department_id | BIGINT | FK | Y |  | → `department.department_id` |
| to_department_id | BIGINT | FK | Y |  | → `department.department_id` |
| from_position_id | BIGINT | FK | Y |  | → `position.position_id` |
| to_position_id | BIGINT | FK | Y |  | → `position.position_id` |
| reason | VARCHAR(500) |  | Y |  |  |
| approval_status | VARCHAR(20) |  |  | 'PENDING' | PENDING/APPROVED/REJECTED |
| approver_id | BIGINT | FK | Y |  | → `employee.employee_id` |
| approved_at | DATETIME |  | Y |  |  |
| registered_by | BIGINT | FK |  |  | 등록자 → `employee.employee_id` |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### employee_event_support

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_event_support_id | BIGINT | PK |  |  | 경조비 PK |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| document_number | VARCHAR(30) |  |  |  | ES-2026-001 |
| event_type | VARCHAR(100) |  |  |  | 결혼/출산/사망 등 |
| family_relation | VARCHAR(100) |  | Y |  |  |
| target_name | VARCHAR(100) |  |  |  | 대상자 |
| application_date | DATE |  |  |  |  |
| event_date | DATE |  |  |  |  |
| requested_amount | DECIMAL(12, 0) |  |  |  | 신청금액 |
| event_location | VARCHAR(255) |  | Y |  |  |
| bank_name | VARCHAR(100) |  | Y |  |  |
| account_number | VARCHAR(100) |  | Y |  |  |
| account_holder | VARCHAR(100) |  | Y |  |  |
| approval_status | VARCHAR(50) |  |  | 'PENDING' | PENDING/APPROVED/REJECTED/PAID |
| approver_id | BIGINT | FK | Y |  | → `employee.employee_id` |
| approved_at | DATETIME |  | Y |  |  |
| memo | VARCHAR(1000) |  | Y |  |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### position

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| position_id | BIGINT | PK |  |  | 직급 PK |
| position_name | VARCHAR(100) |  |  |  | 직급명 |
| category | VARCHAR(20) |  |  |  | FACULTY/STAFF/COMMON |
| level | INT |  |  | 0 | 직급 레벨 |
| active | BOOLEAN |  |  | TRUE |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### attendance

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| attendance_id | BIGINT | PK |  |  | 근태 PK |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| work_date | DATE |  |  |  |  |
| check_in_time | TIME |  | Y |  |  |
| check_out_time | TIME |  | Y |  |  |
| work_minutes | INT |  | Y |  |  |
| overtime_minutes | INT |  | Y |  |  |
| night_work_minutes | INT |  | Y |  |  |
| late_minutes | INT |  | Y |  |  |
| early_leave_minutes | INT |  | Y |  |  |
| attendance_status_code | VARCHAR(30) |  |  |  | PRESENT/LATE/ABSENT/LEAVE ... |
| remark | VARCHAR(300) |  | Y |  |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### employee_certificate_issue

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_certificate_issue_id | BIGINT | PK |  |  | 증명서발급 PK |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| document_number | VARCHAR(30) |  |  |  | CERT-2026-001 |
| certificate_type | VARCHAR(100) |  |  |  | 재직/경력/급여 등 |
| application_date | DATE |  |  |  |  |
| purpose | VARCHAR(500) |  | Y |  |  |
| issue_status | VARCHAR(50) |  |  | 'WAITING' | WAITING/ISSUED/REJECTED |
| issued_at | DATETIME |  | Y |  |  |
| approval_status | VARCHAR(50) |  |  | 'PENDING' | PENDING/APPROVED/REJECTED |
| approver_id | BIGINT | FK | Y |  | → `employee.employee_id` |
| approved_at | DATETIME |  | Y |  |  |
| memo | VARCHAR(1000) |  | Y |  |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### employment_type

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employment_type_id | BIGINT | PK |  |  | 임용구분 PK |
| employment_type_name | VARCHAR(100) |  |  |  | 임용구분명 |
| active | BOOLEAN |  |  | TRUE |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### employee

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_id | BIGINT | PK |  |  | 교직원 PK |
| employee_no | VARCHAR(30) |  |  |  | 사번 |
| department_id | BIGINT | FK |  |  | 소속 → `department.department_id` |
| position_id | BIGINT | FK |  |  | 직급 → `position.position_id` |
| employment_type_id | BIGINT | FK |  |  | 임용구분 → `employment_type.employment_type_id` |
| name | VARCHAR(100) |  |  |  | 성명 |
| staff_category | VARCHAR(20) |  |  |  | FACULTY(교원)/STAFF(직원) |
| email | VARCHAR(100) |  |  |  | 로그인 ID |
| password | VARCHAR(255) |  |  |  | BCrypt |
| role | VARCHAR(20) |  |  |  | JWT 대표권한 |
| phone | VARCHAR(30) |  | Y |  |  |
| birth_date | DATE |  | Y |  |  |
| gender | VARCHAR(10) |  | Y |  |  |
| address | VARCHAR(255) |  | Y |  |  |
| emergency_contact | VARCHAR(50) |  | Y |  |  |
| hire_date | DATE |  |  |  | 임용일 |
| resignation_date | DATE |  | Y |  |  |
| employee_status_code | VARCHAR(30) |  |  |  | EMPLOYED/ON_LEAVE/RESIGNED |
| bank_name | VARCHAR(100) |  | Y |  |  |
| account_number | VARCHAR(100) |  | Y |  |  |
| account_holder | VARCHAR(100) |  | Y |  |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### leave_type

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| leave_type_id | BIGINT | PK |  |  | 휴가유형 PK |
| leave_type_name | VARCHAR(100) |  |  |  | 휴가유형명 |
| paid_yn | BOOLEAN |  |  |  | 유급여부 |
| default_days | DECIMAL(4, 1) |  | Y |  | 기본부여일수 |
| note | VARCHAR(255) |  | Y |  |  |
| active | BOOLEAN |  |  | TRUE |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### file_attachment

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| file_attachment_id | BIGINT | PK |  |  | 첨부파일 PK |
| ref_type | VARCHAR(50) |  |  |  | 업무유형(APPOINTMENT/EVENT ...) |
| ref_id | BIGINT |  |  |  | 업무데이터 PK |
| original_name | VARCHAR(255) |  |  |  |  |
| stored_name | VARCHAR(255) |  |  |  |  |
| file_path | VARCHAR(500) |  |  |  |  |
| extension | VARCHAR(20) |  | Y |  |  |
| content_type | VARCHAR(100) |  | Y |  |  |
| file_size | BIGINT |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| created_at | DATETIME |  |  |  |  |

### leave_policy

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| leave_policy_id | BIGINT | PK |  |  | 휴가정책 PK |
| position_id | BIGINT | FK | Y |  | 적용 직급(NULL=전체) → `position.position_id` |
| annual_leave_days | DECIMAL(4, 1) |  |  |  | 연차일수 |
| max_carry_over_days | DECIMAL(4, 1) |  | Y |  | 이월한도 |
| half_day_allowed | BOOLEAN |  | Y |  | 반차허용 |
| note | VARCHAR(255) |  | Y |  |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### common_code

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| common_code_id | BIGINT | PK |  |  | 공통코드 PK |
| group_code | VARCHAR(50) |  |  |  | 코드그룹 |
| code | VARCHAR(50) |  |  |  | 코드값 |
| name | VARCHAR(100) |  |  |  | 표시명 |
| sort_order | INT |  |  | 0 |  |
| parent_code | VARCHAR(50) |  | Y |  |  |
| active | BOOLEAN |  |  | TRUE |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### employee_education

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_education_id | BIGINT | PK |  |  | 학력 PK |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| school_name | VARCHAR(200) |  |  |  | 학교명 |
| major | VARCHAR(200) |  | Y |  | 전공 |
| degree | VARCHAR(100) |  | Y |  | 학위 |
| admission_date | DATE |  | Y |  | 입학일 |
| graduation_date | DATE |  | Y |  | 졸업일 |
| status | VARCHAR(50) |  | Y |  | 졸업/재학/수료/중퇴 |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### leave_request

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| leave_request_id | BIGINT | PK |  |  | 휴가신청 PK |
| document_number | VARCHAR(30) |  |  |  | LVE-2026-001 |
| leave_type_id | BIGINT | FK |  |  | → `leave_type.leave_type_id` |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| start_date | DATE |  |  |  |  |
| end_date | DATE |  |  |  |  |
| leave_days | DECIMAL(4, 1) |  |  |  |  |
| reason | TEXT |  | Y |  |  |
| status | VARCHAR(30) |  |  | 'PENDING' | PENDING/APPROVED/REJECTED |
| approver_id | BIGINT | FK | Y |  | → `employee.employee_id` |
| approved_at | DATETIME |  | Y |  |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### role

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| role_id | BIGINT | PK |  |  | 역할 PK |
| code | VARCHAR(50) |  |  |  | ROLE_ADMIN 등 |
| name | VARCHAR(50) |  |  |  |  |
| description | VARCHAR(200) |  | Y |  |  |
| active | BOOLEAN |  |  | TRUE |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### employee_career

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_career_id | BIGINT | PK |  |  | 경력 PK |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| company_name | VARCHAR(200) |  |  |  | 기관/회사명 |
| department | VARCHAR(100) |  | Y |  | 부서 |
| position | VARCHAR(100) |  | Y |  | 직위 |
| job_description | VARCHAR(500) |  | Y |  | 담당업무 |
| start_date | DATE |  |  |  | 시작일 |
| end_date | DATE |  | Y |  | 종료일 |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### permission

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| permission_id | BIGINT | PK |  |  | 권한 PK |
| code | VARCHAR(80) |  |  |  | EMPLOYEE_READ 등 |
| name | VARCHAR(80) |  |  |  |  |
| resource | VARCHAR(50) |  | Y |  |  |
| action | VARCHAR(30) |  | Y |  |  |

### employee_leave_balance

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_leave_balance_id | BIGINT | PK |  |  | 잔여휴가 PK |
| leave_type_id | BIGINT | FK |  |  | → `leave_type.leave_type_id` |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| year | INT |  |  |  | 기준연도 |
| total_days | DECIMAL(5, 1) |  |  |  | 부여일수 |
| used_days | DECIMAL(5, 1) |  |  | 0 | 사용일수 |
| remain_days | DECIMAL(5, 1) |  |  |  | 잔여일수 |
| expire_date | DATE |  | Y |  |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### role_permission

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| role_id | BIGINT | FK |  |  | → `role.role_id` |
| permission_id | BIGINT | FK |  |  | → `permission.permission_id` |

### employee_role

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| role_id | BIGINT | FK |  |  | → `role.role_id` |

### employee_certificate

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_certificate_id | BIGINT | PK |  |  | 자격증 PK |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| name | VARCHAR(200) |  |  |  | 자격증명 |
| issuer | VARCHAR(100) |  | Y |  | 발급기관 |
| cert_number | VARCHAR(100) |  | Y |  | 자격번호 |
| acquired_date | DATE |  | Y |  | 취득일 |
| expiry_date | DATE |  | Y |  | 만료일 |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### allowance

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| allowance_id | BIGINT | PK |  |  | 수당 PK |
| allowance_name | VARCHAR(100) |  |  |  | 수당명 |
| taxable | BOOLEAN |  |  |  | 과세여부 |
| fixed | BOOLEAN |  |  |  | 고정여부 |
| active | BOOLEAN |  |  | TRUE |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### audit_log

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| audit_log_id | BIGINT | PK |  |  | 감사로그 PK |
| actor_id | BIGINT | FK | Y |  | 행위자(employee) → `employee.employee_id` |
| action | VARCHAR(50) |  |  |  | CREATE/UPDATE/APPROVE ... |
| entity_type | VARCHAR(50) |  | Y |  |  |
| entity_id | BIGINT |  | Y |  |  |
| before_data | TEXT |  | Y |  |  |
| after_data | TEXT |  | Y |  |  |
| ip_address | VARCHAR(45) |  | Y |  |  |
| created_at | DATETIME |  |  |  |  |

### employee_family

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_family_id | BIGINT | PK |  |  | 가족 PK |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| family_name | VARCHAR(100) |  |  |  | 가족성명 |
| family_relation | VARCHAR(50) |  |  |  | 관계(부/모/배우자 등) |
| birth_date | DATE |  | Y |  |  |
| job | VARCHAR(100) |  | Y |  |  |
| living_together | BOOLEAN |  | Y |  | 동거여부 |
| dependent | BOOLEAN |  | Y |  | 부양여부 |
| disabled | BOOLEAN |  | Y |  | 장애여부 |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### employee_allowance

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_allowance_id | BIGINT | PK |  |  | 사원수당 PK |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| allowance_id | BIGINT | FK |  |  | → `allowance.allowance_id` |
| amount | DECIMAL(15, 2) |  |  |  | 금액 |
| start_date | DATE |  | Y |  |  |
| end_date | DATE |  | Y |  |  |
| active | BOOLEAN |  |  | TRUE |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### document_sequence

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| prefix | VARCHAR(10) | PK |  |  |  |
| seq_year | INT | PK |  |  |  |
| last_no | INT |  |  |  |  |

### payroll_item_master

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| payroll_item_master_id | BIGINT | PK |  |  | 급여항목 PK |
| item_name | VARCHAR(100) |  |  |  | 항목명 |
| item_type_code | VARCHAR(30) |  |  |  | PAY(지급)/DEDUCT(공제) |
| taxable | BOOLEAN |  |  |  | 과세여부 |
| fixed | BOOLEAN |  |  |  | 고정여부 |
| active | BOOLEAN |  |  | TRUE |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### employee_military

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_military_id | BIGINT | PK |  |  | 병역 PK |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| military_type | VARCHAR(100) |  | Y |  | 군별 |
| military_rank | VARCHAR(100) |  | Y |  | 계급 |
| discharge_type | VARCHAR(100) |  | Y |  | 병역구분(만기/면제 등) |
| enlistment_date | DATE |  | Y |  |  |
| discharge_date | DATE |  | Y |  |  |
| exemption_reason | VARCHAR(200) |  | Y |  | 면제사유 |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### payroll

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| payroll_id | BIGINT | PK |  |  | 급여명세서 PK |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| payroll_year_month | VARCHAR(6) |  |  |  | 급여년월(YYYYMM) |
| payment_date | DATE |  | Y |  | 지급일 |
| total_pay_amount | DECIMAL(15, 2) |  |  |  | 지급총액 |
| total_deduction_amount | DECIMAL(15, 2) |  |  |  | 공제총액 |
| real_pay_amount | DECIMAL(15, 2) |  |  |  | 실지급액 |
| payroll_status_code | VARCHAR(30) |  | Y |  | DRAFT/CONFIRMED/PAID |
| employee_name_snapshot | VARCHAR(100) |  | Y |  | 당시 성명 스냅샷 |
| department_name_snapshot | VARCHAR(100) |  | Y |  | 당시 소속 스냅샷 |
| position_name_snapshot | VARCHAR(100) |  | Y |  | 당시 직급 스냅샷 |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### employee_language

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_language_id | BIGINT | PK |  |  | 어학 PK |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| language_name | VARCHAR(100) |  |  |  | 언어 |
| reading_level | VARCHAR(50) |  | Y |  |  |
| writing_level | VARCHAR(50) |  | Y |  |  |
| speaking_level | VARCHAR(50) |  | Y |  |  |
| test_name | VARCHAR(100) |  | Y |  | 시험명 |
| test_score | VARCHAR(100) |  | Y |  | 점수 |
| issued_date | DATE |  | Y |  |  |
| issuer | VARCHAR(100) |  | Y |  |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| created_by | BIGINT |  | Y |  |  |
| updated_by | BIGINT |  | Y |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### payroll_detail

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| payroll_detail_id | BIGINT | PK |  |  | 급여상세 PK |
| payroll_id | BIGINT | FK |  |  | → `payroll.payroll_id` |
| payroll_item_master_id | BIGINT | FK |  |  | → `payroll_item_master.payroll_item_master_id` |
| item_name_snapshot | VARCHAR(100) |  |  |  | 항목명 스냅샷 |
| item_type_code | VARCHAR(30) |  |  |  | PAY/DEDUCT |
| amount | DECIMAL(15, 2) |  |  |  |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |
| version | BIGINT |  |  | 0 |  |
| deleted | BOOLEAN |  |  | FALSE |  |

### employee_oauth

| 컬럼명 | 타입 | 키 | Null | 기본값 | 설명 |
|---|---|:-:|:-:|---|---|
| employee_oauth_id | BIGINT | PK |  |  | 소셜계정 PK |
| employee_id | BIGINT | FK |  |  | → `employee.employee_id` |
| provider | VARCHAR(20) |  |  |  | KAKAO/GOOGLE/NAVER |
| provider_user_id | VARCHAR(100) |  |  |  | 소셜 고유 ID |
| provider_email | VARCHAR(255) |  | Y |  |  |
| created_at | DATETIME |  |  |  |  |
| updated_at | DATETIME |  |  |  |  |

---

> Null 열: `Y` = NULL 허용, 공백 = NOT NULL
