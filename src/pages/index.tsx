import React from 'react';
import { Link, graphql, PageProps } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import styled from 'styled-components';

import { IndexPageQueryQuery } from '@src/types/gatsby-graphql';

// Layout
import Layout from '@src/layouts';

// App
import Bio from '@src/components/app/bio';
import Seo from '@src/components/app/seo';

// UI
import ChipGroup from '@components/UI/group/ChipGroup';
import Chip from '@components/UI/Chip';
import { theme } from '@src/styles/theme';

export const StyledArticle = styled.article`
  margin-bottom: ${theme.spacing(8)};
  margin-top: ${theme.spacing(8)};

  p {
    margin-bottom: ${theme.spacing(0)};
  }

  h2 {
    font-size: ${theme.fontSize(4)};
    color: ${theme.color.black};
    margin-bottom: ${theme.spacing(2)};
    margin-top: ${theme.spacing(0)};
  }

  header {
    margin-bottom: ${theme.spacing(2)};
  }

  section {
    margin-bottom: ${theme.spacing(2)};
  }
`;

const BlogIndexPage = ({
  data,
  location,
}: PageProps<IndexPageQueryQuery, object, { key: string; previousPath: string }>) => {
  const { siteMetadata } = data.site;
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout location={location} siteMetadata={siteMetadata}>
      <Seo title="Home" />
      <Bio />
      {posts.length === 0 ? (
        <p>게시물 조회에 실패 하였습니다.</p>
      ) : (
        <ol style={{ listStyle: `none` }}>
          {posts.map((post) => {
            const title = post.frontmatter.title || post.fields.slug;

            return (
              <li key={post.fields.slug}>
                <StyledArticle itemScope itemType="http://schema.org/Article">
                  <header>
                    <h2>
                      <Link
                        to={post.fields.slug}
                        itemProp="url"
                        state={{ previousPath: location.pathname }}
                      >
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
                  <ChipGroup>
                    {post.frontmatter.tags.map((tag, index) => {
                      return (
                        <Chip key={index} to={`/tag/${kebabCase(tag)}`}>
                          {tag}
                        </Chip>
                      );
                    })}
                  </ChipGroup>
                </StyledArticle>
              </li>
            );
          })}
        </ol>
      )}
    </Layout>
  );
};

export default BlogIndexPage;

export const pageQuery = graphql`
  query IndexPageQuery {
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
          tags
        }
      }
    }
  }
`;
