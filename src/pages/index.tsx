import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "@src/layouts"
import Bio from "@components/bio"
import Seo from "@components/seo"

const BlogIndex: React.FC<any> = ({ data, location }) => {
  const { siteMetadata } = data.site
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout location={location} siteMetadata={siteMetadata}>
      <Seo title="All posts" />
      <Bio />
      {posts.length === 0 ? (
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      ) : (
        <ol style={{ listStyle: `none` }}>
          {posts.map(post => {
            const title = post.frontmatter.title || post.fields.slug

            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2>
                      <Link to={post.fields.slug} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <small>{post.frontmatter.date}</small>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: post.frontmatter.description || post.excerpt,
                      }}
                      itemProp="description"
                    />
                  </section>
                </article>
              </li>
            )
          })}
        </ol>
      )}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexPageQuery{
    site {
      siteMetadata {
        title
        youtubeVideoId
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
