document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            window.location.href = "/login.html";
        });
    }

    // Código opcional: Exibir saudação com nome e sobrenome
    const urlParams = new URLSearchParams(window.location.search);
    const nome = urlParams.get('nome');
    const sobrenome = urlParams.get('sobrenome');
    const welcomeText = document.getElementById('welcome-text');

    if (nome && sobrenome && welcomeText) {
        welcomeText.textContent = `Bem-vindo(a), ${nome} ${sobrenome}!`;
    }
});

const postInput = document.querySelector('#post-text input');
const postButton = document.querySelector('#post-submit');
const postList = document.querySelector('#post-list');

postButton.addEventListener('click', () => {
    const text = postInput.value.trim();

    if (text === '') {
        return;
    }

    const postDiv = document.createElement('div');
    postDiv.className = 'post';

    postDiv.innerHTML = `
      <div class="feed-profile-picture">
        <img src="../img/svg/user.svg" />
      </div>
      <div class="feed-content">
        <p class="feed-name">Você</p>
        <div class="feed-text">${text}</div>
        <div class="feed-options">
          <img src="../img/svg/heart.svg" class="img post-like" />
          <img src="../img/svg/chat.svg" class="img post-comment" />
          <img src="../img/svg/send.svg" class="img post-share" />
        </div>
      </div>
      <div class="feed-aux">
        <div>agora mesmo</div>
      </div>
    `;

    // Adiciona o novo post no topo
    postList.prepend(postDiv);

    // Limpa o campo de texto
    postInput.value = '';
});