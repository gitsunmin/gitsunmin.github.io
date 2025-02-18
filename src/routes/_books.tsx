import { Header } from '@/components/Header';
import { Scaffold } from '@/components/Scaffold';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_books')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Scaffold header={<Header />} variant="book">
      <Outlet />
    </Scaffold>
  );
}
