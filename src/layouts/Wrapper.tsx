import React from 'react';

import styled from 'styled-components';

const StyledWrapper = styled.main`
  margin: 0 auto;
  max-width: ${({ theme }) => theme.maxWidth('wrapper')};
  padding: ${({ theme }) => theme.spacing(10)} ${({ theme }) => theme.spacing(5)};
  margin-bottom: ${({ theme }) => theme.spacing(20)};
`;

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <StyledWrapper>{children}</StyledWrapper>;
};

export default Wrapper;
