import React from "react"
import { WindowLocation } from "@reach/router"

import Header from "./Header"
import Footer from "./Footer"
import styled, { ThemeProvider } from "styled-components"
import { theme } from "@src/styles/theme"

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

const Layout: React.FC<LayoutProps> = ({ location, siteMetadata, children }) => {
  const isRootPath = location.pathname === ROOT_PATH
  const { title, youtubeVideoId } = siteMetadata

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
      <Footer />
    </ThemeProvider>
  )
}

export default Layout
