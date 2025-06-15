import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { HeadContent } from '@tanstack/react-router';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        name: 'description',
        content: "Gitsunmin's website | 김선민의 웹사이트",
      },
      {
        title: 'Gitsunmin',
      },
    ],
  }),
  component: () => {
    return (
      <>
        <HeadContent />
        <Outlet />
        {__MODE__ === 'development' && <TanStackRouterDevtools />}
      </>
    );
  },
});
