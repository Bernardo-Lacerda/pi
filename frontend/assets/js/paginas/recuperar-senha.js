document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#form-recuperar');
    if (!form) {
        return;
    }

    form.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        const email = document.querySelector('#email').value.trim();
        try {
            const dados = await OrganizaAPI.post('/auth/recuperar-senha', { email: email });
            const token = dados.token_demo || '';
            window.location.href = 'redefinir-senha.html?token=' + encodeURIComponent(token);
        } catch (erro) {
            OrganizaUI.mostrarMensagem(form, erro.message, 'erro');
        }
    });
});
