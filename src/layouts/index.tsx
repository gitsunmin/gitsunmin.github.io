import React, { useState, MouseEventHandler } from "react"
import { ThemeProvider } from "styled-components"
import { useRecoilState } from "recoil"
import type { WindowLocation } from "@reach/router"

import Navigation from "@src/layouts/Navigation"
import Header from "@src/layouts/Header"
import Wrapper from "@src/layouts/Wrapper"
import Footer from "@src/layouts/Footer"
import Drawer from "@src/layouts/Drawer"

import { theme } from "@src/styles/theme"
import { debounce } from "@src/utils"

import { SiteSiteMetadata } from "@src/types/gatsby-graphql"
import { DrawerState } from '@src/store';

interface LayoutProps {
  location: WindowLocation<{ key: string; previousPath: string }>
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
  const [drawerOpen, setDrawerOpen] = useRecoilState(DrawerState)

  /**
   * * scroll이 바닥에 있을 때 Footer를 보여주기 위한 함수
   */
  const handleScroll = () => {
    if (typeof document !== "undefined") {
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
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      debounce(() => {
        handleScroll()
      }, 100)
    })
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <ThemeProvider theme={theme}>
      <Header
        title={title}
        youtubeVideoId={youtubeVideoId}
        location={location}
      />
      <Navigation onClickButton={toggleDrawer} />
      <Wrapper>{children}</Wrapper>
      {isViewsable ? <Footer /> : null}
      <Drawer open={drawerOpen} onClose={toggleDrawer}/>
    </ThemeProvider>
  )
}

export default Layout
