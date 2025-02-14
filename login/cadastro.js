document.addEventListener("DOMContentLoaded", () => {
    // Seleciona os elementos da interface
    const registerButton = document.querySelector(".inputBx input[type='submit']");
    const usernameInput = document.querySelector(".inputBx input[placeholder='Digite o Nome de usuario']");
    const profilePicInput = document.getElementById('profile-pic');

    const emailInput = document.querySelector(".inputBx input[placeholder='Digite o E-mail']");
    const passwordInput = document.querySelector(".inputBx input[placeholder='Digite o Senha']");
    const addressInput = document.querySelector(".inputBx input[placeholder='Digite o Endereço']");
  
    // Função para cadastrar um novo usuário
    function registerUser(username, email, password, address, profilePic) {
      if (localStorage.getItem(username)) {
        alert("Usuário já cadastrado! Use outro nome de usuário.");
        return;
      }

      const userData = { email, password, address, profilePic };

      localStorage.setItem(username, JSON.stringify(userData));
      alert("Cadastro realizado com sucesso! Você pode fazer login agora.");
    }
  
    // Listener para o botão de cadastro
    registerButton.addEventListener("click", (event) => {
      event.preventDefault(); // Evita o comportamento padrão do formulário

      const username = usernameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const address = addressInput.value.trim();
      const profilePic = profilePicInput.files[0];

      if (!username || !email || !password || !address || !profilePic) {
        alert("Por favor, preencha todos os campos e selecione uma foto de perfil.");
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const profilePicBase64 = e.target.result;
        registerUser(username, email, password, address, profilePicBase64);
      };
      reader.readAsDataURL(profilePic);

    });
  });
