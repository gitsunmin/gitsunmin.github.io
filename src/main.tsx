import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import '@/globals.css';

import { routeTree } from '@/routeTree.gen';

import { DefaultPending } from '@/components/DefaultPending';
import { DefaultError } from '@/components/DefaultError';
import { Default404 } from '@/components/Default404';
import { DarkModeProvider } from '@/providers/DarkModeProvider';
import { FontSizeProvider } from './providers/FontSizeContext';

const router = createRouter({
  routeTree,
  basepath: '/',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <DarkModeProvider>
        <FontSizeProvider>
          <RouterProvider
            router={router}
            defaultErrorComponent={DefaultError}
            defaultNotFoundComponent={Default404}
            defaultPendingComponent={DefaultPending}
          />
        </FontSizeProvider>
      </DarkModeProvider>
    </StrictMode>,
  );
}
