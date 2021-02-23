module.exports = {
  schema: [
    {
      'http://localhost:5000/v1/graphql': {
        headers: {
          'x-hasura-admin-secret': 'password',
        },
      },
    },
  ],
  documents: ['./src/**/*.ts', './src/**/*.graphql'],
  overwrite: true,
  generates: {
    './src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        skipTypename: false,
        rawRequest: true,
      },
    },
  },
};
