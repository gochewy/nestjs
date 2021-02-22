import axios from 'axios';
async function getPublicKey() {
  const response = await axios(process.env.PUBLIC_KEY_URLS, {
    method: 'GET',
  });
  console.log('@@ calling api from config');
  return `-----BEGIN PUBLIC KEY-----\r\n${response.data.public_key}\r\n-----END PUBLIC KEY-----`;
}

export default async () => ({
  jwkKey: await getPublicKey(),
});
