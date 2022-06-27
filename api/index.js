import fs from 'fs-extra';
import { handleEvent, getEventType } from 'vitedge/node/index.js';

export default async (req, res) => {
  const { default: functions } = await import(`../functions.js`);
  const packageJson = fs.readJSONSync(`../ssr/package.json`);

  const { default: router } = await import(`../ssr/${packageJson.main}`);
  const manifest = fs.readJSONSync(`../client/ssr-manifest.json`);

  // Generate a full URL
  const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);

  try {
    getEventType({ url, functions }); // api | props | render

    const { statusCode, body, headers } = await handleEvent(
      { url, functions, router, manifest, preload: true },
      // This will be directly passed to api/props handlers
      { request, method: request.method, headers: request.headers }
    );

    res
      .set(headers || {})
      .status(statusCode || 200)
      .end(body);
  } catch (error) {
    console.error(error);
    response.status(500).end(error.message);
  }
};
