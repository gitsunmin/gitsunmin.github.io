import React from "react"
import styled from "styled-components"
import { theme } from '@src/styles/theme'

const StyledCard = styled.div`
  display: flex;
  margin-top: ${theme.spacing(2)};
  flex-direction: row;
  gap: 10px;
  svg, img:hover {
    cursor: pointer;
  }
`

interface SocialGroupProps {
  children: React.ReactNode
}

const SocialGroup: React.FC<SocialGroupProps> = ({ children }) => {
  return <StyledCard>{children}</StyledCard>
}

export default SocialGroup
