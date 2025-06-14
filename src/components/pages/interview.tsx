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
    <article className="flex flex-col text-gray-900 dark:text-gray-100 px-4">
      {INTERVIEW.banner ? (
        <p
          className={twMerge(
            'text-sm break-words',
            'text-gray-500 dark:text-gray-400 border-l-2',
            'border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-800',
            'mt-4 rounded-lg ',
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
