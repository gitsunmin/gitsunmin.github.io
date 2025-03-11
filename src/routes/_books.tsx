import { Button } from '@/components/Button';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/_books')({
  component: RouteComponent,
});

function RouteComponent() {
  const handleBack = () => {
    window.history.back();
  };
  return (
    <>
      <Button
        variant="ghost"
        className="shadow-lg rounded-full absolute top-2 left-4 bg-background"
        onClick={handleBack}
      >
        <ArrowLeft />
      </Button>
      <Outlet />
    </>
  );
}
