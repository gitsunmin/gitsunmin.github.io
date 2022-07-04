import React from 'react';
import styled from 'styled-components';

import { movePath } from '@src/utils';

const StyledChip = styled.span`
  height: ${({ theme }) => theme.spacing(5)};
  background: ${({ theme }) => theme.color.gainsboro};
  padding: ${({ theme }) => theme.spacing(0)} ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.color.grey};
  font-size: ${({ theme }) => theme.fontSize(0)};

  :hover {
    cursor: pointer;
    color: ${({ theme }) => theme.color.primary};
    font-weight: bold;
    background: ${({ theme }) => theme.color.whiteDarker};
  }
`;

interface ChipProps {
  to?: string;
  children: React.ReactNode;
}

const Chip: React.FC<ChipProps> = ({ children, to }) => {
  const onClick = () => {
    to && movePath(to);
  };
  return <StyledChip onClick={onClick}>{children}</StyledChip>;
};

export default Chip;
