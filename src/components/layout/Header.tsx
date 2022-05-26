import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import styled, { keyframes } from "styled-components"
import { media, viewSizes } from "@src/styles/media"
import { useState, useEffect } from "react"

import { debounce, checkOS } from "@src/utils"

// * 이미지 import
import seagull1Src from "@src/images/common/header/seagull-1.svg"
import seagull2Src from "@src/images/common/header/seagull-2.svg"

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

const StyledLightHeader = styled.header`
  position: relative;
  overflow: hidden;
  max-height: 400px;
  border-radius: 0 0 2.5vw 2.5vw;
  -webkit-border-radius: 0 0 2.5vw 2.5vw;
  animation: ${headerScreenUpKeyframe("100px")} 1s 1 normal forwards;

  ${media.mobile`
    max-height: 100px;
    animation: ${headerScreenUpKeyframe("75px")} 1s 1 normal forwards;
  `}
  .static-image {
    transform: translateY(-30%);
    max-height: initial;
    width: 100%;
  }
`

const StyledHeaderText = styled.h1`
  color: white;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--fontSize-7);
  ${media.mobile`
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
  youtubeVideoId: string
}

const Header: React.FC<HeaderProps> = ({
  title,
  youtubeVideoId,
  isRootPath,
}) => {
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

  const header = isRootPath ? (
    <StyledHeader className="global-header">
      <StaticImage
        src="./../../images/common/header-background.png"
        alt="header-background.png"
        height={1000}
        className="static-image"
      />
      <img src={seagull1Src} alt="seagull-1.svg" className="seagull-1" />
      <img src={seagull2Src} alt="seagull-2.svg" className="seagull-2" />
      {isDesktop ? (
        <StyledMonitor>
          <StaticImage
            src="./../../images/common/header/monitor.svg"
            alt="monitor.svg"
          />
          {/* @about youtube Link options: https://it4edu.tistory.com/107 */}
          <StyledThingInMonitor>
            <iframe
              width="230"
              height="140"
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&modestbranding=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </StyledThingInMonitor>
        </StyledMonitor>
      ) : null}
      <StyledHeaderText>{title}</StyledHeaderText>
    </StyledHeader>
  ) : (
    <StyledLightHeader className="global-header">
      <StaticImage
        src="./../../images/common/header-background.png"
        alt="header-background.png"
        height={1000}
        className="static-image"
      />
      <StyledHeaderText>{title}</StyledHeaderText>
    </StyledLightHeader>
  )

  return <Link to="/">{header}</Link>
}

export default Header
