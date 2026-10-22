document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#form-redefinir');
    if (!form) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const token = parametros.get('token') || '';

    form.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        const senha = document.querySelector('#senha').value;
        const confirmar = document.querySelector('#confirmar').value;

        if (senha !== confirmar) {
            OrganizaUI.mostrarMensagem(form, 'As senhas nao coincidem.', 'erro');
            return;
        }

        try {
            await OrganizaAPI.post('/auth/redefinir-senha', { token: token, senha: senha });
            window.location.href = 'login.html';
        } catch (erro) {
            OrganizaUI.mostrarMensagem(form, erro.message, 'erro');
        }
    });
});
