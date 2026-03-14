// Armazena os refresh tokens ativos
const refreshTokens = [];

const RefreshTokenModel = {
  // Salva um novo refresh token
  save(tokenData) {
    refreshTokens.push(tokenData);
    return tokenData;
  },

  // Busca pelo token
  findByToken(token) {
    return refreshTokens.find((t) => t.token === token);
  },

  // Remove um token (logout)
  delete(token) {
    const index = refreshTokens.findIndex((t) => t.token === token);
    if (index !== -1) {
      refreshTokens.splice(index, 1);
      return true;
    }
    return false;
  },

  // Remove todos os tokens de um usuário (logout de todos os dispositivos)
  deleteAllByUserId(userId) {
    const before = refreshTokens.length;
    const remaining = refreshTokens.filter((t) => t.userId !== userId);
    refreshTokens.length = 0;
    refreshTokens.push(...remaining);
    return before - refreshTokens.length;
  },
};

module.exports = RefreshTokenModel;