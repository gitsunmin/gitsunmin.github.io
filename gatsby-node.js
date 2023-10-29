const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const { createFilePath } = require('gatsby-source-filesystem');
  
/**
 * * tag를 펼쳐주는 함수
 */
function flatTags(allMarkdownRemark) {
  const uniqueTags = new Set();
  // Iterate over all articles
  allMarkdownRemark.nodes.forEach((node) => {
    // Iterate over each category in an article
    node.frontmatter.tags.forEach((tag) => {
      uniqueTags.add(tag);
    });
  });
  // Create new array with duplicates removed
  return Array.from(uniqueTags);
}

/**
 * * 해당 폴더 안의 모든 파일을 createPage 함수로 실행하여 만들 수 있도록 array로 만들어주는 함수
 */
const getPageInfoInPath = (path = '', folderName = '') => {
  try {
    if (!path.endsWith('/')) throw new Error('needed forder path');

    const pages = [];

    const filesInForder = fs.readdirSync(path);

    for (const file of filesInForder) {
      /* 폴더명인지, 파일명인지를 구분하기 위한 if */
      if (file.includes('.')) {
        const [filename, fileExtension] = file.split('.');
        
        if (fileExtension === 'tsx') { 
          pages.push({
            path: `/${folderName}/${filename}`,
            component: require.resolve(`./${path}${file}`),
          });
        }
      } else {
        const splitPath = path.split('/');
        const lastTwoForderNames = splitPath.slice(-2);
        const folderPath = `${lastTwoForderNames.join('/')}${file}`;
        const childPages = getPageInfoInPath(`${path}${file}/`, folderPath);

        pages.push(...childPages);
      }
    }
    return pages;
  } catch (error) {
    console.error(error);    
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.tsx`);

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `{
  allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
    nodes {
      id
      fields {
        slug
      }
      frontmatter {
        categories
        tags
      }
    }
  }
}`,
  );
  if (result.errors) {
    reporter.panicOnBuild(`There was an error loading your blog posts`, result.errors);
    return;
  }

  const { allMarkdownRemark } = result.data;

  // Create array of every category without duplicates
  const flatedTags = flatTags(allMarkdownRemark);
  flatedTags.forEach((tag) => {
    createPage({
      path: `tag/${_.kebabCase(tag)}`,
      component: require.resolve('./src/templates/blog-tag.tsx'),
      context: {
        tag,
        // Create an array of ids of articles in this category
        ids: allMarkdownRemark.nodes
          .filter((node) => {
            return node.frontmatter.tags.includes(tag);
          })
          .map((node) => node.id),
      },
    });
    reporter.info(`Creating page: tag/${tag}`);
  });

  const posts = result.data.allMarkdownRemark.nodes;

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id;
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id;

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      });
    });
  }

  /**
   * * 샌드박스 프로젝트
   */
  reporter.info(`Created Sandbox Main Page`);

  const sandboxPages = getPageInfoInPath(`src/pages/sandbox/`, 'sandbox');
  for (const sandboxPage of sandboxPages) { 
    const { path, component } = sandboxPage;
    createPage({
      path,
      component,
    });
  }
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });

    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
