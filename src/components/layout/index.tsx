import * as React from "react"
import { Link } from "gatsby"

import Header from "./Header"
import Footer from "./Footer"

const ROOT_PATH = `/`

const Layout = ({ location, title, children }) => {
  const isRootPath = location.pathname === ROOT_PATH

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <Header location={location} title={title} isRootPath={isRootPath}/>
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
