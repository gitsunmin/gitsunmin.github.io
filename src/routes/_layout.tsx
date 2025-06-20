import { Header } from '@/components/Header';
import { Scaffold } from '@/components/Scaffold';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <Scaffold header={<Header />} className="pt-12 md:pt-16">
      <Outlet />
    </Scaffold>
  );
}
