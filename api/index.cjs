const { handleEvent, getEventType } = require('vitedge/node/index.js');

export default async (req, res) => {
  const { functions } = require(path.join(
    __dirname,
    'renderer',
    `./functions.js`
  ));

  const { default: router } = require(path.join(
    __dirname,
    'renderer',
    `./ssr/main.js`
  ));
  const manifest = require(path.join(
    __dirname,
    'renderer',
    'client/ssr-manifest.json'
  ));

  const protocol =
    req.protocol || (req.headers.referer || '').split(':')[0] || 'http';
  const host = process.env.VERCEL_URL;
  const url = protocol + '://' + host + req.url;

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
