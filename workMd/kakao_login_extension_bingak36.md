# [확장 가이드] 카카오 로그인 — 담당: 송현빈 (bingak36)

> 상태: **미구현(의도적)**. 차후 송현빈 팀장이 추가 예정.
> 이 문서는 "지금 만들지 말고, 나중에 어디에 어떻게 붙이면 되는지"만 정리한 확장 포인트 가이드입니다.
> 작성: 김재아 (MJB9595) · 2026-07-22

---

## 1. 이미 준비되어 있는 것 (재사용 지점)
| 위치 | 내용 |
| --- | --- |
| **DB** `employee_oauth` 테이블 | `provider`(KAKAO/GOOGLE/NAVER), `provider_user_id`(소셜 고유 ID), `provider_email`, `employee_id`(FK) — **이미 V1 스키마에 존재**. 별도 마이그레이션 불필요 |
| **프론트** `login/page.tsx` `handleKakaoLogin()` | 카카오 인가 URL(`https://kauth.kakao.com/oauth/authorize`)로 리다이렉트하는 로직 이미 있음. env `NEXT_PUBLIC_KAKAO_CLIENT_ID`, `NEXT_PUBLIC_KAKAO_REDIRECT_URI` 사용 |
| **백엔드** `JwtTokenProvider.createToken(employeeId, email, role)` | 로그인 성공 시 JWT 발급 — 카카오 로그인에서도 **그대로 재사용** |
| **백엔드** `SecurityConfig` | `permitAll` 패턴 존재(`/auth/login`, `/auth/signup`). 여기에 `/auth/kakao/**` 추가만 하면 됨 |
| **백엔드** `LoginResponse` / `UserResponse` | 로그인 응답 DTO 재사용 가능 |

## 2. 추가해야 할 확장 포인트

### 백엔드
1. **엔티티/레포**: `EmployeeOauth` 엔티티(테이블 `employee_oauth` 매핑) + `EmployeeOauthRepository`
   - `Optional<EmployeeOauth> findByProviderAndProviderUserId(String provider, String providerUserId)`
   - ※ 이 테이블은 `created_at/updated_at`만 있고 감사/버전/삭제 컬럼이 없으므로 `AuditedEntity`를 상속하지 말고 별도 `@MappedSuperclass` 없이 직접 매핑하거나 최소 필드만 둘 것.
2. **설정**(`application.properties`): `kakao.client-id`, `kakao.client-secret`(선택), `kakao.redirect-uri`, 토큰/유저정보 엔드포인트
   - 토큰: `https://kauth.kakao.com/oauth/token`
   - 사용자정보: `https://kapi.kakao.com/v2/user/me`
3. **컨트롤러** `POST /auth/kakao/callback` (body: `{ code }`)
   - 흐름: 인가 code → 카카오 토큰 교환 → 사용자 정보 조회(kakao id, email) → `employee_oauth` 조회
     - **연결된 employee 있음** → `JwtTokenProvider.createToken(...)`로 JWT 발급 → `LoginResponse` 반환 (일반 로그인과 동일)
     - **없음** → 아래 §4 정책에 따라 처리
   - HTTP 호출은 Spring `RestClient`(권장) 또는 `WebClient` 사용
4. **보안**: `SecurityConfig`에 `.requestMatchers("/auth/kakao/**").permitAll()` 추가

### 프론트
1. **콜백 처리**: 리다이렉트 URI에 대응하는 페이지 `/oauth/kakao/callback`
   - URL 쿼리의 `code`를 백엔드 `POST /auth/kakao/callback`로 전달 → 받은 `accessToken`으로 `setToken()` + `setUser()`(AuthContext) → `/employees` 이동
   - 실패 시 `/login`으로 되돌리고 에러 표시
2. **env**: `.env.local`에 `NEXT_PUBLIC_KAKAO_CLIENT_ID`(REST API 키), `NEXT_PUBLIC_KAKAO_REDIRECT_URI`(예: `http://localhost:3000/oauth/kakao/callback`)
3. `handleKakaoLogin()`은 이미 있으므로 env만 채우면 인가 요청까지는 동작. **콜백 페이지만 신규**.

### 카카오 개발자 콘솔
- 애플리케이션 등록 → REST API 키 발급
- 카카오 로그인 활성화, **Redirect URI 등록**(위 프론트 콜백 URL과 일치)
- 동의항목: 이메일(계정 매칭에 사용 시)

## 3. 권장 흐름 (Authorization Code)
```
[프론트] handleKakaoLogin() → 카카오 로그인/동의
   → redirect_uri?code=XXXX
[프론트] /oauth/kakao/callback → POST /auth/kakao/callback { code }
[백엔드] code로 카카오 토큰 교환 → 사용자정보 조회
   → employee_oauth 매칭
      ├ 있음: JWT 발급 → LoginResponse
      └ 없음: §4 정책 처리
[프론트] accessToken 저장(setToken) + setUser → /employees
```

## 4. 먼저 정해야 할 정책 (송현빈 확인)
- **최초 카카오 로그인 시 미가입 사용자 처리**:
  - (a) 자동 계정 생성(승인 불필요) —
  - (b) `signup_request`로 **승인 대기** 생성 후, 관리자 승인 시 `employee` + `employee_oauth` 연결 (현재 회원가입 승인 플로우와 일관) ← **권장**
  - (c) "관리자에게 문의" 안내만
- **기존 이메일 계정과 자동 링크 여부**: 카카오 이메일 == 기존 employee.email이면 자동으로 `employee_oauth`에 링크할지
- 위 (b)를 택하면 이미 만든 `signup` 도메인을 거의 그대로 재사용 가능(비밀번호 없이 소셜 식별자만 저장하는 필드 추가 정도).

## 5. 연결 지점 요약 (파일)
| 신규/수정 | 파일 |
| --- | --- |
| 신규 | `backend/.../oauth/EmployeeOauth.java`, `EmployeeOauthRepository.java` |
| 신규 | `backend/.../auth/KakaoAuthController.java`, `KakaoAuthService.java`, `KakaoClient`(RestClient) |
| 수정 | `backend/.../security/SecurityConfig.java` (`/auth/kakao/**` permitAll) |
| 수정 | `backend/.../resources/application.properties` (kakao.* 설정) |
| 신규 | `frontend/src/app/oauth/kakao/callback/page.tsx` |
| 수정 | `frontend/.env.local` (NEXT_PUBLIC_KAKAO_*) |
| 재사용 | `JwtTokenProvider`, `LoginResponse`/`UserResponse`, `AuthContext.setToken/setUser`, `employee_oauth` 테이블 |
