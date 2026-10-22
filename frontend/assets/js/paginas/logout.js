document.addEventListener('DOMContentLoaded', async function () {
    const mensagem = document.querySelector('#mensagem-logout');
    if (!mensagem) {
        return;
    }
    try {
        await OrganizaAPI.post('/auth/logout');
        mensagem.textContent = 'Sua sessão foi encerrada.';
    } catch (erro) {
        mensagem.textContent = 'Sua sessão foi encerrada.';
    }
});
