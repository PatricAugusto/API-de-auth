function errorMiddleware(err, req, res, next) {
  // Loga o erro no console para debug
  console.error(`[${new Date().toISOString()}] ${err.message}`);

  // Erros de negócio — lançados intencionalmente nos services
  const businessErrors = {
    'Email já cadastrado': 409,
    'Credenciais inválidas': 401,
    'Refresh token inválido': 401,
    'Refresh token expirado': 401,
    'Token não encontrado': 404,
    'Usuário não encontrado': 404,
  };

  if (businessErrors[err.message]) {
    return res.status(businessErrors[err.message]).json({
      error: err.message,
    });
  }

  // Erros de JWT
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expirado' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token inválido' });
  }

  // Erro genérico — não expõe detalhes internos
  return res.status(500).json({ error: 'Erro interno do servidor' });
}

module.exports = errorMiddleware;