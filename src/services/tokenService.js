const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const jwtConfig = require('../config/jwt');
const RefreshTokenModel = require('../models/refreshTokenModel');

const tokenService = {
  // Gera o Access Token (curta duração)
  generateAccessToken(payload) {
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
  },

  // Gera e salva o Refresh Token (longa duração)
  generateRefreshToken(userId) {
    const token = uuidv4(); // token aleatório, não é JWT

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // expira em 7 dias

    RefreshTokenModel.save({
      token,
      userId,
      expiresAt: expiresAt.toISOString(),
    });

    return token;
  },

  // Valida o Access Token e retorna o payload
  verifyAccessToken(token) {
    return jwt.verify(token, jwtConfig.secret);
  },

  // Valida o Refresh Token e retorna os dados
  validateRefreshToken(token) {
    const storedToken = RefreshTokenModel.findByToken(token);

    if (!storedToken) {
      throw new Error('Refresh token inválido');
    }

    if (new Date() > new Date(storedToken.expiresAt)) {
      RefreshTokenModel.delete(token);
      throw new Error('Refresh token expirado');
    }

    return storedToken;
  },
};

module.exports = tokenService;