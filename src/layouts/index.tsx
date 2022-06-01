import React, { useState } from "react"
import { WindowLocation } from "@reach/router"

import Header from "./Header"
import Footer from "./Footer"
import styled, { ThemeProvider } from "styled-components"
import { theme } from "@src/styles/theme"
import { debounce } from "@src/utils"

import { SiteSiteMetadata } from "@src/types/gatsby-graphql"

const StyledWrapper = styled.div`
  margin: 0 auto;
  max-width: ${theme.maxWidth("wrapper")};
  padding: ${theme.spacing(10)} ${theme.spacing(5)};
  margin-bottom: ${theme.spacing(20)};
`

const ROOT_PATH = `/`

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
  const isRootPath = location.pathname === ROOT_PATH
  const [isViewsable, setIsViewsable] = useState<boolean>(false)

  const handleScroll = () => {
    console.log('handleScroll')
    const scrollTop: number = document.documentElement.scrollTop
    const offsetHeight: number = document.documentElement.offsetHeight
    const clientHeight: number = document.documentElement.clientHeight
    if (scrollTop + clientHeight + 200 > offsetHeight) {
      setIsViewsable(true)
    } else {
      setIsViewsable(false)
    }
  }
  window?.addEventListener("scroll", event => {
    debounce(() => {
      handleScroll()
    }, 100)
  })

  return (
    <ThemeProvider theme={theme}>
      <Header
        title={title}
        youtubeVideoId={youtubeVideoId}
        isRootPath={isRootPath}
      />
      <StyledWrapper>
        <main>{children}</main>
      </StyledWrapper>
      {isViewsable ? <Footer /> : null}
    </ThemeProvider>
  )
}

export default Layout
