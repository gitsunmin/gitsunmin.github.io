import React from "react"
import styled from "styled-components"

import MonitorSVG from "@src/images/header/monitor.svg"

const StyledMonitor = styled.div`
  position: absolute;
  top: 32%;
  left: 70%;
`

const StyledThingInMonitor = styled.div`
  position: relative;
  width: inherit;
  height: inherit;
  margin-top: -66.5%;
  left: 11.5%;
`

interface MonitorThatPlayYoutubeProps {
  youtubeVideoId: string
}
const MonitorThatPlayYoutube: React.FC<MonitorThatPlayYoutubeProps> = ({
  youtubeVideoId,
}) => {
  return (
    <StyledMonitor>
      <img src={MonitorSVG} alt="monitor.svg" />
      {/* @about youtube Link options: https://it4edu.tistory.com/107 */}
      <StyledThingInMonitor>
        <iframe
          width="306"
          height="182"
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&modestbranding=1&rel=0&list=PLbs3NCPqzyFQI0ZP4BrDXFqUcgFWVinwC`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </StyledThingInMonitor>
    </StyledMonitor>
  )
}

export default MonitorThatPlayYoutube
