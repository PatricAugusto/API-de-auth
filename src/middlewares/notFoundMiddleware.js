function notFoundMiddleware(req, res) {
  return res.status(404).json({
    error: `Rota ${req.method} ${req.path} não encontrada`,
  });
}

module.exports = notFoundMiddleware;