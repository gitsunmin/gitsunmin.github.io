import { Page } from '@/components/project/Page';
import { 프로젝트 } from '@/data/프로젝트';
import { Skills } from '@/components/project/Skills';

type Props = {
  프로젝트: 프로젝트;
};

export const BookTemplate = ({ 프로젝트 }: Props) => {
  const { 이름, 소개, 책, 업적 } = 프로젝트;
  return (
    <article className="snap-y snap-mandatory h-[100dvh] overflow-y-scroll">
      <Page variant="cover">
        <img
          src={책.표지.앞}
          loading="lazy"
          alt="식봄 프로젝트 정면 표지"
          aria-label="식봄 프로젝트 정면 표지"
        />
      </Page>

      <Page className="flex items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-bold">{이름}</h1>
      </Page>

      <Page>
        <h2 className="text-2xl md:text-4xl font-bold">목차</h2>
      </Page>

      <Page>
        <h2 className="text-2xl md:text-4xl pb-4 font-bold">{이름} 소개</h2>
        {소개}
      </Page>

      {업적?.map((work) => {
        return (
          <>
            <Page>
              <h2 className="text-2xl md:text-4xl pb-4 font-bold">
                {work.제목}
              </h2>
              <br />
              <p>{work.소개}</p>
              <br />
              <Skills list={work.기술} />
            </Page>

            {work.경험.map((경험) => {
              return (
                <Page label={work.제목} key={경험.id}>
                  <h2 className="text-2xl md:text-4xl mt-2 font-bold">
                    {경험.제목}
                  </h2>
                  <br />
                  <p>{경험.내용}</p>
                  <br />
                </Page>
              );
            })}
          </>
        );
      })}

      <Page variant="cover">
        <img
          src={책.표지.뒤}
          loading="lazy"
          alt="식봄 프로젝트 정면 표지"
          aria-label="식봄 프로젝트 정면 표지"
        />
      </Page>
    </article>
  );
};
