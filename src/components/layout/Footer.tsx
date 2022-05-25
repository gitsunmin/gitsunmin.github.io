import * as React from "react"
import styled from "styled-components"

const StyledFooter = styled.footer`
  background: linear-gradient(
    0,
    ${({ theme }) => theme.color.primary},
    ${({ theme }) => theme.color.white}
  );
  text-align: center;
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
