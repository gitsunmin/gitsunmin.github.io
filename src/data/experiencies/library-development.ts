import type { Experience } from '@/data/experiencies';
import BookFrontCover from '@/assets/book_pages.webp';
import BookBackCover from '@/assets/book_pages.webp';
import BookSideCover from '@/assets/book_pages.webp';

export const EXPERIENCE_LIBRARY: Experience = {
  id: 'experience-library-development',
  careers: ['marketboro'],
  name: 'Library 개발',
  introduce: [
    {
      __t: 'text',
      text: '먼저, 찾아주셔서 감사합니다.'
    },
    {
      __t: 'text',
      text: '아래 글에서는 제가 경험하였던 라이브러리 개발에 대한 내용을 다루고 있습니다.'
    },
    {
      __t: 'text',
      text: ' 개인적으로 라이브러리를 개발했던 경험 뿐만 아니라 회사에서 사내 전용 라이브러리 개발에 대한 간단한 팁도 공유해 보겠습니다.'
    },
    {
      __t: 'text',
      text: '최대한 특정 프로그래밍 언어, 프레임워크에 의존하지 않고, "라이브러리 개발"이라는 주제에 집중하여 작성하였습니다.'
    },
    {
      __t: 'text',
      text: '공개되는 링크나 코드는 개인적인 경험을 바탕으로 작성된 것이며, 특정 회사의 정책이나 규정과는 무관합니다.'
    },
    {
      __t: 'text',
      text: '다시 한 번, 해당 글을 읽어주셔서 감사합니다.'
    }
  ],
  contents: [
    {
      __t: 'headline',
      level: 1,
      text: '배경지식'
    },
    {
      __t: 'headline',
      level: 2,
      text: '라이브러리란?'
    },
    {
      __t: 'text',
      text: '당연한 이야기지만, 라이브러리를 개발하기 위해서는 "라이브러리"가 무엇인지에 대한 이해가 필요합니다.'
    },
    {
      __t: 'text',
      text: '라이브러리는 특정 목적을 가지는 모듈의 집합으로, 다른 프로그램에서 재사용할 수 있도록 설계된 코드의 모음입니다.'
    },
    {
      __t: 'text',
      text: '그렇다면, 모듈은 무엇일까요?'
    },
    {
      __t: 'text',
      text: '모듈은 특정 기능이나 역할을 수행하는 코드의 단위로, 라이브러리 내에서 독립적으로 동작할 수 있는 구성 요소입니다.'
    },
    {
      __t: 'text',
      text: ''
    },
    {
      __t: 'text',
      text: '이렇게 바라볼 수도 있을 것 같습니다.'
    },
    {
      __t: 'text',
      text: '모듈과 모듈을 조합하여 하나의 모듈을 만들 수 있고, 또 이 모듈 집합체를 조합하여 하나의 라이브러리를 만들 수 있습니다.'
    },
    {
      __t: 'text',
      text: '즉, 라이브러리를 하나의 모듈로 바라볼 수도 있습니다.'
    },
    {
      __t: 'text',
      text: '예를 들어, 수학적 계산을 수행하는 라이브러리를 개발한다고 가정해 봅시다.'
    },
    {
      __t: 'text',
      text: '더하기를 수행하는 모듈, 빼기를 수행하는 모듈, 곱하기를 수행하는 모듈 등 여러 개의 모듈을 조합하여 하나의 라이브러리를 만들 수 있습니다.'
    },
    {
      __t: 'text',
      text: '이렇게 모듈을 조합하여 라이브러리를 만드는 과정은 마치 레고 블록을 조립하는 것과 비슷합니다.'
    },
    {
      __t: 'headline',
      level: 1,
      text: '라이브러리 설계'
    },
    {
      __t: 'headline',
      level: 1,
      text: '라이브러리 개발 사이클'
    },
    {
      __t: 'headline',
      level: 1,
      text: 'Semver 버전의 이해'
    },
    {
      __t: 'headline',
      level: 1,
      text: 'CHANGELOG 작성'
    },
    {
      __t: 'headline',
      level: 1,
      text: '오픈소스화 하기'
    }
  ],
  book: {
    cover: {
      front: BookFrontCover,
      back: BookBackCover,
      side: BookSideCover
    }
  }
};
