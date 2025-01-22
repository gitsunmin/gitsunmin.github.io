import { createLazyFileRoute, Link } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index,
  errorComponent: undefined,
  notFoundComponent: undefined,
  pendingComponent: undefined,
});

function Index() {
  return (
    <div className="max-w-[1000px] mx-auto">
      <h1 className="text-4xl font-bold text-center">김선민</h1>
      <ul>
        <li>
          <Link to="/interview" className="[&.active]:font-bold">
            인터뷰
          </Link>
        </li>
        <li>
          <Link to="/careers" className="[&.active]:font-bold">
            경력
          </Link>
        </li>
        <li>
          <Link to="/til" className="[&.active]:font-bold">
            TIL
          </Link>
        </li>
      </ul>
    </div>
  );
}
