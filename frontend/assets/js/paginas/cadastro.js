document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#form-cadastro');
    if (!form) {
        return;
    }
    form.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        const nome = document.querySelector('#nome').value.trim();
        const email = document.querySelector('#email').value.trim();
        const senha = document.querySelector('#senha').value;
        try {
            await OrganizaAPI.post('/auth/registrar', { nome: nome, email: email, senha: senha });
            window.location.href = 'dashboard.html';
        } catch (erro) {
            OrganizaUI.mostrarMensagem(form, erro.message, 'erro');
        }
    });
});
