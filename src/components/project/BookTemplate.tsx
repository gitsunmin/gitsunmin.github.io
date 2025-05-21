import { Page } from '@/components/project/Page';
import type { Project } from '@/data/projects';
import { TableOfContents } from '@/components/project/TableOfContents';

type Props = {
  project: Project;
};

export const BookTemplate = ({ project }: Props) => {
  const { id, name, introduce, book, work } = project;

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
        <h2 className="text-2xl md:text-4xl font-bold mb-4">목차</h2>

        <TableOfContents project={project} />
      </Page>

      <Page id={`${id}-intro`} label="Introduction">
        <h2 className="text-2xl md:text-4xl pb-4 font-bold">{name}</h2>
        {introduce}
      </Page>

      {work?.map((work) => {
        return (
          <div key={work.id}>
            <Page>
              <h2 className="text-2xl md:text-4xl pb-4 font-bold">
                {work.title}
              </h2>
              <br />
              <p>{work.introduce}</p>
              <br />
            </Page>

            <Page className="flex items-center justify-center">
              <h2 className="text-2xl md:text-5xl font-bold text-center">
                {work.title}
                <br />
                <br />
                <div className="text-3xl md:text-5xl animate-bounce">
                  기여도
                </div>
              </h2>
            </Page>

            {work.contribution.map((experience) => {
              return (
                <Page label={`${work.title} 기여도`} key={experience.id}>
                  <h2 className="text-2xl md:text-4xl mt-2 font-bold">
                    {experience.title}
                  </h2>
                  <br />
                  <p>{experience.description}</p>
                  <br />
                </Page>
              );
            })}

            <Page className="flex items-center justify-center">
              <h2 className="text-2xl md:text-5xl font-bold text-center">
                {work.title}
                <br />
                <br />
                <div className="text-3xl md:text-5xl animate-bounce">
                  트러블슈팅
                </div>
              </h2>
            </Page>

            {work.troubleshooting.map((troubleshooting) => {
              return (
                <div key={troubleshooting.id}>
                  <Page
                    label={work.title}
                    key={troubleshooting.id}
                    className="relative"
                  >
                    <h2 className="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-[50%] text-2xl md:text-4xl mt-2 font-bold text-center px-4 break-words w-full">
                      <div className="text-4xl animate-bounce">문제점</div>
                      <br />
                      {troubleshooting.title}
                    </h2>
                  </Page>
                  <Page label={troubleshooting.title}>
                    <h3 className="text-xl md:text-3xl font-bold">상세</h3>
                    <p>{troubleshooting.problem}</p>
                  </Page>
                  <Page label={troubleshooting.title}>
                    <h3 className="text-xl md:text-3xl font-bold">해결방법</h3>
                    <p>{troubleshooting.solution}</p>
                  </Page>
                  <Page label={troubleshooting.title}>
                    <h3 className="text-xl md:text-3xl font-bold">회고</h3>
                    <p>{troubleshooting.retrospect}</p>
                  </Page>
                </div>
              );
            })}
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
