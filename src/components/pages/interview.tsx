import { Suspense } from 'react';
import { ChatCard } from '@/components/Chat';
import { INTERVIEW } from '@/data/interview';

import { cn } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';

const Content = () => {
  return (
    <article className="flex flex-col text-gray-900 dark:text-gray-100">
      <p className="text-gray-500 dark:text-gray-400 border-l-2 border-gray-300 dark:border-gray-600 px-4 py-2 text-sm break-words bg-gray-50 dark:bg-gray-800">
        이 페이지는 제가 지금까지 면접이나 주변 사람들에게 들었던 질문들과 그에
        대한 답변을 기반으로 작성해보았습니다.
      </p>
      <section className="flex flex-wrap gap-y-[10px] pt-10">
        {INTERVIEW.map((chat, index, list) => {
          const { name } = chat;
          const isContinues = list[index - 1]?.name === name;

          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={`${name}-${index}`}
              className={cn('w-full flex gap-x-2.5 gap-y-1', {
                'flex-row': name === 'James',
                'flex-row-reverse': name === 'Sunmin',
              })}
            >
              {isContinues ? (
                <div className="w-10" />
              ) : (
                <div className="flex items-start">
                  <Avatar
                    src={
                      name === 'James'
                        ? 'https://images.unsplash.com/photo-1736033302187-64b6be9e4652?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        : 'https://github.com/gitsunmin.png'
                    }
                    alt={`${name}_profile`}
                    size={40}
                    className="rounded-full border border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}
              <div className={'max-w-[60%] flex flex-col gap-y-1'}>
                {isContinues ? null : (
                  <div
                    className={cn('text-sm text-gray-700 dark:text-gray-300', {
                      'text-left': name === 'James',
                      'text-right': name === 'Sunmin',
                    })}
                  >
                    {name}
                  </div>
                )}
                <ChatCard {...chat} />
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
      <Content />
    </Suspense>
  );
};
