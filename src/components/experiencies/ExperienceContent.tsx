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
        className="w-full"
      >
        {match(content)
          .with(
            {
              __t: 'headline'
            },
            ({ __t, text, level, className }) => {
              const id = `${__t}-${level}-${text.toLowerCase().replace(/\s+/g, '-')}`;

              return match(level)
                .with(1, () => (
                  <h1 id={id} className={cn('text-heading-1')}>
                    {text}
                  </h1>
                ))
                .with(2, () => (
                  <h2 id={id} className={cn('text-heading-2', className)}>
                    {text}
                  </h2>
                ))
                .with(3, () => (
                  <h3 id={id} className={cn('text-heading-3', className)}>
                    {text}
                  </h3>
                ))
                .with(4, () => (
                  <h4 id={id} className={cn('text-heading-4', className)}>
                    {text}
                  </h4>
                ))
                .with(5, () => (
                  <h5 id={id} className={cn('text-heading-5', className)}>
                    {text}
                  </h5>
                ))
                .with(6, () => (
                  <h6 id={id} className={cn('text-heading-6', className)}>
                    {text}
                  </h6>
                ))
                .exhaustive();
            }
          )
          .with(
            {
              __t: 'text'
            },
            ({ text, className }) => {
              return (
                <div
                  className={cn(
                    'text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line',
                    'min-w-full text-left',
                    'text-body-1',
                    className
                  )}
                >
                  {text}
                </div>
              );
            }
          )
          .with(
            {
              __t: 'image'
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
            }
          )
          .with(
            {
              __t: 'link'
            },
            ({ label, url, className, target }) => {
              return (
                <a
                  href={url}
                  target={target ?? '_blank'}
                  rel="noopener noreferrer"
                  className={cn(
                    'text-blue-600 hover:underline inline-flex items-center gap-1',
                    className
                  )}
                >
                  {label}
                  <span>↗</span>
                </a>
              );
            }
          )
          .exhaustive()}
      </div>
    );
  });
};
