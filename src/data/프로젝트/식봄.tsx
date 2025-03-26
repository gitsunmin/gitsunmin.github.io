import BookFoodspringFrontCover from '@/assets/book_foodspring_front_cover.webp';
import BookFoodspringSideCover from '@/assets/book_foodspring_side_cover.webp';
import BookFoodspringBackCover from '@/assets/book_foodspring_back_cover.webp';
import { 프로젝트 } from '@/data/프로젝트';
import Carousel from '@/components/Carousel';

export const 식봄: 프로젝트 = {
  id: 'foodspring',
  parentId: null,
  회사key: 'marketboro',
  이름: '식자재 E-Commerce, 식봄',
  소개: (
    <>
      <p>
        식봄은 식자재 시장의 활성화를 목표로 개발된 B2B 커머스 플랫폼입니다. 이
        플랫폼은 식자재 구매자와 판매자를 연결하여 효율적인 거래를 지원합니다.
        특히, 판매자의 배송 유형에 따라 직배송, 택배배송 등으로 구분하여 상품을
        노출하며, 이를 통해 구매자에게는 신선하고 다양한 식자재를, 판매자에게는
        안정적인 판로를 제공합니다.
        <br />
        <br />
      </p>
      <h3 className="font-bold text-xl">주요 특징: </h3>
      <ul className="list-disc list-inside">
        <li>
          다양한 배송 옵션: 판매자의 물류 역량에 따라 직배송, 택배배송 등 다양한
          배송 방식을 지원하여 구매자에게 최적의 배송 서비스를 제공합니다.
        </li>
        <li>
          지역 기반 상품 노출: 상품의 배송 가능 지역을 기반으로 구매자에게
          맞춤형 상품을 노출하여 지역 특산물의 유통을 촉진합니다.
        </li>
        <li>
          실시간 재고 관리: 판매자는 실시간으로 재고를 관리하고, 구매자는 현재
          재고 상황을 즉시 확인할 수 있어 원활한 거래가 가능합니다.
        </li>
      </ul>
    </>
  ),
  기간: '2024.01 ~ ',
  기술들: [
    'react',
    'next',
    'tailwindcss',
    'relay',
    'jest',
    'typescript',
    'bitbucket_pipelines',
    'datadog',
    'vite',
    'bun',
  ],
  책: {
    표지: {
      앞: BookFoodspringFrontCover,
      등: BookFoodspringSideCover,
      뒤: BookFoodspringBackCover,
    },
  },
  작업: [
    {
      id: 'php-to-next-js-transition',
      제목: 'PHP to Next.js 전환 및 UI 작업',
      도구: [
        'react',
        'next',
        'tailwindcss',
        'relay',
        'jest',
        'typescript',
        'bitbucket_pipelines',
        'datadog',
        'vite',
        'bun',
      ],
      소개: (
        <>
          식봄은 기존에 <strong>Code Igniter</strong>라는 PHP 프레임워크를
          사용하고 있었으며, 레거시 시스템으로 인하여 유지보수에 어려웁을 격고
          있었습니다. 이를 해결하기 위해서 현재 웹 서비스로서 프론트엔드와
          백엔드로의 분리를 필요로하였고, 프론트엔드는 Next.js, 백엔드는 Kotlin
          Spring으로의 전환을 계획하였습니다.
          <br />
          <br />
          해당 작업은 AWS의 ALB 서비스를 이용하여 특정 URL의 Pathname을
          Next.js와 PHP 페이지 두 분기를 하여 점진적으로 전환을 해나아가는
          작업이었습니다. 해당 작업을 수행하며 동시에 새롭게 리뉴얼하는 페이지도
          있었고, 공통으로 새로운 기능을 추가하는 일도 있었습니다
          <br />
          <br />
          다양한 작업을 하며 기여도와 트러블슈팅을 간략하게 정리해보았습니다.
        </>
      ),
      기여도: [
        {
          id: 'php-to-next-js-transition-contribution-1',
          제목: '식봄 서비스 Next.js로 전환',
          내용: (
            <>
              로그인/회원가입 및 검색 관련 페이지를 전환하는 작업을 주로
              하였으며, 신규로 생성되는 페이지에 대한 작업을 주로 하였습니다.
              <br />
              <br />
              <Carousel
                slides={[
                  <>
                    <div className="h-[200px] bg-amber-700">테스트1</div>
                  </>,
                  <>
                    <div className="h-[200px] bg-amber-950">테스트2</div>
                  </>,
                  <>
                    <div className="h-[200px] bg-amber-200">테스트3</div>
                  </>,
                  <>
                    <div className="h-[200px] bg-amber-400">테스트4</div>
                  </>,
                ]}
                options={{
                  loop: true,
                  align: 'start', // 왼쪽 정렬
                  containScroll: 'trimSnaps', // 보이는 범위 내로 제한
                }}
                view="wide"
              />
              {/* 상세 이미지가 들어갈 자리 */}
            </>
          ),
        },
        {
          id: 'php-to-next-js-transition-contribution-2',
          제목: 'DataDog을 활용한 서버 모니터링',
          내용: (
            <>
              DataDog을 사용하여 Next.js의 서버 모니터링을 진행하여 오류 상황에
              대해 빠르게 대처하는 역할을 하였으며, 사용자의 동작을 녹화할 수
              있는 Session Replay 기능을 활용하여 사용자의 행동을 분석하여
              기능의 필요성을 측정하는 작업을 하였습니다.
              <br />
              {/* 상세 이미지가 들어갈 자리 */}
            </>
          ),
        },
      ],
      트러블슈팅: [
        {
          id: 'php-to-next-js-transition-troubleshooting-1',
          문제점: 'PHP와 Next.js의 동시 운영 문제',
          해결방법: '',
          회고: '',
        },
        {
          id: 'php-to-next-js-transition-troubleshooting-2',
          문제점: 'Server에서의 Date() 함수의 동작 문제',
          해결방법: '',
          회고: '',
        },
        {
          id: 'php-to-next-js-transition-troubleshooting-3',
          문제점: '본인인증 시 로컬 환경에서의 CORS 문제',
          해결방법: '',
          회고: '',
        },
        {
          id: 'php-to-next-js-transition-troubleshooting-4',
          문제점: 'Scroll 위치 복구 문제',
          해결방법: '',
          회고: '',
        },
      ],
    },
    {
      id: 'print-template-library-for-foodspring',
      제목: '식봄 인쇄 템플릿 라이브러리 개발',
      소개: '',
      도구: ['react', 'next', 'tailwindcss', 'relay', 'jest', 'typescript'],
      기여도: [
        {
          id: 'print-template-library-for-foodspring-contribution-1',
          제목: '인쇄 템플릿 라이브러리 설계',
          내용: (
            <>
              요구사항 분석을 통해서 범용적인 인쇄 템플릿 라이브러리가
              필요하였고, 인쇄 기능만을 담당하는 라이브러리와 각 서비스별
              템플릿을 갖는 번들 형태로 개발 진행
            </>
          ),
        },
        {
          id: 'print-template-library-for-foodspring-contribution-2',
          제목: '인쇄 템플릿 라이브러리 Playground 개발',
          내용: (
            <>
              빠듯한 일정 때문에 개발을 투 트랙으로 진행 하였기 때문에, 실
              사용자에 대한 테스트가 필요하다고 판단하여 인쇄 템플릿을 미리
              테스트해 볼 수 있는 Playground를 개발하여 배포.
            </>
          ),
        },
      ],
      트러블슈팅: [
        {
          id: 'print-template-library-for-foodspring-troubleshooting-1',
          문제점: '배포 파이프라인의 복잡도 증가',
          해결방법:
            '인쇄 기능만 담당하는 인쇄 라이브러리와 각 서비스별 인쇄 템플릿을 담당하는 번들 두 가지로 나누어 작업하였고, 앞으로는 서비스별로 템플릿이 즐가될 예정이었기 때문에, 배포에 간소화가 필요하였고, 이를 위해 각 서비스별로 번들을 나누어 배포하였습니다.',
          회고: '프론트엔드 개발자로서 화면에 대한 이해도 중요하지만, 일의 효율과 안정성을 위해서 CLI 뿐만아니라 pipeline에 대한 수정도 필요하다.',
        },
        {
          id: 'print-template-library-for-foodspring-troubleshooting-2',
          문제점: '인쇄 결과물의 페이지 분할 문제',
          해결방법:
            'Javascript의 Array 타입으로 인쇄 데이터를 넘겨 받고, 각 페이지를 나누는 작업에서, 실제로 결과물의 내용이 많아서 다음 페이지로 넘어가는 케이스와 Array로 구분되어 있는 케이스를 나누어 처리하였습니다.',
          회고: 'CSS로는 생각보다 많은 것들이 가능하다.',
        },
      ],
    },
  ],
};
