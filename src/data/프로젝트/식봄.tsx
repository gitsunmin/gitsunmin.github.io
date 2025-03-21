import BookFoodspringFrontCover from '@/assets/book_foodspring_front_cover.webp';
import BookFoodspringSideCover from '@/assets/book_foodspring_side_cover.webp';
import BookFoodspringBackCover from '@/assets/book_foodspring_back_cover.webp';
import { 프로젝트 } from '@/data/프로젝트';

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
      기술: [
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
          사용하고 있었으며, 프론트엔드는 <strong>Next.js</strong>, 백엔드는
          <strong>Kotlin Spring Boot</strong>로 전환하는 프로젝트입니다. 저는
          프론트엔드를 담당하여 전환 작업을 진행하면서 새로운 기능도 함께
          개발하였고, 그 과정에서 다양한 문제와 해결방법을 찾을 수 있었습니다.
        </>
      ),
      기여도: [
        {
          id: 'php-to-next-js-transition-contribution-1',
          제목: '인증 및 게스트 유저 관리.',
          내용: <>로그인/회원가입 페이지를 전환하면서,</>,
        },
        {
          id: 'php-to-next-js-transition-contribution-2',
          제목: '검색 및 검색 결과 페이지 전환 작업',
          내용: <>공통 로직을 넣음으로서 추가 전환 페이지 수 증가.</>,
        },
        {
          id: 'php-to-next-js-transition-contribution-3',
          제목: '마이크로애니메이션을 사용한 UX 개선',
          내용: <>로그인/회원가입 페이지를 전환하면서,</>,
        },
      ],
      트러블슈팅: [
        {
          id: 'php-to-next-js-transition-troubleshooting-1',
          문제점: 'SSR에서의 Javascript 동작의 변화',
          해결방법: '해결방법을 사용하여 해결함',
          회고: '회고해보니 이런 점을 배울 수 있었음.',
        },
        {
          id: 'php-to-next-js-transition-troubleshooting-2',
          문제점: '너가 문제임',
          해결방법: '너가 문제임',
          회고: '너가 문제임',
        },
      ],
    },
    {
      id: 'prowser-printing-template-library-development',
      제목: '브라우저 인쇄 템플릿 라이브러리 개발',
      기술: [
        'react',
        'tailwindcss',
        'typescript',
        'bitbucket_pipelines',
        'vite',
        'bun',
      ],
      소개: `식봄은 기존에 Code Igniter라는 PHP 프레임워크를 사용하고 있었으며, 프론트엔드는 Next.js, 백엔드는 Kotlin Spring Boot로 전환하는 프로젝트입니다.
                    전환 작업을 진행하면서 새로운 기능도 함께 개발하였고, 그 과정에서 다양한 문제와 해결방법을 찾을 수 있었습니다. 아래에서 그 내용을 이야기 하겠습니다.`,
      기여도: [],
      트러블슈팅: [],
    },
    {
      id: 'datadog-monitoring-for-server-side-next-js',
      제목: 'DataDog을 이용한 모니터링',
      기술: [
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
      소개: `식봄은 기존에 Code Igniter라는 PHP 프레임워크를 사용하고 있었으며, 프론트엔드는 Next.js, 백엔드는 Kotlin Spring Boot로 전환하는 프로젝트입니다.
                    전환 작업을 진행하면서 새로운 기능도 함께 개발하였고, 그 과정에서 다양한 문제와 해결방법을 찾을 수 있었습니다. 아래에서 그 내용을 이야기 하겠습니다.`,
      기여도: [],
      트러블슈팅: [],
    },
  ],
};
