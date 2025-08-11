export function notFound(req, res, next) {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err, req, res, next) {
  // Basic logging for now; can replace with a logger later
  // eslint-disable-next-line no-console
  console.error(err);

  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  const message = (isProd && status === 500)
    ? 'Internal Server Error'
    : (err.message || 'Server error');

  res.status(status).json({ error: message });
}