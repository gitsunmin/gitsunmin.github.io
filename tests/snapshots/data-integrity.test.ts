import { describe, it, expect } from 'vitest';
import { CareersPage } from '@/components/pages/Careers';
import { render } from '@testing-library/react';
import { ExperienciesPage } from '@/components/pages/experiencies';
import { InterviewPage } from '@/components/pages/interview';

describe('data-integrity', () => {
  it('Careers Page Snapshot Test', () => {
    expect(render(CareersPage())).toMatchSnapshot();
  });

  it('Interview Page Snapshot Test', () => {
    expect(render(InterviewPage())).toMatchSnapshot();
  });

  it('Experiencies Page Snapshot Test', () => {
    expect(render(ExperienciesPage())).toMatchSnapshot();
  });
});
