import * as React from "react"
import styled from "styled-components"

import GithubIcon from "@components/icons/GithubIcon"

const StyledCard = styled.div({
  padding: 5,
})

interface SocialNavigationProps {
  social: {
    github: string
  }
}

const SocialNavigation: React.FC<SocialNavigationProps> = ({ social }) => {
  return (
    <StyledCard>
      <GithubIcon
        onClick={() => {
          social.github && window.open(social.github, "_blank")
        }}
      />
    </StyledCard>
  )
}

export default SocialNavigation
