import path from 'path';
import express from 'express';
import compression from 'compression';
import serverlessVercelFunction from './.vercel/output/functions/index.func/index.js';

async function main() {
  const server = express();

  server.use(compression({ filter: () => true }));
  server.use(express.static(path.join(process.cwd(), `./dist/client`)));
  server.use(serverlessVercelFunction);

  const port = 3000;
  console.log(`Server started: http://localhost:${port}`);
  server.listen(port);
}

main();
