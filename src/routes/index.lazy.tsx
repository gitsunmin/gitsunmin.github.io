import { createLazyFileRoute, Link } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index,
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
      </ul>
    </div>
  );
}
