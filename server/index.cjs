const http = require('node:http');
const { loadDotEnv } = require('./env.cjs');
const { createApp } = require('./app.cjs');

loadDotEnv();

const port = Number(process.env.API_PORT || 4000);

const server = http.createServer(createApp);

server.listen(port, '127.0.0.1', () => {
  console.log(`REST||ART API listening on http://127.0.0.1:${port}`);
});
