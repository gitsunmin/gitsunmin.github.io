import { Gitsunmin, James, type User } from '@/data/user';
import type { Content } from '@/data/contentTypes';

export type Chat = {
  user: User;
  content: Content;
};

type Interview = {
  banner?: string;
  chatList: Chat[];
};

export const INTERVIEW: Interview = {
  banner:
    '이 페이지는 제가 지금까지 면접이나 주변 사람들에게 들었던 질문들과 그에 대한 답변을 기반으로 작성해 보았습니다.',
  chatList: [
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '안녕하세요! 제 페이지에 방문해 주셔서 감사합니다.'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '지금부터 제가 자주 받았던 질문들과 그에 대한 답변을 공유해 보겠습니다.'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '먼저, 인터뷰 진행을 담당해주실 James님을 소개해 드릴게요.'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '안녕하세요 ㅎㅎ'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '방금 소개 받은 James입니다. 면접관 역할을 맡게 되었어요.'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '그럼, 시작해 볼까요?'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: 'Gitsunmin님, 간단하게 자기 소개 부탁드리겠습니다.'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '아;; 넵!'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '저는 2019년 부터 프론트엔드 개발을 시작해서 B2B 서비스를 주로 개발하고 있으며, 협업툴, 커머스 등 다양한 경험을 쌓고 있습니다.'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '아 그렇군요! 프론트엔드 개발을 시작한 지 꽤 되셨네요.'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '저는 Gitsunmin님이 왜 프론트엔드 개발을 시작하게 되었는지부터 이야기를 시작해 보고 싶습니다.'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '대학 전공은 응용물리학과인데, 어떻게 프론트엔드 개발을 시작하게 되셨나요?'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '사실 대학 전공은 응용물리학과였지만, 컴퓨터에 대한 관심이 많았어요. 그러다가 "전산물리"라는 전공과목에서 Python을 배우게 되었고, 그 과정에서 프로그래밍 언어에 대한 흥미가 생겼습니다.'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '혼자 공부도 하고, 해커톤도 참여하면서 점점 더 프로그래밍에 빠져들게 되었어요.'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '우연히 "생활코딩"이라는 플랫폼을 통해서 프론트엔드 개발을 접하게 되었고, 사용자에게 더 나은 경험을 제공하는 프론트엔드 개발에 매력을 느끼게 되었습니다.'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'link',
        label: '참고: 생활코딩',
        url: 'https://www.opentutorials.org/course/1'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '그런 이야기가 있었군요!'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '전공과 다른 분야로의 전향은 쉽지 않았을 텐데, 굳은 결심이 필요했을 것 같아요.'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '여러가지 어려움이 있었지만, 흥미있는 일에 집중하고 싶었습니다 ㅎ'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '혹시 전공자들과 함께 일하면서는 지식에 대한 격차나 기술적인 부분에서 어려움은 없었나요?'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '처음에는 기술적인 부분에서 격차가 느껴졌습니다. 하지만, 그 격차를 극복하기 위해서 꾸준히 공부하고, 다양한 프로젝트에 참여하면서 경험을 쌓았습니다.'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '또한, 동료 개발자들과의 협업을 통해서 많은 것을 배울 수 있었습니다. 그 과정에서 기술적인 부분뿐만 아니라, 협업과 커뮤니케이션 능력도 많이 향상되었습니다.'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '그렇군요! 기술적인 격차를 극복하기 위해서 꾸준히 노력하셨군요.'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '어떤 노력들을 하셨는지 구체적으로 말씀해 주실 수 있을까요?'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '1 ~ 2년차에는 주로 온라인 강의와 책을 통해서 컴퓨터 공학의 기초를 다졌습니다.'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '그 이후로는 개인적으로 프로젝트도 만들고, TIL(오늘의 학습)을 작성하면서 지식을 정리하는 습관을 들였습니다.'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'link',
        label: '참고: TIL',
        url: '/til/README'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'link',
        label: '참고: 개인 프로젝트들',
        url: 'https://github.com/gitsunmin/on-recliner'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '이러한 습관들이 저의 기술적인 성장에 큰 도움이 되었습니다.'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '꾸준히 학습하고 정리하는 습관을 통해서 기술적인 격차를 극복하셨군요.'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '그렇다면, 프론트엔드 개발자로서 업무를 진행하면서 가장 기억에 남는 프로젝트나 경험이 있다면 어떤 것이 있을까요?'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '특정 프로젝트가 기억에 남기 보다는'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '설계 단계 부터 참여하여 기획자, 디자이너 등 다양한 직군의 사람들과 협업을 하며 하나의 소프트웨어를 만들었던 프로젝트가 가장 기억에 남습니다.'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '그렇군요! 다양한 직군과의 협업을 통해서 소프트웨어 개발의 전 과정을 경험하는 것이 가장 기억에 남는 경험이었군요.'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '그럼, 그러한 프로젝트에서 가장 어려웠던 점은 무엇이었나요?'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '아무래도 요구사항을 명확하게 이해하고, 이를 바탕으로 설계하는 과정이 가장 어려웠습니다.'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '요구사항에서 누락하거나 개발적으로 불가능한 부분이 있을 때, 기획자와 디자이너와의 소통이 중요했습니다.'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '이러한 소통이 프로젝트 초기에 잘 이루어지지 않으면, 개발 과정에서 많은 어려움을 겪게 되더라고요.'
      }
    },
    {
      user: James,
      content: {
        __t: 'text',
        text: '그렇군요! 요구사항을 명확하게 이해하고, 소통하는 것이 프로젝트의 성공에 중요한 요소라는 것을 잘 알고 계시네요.'
      }
    },
    {
      user: Gitsunmin,
      content: {
        __t: 'text',
        text: '맞습니다. 그래서 저는 항상 요구사항을 명확하게 이해하고, 소통하는 것을 중요하게 생각합니다.'
      }
    }
  ]
};
