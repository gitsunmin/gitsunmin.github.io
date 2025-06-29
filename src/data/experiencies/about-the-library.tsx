import type { Experience } from '@/data/experiencies/';
import BookFrontCover from '@/assets/book_pages.webp';
import BookBackCover from '@/assets/book_pages.webp';
import BookSideCover from '@/assets/book_pages.webp';
import Content from '@/docs/experiencies/about-the-library.mdx';
import { MDXReplacer } from '@/docs/MDXReplacer';

export const EXPERIENCE_LIBRARY: Experience = {
  id: 'experience-library-development',
  careers: ['marketboro'],
  name: 'Library 개발',
  introduce: [
    {
      __t: 'text',
      text: '먼저, 찾아주셔서 감사합니다.',
    },
    {
      __t: 'text',
      text: '아래 글에서는 제가 경험하였던 라이브러리 개발에 대한 내용을 다루고 있습니다.',
    },
    {
      __t: 'text',
      text: ' 개인적으로 라이브러리를 개발했던 경험 뿐만 아니라 회사에서 사내 전용 라이브러리 개발에 대한 간단한 팁도 공유해 보겠습니다.',
    },
    {
      __t: 'text',
      text: '최대한 특정 프로그래밍 언어, 프레임워크에 의존하지 않고, "라이브러리 개발"이라는 주제에 집중하여 작성하였습니다.',
    },
    {
      __t: 'text',
      text: '공개되는 링크나 코드는 개인적인 경험을 바탕으로 작성된 것이며, 특정 회사의 정책이나 규정과는 무관합니다.',
    },
    {
      __t: 'text',
      text: '다시 한 번, 해당 글을 읽어주셔서 감사합니다.',
    },
  ],
  content: <Content components={MDXReplacer({})} />,
  // contents: [
  //   {
  //     __t: 'headline',
  //     level: 1,
  //     text: '라이브러리란?',
  //   },
  //   {
  //     __t: 'text',
  //     text: '라이브러리(library)라는 단어는 본래 **“도서관”**이라는 뜻을 가지고 있습니다. 그런데 왜 코드의 집합체를 이런 이름으로 부르게 되었을까요?',
  //   },
  //   {
  //     __t: 'text',
  //     text: '초기 컴퓨터 프로그래밍 환경에서는 펀치 카드나 기계어를 이용해 프로그램을 작성해야 했습니다. 이러한 환경에서는 자주 사용하는 코드 조각을 매번 새로 작성하는 것이 매우 비효율적이었고, 이에 따라 반복적으로 사용되는 로직이나 기능들을 하나의 묶음으로 정리해두는 방식이 고안되었습니다. 필요한 때에 꺼내 쓸 수 있도록 구성한 이 구조는 책을 보관하고 꺼내 읽는 도서관과 닮아 있었기 때문에, 이러한 코드 모음을 **“라이브러리”**라고 부르게 된 것입니다.',
  //   },
  //   {
  //     __t: 'text',
  //     text: '즉, 라이브러리란 특정 로직이나 기능을 재사용하기 위해 정리해 놓은 코드의 집합이라고 할 수 있습니다.',
  //   },
  //   {
  //     __t: 'text',
  //     text: '저 역시 개발자로서, 반복적이고 일관된 작업을 효율화하기 위해 직접 라이브러리를 만들어본 경험이 있습니다.',
  //   },
  //   {
  //     __t: 'text',
  //     text: '예를 들어, k-number라는 이름의 라이브러리는 숫자를 한국어 표기법으로 변환하는 기능을 제공합니다. 이 라이브러리를 사용하면 "1234"라는 숫자를 "천 이백 삼십 사"와 같은 형태로 한글로 읽을 수 있도록 변환할 수 있습니다.',
  //   },
  //   {
  //     __t: 'link',
  //     label: 'k-number',
  //     url: 'https://github.com/gitsunmin/k-number',
  //   },
  //   {
  //     __t: 'text',
  //     text: '또 다른 예로는 dot-controller라는 라이브러리가 있습니다. 이 라이브러리는 점(dot) 모양의 UI 요소를 통해 기능을 조작하는 컨트롤러로, 페이지 네비게이션 등 다양한 인터랙션에서 활용할 수 있도록 만든 UI/UX 컴포넌트 중심의 라이브러리입니다.',
  //   },
  //   {
  //     __t: 'link',
  //     label: 'Dot Controller',
  //     url: 'https://github.com/gitsunmin/dot_controller',
  //   },
  //   {
  //     __t: 'text',
  //     text: '이처럼 제가 만든 라이브러리들은 모두 단일 목적을 명확히 가지고 있으며, 특정 기능만을 집중적으로 수행할 수 있도록 설계되었습니다.',
  //   },
  //   {
  //     __t: 'text',
  //     text: '이는 라이브러리 설계의 핵심인 “단순하고 명확한 책임(Single Responsibility)” 원칙을 바탕으로 한 접근 방식이었습니다.',
  //   },
  //   {
  //     __t: 'headline',
  //     level: 1,
  //     text: '라이브러리 개발 프로세스',
  //   },
  //   {
  //     __t: 'headline',
  //     level: 1,
  //     text: 'Semver 버전의 이해',
  //   },
  //   {
  //     __t: 'headline',
  //     level: 1,
  //     text: 'CHANGELOG 작성',
  //   },
  //   {
  //     __t: 'headline',
  //     level: 1,
  //     text: '오픈소스화 하기',
  //   },
  // ],
  book: {
    cover: {
      front: BookFrontCover,
      back: BookBackCover,
      side: BookSideCover,
    },
  },
};
