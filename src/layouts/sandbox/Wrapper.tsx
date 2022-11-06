import React from 'react';

import styled from 'styled-components';

const StyledWrapper = styled.main`
`;

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <StyledWrapper>{children}</StyledWrapper>;
};

export default Wrapper;
