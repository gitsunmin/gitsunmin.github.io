import * as React from "react"
import styled from "styled-components"

const StyledFooter = styled.footer`
  background: ${({ theme }) => theme.color.primary};
  text-align: center;
  position: fixed;
  bottom: 0;
  width:100%;
`

const Footer: React.FC = ({}) => {
  return (
    <StyledFooter>
      © {new Date().getFullYear()}, Built with
      <a href="https://www.gatsbyjs.com"> Gatsby</a>
    </StyledFooter>
  )
}

export default Footer
