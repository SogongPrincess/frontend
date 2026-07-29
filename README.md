# Frontend

React + TypeScript + Vite 기반의 창업/상권/금융/사업성 시뮬레이션 UI 프로젝트입니다. KB 브랜드 톤을 반영한 따뜻하고 부드러운 사용자 경험을 지향합니다.

## 주요 기술
- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- React Router DOM
- Zustand
- TanStack React Query
- Axios
- clsx / tailwind-merge
- lucide-react

## 실행 방법
```bash
npm install
npm run dev
```

개발 서버는 기본적으로 http://localhost:5173 에서 실행됩니다.

## 스크립트
```bash
npm run dev       # 개발 서버 실행
npm run build     # 타입체크(tsc -b) 후 프로덕션 빌드
npm run preview   # 빌드 결과 로컬 미리보기
npm run lint      # oxlint 실행
```

## 프로젝트 구조
- src/components/ui: 카드, 버튼, 인풋 등 재사용 가능한 공통 UI 컴포넌트
- src/components/assistant: AI 캐릭터 관련 공통 컴포넌트 (캐릭터, 말풍선, 어시스턴트 영역)
- src/layouts: 페이지 공통 레이아웃 (전체 레이아웃, 홈, 서비스 페이지)
- src/pages: 라우팅되는 화면 단위 페이지
- src/lib: 공통 유틸리티 및 API 헬퍼
- src/store: Zustand 상태 관리
- src/providers: 앱 전역 Provider (React Query 등)
- src/styles: 전역 스타일 및 테마 설정 (브랜드 컬러 토큰)
- src/assets: 이미지 등 정적 자원

## 라우트
- `/` : 홈
- `/startup-location` : 창업 입지추천
- `/business-simulation` : 사업성 시뮬레이션
- `/finance` : 금융
- `/report` : 리포트
- `/settings` : 설정
- `/404`, `*` : Not Found

## 경로 별칭
`@/*`는 `src/*`를 가리킵니다 (예: `import { Button } from "@/components/ui/button"`).

## 개발 원칙
작업 원칙, 폴더 구조, 컴포넌트/레이아웃 원칙, 브랜드 컬러 등 자세한 내용은 [AGENTS.md](./AGENTS.md)를 참고하세요.
