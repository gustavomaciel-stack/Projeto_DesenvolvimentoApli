import express from 'express';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
import routes from './routes/index.js';
import { corsMiddleware } from './middlewares/cors.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(routes);

app.use(notFound);
app.use(errorHandler);

const port = env.port;

app.listen(port, () => {
  console.log(`MatchPoint backend running on http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
