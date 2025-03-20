import { Page } from '@/components/project/Page';
import { 프로젝트 } from '@/data/프로젝트';
import { Skills } from '@/components/project/Skills';
import { Link } from '@tanstack/react-router';

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

      <Page>
        <h2 className="text-2xl md:text-4xl font-bold mb-4">목차</h2>

        <ol className="list-decimal pl-5 space-y-2">
          <li className="font-semibold">
            <Link
              hash={`${id}-intro`}
              to=""
              className="font-semibold"
              hashScrollIntoView={{
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
              }}
            >
              {이름} 소개
            </Link>
          </li>

          {작업?.map((work) => (
            <li key={work.id} className="space-y-2">
              <Link
                to=""
                hash={work.id}
                className="font-semibold"
                hashScrollIntoView
              >
                {work.제목}
              </Link>
              <ol className="list-disc pl-5 space-y-1">
                <li>
                  <Link
                    to=""
                    hash={`${work.id}-contribution`}
                    className="font-medium"
                  >
                    기여도
                  </Link>
                  <ol className="list-circle pl-6 space-y-1">
                    {work.기여도.map((경험) => (
                      <li key={경험.id} className=" space-y-1">
                        <Link to="" hash={경험.id}>
                          {경험.제목}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </li>
                <li>
                  <Link
                    to=""
                    hash={`${work.id}-troubleshooting`}
                    className="font-medium"
                  >
                    트러블슈팅
                  </Link>
                  <ol className="list-circle pl-6 space-y-1">
                    {work.트러블슈팅.map((트러블슈팅) => (
                      <li key={트러블슈팅.id} className=" space-y-1">
                        <Link to="" hash={트러블슈팅.id}>
                          {트러블슈팅.문제점}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </li>
              </ol>
            </li>
          ))}
        </ol>
      </Page>

      <Page id={`${id}-intro`}>
        <h2 className="text-2xl md:text-4xl pb-4 font-bold">{이름}</h2>
        {소개}
      </Page>

      {작업?.map((work) => {
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

            {work.기여도.map((경험) => {
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
