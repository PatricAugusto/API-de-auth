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
};

module.exports = authController;