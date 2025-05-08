document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        // (Opcional) Validações aqui, se quiser
        const email = form.querySelector('#email');
        const password = form.querySelector('#password');

        if (!email.value || !password.value) {
            e.preventDefault(); // Impede o envio se estiver inválido
            alert('Preencha todos os campos!');
        }

        // Se estiver tudo ok, o formulário será enviado normalmente
        // O redirecionamento será feito pelo servidor (Node.js)
    });



    const loginBtn = document.getElementById("login-btn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href = "/login.html";
        });
    }
});