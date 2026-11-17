document.addEventListener('DOMContentLoaded', async function () {
    const prazo = document.querySelector('#prazo');
    if (!prazo) {
        return;
    }
    const resumo = document.querySelector('#resumo');
    const mensagem = document.querySelector('#mensagem-preferencias');
    const modoEscuro = document.querySelector('#modo-escuro');

    if (modoEscuro) {
        modoEscuro.checked = localStorage.getItem('organiza-tema') === 'escuro';
        modoEscuro.addEventListener('change', function () {
            if (modoEscuro.checked) {
                document.documentElement.setAttribute('data-bs-theme', 'dark');
                localStorage.setItem('organiza-tema', 'escuro');
            } else {
                document.documentElement.removeAttribute('data-bs-theme');
                localStorage.setItem('organiza-tema', 'claro');
            }
        });
    }

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
