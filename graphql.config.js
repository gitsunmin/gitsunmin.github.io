module.exports = {
  projects: {
    site: require('.cache/graphql.config.json'),
    server: {
      schema: 'src/**/*.{graphql,gql}',
      documents: 'src/queries/**/*.{ts,tsx,js,jsx}',
    },
  },
};
