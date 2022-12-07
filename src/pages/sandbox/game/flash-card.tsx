import React from 'react';
import { PageProps } from 'gatsby';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

// Layout
import Layout from '@src/layouts/sandbox';

import { MenuTitle } from '@src/types/enums';
import { GAME_CONTENT_TITLE } from '@src/data/sandbox/game';

const StyledGridContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 4px;
`;

const StyledGridItem = styled.div`
  width: 100px;
  background: ${({ theme }) => theme.color.primary};
  border: 1px solid black;
  padding: 4px;
`;

const FlashCardPage = ({
  location,
}: PageProps<{}, object, { key: string; previousPath: string }>) => {
    const sampleCards = ['준', '비', '중', '입', '니', '다', '.'];

  return (
    <Layout location={location}>
      <Helmet title={`${MenuTitle.SANDBOX_GAME} - ${GAME_CONTENT_TITLE.FLASH_CARD}`} />
      <h1>{GAME_CONTENT_TITLE.FLASH_CARD}</h1>
      <StyledGridContainer>
        { sampleCards.map(sample => {
            return <>
                <StyledGridItem>{sample}</StyledGridItem>
            </>
        })}
      </StyledGridContainer>
    </Layout>
  );
};

export default FlashCardPage;
