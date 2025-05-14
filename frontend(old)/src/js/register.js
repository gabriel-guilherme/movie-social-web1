document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        const email = form.querySelector('#email');
        const password = form.querySelector('#password');

        if (!email.value || !password.value) {
            e.preventDefault();
            alert('Preencha todos os campos!');
        }

    });



    const loginBtn = document.getElementById("login-btn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href = "/login.html";
        });
    }
});