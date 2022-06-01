import React from "react"

import styled from "styled-components"
import { theme } from "@src/styles/theme"

const StyledWrapper = styled.main`
  margin: 0 auto;
  max-width: ${theme.maxWidth("wrapper")};
  padding: ${theme.spacing(10)} ${theme.spacing(5)};
  margin-bottom: ${theme.spacing(20)};
`

interface WrapperProps {
  children: React.ReactNode
}

const Wrapper: React.FC<WrapperProps> = ({
  children,
}) => {
  return <StyledWrapper>{children}</StyledWrapper>
}

export default Wrapper
