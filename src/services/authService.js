const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/userModel');

const authService = {
  async register({ name, email, password }) {
    // 1. Verifica se o email já está cadastrado
    const existingUser = UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // 2. Criptografa a senha (o número 10 é o "custo" da criptografia)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Cria o usuário
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    UserModel.create(newUser);

    // 4. Retorna sem a senha — nunca exponha a senha, nem criptografada
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
};

module.exports = authService;