import React from 'react';

import styled from 'styled-components';

const StyledWrapper = styled.main`
  padding: 0 ${({ theme }) => theme.spacing(8)} 0 ${({ theme }) => theme.spacing(8)};
`;

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <StyledWrapper>{children}</StyledWrapper>;
};

export default Wrapper;
