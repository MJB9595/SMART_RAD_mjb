# SMART_RAD 실서버 배포 가이드 (시놀로지 NAS & VPS)

본 문서는 SMART_RAD(HRIS) 프로젝트를 실제 운영 서버(개인 시놀로지 NAS 및 임대용 리눅스 VPS)에 배포하기 위한 환경 설정 및 명령어 가이드를 제공합니다.

## 1. 개인 서버 (시놀로지 NAS) 배포 가이드

시놀로지 NAS는 성능이 비교적 여유가 있고, 자체적으로 리버스 프록시(역방향 프록시)를 지원하는 환경입니다. 코드를 직접 Pull 받아 서버 내에서 Docker 이미지를 빌드합니다.

### 1.1 환경 변수 설정
`HRIS-kbu` 폴더 최상단에 `.env.prod` 파일을 생성하고 아래와 같이 설정합니다.
```env
DOMAIN=tsms.mjb.diskstation.me
KAKAO_CLIENT_ID=your_kakao_client_id
# 기타 필요한 DB 및 보안 설정
```

### 1.2 프록시(Proxy) 설정
시놀로지의 자체 '역방향 프록시' 기능을 활용하여 `https://tsms.mjb.diskstation.me`로 들어오는 트래픽을 도커 컨테이너의 프론트엔드 포트(예: 3049)로 전달하도록 설정해야 합니다.

프론트엔드에서 백엔드 API를 원활히 호출하기 위해 `frontend/next.config.ts` 파일에 API 경로를 우회(`rewrites`)하는 설정이 포함되어 있습니다.
```typescript
// next.config.ts 예시
rewrites: async () => [
  { source: '/api/:path*', destination: 'http://backend:8080/api/:path*' }
]
```

### 1.3 빌드 및 실행 명령어
도커 포트 충돌 방지를 위해 `docker-compose.prod.yml`에서는 `3049`(프론트), `8049`(백엔드), `3349`(DB) 포트를 사용합니다.

```bash
# 1. 프로젝트 폴더 이동
cd /volume3/docker/SMART_RAD

# 2. 최신 코드 깃 동기화
git pull origin main

# 3. 도커 이미지 빌드 및 백그라운드 실행 (기존 DB 데이터는 볼륨에 보존됨)
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 2. 외부 대여 서버 (1GB RAM VPS) 배포 가이드

임대용 VPS는 RAM 용량이 1GB로 매우 협소하기 때문에 **서버 내에서 직접 이미지를 빌드(Build)하면 메모리 부족(OOM)으로 서버가 다운**됩니다.
따라서 **개발용 로컬 PC(Mac)에서 이미지를 굽고 압축하여 전송**하는 방식을 사용합니다. HTTPS 처리를 위해 Caddy 컨테이너를 함께 사용합니다.

### 2.1 스왑(Swap) 메모리 확보
VPS 최초 세팅 시 메모리 부족 방지를 위해 Swap 메모리를 2GB 추가합니다.
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
# 영구 적용을 위해 /etc/fstab 에 /swapfile swap swap defaults 0 0 추가
```

### 2.2 로컬 Mac에서 빌드 및 압축 (Mac 터미널)
Mac에서 최신 코드를 빌드한 후 `linux/amd64` 아키텍처 호환성으로 도커 이미지를 구워냅니다.
```bash
# 1. 백엔드 빌드
cd backend && ./gradlew bootJar && cd ..
docker buildx build --platform linux/amd64 -t tp-hr-backend:vps ./backend

# 2. 프론트엔드 빌드 (실서버 도메인 환경 변수 주입)
docker buildx build --platform linux/amd64 -t tp-hr-frontend:vps \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://tsms.o-r.kr/api \
  --build-arg NEXT_PUBLIC_KAKAO_REDIRECT_URI=https://tsms.o-r.kr/oauth/kakao/callback \
  ./frontend

# 3. 이미지 압축 (약 3~5분 소요)
docker save tp-hr-backend:vps tp-hr-frontend:vps | gzip > hris-images-vps-update.tar.gz

# 4. 압축된 이미지 파일을 VPS로 전송
scp hris-images-vps-update.tar.gz root@49.247.139.51:~/hris/
```

### 2.3 환경 파일 세팅 (초기 1회)
서버의 `~/hris` 폴더에 `.env.prod2` 파일을 구성하고, Caddy 설정 파일(`Caddyfile`)을 위치시킵니다.
`docker-compose.vps.yml`은 Caddy, 프론트, 백엔드, DB 4개의 컨테이너로 구성되어 있으며 메모리 사용량 제한(`mem_limit`)이 엄격하게 걸려있습니다.

### 2.4 서버 내 업데이트 및 실행 (VPS 터미널)
전송받은 이미지를 도커 시스템에 장착하고 실행합니다.
```bash
cd ~/hris

# 1. 압축 파일로부터 도커 이미지 로드 (시간 소요)
docker load < hris-images-vps-update.tar.gz

# 2. 서버 실행 (변경된 이미지를 자동 감지하여 교체 후 재시작)
docker compose -f docker-compose.vps.yml up -d
```
Caddy 컨테이너가 `.env.prod2`에 정의된 `DOMAIN=tsms.o-r.kr` 도메인에 대해 자동으로 Let's Encrypt SSL(HTTPS) 인증서를 발급 및 갱신해 줍니다.
