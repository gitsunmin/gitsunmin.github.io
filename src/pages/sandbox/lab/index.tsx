import React from 'react';
import { PageProps } from 'gatsby';
import { Helmet } from 'react-helmet';
// Layout
import Layout from '@src/layouts/sandbox';

import { MenuTitle } from '@src/types/enums';

const LabIndexPage = ({
  location,
}: PageProps<{}, object, { key: string; previousPath: string }>) => {
  return (
    <Layout location={location}>
      <Helmet title={`${MenuTitle.SANDBOX} - ${MenuTitle.SANDBOX_LAB}`} />
      <h1>{MenuTitle.SANDBOX_LAB}</h1>
      <div>준비중입니다.</div>
    </Layout>
  );
};

export default LabIndexPage;
