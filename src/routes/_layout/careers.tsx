import { 경력 } from '@/data/회사';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/careers')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ul className="flex flex-col gap-8 pt-8">
      {경력.map((회사) => {
        return (
          <li
            key={회사.이름}
            className="p-6 rounded-xl border shadow-sm bg-white flex flex-col gap-4"
          >
            {/* 헤더: 로고 + 회사명 + 직책/기간 */}
            <div className="flex items-start justify-start gap-x-4">
              <img
                src={회사.로고}
                alt={`${회사.이름} 로고`}
                className="rounded-full size-12 border"
              />
              <div>
                <h2 className="text-xl font-bold">{회사.이름}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {회사.직책} | {회사.기간}
                </p>
              </div>
            </div>

            {/* 주의사항 */}
            {회사.주의 && <p className="text-sm text-red-500">* {회사.주의}</p>}

            {/* 회사 소개 */}
            <section className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
              {회사.소개}
            </section>

            {/* 프로젝트 섹션 */}
            <section>
              <h6 className="mt-2 font-semibold text-sm text-gray-700">
                Projects
              </h6>
              <ul className="list-disc ml-5 text-sm mt-1">
                {회사.프로젝트들.map(({ id, 이름 }) => (
                  <li key={id}>{이름}</li>
                ))}
              </ul>
            </section>

            {/* 링크 섹션 */}
            <section>
              <h6 className="mt-2 font-semibold text-sm text-gray-700">
                Links
              </h6>
              <ul className="list-disc ml-5 text-sm mt-1 space-y-1">
                {회사.링크들.map(({ label, url }) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      {label}
                      <span>↗</span>
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
