import React from "react"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"
import styled from "styled-components"

const StyledAvatar = styled.div`
  img {
    margin-right: var(--spacing-4);
    margin-bottom: var(--spacing-0);
    min-width: 50px;
    border-radius: 100%;
    -webkit-border-radius: 100%;
  }
`

interface AvatarProps {
  image?: IGatsbyImageData
}

const Avatar: React.FC<AvatarProps> = ({ image }) => {
  return (
    <StyledAvatar>
      <GatsbyImage image={getImage(image)} alt="Profile picture" />
    </StyledAvatar>
  )
}

export default Avatar
