import React from 'react';
import styled from 'styled-components';

interface CardProps {
  to?: string;
  children: React.ReactNode;
}

const StyledCard = styled.div`
  border: 1px solid ${({ theme }) => theme.color.gainsboro };
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.spacing(2)} 0 0 0;
`;

const Card: React.FC<CardProps> = ({ children }) => {
  return <StyledCard>
    {children}
  </StyledCard>
};

export default Card;
