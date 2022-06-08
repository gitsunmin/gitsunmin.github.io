import React from "react"
import styled from "styled-components"

interface TableOfContentsProps {
  contents: string
}

const StyledTOC = styled.div`
  padding-left: 20px;
  ul {
    margin-left: "0px";

    li {
      color: ${props => props.theme.color.primary};
      p {
        a {
          decoration: none;
        }
      }
    }
  }
`

const StyledDetails = styled.details`
  padding-left: 10px;
  margin-bottom: 20px;
`

const TableOfContents: React.FC<TableOfContentsProps> = ({ contents }) => (
  <>
    <StyledDetails>
      <summary style={{ cursor: "pointer" }}>
        <strong>목차 (TOC)</strong>
      </summary>
      <StyledTOC dangerouslySetInnerHTML={{ __html: contents }} />
    </StyledDetails>
  </>
)

export default TableOfContents
