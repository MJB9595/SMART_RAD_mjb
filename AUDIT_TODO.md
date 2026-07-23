# 점검 작업목록 (백엔드 보안·정합성 / 프론트-백엔드 연결 / UI·UX)

> 점검일: 2026-07-23 · 점검: 김재아(MJB9595) · 기준: 당시 최신 코드
> 아래는 **아직 미수정 항목**의 작업 목록입니다. 착수 시 이 파일에서 체크(✅)하며 진행하세요.

---

> ✅ 2026-07-23 처리: #1·#2·#3·#5·#8 완료 (빌드/부팅/인가 E2E 검증됨). 남은 항목: #4·#6·#7·#9~11.

## 🔴 심각 — 보안 / 개인정보 (우선 처리)

- [x] **1. 조회(GET) API 인가 누락 (IDOR)** — ✅ 완료. 민감 조회에 `@PreAuthorize("hasRole('ADMIN')")` 부여(Employee/Record/Payroll/Attendance/Appointment 클래스레벨, Leave의 목록·잔여 메서드). 비-ADMIN 토큰 → 전부 403, 참조/본인(`/auth/me`,`/departments`) → 200 확인.
  - (남은 완화 옵션) 직원 셀프 조회 화면이 생기면 본인 소유만 허용으로 완화 가능.

- [x] **2. JWT 시크릿 기본값이 배포에 그대로** — ✅ 완료. `docker-compose.yml` backend에 `JWT_SECRET`/`CORS_ALLOWED_ORIGINS` 환경변수 주입(오버라이드 가능). ⚠️ **운영 배포 시 반드시 강한 랜덤값을 host env/.env로 주입할 것.**

## 🟠 기능 연결 버그

- [x] **3. `/api` 경로 이중 접두어** — ✅ 완료. `WelfareController→/welfare`, `AllowanceController→/allowances`·`/employee-allowances`, `DashboardController→/dashboard`, `LeavePolicyController→/leave-policies`, `LeaveTypeController→/leave-types` 로 접두어 제거 + `@PreAuthorize(ADMIN)` 부여. ADMIN GET 200 확인.

- [x] **4. 프론트 화면 5개 mock (백엔드 미연결)** — ✅ 완료. 5개 전부 실 API 연동(mock 제거, 로딩/빈상태 처리).
  - `payroll/allowance`→GET /allowances, `leaves/policy`→GET /leave-policies(+positions 조인), `welfare/event-support`→GET /welfare/event-support, `welfare/certificate`→GET /welfare/certificate(응답에 purpose 추가), `attendance/monthly`→**신규 GET /attendances/monthly?year&month**(직원별 출근/지각/결근/연차 집계) 추가 후 연동.

## 🟡 개선 / 스멜

- [x] **5. `ddl-auto=update` + Flyway 동시 사용** — ✅ `application.properties` → `validate` 전환. 모든 엔티티 테이블이 Flyway에 존재함을 대조 확인, 전환 후 정상 부팅 검증.
- [x] **6. 직원 본인 비밀번호 변경 불가** — ✅ 완료(백+프론트). 백엔드 `PATCH /employees/me/password`(현재 비번 검증 + 본인만, `@PreAuthorize("isAuthenticated()")`). 프론트: 헤더 "비밀번호 변경" 버튼 → 모달(현재/새/확인 + 눈 토글). E2E: 틀린 현재비번 400/에러표시, 정상 변경 후 새 비번 로그인 확인.
- [x] **7. 수정 API 낙관적 락 미활용** — ✅ 완료(교직원 수정). 요청에 `version` 받아 `AuditedEntity.checkOptimisticVersion()`로 대조 → 낡은 version 시 409. version 미전달 시 하위호환(검증 생략). 프론트 편집도 version 전송. **동일 패턴을 records/발령 수정에도 확장 가능.**
- [x] **8. welfare/allowance/dashboard 컨트롤러 인가 없음** — ✅ 3번과 함께 `@PreAuthorize(ADMIN)` 부여. 비-ADMIN 403 확인.

> [x] ✅ **404→500 처리** — `GlobalExceptionHandler`에 `NoHandlerFound`/`NoResourceFound`→404, `MethodNotSupported`→405 핸들러 추가. 없는 경로 404 확인.
> [x] ✅ **승인 API approverId 스푸핑** — welfare(경조비/증명서) 승인의 `@RequestParam approverId` → `SecurityUtils.getCurrentEmployeeId()`로 교체 + create에 `@Valid` 추가(welfare/allowance).

## UI / UX

- [ ] **9. 전역 텍스트 줄넘김** — 좁은 컬럼 + CJK 줄바꿈. **성준님 담당**(문서화됨: `workMd/text_wrap_bug_request_kim-sungjun592.md`).
- [x] **10. mock 화면 오해 소지** — ✅ 해소. 4번 연동으로 실데이터 표시(빈 상태는 "기록 없음"). 가짜 데이터 제거됨.
- [x] **11. "+ 교직원 등록" 라벨** — ✅ 완료. 목록 버튼을 "+ 승인 자리 등록"으로 변경 + 툴팁(자리=직위·권한 정의). 자리 생성 페이지는 이미 "교직원 등록 — 승인 자리 생성"으로 명확.
