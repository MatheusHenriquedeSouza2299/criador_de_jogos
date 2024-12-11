const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Simulação do banco de dados
const users = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    res.status(200).json({ message: 'Login bem-sucedido!' });
  } else {
    res.status(401).json({ message: 'Usuário ou senha incorretos!' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
