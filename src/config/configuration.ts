import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
async function getPublicKey() {
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
    : 'NO_KEYCLOAK';
}
export default async () => ({
  jwkKey: await getPublicKey(),
});
