import ApolloClient, { InMemoryCache, HttpLink, split } from 'apollo-boost';
import fetch from 'cross-fetch';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { store } from '../../../client/src/store';
const httpEndpoint = 'http://localhost:5000/v1/graphql';

const createClient = (token) => {
  const httpLink = new HttpLink({
    uri: httpEndpoint,
    fetch,
    headers: {
      'x-hasura-admin-secret': 'password',
    },
  });
  const wsEndpoint = `ws${httpEndpoint?.slice(4)}`;

  const subscriptionClient = new SubscriptionClient(
    `${wsEndpoint}/v1/graphql`,
    {
      reconnect: true,
      connectionParams: () => {
        const { token } = store.getState().auth;
        return {
          headers: {
            authorization: token ? `Bearer ${token}` : '',
          },
        };
      },
    },
  );
  const wsLink = new WebSocketLink(subscriptionClient);
  const link = split();
  return new ApolloClient({
    uri: httpEndpoint,
    fetch,
    headers: {
      'x-hasura-admin-secret': 'password',
      authorization: `Bearer ${token}`,
    },
    cache: new InMemoryCache(),
  });
};
export default createClient;
