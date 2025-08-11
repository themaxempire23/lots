import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { notFound, errorHandler } from './middleware/error.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import tasksRouter from './routes/tasks.js';
import aiRouter from './routes/ai.js';     // <-- add this

const app = express();

app.set('trust proxy', 1);
app.use(helmet());

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

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

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
app.use('/api/tasks', tasksRouter);
app.use('/api/ai', aiRouter);           


app.use('/api', notFound);
app.use(errorHandler);

export default app;
