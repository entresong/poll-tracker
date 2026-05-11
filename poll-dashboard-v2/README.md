# 폴트래커 — 지방선거 · 정당 지지율 대시보드

**메인 페이지**: 2026 지방선거 17개 시도 광역단체장 (지도 인터랙션)
**서브 페이지**: `/party` 정당 지지율

## 🚀 30분 만에 배포하기

### 1. 로컬에서 확인 (5분)

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

- `/` : 지방선거 지도 (메인)
- `/local/seoul`, `/local/gyeonggi` 등 : 지역 상세
- `/party` : 정당 지지율

### 2. GitHub에 올리기 (10분)

```bash
git init
git add .
git commit -m "init poll dashboard"
# github.com에서 새 리포 만든 뒤
git remote add origin https://github.com/사용자명/poll-dashboard.git
git push -u origin main
```

### 3. Vercel 배포 (5분)

1. https://vercel.com 가입 (GitHub 로그인)
2. **Add New → Project** → GitHub 리포 선택
3. **Deploy** 클릭
4. 끝. `https://poll-dashboard-XXX.vercel.app` 도메인 자동 생성

## 🗺 지도 사용법

- 지도에서 **지역 클릭** → 우측 패널에 해당 지역 모든 후보 지지율 표시
- 색상은 1위 후보의 정당색 (민주당 파랑, 국힘 빨강)
- 회색 = 등록된 조사 없음

## 📊 등록된 데이터 (2026년 4-5월 기준)

| 지역 | 1위 후보 | 출처 |
|---|---|---|
| 서울 | 정원오 50.2% (민주) vs 오세훈 38.0% (국힘) | 조원씨앤아이/스트레이트뉴스 |
| 경기 | 추미애 56% (민주) vs 양향자 27% (국힘) | 한국갤럽/세계일보 |
| 인천 | 박찬대 49% (민주) vs 유정복 33% (국힘) | 한국갤럽/세계일보 |
| 부산 | 전재수 48% (민주) vs 박형준 34.9% (국힘) | 에이스리서치/부산일보 |
| 대구 | 김부겸 50.6% (민주) vs 이진숙 31.7% (무소속) | 여론조사꽃 |
| 대전 | 허태정 54.9% (민주) vs 이장우 23.5% (국힘) | 여론조사꽃 |
| 울산 | 김상욱 47% (민주) vs 김두겸 34.9% (국힘) | 여론조사꽃 |
| 강원 | 우상호 51.2% (민주) vs 김진태 37.3% (국힘) | 에이스리서치/강원일보 |
| 충남 | 박수현 50% (민주) vs 김태흠 30.9% (국힘) | 여론조사꽃 |
| 경남 | 김경수 44% (민주) vs 박완수 40% (국힘) | 한국갤럽/세계일보 |

광주·세종·충북·전북·전남·경북·제주는 후보 확정 진행 중이거나 등록된 공표 조사 없음.

## 📝 데이터 추가하는 법

### 지방선거 후보 지지율 추가

`data/local-elections.json` 열기 → 해당 지역의 `surveys` 배열에 객체 추가:

```json
{
  "id": "고유-id",
  "agency": "한국갤럽",
  "client": "조선일보",
  "startDate": "2026-05-10",
  "endDate": "2026-05-11",
  "sampleSize": 800,
  "marginOfError": 3.5,
  "method": "CATI",
  "candidates": [
    { "name": "후보A", "party": "더불어민주당", "rating": 45 },
    { "name": "후보B", "party": "국민의힘", "rating": 38 }
  ]
}
```

### 정당 지지율 추가

`data/party-surveys.json` → `surveys` 배열에 추가 (구조는 README 내 예시 참고).

저장 → `git push` → Vercel이 자동 재배포 (약 1분)

## 📊 데이터 소스

- **중앙선거여론조사심의위원회**: https://www.nesdc.go.kr (필수)
- 한국갤럽, 리얼미터, 에이스리서치, 조원씨앤아이, 여론조사꽃 등 공표 조사

## 🗂 파일 구조

```
poll-dashboard/
├── app/
│   ├── page.tsx              # / 지방선거 지도 (메인)
│   ├── party/page.tsx        # /party 정당 지지율
│   ├── local/[code]/page.tsx # /local/seoul 등 지역별 상세
│   ├── local/page.tsx        # /local → / 로 리다이렉트
│   ├── KoreaMap.tsx          # 한국 지도 + 우측 상세 패널
│   └── SurveyDetail.tsx      # 조사 개요 모달
├── data/
│   ├── party-surveys.json    # 정당 지지율
│   ├── local-elections.json  # 지방선거 후보
│   └── korea-svg-paths.json  # 17개 시도 SVG (자동생성)
└── scripts/
    └── build-svg-paths.mjs   # GeoJSON → SVG path 변환
```

## ⚠️ 법적 주의

공직선거법 제108조에 따라 조사기관·의뢰처·조사일시·표본수·응답률·표본오차·조사방법을 표시해야 합니다 (모든 조사에 포함됨).

선거 6일 전부터 선거일까지 신규 조사 결과 공표는 금지됩니다.

## 🔜 다음 단계

- [ ] NESDC 자동 크롤러
- [ ] 카카오톡 공유용 OG 이미지
- [ ] 후보별 추이 차트 (시간에 따른 지지율 변화)
- [ ] 기초자치단체장·교육감 추가

## 지도 데이터

[southkorea/southkorea-maps](https://github.com/southkorea/southkorea-maps) (KOSTAT, 2013)의 simplified GeoJSON을 SVG path로 변환. 라이선스: 자유 공유·리믹스 가능.
