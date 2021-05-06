import axios from 'axios';
// import config from '../../../chewy.json';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const isAuthEnabled = require('../../../chewy.json').dev.modulesEnabled.auth;
async function getPublicKey() {
  if (!isAuthEnabled) {
    return 'NO_KEYCLOAK';
  }
  let response;
  try {
    response = await axios(process.env.PUBLIC_KEY_URLS, {
      method: 'GET',
    });
    console.log(response.data.public_key);
  } catch (error) {
    console.log(error.code);
  }
  console.log('@@ calling api from config');
  return response
    ? `-----BEGIN PUBLIC KEY-----\r\n${response.data.public_key}\r\n-----END PUBLIC KEY-----`
    : 'NO_KEYCLOAK_RESPONSES';
}
export default async () => ({
  jwkKey: await getPublicKey(),
});
