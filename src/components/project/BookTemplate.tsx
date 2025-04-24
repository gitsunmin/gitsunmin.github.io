import { Page } from '@/components/project/Page';
import type { 프로젝트 } from '@/data/프로젝트';
import { TableOfContents } from '@/components/project/TableOfContents';

type Props = {
  프로젝트: 프로젝트;
};

export const BookTemplate = ({ 프로젝트 }: Props) => {
  const { id, 이름, 소개, 책, 작업 } = 프로젝트;

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

      <Page label="Table of Contents">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">목차</h2>

        <TableOfContents 프로젝트={프로젝트} />
      </Page>

      <Page id={`${id}-intro`} label="Introduction">
        <h2 className="text-2xl md:text-4xl pb-4 font-bold">{이름}</h2>
        {소개}
      </Page>

      {작업?.map((work) => {
        return (
          <div key={work.id}>
            <Page>
              <h2 className="text-2xl md:text-4xl pb-4 font-bold">
                {work.제목}
              </h2>
              <br />
              <p>{work.소개}</p>
              <br />
            </Page>

            <Page className="flex items-center justify-center">
              <h2 className="text-2xl md:text-5xl font-bold text-center">
                {work.제목}
                <br />
                <br />
                <div className="text-3xl md:text-5xl animate-bounce">
                  기여도
                </div>
              </h2>
            </Page>

            {work.기여도.map((경험) => {
              return (
                <Page label={`${work.제목} 기여도`} key={경험.id}>
                  <h2 className="text-2xl md:text-4xl mt-2 font-bold">
                    {경험.제목}
                  </h2>
                  <br />
                  <p>{경험.내용}</p>
                  <br />
                </Page>
              );
            })}

            <Page className="flex items-center justify-center">
              <h2 className="text-2xl md:text-5xl font-bold text-center">
                {work.제목}
                <br />
                <br />
                <div className="text-3xl md:text-5xl animate-bounce">
                  트러블슈팅
                </div>
              </h2>
            </Page>

            {work.트러블슈팅.map((트러블슈팅) => {
              return (
                <div key={트러블슈팅.id}>
                  <Page
                    label={work.제목}
                    key={트러블슈팅.id}
                    className="relative"
                  >
                    <h2 className="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-[50%] text-2xl md:text-4xl mt-2 font-bold text-center px-4 break-words w-full">
                      <div className="text-4xl animate-bounce">문제점</div>
                      <br />
                      {트러블슈팅.제목}
                    </h2>
                  </Page>
                  <Page label={트러블슈팅.제목}>
                    <h3 className="text-xl md:text-3xl font-bold">상세</h3>
                    <p>{트러블슈팅.문제점}</p>
                  </Page>
                  <Page label={트러블슈팅.제목}>
                    <h3 className="text-xl md:text-3xl font-bold">해결방법</h3>
                    <p>{트러블슈팅.해결방법}</p>
                  </Page>
                  <Page label={트러블슈팅.제목}>
                    <h3 className="text-xl md:text-3xl font-bold">회고</h3>
                    <p>{트러블슈팅.회고}</p>
                  </Page>
                </div>
              );
            })}
          </div>
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
