const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/userModel');
const RefreshTokenModel = require('../models/refreshTokenModel');
const tokenService = require('./tokenService');

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

  async login({ email, password }) {
    // 1. Verifica se o usuário existe
    const user = UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // 2. Compara a senha enviada com o hash salvo
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Credenciais inválidas');
    }

    // 3. Gera os tokens
    const accessToken = tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = tokenService.generateRefreshToken(user.id);

    // 4. Retorna os tokens e os dados do usuário
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  },

  async refresh(token) {
    // 1. Valida o refresh token
    const storedToken = tokenService.validateRefreshToken(token);

    // 2. Busca o usuário dono do token
    const user = UserModel.findById(storedToken.userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // 3. Rotação de token — apaga o antigo e gera um novo par
    RefreshTokenModel.delete(token);

    const newAccessToken = tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
    });

    const newRefreshToken = tokenService.generateRefreshToken(user.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  async logout(token) {
    const deleted = RefreshTokenModel.delete(token);
    if (!deleted) {
      throw new Error('Token não encontrado');
    }
  },
};

module.exports = authService;