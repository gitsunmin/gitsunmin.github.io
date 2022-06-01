import React from "react"
import styled from "styled-components"

import { theme } from "@src/styles/theme"
import { movePath } from "@src/utils"

const StyledChip = styled.span`
  height: ${theme.spacing(8)};
  background: ${theme.color.gainsboro};
  padding: ${theme.spacing(0)} ${theme.spacing(2)};
  margin-right: ${theme.spacing(2)};
  color: ${theme.color.grey};
  font-size: ${theme.fontSize(0)};
  :hover {
    cursor: pointer;
    color: ${theme.color.black};
  }
`

interface ChipProps {
  to?: string
  children: React.ReactNode
}

const Chip: React.FC<ChipProps> = ({ children, to }) => {
  const onClick = () => {
    to && movePath(to)
  }
  return <StyledChip onClick={onClick}>{children}</StyledChip>
}

export default Chip
