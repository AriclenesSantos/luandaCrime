function redirecionar() {
    window.location.href = "file:///C:/Users/NEMESIS/Desktop/luandaCrime%20Zone/mapa/mapa.html"; // Caminho para o arquivo HTML"; 
}
document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', (e) => {
        redirecionar();
    });
  });