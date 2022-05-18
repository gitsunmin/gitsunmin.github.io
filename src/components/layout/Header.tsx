import * as React from "react"
import { Link } from "gatsby"

const Footer = ({ title, isRootPath }) => {
  const header = isRootPath ? (
    <h1 className="main-heading">
      <Link to="/">{title}</Link>
    </h1>
  ) : (
    <Link className="header-link-home" to="/">
      {title}
    </Link>
  )
  return <header className="global-header">{header}</header>
}

export default Footer
