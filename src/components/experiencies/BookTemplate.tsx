import { Page } from '@/components/experiencies/Page';
import type { Experience } from '@/data/experiencies';
import { TableOfContents } from '@/components/experiencies/TableOfContents';

type Props = {
  experience: Experience;
};

export const BookTemplate = ({ experience }: Props) => {
  const { id, name, introduce, book, contents } = experience;

  return (
    <article className="snap-y snap-mandatory h-[100dvh] overflow-y-scroll">
      <Page variant="cover">
        <img
          src={book.cover.front}
          loading="lazy"
          alt="식봄 프로젝트 정면 표지"
          aria-label="식봄 프로젝트 정면 표지"
        />
      </Page>

      <Page className="flex items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-bold">{name}</h1>
      </Page>

      <Page label="Table of Contents">
        <TableOfContents experience={experience} />
      </Page>

      <Page id={`${id}-intro`} label="Introduction">
        <h2 className="text-2xl md:text-4xl pb-4 font-bold">{name}</h2>
        {introduce}
      </Page>

      {contents?.map(({ id, title, content }) => {
        return (
          <div key={id}>
            <Page className="flex items-center justify-center">
              <h2 className="text-2xl md:text-5xl font-bold text-center">
                {title}
              </h2>
            </Page>

            <Page className="flex items-center justify-center">
              <div className="text-md md:text-5xl">{content}</div>
            </Page>
          </div>
        );
      })}

      <Page variant="cover">
        <img
          src={book.cover.back}
          loading="lazy"
          alt="식봄 프로젝트 정면 표지"
          aria-label="식봄 프로젝트 정면 표지"
        />
      </Page>
    </article>
  );
};
