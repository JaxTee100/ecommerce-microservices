import express from 'express';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import {logger} from './utils/logger';
import productRoutes from './routes/productRoute';
import cors from 'cors';

export const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4001;


app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    next();
});





app.use('/api/products', productRoutes);

app.listen(PORT, async () => {
  logger.info(`Product Service running on port ${PORT}`);
  await prisma.$connect();
});

