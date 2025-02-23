import { createFileRoute } from "@tanstack/react-router";
import FoodSpringProject from "@/docs/projects/foodspring.mdx";

import FoodSpringBookCover from "@/assets/book_foodspring_front_cover.webp";
import FoodSpringBookCoverBack from "@/assets/book_foodspring_back_cover.webp";
import { Page } from "@/components/Page";
import { CodeBlockWrapper } from "@/components/Codeblock";

export const Route = createFileRoute("/_books/projects/foodspring")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Page variant="cover">
        <img
          src={FoodSpringBookCover}
          alt="식봄 프로젝트 정면 표지"
          aria-label="식봄 프로젝트 정면 표지"
        />
      </Page>
      <FoodSpringProject
        components={{
          h1: (props) => (
            <h1 className="text-6xl pb-2 text-center" {...props} />
          ),
          h2: (props) => <h2 className="text-5xl pb-2" {...props} />,
          h3: (props) => <h3 className="text-4xl pb-2" {...props} />,
          h4: (props) => <h4 className="text-3xl pb-1" {...props} />,
          h5: (props) => <h5 className="text-2xl pb-1" {...props} />,
          h6: (props) => <h6 className="text-xl pb-1" {...props} />,
          p: (props) => <p className="" {...props} />,
          ol: (props) => <ol className="list-decimal list-inside" {...props} />,
          ul: (props) => <ul className="list-disc list-inside" {...props} />,
          li: (props) => <li className="ml-4" {...props} />,
          pre: (el) => {
            const preComponent = el.children as unknown as {
              props: {
                className: string;
                children: string;
              };
            };
            const { className, children: code } = preComponent.props;

            return (
              <CodeBlockWrapper
                languege={
                  className?.split("-").slice(1).join("") ?? "javascript"
                }
                code={code}
              />
            );
          },
        }}
      />

      <Page variant="cover">
        <img
          src={FoodSpringBookCoverBack}
          alt="식봄 프로젝트 정면 표지"
          aria-label="식봄 프로젝트 정면 표지"
        />
      </Page>
    </>
  );
}
