import React from 'react';
import { graphql, PageProps } from 'gatsby';
import { Helmet } from 'react-helmet';
// Layout
import Layout from '@src/layouts/sandbox';

import { SandBoxPageQuery } from '@src/types/gatsby-graphql';

const SandBoxPage = ({
  data,
  location,
}: PageProps<SandBoxPageQuery, object, { key: string; previousPath: string }>) => {
  return (
    <Layout location={location}>
      <Helmet title="샌드박스" />
      <h1>준비중입니다.</h1>
    </Layout>
  );
};

export default SandBoxPage;

export const pageQuery = graphql`
  query SandBoxPage {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
