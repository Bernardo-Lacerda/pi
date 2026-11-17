window.OrganizaUI = {
    rotulosPrioridade: { baixa: 'Baixa', media: 'Média', alta: 'Alta' },
    rotulosStatus: { pendente: 'Pendente', em_progresso: 'Em andamento', concluida: 'Concluída' },

    mostrarMensagem: function (form, texto, tipo) {
        let caixa = form.querySelector('.organiza-mensagem');
        if (!caixa) {
            caixa = document.createElement('div');
            caixa.className = 'organiza-mensagem mb-3';
            form.prepend(caixa);
        }
        caixa.textContent = texto;
        caixa.className = 'organiza-mensagem mb-3 ' + (tipo === 'erro' ? 'text-danger' : 'text-success');
    },

    escapar: function (texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    },
};

document.addEventListener('DOMContentLoaded', async function () {
    const linksAdmin = document.querySelectorAll('.nav-admin');
    if (linksAdmin.length === 0) {
        return;
    }
    try {
        const dados = await OrganizaAPI.get('/perfil');
        if (dados.usuario.tipo_usuario === 'admin') {
            linksAdmin.forEach(function (link) {
                link.classList.remove('d-none');
            });
        }
    } catch (erro) {
        // usuario nao autenticado: links de administracao continuam escondidos
    }
});
