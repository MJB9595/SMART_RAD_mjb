# 배포 가이드 — 49.247.139.51 (Docker 이미지 방식 · macOS 기준)

> **방식**: 맥에서 이미지를 빌드 → 파일로 저장 → SSH로 서버에 전송 → 서버에서 이미지 로드 후 실행
> (서버에서 소스 빌드 X, 레지스트리 계정 불필요)
>
> **배포 후 주소**: 프론트 `http://49.247.139.51:3000` · API `http://49.247.139.51:8080/api`

---

## ⚠️ 시작 전 반드시 알아야 할 2가지 (여기서 실패가 제일 많음)

**1. 맥은 arm64, 서버는 대부분 amd64(x86_64)**
그냥 빌드하면 서버에서 `exec format error`로 실행이 안 됩니다.
→ 반드시 **`--platform linux/amd64`** 로 빌드합니다. (아래 2단계에 포함)

**2. 프론트엔드는 API 주소가 "빌드 시점"에 코드에 박힙니다**
`localhost`로 빌드한 이미지를 서버에 올리면, 화면은 뜨는데 **모든 기능이 동작하지 않습니다**
(브라우저가 자기 PC의 localhost:8080을 찾아서 실패).
→ 반드시 **`NEXT_PUBLIC_API_BASE_URL=http://49.247.139.51:8080/api`** 로 빌드합니다.

---

## 0단계. 사전 준비 (최초 1회)

### 0-1. 서버 접속 확인 (맥 터미널)
```bash
ssh <서버계정>@49.247.139.51
```
> `<서버계정>`은 실제 계정명(예: `root`, `ubuntu`)으로 바꾸세요.
> 비밀번호를 매번 안 치려면: `ssh-copy-id <서버계정>@49.247.139.51`

### 0-2. 서버에 Docker 설치되어 있는지 확인 (서버 안에서)
```bash
docker --version && docker compose version
```
안 깔려 있으면 (Ubuntu 기준, 서버 안에서):
```bash
curl -fsSL https://get.docker.com | sudo sh && sudo usermod -aG docker $USER
```
> 실행 후 **로그아웃했다 다시 SSH 접속**해야 `sudo` 없이 docker가 됩니다.

### 0-3. 서버에 배포 폴더 만들기 (서버 안에서)
```bash
mkdir -p ~/hris && cd ~/hris && pwd
```

### 0-4. 방화벽 / 보안그룹에서 포트 열기
클라우드 콘솔(보안그룹)에서 **3000, 8080** 인바운드 허용.
서버에 ufw를 쓴다면 (서버 안에서):
```bash
sudo ufw allow 3000/tcp && sudo ufw allow 8080/tcp
```

---

## 1단계. (맥) 배포할 소스 최신화

```bash
cd "/Users/mjb/빌드 및 컴파일/HRIS-kbu"
git pull
```

---

## 2단계. (맥) 서버용 이미지 빌드 — amd64 + 서버 주소

> ⚠️ 이 명령이 이번 배포의 핵심입니다. 한 줄씩 그대로 실행하세요.

**백엔드 이미지 빌드**
```bash
docker build --platform linux/amd64 -t hris-kbu-backend:latest ./backend
```

**프론트엔드 이미지 빌드 (API 주소를 서버 IP로!)**
```bash
docker build --platform linux/amd64 --build-arg NEXT_PUBLIC_API_BASE_URL=http://49.247.139.51:8080/api -t hris-kbu-frontend:latest ./frontend
```

> 카카오 로그인은 **프론트 빌드 인자로 넣지 않습니다.** 프론트가 실행 중에
> `GET /api/auth/kakao/config` 로 서버에서 받아 쓰므로, 서버의 `.env` 에
> `KAKAO_REST_API_KEY` 와 `KAKAO_REDIRECT_URI` 만 넣으면 됩니다.
> (카카오 개발자 콘솔에도 이 Redirect URI를 등록해야 합니다.)

**빌드 결과 확인 (amd64로 나왔는지)**
```bash
docker image inspect hris-kbu-backend:latest hris-kbu-frontend:latest --format '{{.RepoTags}} {{.Os}}/{{.Architecture}}'
```
→ `linux/amd64` 로 나와야 정상입니다.

---

## 3단계. (맥) 이미지를 파일로 저장

```bash
cd "/Users/mjb/빌드 및 컴파일/HRIS-kbu"
docker save hris-kbu-backend:latest hris-kbu-frontend:latest | gzip > hris-images.tar.gz
ls -lh hris-images.tar.gz
```
> 보통 수백 MB입니다. 시간이 좀 걸립니다.

---

## 4단계. (맥) 서버로 전송

```bash
scp hris-images.tar.gz docker-compose.prod.yml <서버계정>@49.247.139.51:~/hris/
```

---

## 5단계. (서버) 환경변수 파일 만들기 — 최초 1회

서버에 접속:
```bash
ssh <서버계정>@49.247.139.51
cd ~/hris
```

**비밀값 생성 (JWT용 랜덤 문자열)**
```bash
openssl rand -base64 48
```
→ 출력된 문자열을 복사해 두세요.

**.env 파일 작성**
```bash
nano .env
```
아래 내용을 붙여넣고, `여기에_...` 부분을 실제 값으로 바꿉니다:
```
MYSQL_ROOT_PASSWORD=여기에_강한_루트비밀번호
MYSQL_PASSWORD=여기에_강한_DB비밀번호
JWT_SECRET=여기에_위에서_생성한_랜덤문자열
CORS_ALLOWED_ORIGINS=http://49.247.139.51:3000
TAG=latest
```
저장: `Ctrl+O` → `Enter` → `Ctrl+X`

> 카카오를 쓰면 아래도 추가:
> ```
> KAKAO_REST_API_KEY=카카오_REST_키
> KAKAO_CLIENT_SECRET=카카오_시크릿
> KAKAO_REDIRECT_URI=http://49.247.139.51:3000/oauth/kakao/callback
> ```

**.env는 비밀값이므로 권한 제한**
```bash
chmod 600 .env
```

---

## 6단계. (서버) 이미지 로드 후 실행

```bash
cd ~/hris
docker load < hris-images.tar.gz
docker compose -f docker-compose.prod.yml up -d
```

**상태 확인**
```bash
docker compose -f docker-compose.prod.yml ps
```
→ mysql(healthy), backend(Up), frontend(Up) 3개가 떠야 정상.

**백엔드 기동 로그 확인 (마이그레이션/부팅)**
```bash
docker compose -f docker-compose.prod.yml logs -f backend
```
→ `Successfully applied N migrations` 와 `Started HrApplication in ...` 이 보이면 성공.
→ `Ctrl+C` 로 로그 보기 종료 (컨테이너는 계속 실행됨).

---

## 7단계. 동작 확인

**서버 안에서 (API 살아있는지)**
```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@tphr.com","password":"admin1234"}'
```
→ `200` 이면 정상.

**맥 브라우저에서**
- 프론트: http://49.247.139.51:3000
- 로그인: `admin@tphr.com` / `admin1234`

> 🔐 **배포 직후 반드시**: 로그인 후 우측 상단 **비밀번호 변경**으로 admin 초기 비밀번호를 변경하세요.

---

## 8단계. 재배포 (코드 수정 후 다시 올릴 때)

맥에서:
```bash
cd "/Users/mjb/빌드 및 컴파일/HRIS-kbu" && git pull
docker build --platform linux/amd64 -t hris-kbu-backend:latest ./backend
docker build --platform linux/amd64 --build-arg NEXT_PUBLIC_API_BASE_URL=http://49.247.139.51:8080/api -t hris-kbu-frontend:latest ./frontend
docker save hris-kbu-backend:latest hris-kbu-frontend:latest | gzip > hris-images.tar.gz
scp hris-images.tar.gz <서버계정>@49.247.139.51:~/hris/
```
서버에서:
```bash
cd ~/hris
docker load < hris-images.tar.gz
docker compose -f docker-compose.prod.yml up -d
docker image prune -f      # 안 쓰는 옛 이미지 정리
```
> DB 데이터는 볼륨에 남으므로 재배포해도 유지됩니다.
> 새 마이그레이션은 백엔드가 뜰 때 자동 적용됩니다.

---

## 문제 해결 (자주 겪는 것)

| 증상 | 원인 | 해결 |
|---|---|---|
| 화면은 뜨는데 **로그인/조회가 전부 안 됨** | 프론트를 `localhost`로 빌드함 | 2단계의 `--build-arg NEXT_PUBLIC_API_BASE_URL=http://49.247.139.51:8080/api` 로 **다시 빌드**해서 재배포 |
| `exec format error` | 맥(arm64) 이미지를 amd64 서버에서 실행 | `--platform linux/amd64` 붙여 재빌드 |
| 브라우저 콘솔에 **CORS 에러** | `CORS_ALLOWED_ORIGINS` 불일치 | 서버 `.env`의 값이 정확히 `http://49.247.139.51:3000` 인지 확인 후 `up -d` 재실행 |
| 백엔드가 계속 재시작 | DB 비밀번호 불일치 또는 마이그레이션 실패 | `docker compose -f docker-compose.prod.yml logs backend` 확인. 비밀번호를 바꿨다면 기존 볼륨과 안 맞을 수 있음 |
| 사이트 접속 자체가 안 됨 | 방화벽/보안그룹 | 3000·8080 인바운드 허용 확인 (0-4단계) |

**완전 초기화 (⚠️ DB 데이터 전부 삭제됨 — 운영 데이터 있으면 금지)**
```bash
cd ~/hris && docker compose -f docker-compose.prod.yml down -v && docker compose -f docker-compose.prod.yml up -d
```

---

## 운영 시 남은 과제 (지금은 미적용)

- **HTTPS 미적용** (현재 http). 도메인 붙이면 Nginx + Let's Encrypt 리버스 프록시 권장.
- **8080 포트가 외부 노출**됨. Nginx로 `/api` 프록시하면 8080을 닫을 수 있음.
- MySQL은 외부 포트를 열지 않도록 이미 구성됨(백엔드만 내부 접근).
