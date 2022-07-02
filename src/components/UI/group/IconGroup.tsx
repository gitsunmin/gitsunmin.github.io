import React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  display: flex;
  margin-top: ${({ theme }) => theme.spacing(2)};
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(2)};
`;

interface IconGroupProps {
  children: React.ReactNode;
}

const IconGroup: React.FC<IconGroupProps> = ({ children }) => {
  return <StyledCard>{children}</StyledCard>;
};

export default IconGroup;
