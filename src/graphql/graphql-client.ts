import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../generated/graphql';

interface SdkConfig {
  admin?: boolean;
  token?: string;
}
const endPoint = 'http://localhost:5000/v1/graphql';
const getHeaders = (config?: SdkConfig) => {
  const headers = {};
  if (config.admin) {
    headers['x-hasura-admin-secret'] = process.env.HASURA_ADMIN_SECRET;
  } else if (config.token) {
    headers['authorization'] = `Bearer ${config.token}`;
  }
  return headers;
};
const getGraphqlSdk = (config?: SdkConfig) => {
  const headers = getHeaders(config);
  const graphqlClient = new GraphQLClient(endPoint, { headers });
  return getSdk(graphqlClient);
};

export default getGraphqlSdk;
