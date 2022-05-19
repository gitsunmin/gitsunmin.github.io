import * as React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

const StyledHeader = styled.header(({ theme }) => {
  return {
    height: "10rem",
  }
})

const Header = ({ title, isRootPath }) => {
  const header = isRootPath ? (
    <h1 className="main-heading">
      <Link to="/">{title}</Link>
    </h1>
  ) : (
    <Link className="header-link-home" to="/">
      {title}
    </Link>
  )

  return <StyledHeader className="global-header">{header}</StyledHeader>
}

export default Header
