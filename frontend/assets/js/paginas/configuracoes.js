document.addEventListener('DOMContentLoaded', async function () {
    const prazo = document.querySelector('#prazo');
    if (!prazo) {
        return;
    }
    const resumo = document.querySelector('#resumo');
    const mensagem = document.querySelector('#mensagem-preferencias');

    try {
        const dados = await OrganizaAPI.get('/perfil');
        prazo.checked = !!dados.usuario.notificar_prazos;
        resumo.checked = !!dados.usuario.resumo_diario;
    } catch (erro) {
        mensagem.className = 'text-danger small';
        mensagem.textContent = erro.message;
    }

    async function salvar() {
        try {
            await OrganizaAPI.put('/perfil/preferencias', {
                notificar_prazos: prazo.checked,
                resumo_diario: resumo.checked,
            });
            mensagem.className = 'text-success small';
            mensagem.textContent = 'Preferências salvas.';
        } catch (erro) {
            mensagem.className = 'text-danger small';
            mensagem.textContent = erro.message;
        }
    }

    prazo.addEventListener('change', salvar);
    resumo.addEventListener('change', salvar);
});
