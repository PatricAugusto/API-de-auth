const authService = require('../services/authService');

const authController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validação básica dos campos
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
      }

      const user = await authService.register({ name, email, password });

      return res.status(201).json({
        message: 'Usuário cadastrado com sucesso!',
        user,
      });
    } catch (error) {
      // Erro de negócio (ex: email duplicado)
      if (error.message === 'Email já cadastrado') {
        return res.status(409).json({ error: error.message });
      }

      // Erro inesperado
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const data = await authService.login({ email, password });

      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        ...data,
      });
    } catch (error) {
      if (error.message === 'Credenciais inválidas') {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token é obrigatório' });
      }

      const tokens = await authService.refresh(refreshToken);

      return res.status(200).json({
        message: 'Tokens renovados com sucesso!',
        ...tokens,
      });
    } catch (error) {
      if (
        error.message === 'Refresh token inválido' ||
        error.message === 'Refresh token expirado'
      ) {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async logout(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token é obrigatório' });
      }

      await authService.logout(refreshToken);

      return res.status(200).json({ message: 'Logout realizado com sucesso!' });
    } catch (error) {
      if (error.message === 'Token não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
};

module.exports = authController;