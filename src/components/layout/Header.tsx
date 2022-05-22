import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"

import { media } from "@src/styles/media"

const StyledHeader = styled.header`
  position: relative;
  top: 0;

  .static-image {
    max-height: 500px;
    text-algin: center;
    width: 100%;
    vertical-align: middle;
  }
`

const StyledHeaderText = styled.h1`
  text-shadow: 6px 2px 2px white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--fontSize-7);
  ${media.phone`
      top: 30%;
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
