import path from 'path';
import express from 'express';
import compression from 'compression';
import fs from 'fs-extra';
import { handleEvent } from 'vitedge/node/index.js';

async function main() {
  const { default: functions } = await import(`./dist/functions.js`);
  const packageJson = fs.readJSONSync(`./dist/ssr/package.json`);

  const { default: router } = await import(`./dist/ssr/${packageJson.main}`);
  const manifest = fs.readJSONSync(`./dist/client/ssr-manifest.json`);

  const server = express();

  server.use(compression({ filter: () => true }));
  server.use(express.static(path.join(process.cwd(), `./dist/client`)));
  server.use(async (request, response) => {
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
  });

  const port = 3000;
  console.log(`Server started: http://localhost:${port}`);
  server.listen(port);
}

main();
