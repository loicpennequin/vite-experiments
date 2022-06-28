import fs from 'fs-extra';
import { handleEvent } from 'vitedge/node/index.js';
import functions from './dist/functions.js';
import router from './dist/ssr/main.js';

const manifest = fs.readJSONSync(`./dist/client/ssr-manifest.json`);

export default async function (request, response) {

  // Generate a full URL
  const url = new URL(
    request.protocol + '://' + request.get('host') + request.originalUrl
  );

  try {
    // const type = getEventType({ url, functions }); // api | props | render

    const { statusCode, body, headers } = await handleEvent(
      { url, functions, router, manifest, preload: true },
      // This will be directly passed to api/props handlers
      { request, method: request.method, headers: request.headers }
    );

    response
      .set(headers || {})
      .status(statusCode || 200)
      .end(body);
  } catch (error) {
    console.error(error);
    response.status(500).end(error.message);
  }
}
