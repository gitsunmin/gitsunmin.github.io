import React from 'react';
import { Link, graphql, PageProps } from 'gatsby';
import kebabCase from 'lodash/kebabCase';

import Layout from '@src/layouts';
import Bio from '@src/components/app/bio';
import Seo from '@src/components/app/seo';
import TableOfContents from '@src/components/app/post/TableOfContents';
import Chip from '@components/UI/Chip';
import ChipGroup from '@components/UI/group/ChipGroup';
import Comment from '@components/app/comment';
import Card from '@components/UI/Card';

import { BlogPostBySlugQuery } from '@src/types/gatsby-graphql';

import 'gatsby-remark-vscode/styles.css';

const BlogPostTemplate = ({
  data,
  location,
}: PageProps<BlogPostBySlugQuery, object, { key: string; previousPath: string }>) => {
  const { siteMetadata } = data.site;
  const { previous, next, markdownRemark: post } = data;
  console.log('location:', location);
  const { origin, pathname } = location;

  return (
    <>
      <Layout location={location} siteMetadata={siteMetadata}>
        <Seo
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <article className="blog-post" itemScope itemType="http://schema.org/Article">
          <header>
            <h1 itemProp="headline">{post.frontmatter.title}</h1>
            <p>{post.frontmatter.date}</p>
          </header>
          <TableOfContents contents={post.tableOfContents} />
          <section dangerouslySetInnerHTML={{ __html: post.html }} itemProp="articleBody" />
          <footer>
            <ChipGroup>
              {post.frontmatter?.tags?.map((tag, index) => (
                <Chip to={`/tag/${kebabCase(tag)}`} key={index}>
                  {tag}
                </Chip>
              ))}
            </ChipGroup>
            <hr />
            <Bio />
          </footer>
        </article>
        <nav>
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
            <Card>
              {previous && (
                <Link
                  to={previous.fields.slug}
                  rel="prev"
                  state={{ previousPath: location.pathname }}
                >
                  {previous.frontmatter.title}
                </Link>
              )}
            </Card>
            </li>
            <li>
              <Card>
                {next && (
                  <Link to={next.fields.slug} rel="next" state={{ previousPath: location.pathname }} activeStyle={{ color: "red" }}
                  >
                    {next.frontmatter.title}
                  </Link>
                )}
              </Card>
            </li>
          </ul>
        </nav>
        <Comment />
      </Layout>
    </>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($id: String!, $previousPostId: String, $nextPostId: String) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      tableOfContents
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
        categories
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
