
import React from 'react';
import { graphql, PageProps } from 'gatsby';
import { Helmet } from 'react-helmet';
// Layout
import Layout from '@src/layouts/sandbox';


const SandBoxIndex2Page = ({
  location,
}: PageProps) => {
  return (
    <><Helmet title="SandBoxIndex2Page" /><h1>SandBoxIndex2Page.</h1></>
  );
};

export default SandBoxIndex2Page;
