import React from 'react';
import { graphql, PageProps } from 'gatsby';
import { Helmet } from 'react-helmet';
// Layout
import Layout from '@src/layouts/sandbox';


const SandBoxGameAAAPage = ({
  location,
}: PageProps) => {
  return (
      <><Helmet title="샌드박스222" /><h1>준비중입니다2222.</h1></>
  );
};

export default SandBoxGameAAAPage;
