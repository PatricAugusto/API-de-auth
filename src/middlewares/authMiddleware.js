const tokenService = require('../services/tokenService');

function authMiddleware(req, res, next) {
  // 1. Pega o header Authorization
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // 2. O header vem no formato "Bearer eyJhbGci..."
  //    Separamos a palavra "Bearer" do token em si
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  const token = parts[1];

  try {
    // 3. Verifica e decodifica o token
    const payload = tokenService.verifyAccessToken(token);

    // 4. Injeta os dados do usuário na requisição
    //    Agora qualquer controller pode acessar req.user
    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    next(); // libera para o próximo handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = authMiddleware;