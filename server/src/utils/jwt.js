import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('JWT_SECRET not set');
}

export function signAccessToken(payload, options = {}) {
  // We store user id in the JWT subject (sub)
  return jwt.sign(payload, SECRET, { expiresIn: '7d', ...options });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, SECRET);
}
