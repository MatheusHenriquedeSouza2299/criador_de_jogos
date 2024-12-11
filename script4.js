document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
  
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Redireciona para a página inicial em caso de sucesso
        window.location.href = 'home.html';
      } else {
        errorMessage.textContent = result.message;
      }
    } catch (error) {
      errorMessage.textContent = 'Erro ao conectar ao servidor!';
    }
  });
  