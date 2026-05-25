function errorHandler(err, req, res, next) {
  console.error('[GlucoWise Error]', err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
}

module.exports = { errorHandler };
