import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { notFound, errorHandler } from './middleware/error.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';

const app = express();

// Trust proxy (needed for secure cookies behind Render/Reverse proxies later)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS (allow Vite dev + any additional origins in CORS_ORIGINS)
const allowed = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Cookies
app.use(cookieParser());

// Rate limit on all /api routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', apiLimiter);

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

// 404 for /api/*
app.use('/api', notFound);

// Unified error handler
app.use(errorHandler);

export default app;
