import app from './app';
import http from 'http';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});