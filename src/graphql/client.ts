import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';
const httpEndpoint = 'http://localhost:5000/v1/graphql';

const createClient = (token) => {
  const httpLink = new HttpLink({
    uri: httpEndpoint,
    fetch,
    headers: {
      'x-hasura-admin-secret': 'password',
      authorization: `Bearer ${token}`,
    },
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
};
export default createClient;
