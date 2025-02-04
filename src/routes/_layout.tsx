import { Header } from '@/components/Header'
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
    const routerState = useRouterState();
    console.log('routerState:', routerState);

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
