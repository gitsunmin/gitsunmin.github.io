import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import UAParser from "ua-parser-js"

import { media, viewSizes } from "@src/styles/media"
import { useState } from "react"

const StyledHeader = styled.header`
  position: relative;
  overflow: hidden;
  max-height: 400px;
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
  .seagull-1 {
    position: absolute;
    top: 40%;
    left: 90%;
    transform: translate(-50%, -50%);
  }
  .seagull-2 {
    position: absolute;
    top: 20%;
    left: 20%;
    transform: translate(-50%, -50%);
  }
`

const StyledHeaderText = styled.h1`
  color: white;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--fontSize-7);
  ${media.phone`
      top: -30%;
      left: 40%;
      font-size: var(--fontSize-3);
      font-weight: var(--fontWeight-bold);
      transform: none;
    `}
`

const StyledMonitor = styled.div`
  position: absolute;
  top: 50%;
  left: 70%;
`

const StyledThingInMonitor = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--fontSize-7);
`

interface HeaderProps {
  title: string
  isRootPath: boolean
}

const Header: React.FC<HeaderProps> = ({ title, isRootPath }) => {
  const desktopFilter = ["Mac OS", "Windows"]

  const parser: UAParser = new UAParser()
  const result: UAParser.IResult = parser.getResult()
  const { os } = result
  // const header = isRootPath ? (
  //   <h1 className="main-heading">
  //     <Link to="/">{title}</Link>
  //   </h1>
  // ) : (
  //   <Link className="header-link-home" to="/">
  //     {title}
  //   </Link>
  // )
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  const checkOS = desktopFilter.includes(os.name)
  const checkSize = windowWidth >= viewSizes.desktop
  const [isDesktop, setIsDesktop] = useState<boolean>(checkOS && checkSize)

  window.addEventListener("resize", () => {
    setWindowWidth(window.innerWidth)
    setIsDesktop(checkOS && checkSize)
  })
  return (
    <Link to="/">
      <StyledHeader className="global-header">
        <StaticImage
          src="./../../images/common/header-background.png"
          alt="header-background.png"
          height={1000}
          className="static-image"
        />
        <StaticImage
          src="./../../images/common/header/seagull-1.svg"
          alt="seagull-1.svg"
          className="seagull-1"
        />
        <StaticImage
          src="./../../images/common/header/seagull-2.svg"
          alt="seagull-2.svg"
          className="seagull-2"
        />
        {isDesktop ? (
          <StyledMonitor>
            <StaticImage
              src="./../../images/common/header/monitor.svg"
              alt="monitor.svg"
            />
            <StyledThingInMonitor>
              <iframe
                width="230"
                height="140"
                src="https://www.youtube.com/embed/zXk0Bt0hLrU?autoplay=1&mute=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </StyledThingInMonitor>
          </StyledMonitor>
        ) : null}
        <StyledHeaderText>{title}</StyledHeaderText>
      </StyledHeader>
    </Link>
  )
}

export default Header
