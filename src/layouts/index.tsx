import React, { useState } from "react"
import { ThemeProvider } from "styled-components"
import type { WindowLocation } from "@reach/router"

import Header from "@src/layouts/Header"
import Wrapper from '@src/layouts/Wrapper'
import Footer from "@src/layouts/Footer"

import { theme } from "@src/styles/theme"
import { debounce } from "@src/utils"

import { SiteSiteMetadata } from "@src/types/gatsby-graphql"


interface LayoutProps {
  location: WindowLocation
  siteMetadata: SiteSiteMetadata
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({
  location,
  siteMetadata,
  children,
}) => {
  const { title, youtubeVideoId } = siteMetadata
  const [isViewsable, setIsViewsable] = useState<boolean>(false)

  /**
   * * scroll이 바닥에 있을 때 Footer를 보여주기 위한 함수
   */
  const handleScroll = () => {
    if (document) {
      const scrollTop: number = document?.documentElement.scrollTop ?? 0
      const offsetHeight: number = document?.documentElement.offsetHeight ?? 0
      const clientHeight: number = document?.documentElement.clientHeight ?? 0
      if (scrollTop + clientHeight + 200 > offsetHeight) {
        setIsViewsable(true)
      } else {
        setIsViewsable(false)
      }
    }
  }
  window?.addEventListener("scroll", () => {
    debounce(() => {
      handleScroll()
    }, 100)
  })

  return (
    <ThemeProvider theme={theme}>
      <Header
        title={title}
        youtubeVideoId={youtubeVideoId}
        location={location}
      />
      <Wrapper>{children}</Wrapper>
      {isViewsable ? <Footer /> : null}
    </ThemeProvider>
  )
}

export default Layout
