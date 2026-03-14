// "banco de dados" em memória
const users = [];

const UserModel = {
  // Busca usuário pelo email
  findByEmail(email) {
    return users.find((user) => user.email === email);
  },

  // Busca usuário pelo ID
  findById(id) {
    return users.find((user) => user.id === id);
  },

  // Cria e salva um novo usuário
  create(userData) {
    users.push(userData);
    return userData;
  },

  // Retorna todos os usuários (útil para debug)
  getAll() {
    return users;
  },
};

module.exports = UserModel;