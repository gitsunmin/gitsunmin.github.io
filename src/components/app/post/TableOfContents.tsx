import React from 'react';
import styled from 'styled-components';

interface TableOfContentsProps {
  contents: string;
}

const StyledTOC = styled.div``;

const StyledDetails = styled.details``;

const TableOfContents: React.FC<TableOfContentsProps> = ({ contents }) => (
  <StyledDetails>
    <summary style={{ cursor: 'pointer' }}>
      <strong>목차 (TOC)</strong>
    </summary>
    <StyledTOC dangerouslySetInnerHTML={{ __html: contents }} />
  </StyledDetails>
);

export default TableOfContents;
