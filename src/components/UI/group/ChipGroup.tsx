import React from "react"
import styled from "styled-components"
import { theme } from "@src/styles/theme"
import { Tags } from "@styled-icons/fa-solid/Tags"

const StyledChipGroup = styled.span``

const StyledTagsIcon = styled(Tags)`
  margin-right: 10px;
`

interface ChipGroupProps {
  children: React.ReactNode
}

const ChipGroup: React.FC<ChipGroupProps> = ({ children }) => (
  <StyledChipGroup>
    <StyledTagsIcon size={theme.fontSize(1)} color={theme.color.gainsboro} />
    <span>{children}</span>
  </StyledChipGroup>
)

export default ChipGroup
