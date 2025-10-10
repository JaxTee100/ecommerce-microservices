import express from 'express';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import {logger} from './utils/logger';
import authRouter from './routes/auth';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import {RateLimiterRedis } from 'rate-limiter-flexible'
import Redis from 'ioredis';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

export const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

// app.use(bodyParser.json());

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    next();
});


const RedisClient = new Redis(process.env.REDIS_URL as string);


//ddos protection
const rateLimiter = new RateLimiterRedis({
    storeClient: RedisClient,
    keyPrefix: 'middleware',
    points: 10, // 10 requests
    duration: 20, // per second by IP
});

app.use((req, res, next) => {
  const ip = req.ip ?? 'unknown-ip';
  rateLimiter.consume(ip).then(() => next()).catch(() => {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    res.status(429).json({success: false, message: 'Too Many Requests' });
  })
})

// //Ip based rate limiting for sensitive endpoints
// const sensitiveEndpoints = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100,//maximum number of requests
//     standardHeaders: true,//include headers in the response
//     legacyHeaders: false, //i dont want to include legacy headers
//     handler: (req, res) => {
//         logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
//         res.status(429).json({
//             message: 'Too many requests',
//         });
//     },
//     store: new RedisStore({
//         sendCommand: (args) => RedisClient.call(...args),
//     })
// });

app.use('/auth', authRouter);

app.listen(PORT, async () => {
  logger.info(`User Service running on port ${PORT}`);
  await prisma.$connect();
});

