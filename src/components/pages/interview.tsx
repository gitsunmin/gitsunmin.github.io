import { Suspense } from 'react';
import { ChatCard } from '@/components/Chat';
import { INTERVIEW } from '@/data/interview';

import { cn } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';
import { Gitsunmin, James, type User } from '@/data/user';
import { twMerge } from 'tailwind-merge';

type Props = {
  interviewer: User;
  interviewee: User;
};

const Content = ({ interviewer, interviewee }: Props) => {
  return (
    <article className="flex flex-col text-gray-900 dark:text-gray-100 px-4 w-full md:max-w-(--breakpoint-md) mx-auto pb-10">
      {INTERVIEW.banner ? (
        <p
          className={twMerge(
            'text-sm break-words',
            'text-gray-500 dark:text-gray-400 border-l-2',
            'border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-800',
            'mt-4 rounded-lg',
          )}
        >
          {INTERVIEW.banner}
        </p>
      ) : (
        <></>
      )}
      <section className="flex flex-wrap gap-y-[10px] pt-12">
        {INTERVIEW.chatList.map((chat, index, list) => {
          const { user } = chat;
          const isContinues = list[index - 1]?.user.id === user.id;

          return (
            <div
              key={`${user.id}-${index}`}
              className={cn('w-full flex gap-x-2.5 gap-y-1', {
                'flex-row': user.id === interviewer.id,
                'flex-row-reverse': user.id === interviewee.id,
              })}
            >
              {isContinues ? (
                <div className="w-10" />
              ) : (
                <div className="flex items-start">
                  <Avatar
                    src={user.avatar}
                    alt={`${name} profile`}
                    size={40}
                    className="rounded-full border border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}
              <div className={'max-w-[60%] flex flex-col gap-y-1'}>
                {isContinues ? null : (
                  <div
                    className={cn('text-sm text-gray-700 dark:text-gray-300', {
                      'text-left': user.id === interviewer.id,
                      'text-right': user.id === interviewee.id,
                    })}
                  >
                    {user.name.first}
                  </div>
                )}
                <ChatCard {...chat} active={user.id === interviewee.id} />
              </div>
            </div>
          );
        })}
      </section>
      <section className="mt-8">
        <a
          href="https://github.com/gitsunmin/gitsunmin.github.io/issues/new?template=new_interview_questions.md"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-4 py-2 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors animate-bounce"
        >
          <span className="font-bold">추가질문</span>을 하고 싶다면,
          <span className="font-bold pl-1">클릭</span>
          <span className="pl-1">해주세요.</span>
        </a>
      </section>
    </article>
  );
};

export const InterviewPage = () => {
  return (
    <Suspense>
      <Content interviewer={James} interviewee={Gitsunmin} />
    </Suspense>
  );
};
