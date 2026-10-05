/**
 * works 요약(brief)에 붙이는 역량 분류.
 *
 * 채용 담당자가 "어떤 포지션을 보고 있는가"를 고르면(직무 렌즈) 이 태그로 케이스를 고른다.
 * 기술 이름이 아니라 "어떤 종류의 문제를 풀어 봤는가"의 축이다 — 기술은 Work·SubRepo의
 * techs가 이미 말해 준다.
 *
 * `keywords`는 붙여 넣은 채용공고(JD)에서 이 역량을 알아보는 단서다. 소문자로 적고,
 * 한글은 조사가 붙어도 걸리도록 어간만 적는다.
 */

export const COMPETENCY_IDS = [
  'design-system',
  'hybrid-webview',
  'b2b',
  'admin',
  'data-integrity',
  'observability',
  'release-ops',
  'dx-tooling',
  'architecture-0to1',
] as const;

export type CompetencyId = (typeof COMPETENCY_IDS)[number];

type Competency = {
  id: CompetencyId;
  label: string;
  description: string;
  keywords: string[];
};

export const COMPETENCIES: Competency[] = [
  {
    id: 'design-system',
    label: '디자인 시스템',
    description: '공통 UI 라이브러리, 테마, 컴포넌트 배포',
    keywords: ['디자인 시스템', '디자인시스템', 'design system', '컴포넌트 라이브러리', '공통 컴포넌트', 'storybook', 'ui 라이브러리', '테마'],
  },
  {
    id: 'hybrid-webview',
    label: '하이브리드 앱',
    description: 'WebView, 네이티브 연동, 앱 배포 환경',
    keywords: ['webview', '웹뷰', '하이브리드', 'hybrid', 'react native', '앱 개발', '네이티브 앱', 'flutter', 'expo', '모바일 앱'],
  },
  {
    id: 'b2b',
    label: 'B2B 서비스',
    description: '업체가 고객인 서비스 — 발주, 거래 문서, 업무 현장의 사용 환경',
    keywords: ['b2b', 'saas', '기업 고객', '기업용', '거래처', '발주', '유통사', '공급사', '도매'],
  },
  {
    id: 'admin',
    label: '어드민 · 운영 도구',
    description: '관리자 화면, 백오피스, 사내 운영 도구',
    keywords: ['어드민', 'admin', '백오피스', 'back office', '관리자', '운영 도구', '운영 툴', '사내 도구', '내부 도구', 'erp', 'cms'],
  },
  {
    id: 'data-integrity',
    label: '데이터 정합성',
    description: '금액 계산, 검증, 타입 안전한 스키마',
    keywords: ['정합성', '금액', '정산', '결제', '커머스', '핀테크', 'fintech', '타입 안전', '타입 안정', 'graphql codegen', '스키마'],
  },
  {
    id: 'observability',
    label: '성능 · 모니터링',
    description: '실사용자 계측, 성능 개선, 로그와 알림',
    keywords: ['성능', 'performance', '최적화', 'web vitals', 'lcp', '모니터링', 'monitoring', 'datadog', 'sentry', 'rum', '로깅', '관측'],
  },
  {
    id: 'release-ops',
    label: '배포 · 운영 안정성',
    description: '버전 관리, 배포 전략, 운영 중단 없는 전환',
    keywords: ['배포 자동화', '릴리스', 'release', '장애 대응', '안정성', '무중단', '마이그레이션', 'migration', '레거시', 'legacy'],
  },
  {
    id: 'dx-tooling',
    label: '개발 경험 · 툴링',
    description: '빌드 구성, 라이브러리 배포, 개발 도구',
    keywords: ['dx', '개발 경험', '개발자 경험', '개발 생산성', '툴링', 'tooling', 'ci/cd', '모노레포', 'monorepo', '라이브러리 개발', '오픈소스', 'open source', 'npm', 'vite', 'webpack', 'esbuild'],
  },
  {
    id: 'architecture-0to1',
    label: '0→1 설계',
    description: '초기 아키텍처, 신규 구축, 단독 설계',
    keywords: ['0→1', '0 to 1', '0to1', '신규 구축', '신규 서비스', '처음부터', '초기 설계', '초기 멤버', '아키텍처 설계', 'greenfield', '오너십'],
  },
];

export const competencyOf = (id: CompetencyId): Competency => {
  const found = COMPETENCIES.find((c) => c.id === id);
  if (!found) throw new Error(`알 수 없는 역량: ${id}`);
  return found;
};
