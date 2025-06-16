import type { Content } from '@/data/contentTypes';
import { cn } from '@/lib/utils';
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
            ({ text, level, className }) => {
              return match(level)
                .with(1, () => (
                  <h1
                    id={text.toLowerCase().replace(/\s+/g, '-')}
                    className={cn('text-3xl md:text-6xl font-bold')}
                  >
                    {text}
                  </h1>
                ))
                .with(2, () => (
                  <h2
                    id={text.toLowerCase().replace(/\s+/g, '-')}
                    className={cn('text-2xl md:text-5xl font-bold', className)}
                  >
                    {text}
                  </h2>
                ))
                .with(3, () => (
                  <h3
                    id={text.toLowerCase().replace(/\s+/g, '-')}
                    className={cn('text-xl md:text-4xl font-bold', className)}
                  >
                    {text}
                  </h3>
                ))
                .with(4, () => (
                  <h4
                    id={text.toLowerCase().replace(/\s+/g, '-')}
                    className={cn('text-lg md:text-3xl font-bold', className)}
                  >
                    {text}
                  </h4>
                ))
                .with(5, () => (
                  <h5
                    id={text.toLowerCase().replace(/\s+/g, '-')}
                    className={cn('text-md md:text-2xl font-bold', className)}
                  >
                    {text}
                  </h5>
                ))
                .with(6, () => (
                  <h6
                    id={text.toLowerCase().replace(/\s+/g, '-')}
                    className={cn('text-xs md:text-xl font-bold', className)}
                  >
                    {text}
                  </h6>
                ))
                .exhaustive();
            },
          )
          .with(
            {
              __t: 'text',
            },
            ({ text, className }) => {
              return (
                <p
                  className={cn(
                    'text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line',
                    className,
                  )}
                >
                  {text}
                </p>
              );
            },
          )
          .with(
            {
              __t: 'image',
            },
            ({ src, alt, className }) => {
              return (
                <img
                  src={src}
                  alt={alt}
                  className={cn('w-full max-w-md mx-auto my-4', className)}
                  loading="lazy"
                />
              );
            },
          )
          .with(
            {
              __t: 'link',
            },
            ({ label, url, className }) => {
              return (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'text-blue-600 hover:underline inline-flex items-center gap-1',
                    className,
                  )}
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
