## 🚀 How to Create this Gatsby site(gitsunmin's Blog).

1.  **Create this Gatsby site.**

    ```shell
    # create a new Gatsby site using the blog starter
    npx gatsby new my-blog-starter https://github.com/gatsbyjs/gatsby-starter-blog
    ```

2.  **Edit Layout**
3.  **Create TOC**

- [ref](https://soopdop.github.io/2020/12/03/add-table-of-content-gatsby/#%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8-%EC%84%A4%EC%B9%98-%ED%9B%84-%EB%B0%94%EB%80%90%EC%A0%90-%ED%99%95%EC%9D%B8)

4.  **Create Graphql.config.js**

- [how to create graphql.config.js](https://www.gatsbyjs.com/plugins/gatsby-plugin-graphql-config/?=graphql)

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── .gitignore
    ├── .prettierrc
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    └── README.md

1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

2.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

3.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

4.  **`.prettierrc`**: This is a configuration file for [Prettier](https://prettier.io/). Prettier is a tool to help keep the formatting of your code consistent.

5.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

6.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/) for more detail).

7.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

8.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.

9.  **`LICENSE`**: This Gatsby starter is licensed under the 0BSD license. This means that you can see this file as a placeholder and replace it with your own license.

10. **`package-lock.json`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. **(You won’t change this file directly).**

11. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

12. **`README.md`**: A text file containing useful reference information about your project.

## 💫 Deploy

in package.json

```json
"deploy": "gatsby build && gh-pages -d public -b master",
```

in dev branch

```shell
>> npm run deploy
```

## 🎓 Learning Gatsby

- [tutorial for creating a site with Gatsby](https://www.gatsbyjs.com/tutorial/)
- [documentation](https://www.gatsbyjs.com/docs/).
- [Query for Data with GraphQL Tutorial](https://www.gatsbyjs.com/docs/tutorial/part-4/#use-graphiql-to-explore-the-data-layer-and-write-graphql-queries).

## 🗒 To Do List (Delete on completion)

- 갈매기를 클릭하면 "끼룩 끼룩" 나오면 좋을 듯 함.
- <s>포스트 페이지 들어갈 때, 해더 타이틀이 좀 더 위로 올라가야할 것 같음. </s>
- [카테고리 추가하기](https://soopdop.github.io/2020/11/27/add-categories-to-gatsby/)
- <s>이전 블로그의 포스트들 옮기기</s>
- <s>[rss 적용하기](https://ha-young.github.io/2020/gatsby/Gatsby-%EB%B8%94%EB%A1%9C%EA%B7%B8-RSS-Feed-%EC%83%9D%EC%84%B1%EC%8B%9C%ED%82%A4%EA%B8%B0/)</s>
