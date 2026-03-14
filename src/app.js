require('dotenv').config(); 
const express = require('express');

const app = express();

// Middleware para o Express entender JSON no corpo das requisições
app.use(express.json());

// Rota de teste para confirmar que o servidor está no ar
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});