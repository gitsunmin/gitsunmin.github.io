import { 경력들 } from '@/data/경력';

export const Article_경력 = () => {
  return (
    <div className="flex justify-center">
      <div className="max-w-[1000px] mx-auto">
        <ul>
          {경력들.map((회사) => {
            return (
              <li>
                <h2 className="text-2xl">
                  <span className="font-bold">{회사.이름} </span>
                  <span>{회사.기간}</span>
                </h2>
                <section>
                  <div>{회사.주의 && <span>* {회사.주의}</span>}</div>
                </section>
                <section>
                  <div>{회사.직책}</div>
                </section>
                <section>
                  <p>{회사.소개}</p>
                </section>
                <section>
                  <ul>
                    <li>asiodjoiasjd</li>
                  </ul>
                </section>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
