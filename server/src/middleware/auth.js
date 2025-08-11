import { verifyAccessToken } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = verifyAccessToken(token);
    // decoded.sub set when we sign the token
    req.user = { id: parseInt(decoded.sub, 10) };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
