import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import styled, { keyframes } from "styled-components"
import type { WindowLocation } from "@reach/router"

import { debounce, checkOS } from "@src/utils"
import { media, viewSizes } from "@src/styles/media"

// * 이미지 import
import seagull1Src from "@src/images/header/seagull-1.svg"
import seagull2Src from "@src/images/header/seagull-2.svg"

//* components
import MonitorThatPlayYoutube from "@src/components/layout/header/MonitorThatPlayYoutube"

const seagull1Keyframe = keyframes`
  0% {
    top: 60%;
    left: -10%;
    transform: rotate(90deg);
  }
  50% {
    top: 60%;
    left: 0%;
  }
  100% {
    top: 20%;
    left: 100%;
    transform: rotate(80deg);
  }
`
const seagull2Keyframe = keyframes`
  0% {
    top: -60%;
    left: -20%;
  }
  30% {
    top: -58%;
    left: -22%;
  }
  60% {
    top: -61%;
    left: -19%;
  }
  100% {
    top: -59%;
    left: -18%;
  }
`

const headerScreenUpKeyframe = (maxHeight: string) => keyframes`
  100% {
    max-height: ${maxHeight};
  }
`

const HeaderTextKeyframe = (top: string, left: string) => keyframes`
  100% {
    top: ${top};
    left: ${left};
  }
`

const StyledHeader = styled.header`
  position: relative;
  overflow: hidden;
  max-height: 400px;
  border-radius: 0 0 2.5vw 2.5vw;
  -webkit-border-radius: 0 0 2.5vw 2.5vw;

  ${media.mobile`
    max-height: 100px;
  `}
  .static-image {
    transform: translateY(-30%);
    max-height: initial;
    width: 100%;
  }
  .seagull-1 {
    position: absolute;
    animation: ${seagull1Keyframe} 4s infinite normal;
  }
  .seagull-2 {
    position: absolute;
    transform: scale(0.2, 0.2);
    animation: ${seagull2Keyframe} 4s infinite alternate;
  }
`

const StyledLightHeader = styled.header<{ isFolded: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: 0 0 2.5vw 2.5vw;
  -webkit-border-radius: 0 0 2.5vw 2.5vw;
  max-height: ${props => (props.isFolded ? "100px" : "400px")};
  animation: ${headerScreenUpKeyframe("100px")} 1s 1 normal forwards;

  ${media.mobile`
    max-height: ${props => (props.isFolded ? "75px" : "100px")};
    animation: ${headerScreenUpKeyframe("75px")} 1s 1 normal forwards;
  `}
  .static-image {
    transform: translateY(-30%);
    max-height: initial;
    width: 100%;
  }
`

const StyledHeaderText = styled.h1`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--fontSize-7);
  ${media.mobile`
      top: 20%;
      left: 40%;
      font-size: var(--fontSize-3);
      font-weight: var(--fontWeight-bold);
      transform: none;
  `};
`

const StyledLightHeaderText = styled(StyledHeaderText)<{
  isFolded: boolean
}>`
  top: ${props => (props.isFolded ? "35%" : "60%")};
  left: 50%;
  animation: ${HeaderTextKeyframe("35%", "50%")} 1s 1 normal forwards;

  ${media.mobile`
    top: ${props => (props.isFolded ? "0" : "20%")};
    left: 40%;
    animation: ${HeaderTextKeyframe("0", "40%")} 1s 1 normal forwards;
  `};
`
const ROOT_PATH = `/`
interface HeaderProps {
  title: string
  youtubeVideoId: string
  location: WindowLocation<{ key: string; previousPath: string }>
}

const Header: React.FC<HeaderProps> = ({ title, youtubeVideoId, location }) => {
  const isRootPath = location.pathname === ROOT_PATH
  const isFolded = location.state?.previousPath !== ROOT_PATH

  let talk_seagull = ""
  const [isDesktop, setIsDesktop] = useState<boolean>(checkOS("desktop"))
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDesktop(checkOS && window?.innerWidth >= viewSizes.desktop)
      window.addEventListener("resize", () => {
        debounce(
          () =>
            setIsDesktop(checkOS && window?.innerWidth >= viewSizes.desktop),
          1000
        )
      })
    }
  }, [])

  const handledHeader = isRootPath ? (
    <StyledHeader>
      <StaticImage
        src="./../images/header/header-background.png"
        alt="header-background.png"
        height={1000}
        className="static-image"
      />
      <img src={seagull1Src} alt="seagull-1.svg" className="seagull-1" />
      <div className="seagull-2">
        <img src={seagull2Src} alt="seagull-2.svg" />
      </div>
      {isDesktop ? (
        <MonitorThatPlayYoutube youtubeVideoId={youtubeVideoId} />
      ) : null}
      <StyledHeaderText>
        <Link to="/" state={{ previousPath: location.pathname }}>
          {title}
        </Link>
      </StyledHeaderText>
    </StyledHeader>
  ) : (
    <StyledLightHeader isFolded={isFolded}>
      <StaticImage
        src="./../images/header/header-background.png"
        alt="header-background.png"
        height={1000}
        className="static-image"
      />
      <StyledLightHeaderText isFolded={isFolded}>
        <Link to="/" state={{ previousPath: location.pathname }}>
          {title}
        </Link>
      </StyledLightHeaderText>
    </StyledLightHeader>
  )

  return handledHeader
}

export default Header
