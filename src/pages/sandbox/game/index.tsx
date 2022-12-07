import React from 'react';
import { PageProps, Link } from 'gatsby';
import { Helmet } from 'react-helmet';
// Layout
import Layout from '@src/layouts/sandbox';

import { MenuTitle } from '@src/types/enums';
import { GAME_CONTENTS } from '@src/data/sandbox/game';

const GameIndexPage = ({
  location,
}: PageProps<{}, object, { key: string; previousPath: string }>) => {
  return (
    <Layout location={location}>
      <Helmet title={`${MenuTitle.SANDBOX} - ${MenuTitle.SANDBOX_GAME}`} />
      <h1>{MenuTitle.SANDBOX_GAME}</h1>
      <ul>
        {GAME_CONTENTS.map((content) => (
          <>
            <li>
                <Link to={content.url}>{content.title}</Link>
            </li>
          </>
        ))}
      </ul>
    </Layout>
  );
};

export default GameIndexPage;
