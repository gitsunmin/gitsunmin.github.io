import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <Outlet />
        {__MODE__ === 'development' && <TanStackRouterDevtools />}
      </>
    );
  },
});
