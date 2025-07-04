import { Career } from '@/data/careers';
import { Suspense } from 'react';

const Content = () => {
  return (
    <article className="py-8 px-4 md:px-0 w-full md:max-w-(--breakpoint-md) mx-auto">
      <ul className="flex flex-col gap-8">
        {Career.map((career) => {
          return (
            <li
              key={career.name}
              className="p-6 rounded-xl border shadow-sm bg-background text-foreground flex flex-col gap-4"
            >
              <div className="flex items-start justify-start gap-x-4">
                <img
                  src={career.logo}
                  alt={`${career.name} 로고`}
                  className="rounded-full size-12 border"
                />
                <div>
                  <h2 className="text-xl font-bold">{career.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-200 mt-1">
                    {career.positoin} | {career.range}
                  </p>
                </div>
              </div>

              {/* 회사 소개 */}
              <section className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                {career.introduce}
              </section>

              {/* 링크 섹션 */}
              <section>
                <h6 className="mt-2 font-semibold text-sm text-gray-700 dark:text-gray-300">
                  Links
                </h6>
                <ul className="list-disc ml-5 text-sm mt-1 space-y-1">
                  {career.links.map(({ label, url }) => (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        {label}
                        <span>↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </li>
          );
        })}
      </ul>
    </article>
  );
};

export const CareersPage = () => {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
};
