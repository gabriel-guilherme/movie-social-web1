document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error")) {
        document.getElementById("error-msg").innerText =
            "Usuário ou senha inválidos.";
    }

    console.log(params.get("error"))
});