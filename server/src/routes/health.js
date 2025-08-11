import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

router.get('/db', async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    err.status = 500;
    err.message = 'Database connection failed';
    next(err);
  }
});

export default router;
