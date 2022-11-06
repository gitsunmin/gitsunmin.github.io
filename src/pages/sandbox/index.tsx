import React from 'react';
import { graphql, PageProps, Link } from 'gatsby';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import { GameController } from '@styled-icons/ionicons-solid/GameController';
import { Lab } from '@styled-icons/icomoon/Lab';

// Layout
import Layout from '@src/layouts/sandbox';

import { theme } from '@src/styles/theme';

import { SandBoxPageQuery } from '@src/types/gatsby-graphql';

const StyledHeader = styled.header`
  margin: ${({ theme }) => theme.spacing(2) };
`;

const StyledNavigation = styled.nav`
  margin: ${({ theme }) => theme.spacing(2) };
`;

const StyledIconWrapper = styled.span`
  padding-right: ${({ theme }) => theme.spacing(2) };
`

const SandBoxPage = ({
  location,
}: PageProps<SandBoxPageQuery, object, { key: string; previousPath: string }>) => {
  return (
    <Layout location={location}>
      <Helmet title="샌드박스" />
      <StyledHeader>
        <h1>샌드박스</h1>
      </StyledHeader>
      <StyledNavigation>
        <ul>
          <li>
            <StyledIconWrapper>
              <GameController size={24} color={theme.color.black} />
            </StyledIconWrapper>
            <Link to='/sandbox/game'>
              Game
            </Link>
          </li>
          <li>
            <StyledIconWrapper>
              <Lab size={24} color={theme.color.black} />
            </StyledIconWrapper>
            <Link to='/sandbox/lab'>
              Lab
            </Link>
          </li>
        </ul>
      </StyledNavigation>
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
