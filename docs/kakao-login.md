# 카카오 로그인 설정

SMART_RAD의 카카오 로그인은 카카오에서 사용자를 인증한 뒤, 기존 교직원 계정에 카카오 회원번호를 연결하고 SMART_RAD 자체 JWT를 발급합니다. 카카오 사용자를 새로운 교직원으로 자동 생성하지 않습니다.

## 카카오 개발자 콘솔

1. 카카오 개발자 콘솔에서 애플리케이션을 생성합니다.
2. **카카오 로그인 > 사용 설정**을 활성화합니다.
3. REST API 키와 클라이언트 시크릿을 확인합니다.
4. Redirect URI에 `http://localhost:3000/oauth/kakao/callback`을 등록합니다.
5. 동의항목에서 **카카오계정(이메일)** 제공을 설정합니다.

Redirect URI는 콘솔, 프런트엔드, 백엔드에서 완전히 같은 값이어야 합니다.

## 로컬 실행 환경변수

프런트엔드에서 예제 파일을 복사해 `.env.local`을 만들고 실제 REST API 키를 입력합니다.

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_KAKAO_CLIENT_ID=실제_REST_API_키
NEXT_PUBLIC_KAKAO_REDIRECT_URI=http://localhost:3000/oauth/kakao/callback
```

백엔드를 실행하기 전에 다음 환경변수를 설정합니다.

```dotenv
KAKAO_REST_API_KEY=실제_REST_API_키
KAKAO_CLIENT_SECRET=실제_클라이언트_시크릿
KAKAO_REDIRECT_URI=http://localhost:3000/oauth/kakao/callback
```

`KAKAO_CLIENT_SECRET`은 브라우저에 노출하면 안 됩니다. `NEXT_PUBLIC_` 환경변수에는 REST API 키와 Redirect URI만 넣습니다.

Docker Compose를 사용할 때는 프로젝트 루트의 `.env.example`을 `.env`로 복사한 뒤 실제 값을 입력하고 실행합니다.

```bash
docker compose up --build
```

## 최초 로그인 조건

- 카카오가 이메일을 제공해야 합니다.
- 이메일이 유효하고 인증된 상태여야 합니다.
- 동일 이메일을 가진 삭제되지 않은 `employee`가 이미 존재해야 합니다.
- 퇴직 상태인 교직원은 로그인할 수 없습니다.
- 한 교직원에는 하나의 카카오 계정만 연결됩니다.

최초 연결 후에는 이메일이 아니라 `(KAKAO, provider_user_id)`로 사용자를 찾습니다.

## API 흐름

1. 로그인 화면이 요청별 난수 `state`를 만들고 카카오 인가 페이지로 이동합니다.
2. 카카오가 `/oauth/kakao/callback`으로 인가 코드와 `state`를 보냅니다.
3. 프런트엔드는 저장한 `state`와 응답 `state`를 비교합니다.
4. 프런트엔드가 `POST /api/auth/kakao/callback`에 인가 코드를 보냅니다.
5. 백엔드는 카카오 토큰 및 사용자 정보를 조회하고 교직원을 연결합니다.
6. 백엔드가 기존 로그인과 동일한 SMART_RAD JWT 응답을 반환합니다.

카카오 액세스 토큰은 사용자 정보 확인에만 사용하며 DB 또는 프런트엔드에 저장하지 않습니다.
