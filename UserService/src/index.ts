import express from 'express';
import { PrismaClient } from '@prisma/client';
import {logger} from './utils/logger';
import authRouter from './routes/auth';
import bodyParser from 'body-parser';

export const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use('/auth', authRouter);

app.listen(PORT, async () => {
  logger.info(`User Service running on port ${PORT}`);
  await prisma.$connect();
});

