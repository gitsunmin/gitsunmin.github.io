import React from "react"
import styled from "styled-components"
import { theme } from "@src/styles/theme"
import { Tags } from "@styled-icons/fa-solid/Tags"

const StyledChipGroup = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: inherit;
  gap: ${theme.spacing(2)}
`

const StyledTagsIcon = styled(Tags)`
`

interface ChipGroupProps {
  children: React.ReactNode
}

const ChipGroup: React.FC<ChipGroupProps> = ({ children }) => (
  <StyledChipGroup>
    <StyledTagsIcon size={theme.fontSize(2)} color={theme.color.gainsboro} />
    {children}
  </StyledChipGroup>
)

export default ChipGroup
