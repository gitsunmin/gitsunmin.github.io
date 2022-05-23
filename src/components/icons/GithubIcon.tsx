import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

interface GithubIconProps {
  onClick?: () => void
}

const GithubIcon: React.FC<GithubIconProps> = ({ onClick = () => {} }) => {
  return (
    <span onClick={onClick} className="pointer">
      <StaticImage
        src="./../../images/icons/github.svg"
        width={24}
        height={24}
        alt="github"
      />
    </span>
  )
}

export default GithubIcon
