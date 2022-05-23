import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"

import { media } from "@src/styles/media"

const StyledHeader = styled.header`
  position: relative;
  overflow: hidden;
  max-height: 500px;
  border-radius: 0 0 2.5vw 2.5vw;
  -webkit-border-radius: 0 0 2.5vw 2.5vw;

  ${media.phone`
    max-height: 100px;
  `}
  .static-image {
    transform: translateY(-30%);
    max-height: initial;
    width: 100%;
    ${media.phone`
      width: 100%;
    `}
  }
`

const StyledHeaderText = styled.h1`
  text-shadow: 6px 2px 2px white;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--fontSize-7);
  ${media.phone`
      top: -30%;
      left: 40%;
      font-size: var(--fontSize-1);
      transform: none;
    `}
`

interface HeaderProps {
  title: string
  isRootPath: boolean
}

const Header: React.FC<HeaderProps> = ({ title, isRootPath }) => {
  // const header = isRootPath ? (
  //   <h1 className="main-heading">
  //     <Link to="/">{title}</Link>
  //   </h1>
  // ) : (
  //   <Link className="header-link-home" to="/">
  //     {title}
  //   </Link>
  // )

  return (
    <StyledHeader className="global-header">
      <StaticImage
        src="./../../images/common/header-background.png"
        alt="header-background.png"
        height={1000}
        className="static-image"
      />
      <StyledHeaderText>
        <Link to="/">{title}</Link>
      </StyledHeaderText>
    </StyledHeader>
  )
}

export default Header
