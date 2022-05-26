import React from "react"

import Header from "./Header"
import Footer from "./Footer"
import { ThemeProvider } from "styled-components"
import { theme } from "@src/styles/theme"
const ROOT_PATH = `/`

const Layout = ({ location, siteMetadata, children }) => {
  const isRootPath = location.pathname === ROOT_PATH
  const { title, youtubeVideoId } = siteMetadata

  return (
    <ThemeProvider theme={theme}>
      <Header title={title} youtubeVideoId={youtubeVideoId} isRootPath={isRootPath} />
      <div className="global-wrapper" data-is-root-path={isRootPath}>
        <main>{children}</main>
      </div>
      <Footer />
    </ThemeProvider>
  )
}

export default Layout
