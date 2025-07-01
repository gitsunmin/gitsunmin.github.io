import { Page } from '@/components/experiencies/Page';
import type { Experience } from '@/data/experiencies/index';
import { TableOfContents } from '@/components/experiencies/TableOfContents';

type Props = {
  experience: Experience;
};

export const ExperienceTemplate = ({ experience }: Props) => {
  const { name, book, content } = experience;

  return (
    <article className="snap-y snap-mandatory h-[calc(100dvh-48px)] md:h-[calc(100dvh-64px)] overflow-y-scroll w-full">
      <Page variant="cover">
        <img
          src={book.cover.front}
          loading="lazy"
          className="w-full max-h-[80dvh] object-contain"
          alt="식봄 프로젝트 정면 표지"
          aria-label="식봄 프로젝트 정면 표지"
        />
      </Page>

      <Page className="flex items-center justify-center">
        <h1 className="text-3xl md:text-6xl font-bold my-6">{name}</h1>
      </Page>

      <Page label="Table of Contents">
        <TableOfContents experience={experience} />
      </Page>

      <Page className="flex justify-start py-20">{content}</Page>

      <Page variant="cover">
        <img
          src={book.cover.back}
          loading="lazy"
          className="w-full max-h-[80dvh] object-contain"
          alt="식봄 프로젝트 정면 표지"
          aria-label="식봄 프로젝트 정면 표지"
        />
      </Page>
    </article>
  );
};
