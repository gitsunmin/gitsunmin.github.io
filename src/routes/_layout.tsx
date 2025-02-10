import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Scaffold } from '@/components/Scaffold';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Scaffold header={<Header />} footer={<Footer />}>
      <Outlet />
    </Scaffold>
  );
}
