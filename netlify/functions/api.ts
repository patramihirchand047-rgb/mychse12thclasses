import express from 'express';
import serverless from 'serverless-http';
import { apiRouter } from '../../server/apiRoutes.ts';

const app = express();

app.use(express.json());

// Handle direct Netlify function path, /api prefix, and root path seamlessly
app.use('/.netlify/functions/api', apiRouter);
app.use('/api', apiRouter);
app.use('/', apiRouter);

export const handler = serverless(app);
