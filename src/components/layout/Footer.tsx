import * as React from "react"

const Footer: React.FC = ({}) => {
  return (
    <footer>
      © {new Date().getFullYear()}, Built with
      <a href="https://www.gatsbyjs.com"> Gatsby</a>
    </footer>
  )
}

export default Footer
