const http = require('node:http');
const { loadDotEnv } = require('./env.cjs');
const { createApp } = require('./app.cjs');

loadDotEnv();

const port = Number(process.env.API_PORT || 4000);
const host = process.env.API_HOST || '127.0.0.1';

const server = http.createServer(createApp);

server.listen(port, host, () => {
  console.log(`REST||ART API listening on http://${host}:${port}`);
});
