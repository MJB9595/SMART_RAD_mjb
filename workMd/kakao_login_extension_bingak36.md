---
작성자: 송현빈 (bingak36)
날짜: 2026-07-23
---
# [작업 이력] 카카오 로그인 연동 기반 구현

> 담당: 송현빈 (bingak36)
> 작업일: 2026-07-23
> 적용 브랜치: main
> 적용 커밋: c6c6f7937ef5659428b1ad5fb8631171fb47618c (feat: 카카오 로그인 연동 기반 구현)
> 현재 상태: 개발 완료

---

## 1. 작업 목적
기존 이메일/비밀번호 기반 로그인 외에 카카오 OAuth 기반의 소셜 로그인 기능을 추가하여 사용자 편의성을 높임. 향후 타 소셜 로그인(구글, 네이버 등) 확장을 고려한 `EmployeeOAuth` 엔티티 및 기반 구조 마련.

## 2. 세부 내역 (API 명세, UI 변경점 등)
**백엔드 API**
- `POST /auth/kakao/callback`
  - **Request**: `{ "code": "카카오에서_받은_인가_코드" }` (`KakaoLoginRequest`)
  - **Response**: JWT 토큰 및 사용자 정보 반환 (`KakaoTokenResponse`, `KakaoUserResponse`)

**프론트엔드 UI 변경점**
- 카카오 로그인 콜백 처리를 위한 신규 페이지 `/oauth/kakao/callback/page.tsx` 추가
- 로그인 페이지(`login/page.tsx`) 카카오 로그인 버튼 연동
- `.env.local` 및 `application.properties`에 카카오 OAuth 관련 환경 변수(`NEXT_PUBLIC_KAKAO_CLIENT_ID`, `NEXT_PUBLIC_KAKAO_REDIRECT_URI`, `kakao.client-id` 등) 추가

## 3. 처리 기준 / 비즈니스 로직
- **Authorization Code 흐름**:
  1. 프론트엔드에서 카카오 인가 URL로 리다이렉트 (인가 코드 발급)
  2. 프론트엔드 콜백 페이지(`/oauth/kakao/callback`)에서 받은 `code`를 백엔드 API(`/auth/kakao/callback`)로 전송
  3. 백엔드 `KakaoOAuthClient`에서 카카오 API를 호출하여 인가 코드로 액세스 토큰 교환 (`/oauth/token`)
  4. 획득한 액세스 토큰으로 카카오 사용자 정보 조회 (`/v2/user/me`)
  5. DB(`employee_oauth`)에서 `provider`(KAKAO) 및 `providerUserId`로 기존 연동 계정 조회
     - **연동 계정 존재 시**: 기존 `JwtTokenProvider`를 통해 토큰 발급 및 로그인 처리
     - **연동 계정 미존재 시**: 최초 카카오 로그인 사용자를 위한 정책 처리 (회원가입 승인 대기 또는 기존 계정 연동)

## 4. 공통 기능 및 보안 (선택 사항)
- **보안 설정**: `SecurityConfig`의 `permitAll` 패턴에 `/auth/kakao/**` 추가하여 카카오 로그인 콜백 API 인증 제외 처리
- **HTTP 클라이언트**: 카카오 API 연동을 위해 Spring `RestClient` 기반 `KakaoOAuthClient` 신규 추가 및 `RestClientConfig` 설정 추가
- **OAuth 공통 엔티티**: `EmployeeOAuth` 엔티티와 `OAuthProvider` Enum(KAKAO, GOOGLE, NAVER) 추가

## 5. 주요 변경 파일
| 구분 | 파일 | 역할 |
| --- | --- | --- |
| 신규 | `backend/.../oauth/EmployeeOAuth.java`<br>`EmployeeOAuthRepository.java`<br>`OAuthProvider.java` | OAuth 연동 정보 저장 엔티티 및 Repository, Provider Enum |
| 신규 | `backend/.../auth/KakaoAuthController.java`<br>`KakaoAuthService.java` | 카카오 로그인 API 엔드포인트 및 비즈니스 로직 |
| 신규 | `backend/.../auth/client/KakaoOAuthClient.java` | 카카오 외부 API 호출용 RestClient 모듈 |
| 수정 | `backend/.../security/SecurityConfig.java` | 카카오 인증 API 경로 인가 제외(`permitAll`) 추가 |
| 수정 | `backend/.../resources/application.properties` | 카카오 API 키, Secret, redirect-uri 등 속성 추가 |
| 신규 | `frontend/src/app/oauth/kakao/callback/page.tsx` | 프론트엔드 카카오 콜백 수신 및 백엔드 API 연동 페이지 |
| 수정 | `frontend/src/app/login/page.tsx` | 카카오 로그인 시작 로직 연동 |
| 수정 | `frontend/src/lib/auth/AuthContext.tsx` | 로그인 성공 후 토큰 및 유저 상태 업데이트 로직 보완 |
| 신규 | `frontend/src/lib/auth/kakao.ts` | 카카오 로그인 관련 유틸리티 및 타입 |
| 신규 | `docs/kakao-login.md` | 카카오 로그인 구현 관련 문서 |

## 6. 테스트 및 검증
- **백엔드 유닛 테스트**: `KakaoAuthServiceTest.java` (122 lines) 작성하여 Mocking을 통한 카카오 API 교환 및 사용자 매칭 로직 검증

## 7. 기타/후속 연동 지점
- 프론트엔드 실행 환경에 맞게 `.env.local`의 `NEXT_PUBLIC_KAKAO_CLIENT_ID` 및 `NEXT_PUBLIC_KAKAO_REDIRECT_URI` 값이 설정되어야 정상 작동함
- 백엔드 실행 시 `application.properties` 또는 환경변수로 `kakao.client-id` 등의 값이 주입되어야 함
- 현재 KAKAO 이외에 GOOGLE, NAVER를 위한 `OAuthProvider` 스펙이 준비되어 있으므로, 향후 동일한 구조(`OAuthClient`, `Controller`, `Service`)로 타 소셜 로그인을 쉽게 추가 확장 가능함
