import * as React from "react"
import { Link } from "gatsby"

import Header from "./Header"
import Footer from "./Footer"
import { ThemeProvider } from "styled-components"
import { theme } from "@src/styles/theme"
const ROOT_PATH = `/`

const Layout = ({ location, title, children }) => {
  const isRootPath = location.pathname === ROOT_PATH

  return (
    <ThemeProvider theme={theme}>
      <Header title={title} isRootPath={isRootPath} />
      <div className="global-wrapper" data-is-root-path={isRootPath}>
        <main>{children}</main>
      </div>
      <Footer />
    </ThemeProvider>
  )
}

export default Layout
