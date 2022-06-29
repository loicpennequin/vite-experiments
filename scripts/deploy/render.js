import fs from 'fs';
import { handleEvent } from 'vitedge/node/index.js';

export default async function (req, res) {
  const manifest = JSON.parse(fs.readFileSync(`./ssr-manifest.json`));
  const { default: functions } = await import('../../dist/functions.js');
  const { default: router } = await import('../../dist/ssr/main.js');

  // Generate a full URL
  const protocol =
    req.headers['x-forwarded-proto'] || req.connection.encrypted
      ? 'https'
      : 'http';

  const url = new URL(protocol + '://' + req.headers.host + req.url);

  try {
    // const type = getEventType({ url, functions }); // api | props | render

    const { statusCode, body, headers } = await handleEvent(
      { url, functions, router, manifest, preload: true },
      // This will be directly passed to api/props handlers
      { request: req, method: req.method, headers: req.headers }
    );

    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    res.status(statusCode || 200).end(body);
  } catch (error) {
    console.error(error);
    res.status(500).end(error.message);
  }
}
