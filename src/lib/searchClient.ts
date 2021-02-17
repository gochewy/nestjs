import { MeiliSearch } from 'meilisearch';
const client = new MeiliSearch({
  host: 'http://localhost:7700/',
  apiKey: 'b1d421af3151b78b8754481eb9ab83c1bfa436baf3c2b064ad9f51ab17efc3fa',
});

export default client;
