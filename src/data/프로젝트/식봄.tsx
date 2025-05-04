import BookFoodspringFrontCover from '@/assets/book_foodspring_front_cover.webp';
import BookFoodspringSideCover from '@/assets/book_foodspring_side_cover.webp';
import BookFoodspringBackCover from '@/assets/book_foodspring_back_cover.webp';
import Foodspring1 from '@/assets/foodspring/foodspring_1.webp';
import Foodspring2 from '@/assets/foodspring/foodspring_2.webp';
import Foodspring3 from '@/assets/foodspring/foodspring_3.webp';
import Foodspring4 from '@/assets/foodspring/foodspring_4.webp';
import Foodspring5 from '@/assets/foodspring/foodspring_5.webp';
import type { 프로젝트 } from '@/data/프로젝트';
import { LightBox } from '@/components/LightBox';

export const 식봄: 프로젝트 = {
  id: 'foodspring',
  parentId: null,
  회사key: 'marketboro',
  이름: '식자재 E-Commerce, 식봄',
  목적: '',
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
      제목: 'PHP to Next.js 전환',
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
          제목: '전반적인 화면설계 및 비즈니스 로직 구현',
          내용: (
            <>
              로그인/회원가입을 시작으로 전반적인 프론트엔드 개발을 하였으며
              검색과 관련된 기능을 중점으로 개발하여 사용자의 편의성을 높이는
              역할을 하였습니다.
              <br />
              <br />
              특히, 검색 페이지에서의 API의 호출을 분할하여 성능 최적화 또는
              다건의 검색어를 한 번에 검색할 수 있는 기능을 개발하여 식봄의 검색
              기능을 향상시켰습니다.
              <br />
              <br />
              <LightBox
                slides={[
                  {
                    src: Foodspring1,
                    alt: '식봄,모바일 로그인 화면',
                  },
                  {
                    src: Foodspring2,
                    alt: '식봄,모바일 검색 화면',
                  },
                  {
                    src: Foodspring3,
                    alt: '식봄,모바일 검색 결과 화면',
                  },
                  {
                    src: Foodspring4,
                    alt: '식봄,PC 검색 결과 화면',
                  },
                  {
                    src: Foodspring5,
                    alt: '식봄,모바일 한 번에 검색 결과 화면',
                  },
                ]}
                className="font-bold"
              >
                관련 자료 모아보기
              </LightBox>
            </>
          ),
        },
        {
          id: 'php-to-next-js-transition-contribution-2',
          제목: 'DataDog을 활용한 서버 모니터링',
          내용: (
            <>
              모니터링 도구인 DataDog을 사용하여 Next.js의 서버 모니터링을
              진행하여 오류 상황에 메신저로 알림이 오도록 설정하여 긴급 상황에
              신속히 대비할 수 있었습니다. 또한 사용자의 트래킹이나 이벤트 등을
              수집하여 단위 기능의 성과를 확인하여 개선점을 찾아내는 역할을
              하였습니다.
              <br />
            </>
          ),
        },
      ],
      트러블슈팅: [
        {
          id: 'php-to-next-js-transition-troubleshooting-1',
          제목: 'Server에서의 Date() 함수의 동작 문제',
          문제점: (
            <>
              Next.js의 Server Side에서 Cookie의 Expire 값을 셋팅해주기 위해서{' '}
              <code>new Date()</code> API를 사용하여 하나의 상수로 저장을 하여
              사용하려고 했습니다. 이는 Client Side 였다면, 사용자가 페이지를
              진입했을 시점의 시간으로 항상 재할당 되어 사용될 코드였습니다.
              하지만, Server Side에서는 서버가 시작되었을 때의 시간으로 고정되어
              있어 문제가 발생하였습니다.
            </>
          ),
          해결방법: (
            <>
              Expire에 해당하는 값을 함수로 Wrapping하여 호출할 때마다
              재계산하여 Expire을 셋팅하도록 로직을 변경하였습니다.
            </>
          ),
          회고: (
            <>
              물론 Client Side와 Server Side에서는 다르게 동작하는 것은 당연한
              것이지만, 이러한 부분을 고려하지 않고 개발을 진행하다보니 발생한
              문제였습니다. 이러한 문제를 통해, Server Side에서의 동작과 Client
              Side에서의 동작을 명확히 구분하여 개발을 진행해야겠다는 생각을
              하게 되었습니다.
            </>
          ),
        },
        {
          id: 'php-to-next-js-transition-troubleshooting-2',
          제목: 'Scroll 위치 복구 문제',
          문제점: <></>,
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
          제목: '배포 파이프라인의 복잡도 증가',
          문제점: '배포 파이프라인의 복잡도 증가',
          해결방법:
            '인쇄 기능만 담당하는 인쇄 라이브러리와 각 서비스별 인쇄 템플릿을 담당하는 번들 두 가지로 나누어 작업하였고, 앞으로는 서비스별로 템플릿이 즐가될 예정이었기 때문에, 배포에 간소화가 필요하였고, 이를 위해 각 서비스별로 번들을 나누어 배포하였습니다.',
          회고: '프론트엔드 개발자로서 화면에 대한 이해도 중요하지만, 일의 효율과 안정성을 위해서 CLI 뿐만아니라 pipeline에 대한 수정도 필요하다.',
        },
        {
          id: 'print-template-library-for-foodspring-troubleshooting-2',
          제목: '인쇄 결과물의 페이지 분할 문제',
          문제점: '인쇄 결과물의 페이지 분할 문제',
          해결방법:
            'Javascript의 Array 타입으로 인쇄 데이터를 넘겨 받고, 각 페이지를 나누는 작업에서, 실제로 결과물의 내용이 많아서 다음 페이지로 넘어가는 케이스와 Array로 구분되어 있는 케이스를 나누어 처리하였습니다.',
          회고: 'CSS로는 생각보다 많은 것들이 가능하다.',
        },
      ],
    },
  ],
};
