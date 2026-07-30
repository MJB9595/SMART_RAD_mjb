---
작성자: 부현민 (hyunminboo)
날짜: 2026-07-30
---
# [작업 이력] 랜딩 페이지 전체폭 레이아웃 전환 및 브랜드 로고 적용

> 담당: 부현민 (hyunminboo)
> 작업일: 2026-07-30
> 적용 브랜치: frontend → main (체리픽 반영)
> 적용 커밋: 3a54f1e (Update landing page layout to support full width and adjust HeroSection) → main 반영분 `b07e8b7`
> 현재 상태: 작업 완료 / main 반영 완료

---

## 1. 작업 목적
- 랜딩 페이지 각 섹션이 `max-w-[1400px]` ~ `max-w-[1600px]` 로 묶여 있어 와이드 모니터에서 좌우 여백이 과도하게 남는 문제를 해소함.
- Hero 영역의 세로 높이와 우측 UI 목업 크기가 화면을 충분히 채우지 못해 첫 인상이 약했던 점을 보완함.
- 목업과 헤더에 남아 있던 이전 서비스명(`SMART RAD`)과 빈 placeholder 도형을 실제 브랜드(TSM) 자산으로 교체함.

## 2. 세부 내역 (UI 변경점)

### 2-1. 전체폭 레이아웃 전환
컨테이너의 최대 폭 제한을 제거하고 좌우 패딩만으로 여백을 잡도록 변경.

| 컴포넌트 | 변경 전 | 변경 후 |
| --- | --- | --- |
| `HeroSection` | `max-w-[1600px] px-8 md:px-16 lg:px-24` | `w-full px-8 md:px-16 lg:px-24` |
| `FeatureDetailSection` | `max-w-[1400px] px-8 md:px-16 z-10` | `w-full px-8 md:px-16 lg:px-24 z-10` |
| `FeaturesGridSection` | `max-w-[1400px] px-8 md:px-16` | `w-full px-8 md:px-16 lg:px-24` |
| `SecuritySection` | `max-w-[1600px] px-8 md:px-16 lg:px-24` | `w-full px-8 md:px-16 lg:px-24` |
| `LandingFooter` | `max-w-[1600px]` | `w-full` |

### 2-2. Hero 영역 크기 조정
- 섹션 높이: `min-h-[90vh]` → `min-h-screen` (첫 화면을 꽉 채움)
- 우측 브라우저 목업 높이: `h-[600px]` → `h-[720px]`

### 2-3. 브랜드 자산 적용
- **목업 사이드바 로고**: 단색 사각형 + `SMART RAD` 텍스트 → 4분할 SVG 아이콘(`#1F3A8F` 배경) + `TSM`
- **랜딩 헤더**: `<div className="h-10 w-10 rounded-xl bg-slate-900" />` placeholder → 실제 로고 이미지
- **로그인 화면 헤더**: `S` 이니셜 배지 → 동일 로고 이미지로 통일

```tsx
<img src="/images/logo.png" alt="TSM Logo" className="h-10 w-10 object-contain flex-shrink-0" />
```

## 3. 주요 변경 파일

| 구분 | 파일 | 역할 |
| --- | --- | --- |
| 자산 | `frontend/public/images/logo.png` | TSM 브랜드 로고 (신규, 237KB) |
| 프론트 | `components/landing/HeroSection.tsx` | 전체폭 + 높이 조정 + 목업 로고 교체 |
| 프론트 | `components/landing/LandingHeader.tsx` | placeholder → 실제 로고 |
| 프론트 | `components/landing/FeatureDetailSection.tsx` | 전체폭 전환 |
| 프론트 | `components/landing/FeaturesGridSection.tsx` | 전체폭 전환 |
| 프론트 | `components/landing/SecuritySection.tsx` | 전체폭 전환 |
| 프론트 | `components/landing/LandingFooter.tsx` | 전체폭 전환 |
| 프론트 | `app/page.tsx` | 랜딩 루트 정리 |
| 프론트 | `app/login/page.tsx` | 헤더 로고 통일 |

## 4. 테스트 및 검증
- 로컬 Docker 재빌드 후 랜딩 페이지 렌더링 확인 — 전체폭 레이아웃 및 헤더 로고 정상 적용.
- `login/page.tsx` 가 김재아 작업(데모 계정 `permissions` 필드 추가)과 같은 파일을 건드렸으나, 변경 범위가 로고 교체 한 곳뿐이라 **체리픽 시 충돌 없이 병합됨**.

## 5. 기타/후속 연동 지점
- 본 작업은 `frontend` 브랜치에서 진행되었고, 이후 `main` 으로 체리픽되어 전 브랜치에 반영되었다(원저자 정보 보존).
- 같은 날 진행한 `4b555dd (Remove icons from RBAC roles page headers)` 는 대상 파일인 `system/roles/page.tsx` 가 전면 재작성되어 체리픽이 불가했다. **동일한 의도로 재작업되어 `ac9e8ac` 로 반영**되었으며, 시스템 관리 3개 화면(권한 관리·공통 코드 관리·감사로그 조회)의 제목 아이콘과 역할 상세 헤더 아이콘이 제거되었다. 역할 목록 카드의 아이콘은 원 커밋 의도대로 유지.
- 로고 이미지가 237KB로 다소 크다. 이후 WebP 변환 또는 `next/image` 적용으로 최적화 여지가 있다.
