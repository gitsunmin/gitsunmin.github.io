import {
  createRootRoute,
  Outlet,
  useRouterState
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { HeadContent } from '@tanstack/react-router';
import { Spinner } from '@/components/Spinner';
import { createPortal } from 'react-dom';

const RouterSpinner = () => {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' });
  return <Spinner show={isLoading} />;
};

export function HeadPortal() {
  return createPortal(<HeadContent />, document.head);
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        name: 'description',
        content: "Gitsunmin's website | 김선민의 웹사이트"
      },
      {
        title: 'Gitsunmin'
      }
    ]
  }),
  pendingComponent: () => <RouterSpinner />,
  component: () => {
    return (
      <>
        <HeadPortal />
        <Outlet />
        {__MODE__ === 'development' && <TanStackRouterDevtools />}
      </>
    );
  }
});
