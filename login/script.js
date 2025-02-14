document.addEventListener("DOMContentLoaded", () => {
    // Seleciona os elementos da interface
    const loginButton = document.querySelector(".inputBx input[type='submit']");
    const usernameInput = document.querySelector(".inputBx input[placeholder='Nome de usuario']");
    const emailInput = document.querySelector(".inputBx input[placeholder='E-mail']");
    const passwordInput = document.querySelector(".inputBx input[placeholder='Senha']");
  
    // Função para fazer login
    function loginUser(username, email, password) {
      const storedData = localStorage.getItem(username);
      if (!storedData) {
        alert("Usuário não encontrado. Por favor, cadastre-se primeiro.");
        return;
      }
  
      const userData = JSON.parse(storedData);
      if (userData.email === email && userData.password === password) {
        alert("Login bem-sucedido! Bem-vindo(a), " + username + "!");
        window.location.href = "C:/Users/NEMESIS/Desktop/luandaCrime Zone/loading pages/loadMap.html";
      } else {
        alert("Credenciais incorretas. Verifique seu e-mail e senha.");
      }

    }
  
    // Listener para o botão de login
    loginButton.addEventListener("click", (event) => {
      event.preventDefault(); // Evita o comportamento padrão do formulário
  
      const username = usernameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
  
      if (!username || !email || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
      }
  
      loginUser(username, email, password);
    });
  });
