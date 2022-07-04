import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';
import { Hamburger } from '@styled-icons/fa-solid/Hamburger';
import { theme } from '@src/styles/theme';

import Button from '@src/components/UI/Button';

const StyledNavigation = styled.nav`
  position: fixed;
  top: 10px;
  right: 10px;
  text-align: right;
  z-index: 100000;
`;

interface NavigationProps {
  onClickButton?: (event) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onClickButton }) => {
  return (
    <StyledNavigation>
      <Button backgroundColor="transparent" onClick={onClickButton}>
        <Hamburger size={theme.spacing(8)} />
      </Button>
    </StyledNavigation>
  );
};

export default Navigation;
