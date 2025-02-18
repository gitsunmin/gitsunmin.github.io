import { 경력 } from '@/data/회사';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/careers')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ul className="flex flex-col gap-12">
      {경력.map((회사) => {
        return (
          <li className="flex flex-col gap-2">
            <h5 className="flex justify-between items-center">
              <span className="text-2xl font-bold">{회사.이름} </span>
              <span className="max-w-12 max-h-12 text-sm flex items-center justify-center rounded-full shadow-md">
                <img
                  src={회사.로고}
                  alt={`${회사.이름} 로고`}
                  className="rounded-full size-12"
                />
              </span>
            </h5>
            <section>
              {회사.주의 && (
                <span className="text-red-500 text-sm">* {회사.주의}</span>
              )}
            </section>
            <section className="text-gray-500">
              {회사.직책} | {회사.기간}
            </section>
            <section>
              <p>{회사.소개}</p>
            </section>
            <section>
              <h6>Projects</h6>
              {
                <ul>
                  {회사.프로젝트들.map(({ id, 이름 }) => (
                    <li key={id} className="ml-4 list-disc">
                      {이름}
                    </li>
                  ))}
                </ul>
              }
            </section>
            <section>
              <h6>Links</h6>
              <ul>
                {회사.링크들.map(({ label, url }) => (
                  <li key={url} className="ml-4 list-disc">
                    <a
                      href={url}
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </li>
        );
      })}
    </ul>
  );
}
