# 🔐 Auth API

API de autenticação completa construída com **Node.js** e **Express**, com cadastro de usuários, login com JWT, refresh token e controle de sessão.

---

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [JSON Web Token (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [dotenv](https://github.com/motdotla/dotenv)
- [uuid](https://github.com/uuidjs/uuid)
- [Nodemon](https://nodemon.io/) *(desenvolvimento)*

---

## 📁 Estrutura do projeto

```
auth-api/
├── src/
│   ├── config/
│   │   └── jwt.js                 # Configurações do JWT
│   ├── controllers/
│   │   ├── authController.js      # Handlers de autenticação
│   │   └── userController.js      # Handlers de usuário
│   ├── middlewares/
│   │   ├── authMiddleware.js      # Validação do Access Token
│   │   ├── errorMiddleware.js     # Tratamento global de erros
│   │   └── notFoundMiddleware.js  # Rotas não encontradas
│   ├── models/
│   │   ├── userModel.js           # Modelo de usuário (em memória)
│   │   └── refreshTokenModel.js   # Modelo de refresh token (em memória)
│   ├── routes/
│   │   ├── authRoutes.js          # Rotas públicas de autenticação
│   │   └── userRoutes.js          # Rotas protegidas de usuário
│   ├── services/
│   │   ├── authService.js         # Lógica de autenticação
│   │   └── tokenService.js        # Geração e validação de tokens
│   └── app.js                     # Configuração do servidor Express
├── .env                           # Variáveis de ambiente (não versionar)
├── .env.example                   # Exemplo de variáveis de ambiente
├── .gitignore
└── package.json
```

---

## ⚙️ Configuração e instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/auth-api.git

# Entre na pasta
cd auth-api

# Instale as dependências
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
PORT=3000
JWT_SECRET=minha_chave_secreta_super_segura_troque_isso
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

> ⚠️ Nunca suba o arquivo `.env` para o repositório. Ele já está no `.gitignore`.

### Executando o projeto

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

O servidor estará disponível em `http://localhost:3000`.

---

## 📡 Endpoints

### Públicos

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Verifica se o servidor está no ar |
| `POST` | `/auth/register` | Cadastro de novo usuário |
| `POST` | `/auth/login` | Login e geração de tokens |
| `POST` | `/auth/refresh` | Renovação do Access Token |
| `POST` | `/auth/logout` | Logout e invalidação do Refresh Token |

### Protegidos *(requerem Access Token)*

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/users/me` | Retorna dados do usuário autenticado |
| `GET` | `/users` | Lista todos os usuários cadastrados |

---

## 🔑 Como autenticar

### 1. Cadastro

```http
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

### 2. Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "123456"
}
```

Resposta:

```json
{
  "message": "Login realizado com sucesso!",
  "user": { "id": "...", "name": "João Silva", "email": "joao@email.com" },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "550e8400-e29b-41d4-a716-..."
}
```

### 3. Acessando rotas protegidas

Envie o `accessToken` no header de cada requisição:

```http
GET /users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 4. Renovando o Access Token

Quando o Access Token expirar (15 minutos), use o Refresh Token para obter um novo par:

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "550e8400-e29b-41d4-a716-..."
}
```

### 5. Logout

```http
POST /auth/logout
Content-Type: application/json

{
  "refreshToken": "550e8400-e29b-41d4-a716-..."
}
```

---

## 🔒 Segurança

- Senhas criptografadas com **bcryptjs** (salt rounds: 10)
- Access Token de curta duração (**15 minutos**)
- Refresh Token de longa duração (**7 dias**) com **rotação** a cada uso
- Tokens JWT assinados com chave secreta via variável de ambiente
- Senhas nunca retornadas nas respostas da API

---

## ⚠️ Observação sobre armazenamento

Os dados são armazenados **em memória** e são perdidos ao reiniciar o servidor. Essa abordagem foi escolhida intencionalmente para simplificar o aprendizado e focar na lógica de autenticação. Para um ambiente de produção, substitua os `models` por um banco de dados como **PostgreSQL** ou **MongoDB**.

---