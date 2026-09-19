# 베스트에이블 플레이스 진단 리포트 생성기

직접 확인하고 입력한 네이버 플레이스 정보로 고객용 진단 리포트를 만드는 내부 상담 도구입니다.

## 주요 기능

- 업체 기본정보, 목표 키워드 최대 5개 및 현재 순위 입력
- 6개 영역의 좋음·보통·미흡 평가와 100점 만점 계산
- 강점·문제점 태그를 바탕으로 업종별 진단 문구 작성
- 우선 개선 과제 3개 및 1개월 운영 방향 제안
- 리포트 전체 복사, 인쇄 및 PDF 저장
- PC와 모바일 화면 지원

자동 수집, 네이버 API, 로그인, 데이터베이스, 외부 AI 연결을 사용하지 않습니다. 모든 입력과 계산은 브라우저 안에서만 처리합니다. 새로고침하거나 창을 닫으면 입력 내용은 사라집니다.

## 실행

Node.js 22.12 이상을 설치한 뒤 프로젝트 폴더에서 실행하세요.

```sh
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`을 엽니다. Windows에서는 `start.cmd`를 더블클릭해 실행할 수도 있습니다.

## 검사 및 배포 파일 만들기

```sh
npm test
npm run build
```

완성된 웹사이트 파일은 `dist` 폴더에 생성됩니다.

## GitHub Pages

저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다. `main`에 파일을 올리면 검사와 빌드 후 웹사이트가 자동 배포됩니다. 진행 결과는 **Actions**에서 확인할 수 있습니다.

이 도구에는 로그인이 없으므로 공개 배포한 주소에 접속하는 누구나 사용할 수 있습니다. 이용자가 입력한 업체 정보나 리포트는 저장소에 올라가지 않습니다.

## 문구와 디자인 변경

| 파일 | 수정할 내용 |
| --- | --- |
| `src/App.jsx` | 화면 구성, 입력 항목, 안내 문구 |
| `src/App.css` | 색상, 글자, 여백, 모바일·인쇄 디자인 |
| `src/scoreCalculator.js` | 점수와 순위 구간 |
| `src/reportGenerator.js` | 분석 문구와 우선 과제 선정 |
| `src/industryTemplates.js` | 업종별 문구와 서비스 설명 |
| `src/tags.js` | 강점·문제점 태그 |

초보자를 위한 자세한 설명은 [사용안내.md](사용안내.md)를 확인하세요.

배포 방식 참고: [Vite 공식 GitHub Pages 안내](https://vite.dev/guide/static-deploy.html#github-pages).
