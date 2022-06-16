import React from "react"
import { graphql } from "gatsby"

import Layout from "@src/layouts"
import Seo from "@src/components/app/seo"

const NotFoundPage: React.FC<any> = ({ data, location }) => {
  const { siteMetadata } = data.site

  return (
    <Layout location={location} siteMetadata={siteMetadata}>
      <Seo title="404: Not Found" />
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query NotFoundPageQuery {
    site {
      siteMetadata {
        title
        youtubeVideoId
      }
    }
  }
`
