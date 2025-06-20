import { createFileRoute } from '@tanstack/react-router';

import { InterviewPage } from '@/components/pages/interview';

export const Route = createFileRoute('/_layout/interview')({
  component: InterviewPage,
  errorComponent: undefined,
  notFoundComponent: undefined,
  pendingComponent: undefined
});
