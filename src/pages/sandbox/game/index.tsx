import React from 'react';
import { graphql, PageProps } from 'gatsby';
import { Helmet } from 'react-helmet';
// Layout
import Layout from '@src/layouts/sandbox';

const GameIndexPage = ({
    location,
}: PageProps<{}, object, { key: string; previousPath: string }>) => {
    return (
        <Layout location={location}>
            <Helmet title="샌드박스 - Game" />
            <h1>Game</h1>
            <div>준비중입니다.</div>
        </Layout>
    );
};

export default GameIndexPage;
