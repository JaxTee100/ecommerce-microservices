import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { validateLogin, validateRegistration } from '../utils/validation';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export async function register(req: Request, res: Response) {
  logger.info('Register endpoint called');
  try {
    const { error } = validateRegistration(req.body);
    if (error) {
      logger.warn('validation error', error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,

      });
    }
    const { email, password, name } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      logger.warn('Email already in use', email);
      res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name }
    });
    logger.info('User registered', { userId: user.id });
    res.status(201).json({
      success: true,
      message: 'User registered succesfully',
      user: user.id
    });
  } catch (error) {

    logger.error('Registration error', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }


}

export async function login(req: Request, res: Response) {
  logger.info('Login endpoint called');
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      logger.warn('validation error', error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.warn('Invalid credentials', email);
      return res.status(401).json({ message: 'invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      logger.warn('Invalid credentials', email);
      return res.status(401).json({ message: 'invalid credentials' });
    }
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token
    });
  } catch (error) {

  }








}
