import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './globals.css';

import { routeTree } from './routeTree.gen';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DefaultPending } from '@/components/DefaultPending';
import { DefaultError } from './components/DefaultError';

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  basepath: '/i/',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={router}
          defaultErrorComponent={DefaultError}
          defaultNotFoundComponent={() => <>404</>}
          defaultPendingComponent={DefaultPending}
        />
        <ReactQueryDevtools initialIsOpen={true} client={queryClient} />
      </QueryClientProvider>
    </StrictMode>
  );
}
