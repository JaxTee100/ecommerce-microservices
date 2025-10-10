import express from 'express';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API Gateway is running');
});

app.listen(PORT, () => {
  logger.info(`API Gateway is listening on port ${PORT}`);
});