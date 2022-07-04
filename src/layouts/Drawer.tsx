import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import styled from 'styled-components';
import kebabCase from 'lodash/kebabCase';

import Bio from '@components/app/bio';
import ChipGroup from '@components/UI/group/ChipGroup';
import Chip from '@components/UI/Chip';
import TreeView from '@components/UI/TreeView';

import { MENU } from '@src/data';

const StyledDrawer = styled.div<{ width: string; open: boolean }>`
  position: fixed;
  top: 0;
  z-index: 99999;

  background-color: #fff;
  border-left: 1px solid black;
  height: 100%;

  transition: right 0.5s cubic-bezier(0.82, 0.085, 0.395, 0.895);

  width: ${(props) => props.width};
  right: -${(props) => props.width};
  ${(props) => (props.open ? `right: 0;` : `right: -${props.width}`)};
`;

const StyledDrawerHeader = styled.header`
  height: 50px;
`;

const StyledDrawerWrapper = styled.div`
  height: 100%;
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
`;

interface DrawerProps {
  open?: boolean;
  width?: string;
  onClose?: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ open = true, width = '300px', onClose = () => {} }) => {
  const data = useStaticQuery(graphql`
    query AllTagsQuery {
      allMarkdownRemark {
        nodes {
          frontmatter {
            tags
          }
        }
      }
    }
  `);

  const tagList = [
    ...new Set<string>(data?.allMarkdownRemark.nodes.map((post) => post.frontmatter.tags).flat()),
  ];
  let touchX = 0;

  const onTouchStart = (event) => {
    const myTouch = event.touches[0];
    const x = myTouch?.pageX ?? 0;
    touchX = x;
  };

  const onTouchEnd = (event) => {
    const myTouch = event.changedTouches[0];
    const x = myTouch?.pageX ?? 0;
    if (touchX < x) {
      onClose();
    } else {
      // open
    }
  };

  return (
    <>
      <StyledDrawer width={width} open={open} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <StyledDrawerHeader></StyledDrawerHeader>
        <hr />
        <StyledDrawerWrapper>
          <Bio />
          <h4>Menu</h4>
          <TreeView nodes={MENU} />
          <h4>All Tags</h4>
          <ChipGroup>
            {tagList.map((tag, index) => {
              return (
                <Chip key={index} to={`/tag/${kebabCase(tag)}`}>
                  {tag}
                </Chip>
              );
            })}
          </ChipGroup>
        </StyledDrawerWrapper>
      </StyledDrawer>
    </>
  );
};

export default Drawer;
