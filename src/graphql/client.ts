import ApolloClient, { InMemoryCache } from 'apollo-boost';
import fetch from 'cross-fetch';
const httpEndpont = 'http://localhost:5000/v1/graphql';

const createClient = (token) => {
  return new ApolloClient({
    uri: httpEndpont,
    fetch,
    headers: {
      'x-hasura-admin-secret': 'password',
      authorization: `Bearer ${token}`,
    },
    cache: new InMemoryCache(),
  });
};
export default createClient;
