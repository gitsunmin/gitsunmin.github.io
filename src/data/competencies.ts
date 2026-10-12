/**
 * works 요약(brief)에 붙이는 역량 분류.
 *
 * llms.txt가 케이스마다 이 이름을 붙여, 읽는 AI가 "어떤 종류의 문제였나"를 알 수 있게 한다.
 * 기술 이름이 아니라 "어떤 종류의 문제를 풀어 봤는가"의 축이다 — 기술은 Work·SubRepo의
 * techs가 이미 말해 준다.
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
};

export const COMPETENCIES: Competency[] = [
  {
    id: 'design-system',
    label: '디자인 시스템',
    description: '공통 UI 라이브러리, 테마, 컴포넌트 배포',
  },
  {
    id: 'hybrid-webview',
    label: '하이브리드 앱',
    description: 'WebView, 네이티브 연동, 앱 배포 환경',
  },
  {
    id: 'b2b',
    label: 'B2B 서비스',
    description: '업체가 고객인 서비스 — 발주, 거래 문서, 업무 현장의 사용 환경',
  },
  {
    id: 'admin',
    label: '어드민 · 운영 도구',
    description: '관리자 화면, 백오피스, 사내 운영 도구',
  },
  {
    id: 'data-integrity',
    label: '데이터 정합성',
    description: '금액 계산, 검증, 타입 안전한 스키마',
  },
  {
    id: 'observability',
    label: '성능 · 모니터링',
    description: '실사용자 계측, 성능 개선, 로그와 알림',
  },
  {
    id: 'release-ops',
    label: '배포 · 운영 안정성',
    description: '버전 관리, 배포 전략, 운영 중단 없는 전환',
  },
  {
    id: 'dx-tooling',
    label: '개발 경험 · 툴링',
    description: '빌드 구성, 라이브러리 배포, 개발 도구',
  },
  {
    id: 'architecture-0to1',
    label: '0→1 설계',
    description: '초기 아키텍처, 신규 구축, 단독 설계',
  },
];

export const competencyOf = (id: CompetencyId): Competency => {
  const found = COMPETENCIES.find((c) => c.id === id);
  if (!found) throw new Error(`알 수 없는 역량: ${id}`);
  return found;
};
