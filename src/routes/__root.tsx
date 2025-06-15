import {
  createRootRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { HeadContent } from '@tanstack/react-router';
import { Spinner } from '@/components/Spinner';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const RouterSpinner = () => {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' });
  return <Spinner show={isLoading} />;
};

export function HeadPortal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(<HeadContent />, document.head) : null;
}

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
  pendingComponent: () => <RouterSpinner />,
  component: () => {
    return (
      <>
        <HeadPortal />
        <Outlet />
        {__MODE__ === 'development' && <TanStackRouterDevtools />}
      </>
    );
  },
});
