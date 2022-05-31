import React from "react"
import { Helmet } from "react-helmet"
import { graphql, PageProps, Link } from "gatsby"
import styled from "styled-components"
import Layout from "@src/layouts"
import { TagsTemplateQueryQuery } from "@src/types/gatsby-graphql"
import { theme } from "@src/styles/theme"

interface TagsTemplatePageContext {
  ids: string[]
  tag: string
}

const StyledHeader = styled.h1`
  margin: ${theme.spacing(4)} 0;
  span {
    color: ${theme.color.primary};
  }
`

const TagsTemplate = ({
  data,
  pageContext,
  location,
}: PageProps<TagsTemplateQueryQuery, TagsTemplatePageContext>) => {
  const { allMarkdownRemark, site } = data
  const { siteMetadata } = site
  const { tag } = pageContext
  return (
    <>
      <Layout location={location} siteMetadata={siteMetadata}>
        <Helmet title={tag} />
        <StyledHeader>
          About <span>{tag}</span> tag
        </StyledHeader>
        <ul>
          {allMarkdownRemark.nodes.map(node => {
            return (
              <ol style={{ listStyle: `none` }}>
                <li key={node.fields.slug}>
                  <article
                    className="post-list-item"
                    itemScope
                    itemType="http://schema.org/Article"
                  >
                    <header>
                      <h2>
                        <Link to={node.fields.slug} itemProp="url">
                          <span itemProp="headline">
                            {node.frontmatter.title}
                          </span>
                        </Link>
                      </h2>
                      <small>{node.frontmatter.date}</small>
                    </header>
                    <section>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: node.frontmatter.description || node.excerpt,
                        }}
                        itemProp="description"
                      />
                    </section>
                  </article>
                </li>
              </ol>
              // <li key={node.frontmatter.title}>
              //   <Link to={node.fields.slug}>
              //     <span>{node.frontmatter.title}</span>
              //     <span>
              //       <time>{node.frontmatter.date}</time>
              //     </span>
              //   </Link>
              // </li>
            )
          })}
        </ul>
      </Layout>
    </>
  )
}

export const query = graphql`
  query TagsTemplateQuery($ids: [String]!) {
    site {
      siteMetadata {
        title
        youtubeVideoId
      }
    }
    allMarkdownRemark(filter: { id: { in: $ids } }) {
      nodes {
        id
        excerpt
        fields {
          slug
        }
        frontmatter {
          title
          categories
          description
          tags
          date(formatString: "MMMM DD, YYYY")
        }
      }
    }
  }
`

export default TagsTemplate
