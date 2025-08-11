export function notFound(req, res, next) {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err, req, res, next) {

  console.error(err);

  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  const message = (isProd && status === 500)
    ? 'Internal Server Error'
    : (err.message || 'Server error');

  res.status(status).json({ error: message });
}