const UserModel = require('../models/userModel');

const userController = {
  // Retorna os dados do próprio usuário logado
  async me(req, res, next) {
    try {
      const user = UserModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      next(error);
    }
  },

  // Retorna todos os usuários cadastrados
  async list(req, res) {
    try {
      const users = UserModel.getAll().map(({ password: _, ...user }) => user);
      return res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;