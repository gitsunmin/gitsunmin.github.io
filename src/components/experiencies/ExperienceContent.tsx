import type { Content } from '@/data/contentTypes';
import { match } from 'ts-pattern';

type Props = {
  contents: Content[];
};

export const ExperienceContents = ({ contents }: Props) => {
  return contents.map((content, index) => {
    return (
      <div
        key={`experience-content-${
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          index
        }`}
      >
        {match(content)
          .with(
            {
              __t: 'headline',
            },
            ({ text }) => {
              return (
                <h2 className="text-2xl md:text-5xl font-bold text-center">
                  {text}
                </h2>
              );
            },
          )
          .with(
            {
              __t: 'text',
            },
            ({ text }) => {
              return (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                  {text}
                </p>
              );
            },
          )
          .with(
            {
              __t: 'image',
            },
            ({ src, alt }) => {
              return (
                <img
                  src={src}
                  alt={alt}
                  className="w-full max-w-md mx-auto my-4"
                  loading="lazy"
                />
              );
            },
          )
          .with(
            {
              __t: 'link',
            },
            ({ label, url }) => {
              return (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  {label}
                  <span>↗</span>
                </a>
              );
            },
          )
          .exhaustive()}
      </div>
    );
  });
};
