function errorHandler(err, req, res, next) {
  console.error('[GlucoWise Error]', err.message);
  const status = err.status || 500;
  const safe = status < 500 ? err.message : 'Internal server error';
  res.status(status).json({ error: safe });
}

module.exports = { errorHandler };
