import ApolloClient from 'apollo-boost';
import fetch from 'cross-fetch';
const httpEndpont = 'http://localhost:3001/graphql';

const createClient = (token) => {
  return new ApolloClient({
    uri: httpEndpont,
    fetch,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};
export default createClient;
