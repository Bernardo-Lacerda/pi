document.addEventListener('DOMContentLoaded', function () {
    const lista = document.querySelector('#lista-notificacoes');
    if (!lista) {
        return;
    }

    const rotulosTipo = {
        informacao: 'badge text-bg-light',
        prazo: 'badge text-bg-warning',
        conclusao: 'badge text-bg-success',
    };
    const nomesTipo = {
        informacao: 'Informação',
        prazo: 'Prazo',
        conclusao: 'Conclusão',
    };

    async function carregar() {
        try {
            const dados = await OrganizaAPI.get('/notificacoes');
            renderizar(dados.notificacoes);
        } catch (erro) {
            lista.innerHTML = '<p class="text-danger">' + OrganizaUI.escapar(erro.message) + '</p>';
        }
    }

    function renderizar(notificacoes) {
        lista.innerHTML = '';
        if (notificacoes.length === 0) {
            lista.innerHTML = '<p class="text-secondary">Nenhuma notificação por aqui.</p>';
            return;
        }
        notificacoes.forEach(function (notificacao) {
            const item = document.createElement('div');
            item.className = 'border-bottom py-4' + (notificacao.lida == 0 ? '' : ' opacity-50');
            item.innerHTML =
                '<span class="' + rotulosTipo[notificacao.tipo] + ' mb-2">' + nomesTipo[notificacao.tipo] + '</span>' +
                '<h2 class="h5 titulo">' + OrganizaUI.escapar(notificacao.titulo) + '</h2>' +
                (notificacao.descricao ? '<p class="text-secondary mb-1">' + OrganizaUI.escapar(notificacao.descricao) + '</p>' : '') +
                '<small class="text-secondary">' + OrganizaUI.escapar(notificacao.criado_em) + '</small>' +
                (notificacao.lida == 0 ? ' <button type="button" class="btn btn-sm btn-link" data-id="' + notificacao.id + '">Marcar como lida</button>' : '');
            lista.appendChild(item);
        });
    }

    lista.addEventListener('click', async function (evento) {
        const botao = evento.target.closest('button[data-id]');
        if (!botao) {
            return;
        }
        try {
            await OrganizaAPI.put('/notificacoes/' + botao.dataset.id + '/lida');
            await carregar();
        } catch (erro) {
            window.alert(erro.message);
        }
    });

    document.querySelector('#btn-marcar-todas').addEventListener('click', async function () {
        try {
            await OrganizaAPI.put('/notificacoes/lidas');
            await carregar();
        } catch (erro) {
            window.alert(erro.message);
        }
    });

    carregar();
});
