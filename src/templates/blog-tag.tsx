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

const StyledHeader = styled.span`
  .tag {
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
    <Layout location={location} siteMetadata={siteMetadata}>
      <Helmet title={`${tag} tag`} />
      <StyledHeader>
        <h1>
          <span className="tag">{tag}</span> tag
        </h1>
        <span>TOTAL: {allMarkdownRemark.nodes.length}</span>
      </StyledHeader>
      <ul>
        {allMarkdownRemark.nodes.map((node, index) => {
          return (
            <ol key={index} style={{ listStyle: `none` }}>
              <li key={index}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                  key={index}
                >
                  <header>
                    <h2>
                      <Link
                        to={node.fields.slug}
                        itemProp="url"
                        state={{ previousPath: location.pathname }}
                      >
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
          )
        })}
      </ul>
    </Layout>
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
