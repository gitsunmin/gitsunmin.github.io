import { describe, it, expect } from 'vitest';
import { CareersPage } from '@/components/pages/Careers';
import { render } from '@testing-library/react';

describe('data-integrity', () => {
  it('Careers Page Snapshot Test', () => {
    expect(render(CareersPage())).toMatchSnapshot();
  });
});
