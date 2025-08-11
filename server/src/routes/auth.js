import { Router } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../db.js';
import { signAccessToken } from '../utils/jwt.js';
import { signupSchema, loginSchema } from '../validators/authSchemas.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const isProd = process.env.NODE_ENV === 'production';

// In dev (localhost) we can be lax; in prod (Vercel  Render) we must be None+Secure
const cookieOptions = {
  httpOnly: true,
  secure: isProd,              // required when SameSite=None
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

function publicUser(u) {
  return { id: u.id, email: u.email, name: u.name, createdAt: u.createdAt, updatedAt: u.updatedAt };
}

router.post('/signup', async (req, res, next) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });

    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, passwordHash, name } });

    const token = signAccessToken({}, { subject: String(user.id) });
    res.cookie('access_token', token, cookieOptions);
    return res.status(201).json({ user: publicUser(user) });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signAccessToken({}, { subject: String(user.id) });
    res.cookie('access_token', token, cookieOptions);
    return res.json({ user: publicUser(user) });
  } catch (err) { next(err); }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    return res.json({ user: publicUser(user) });
  } catch (err) { next(err); }
});

router.post('/logout', (req, res) => {
  res.cookie('access_token', '', { ...cookieOptions, maxAge: 0 });
  return res.json({ ok: true });
});

export default router;
