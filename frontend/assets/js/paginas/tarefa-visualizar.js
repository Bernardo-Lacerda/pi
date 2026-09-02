document.addEventListener('DOMContentLoaded', async function () {
    const conteudo = document.querySelector('#conteudo-tarefa');
    if (!conteudo) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');
    const mensagem = document.querySelector('#mensagem-tarefa');

    if (!id) {
        conteudo.innerHTML = '<p class="text-danger">Nenhuma tarefa informada.</p>';
        return;
    }

    let tarefa = null;

    async function carregar() {
        try {
            const dados = await OrganizaAPI.get('/tarefas/' + id);
            tarefa = dados.tarefa;
            renderizar();
        } catch (erro) {
            conteudo.innerHTML = '<p class="text-danger">' + OrganizaUI.escapar(erro.message) + '</p>';
        }
    }

    function renderizar() {
        document.querySelector('#titulo-tarefa').textContent = tarefa.titulo;
        document.querySelector('#descricao-tarefa').textContent = tarefa.descricao || 'Sem descrição.';
        document.querySelector('#meta-tarefa').textContent =
            (tarefa.prazo ? 'vence em ' + tarefa.prazo : 'sem prazo') + ' · ' + OrganizaUI.rotulosStatus[tarefa.status];
        document.querySelector('#badge-prioridade').textContent = OrganizaUI.rotulosPrioridade[tarefa.prioridade];
        document.querySelector('#link-editar').href = 'tarefa-editar.html?id=' + tarefa.id;

        const botaoStatus = document.querySelector('#btn-alternar-status');
        botaoStatus.textContent = tarefa.status === 'concluida' ? 'Reabrir tarefa' : 'Marcar como concluída';
    }

    document.querySelector('#btn-alternar-status').addEventListener('click', async function () {
        const novoStatus = tarefa.status === 'concluida' ? 'pendente' : 'concluida';
        try {
            await OrganizaAPI.put('/tarefas/' + id + '/status', { status: novoStatus });
            await carregar();
        } catch (erro) {
            mensagem.textContent = erro.message;
        }
    });

    document.querySelector('#btn-excluir').addEventListener('click', async function () {
        if (!window.confirm('Excluir esta tarefa?')) {
            return;
        }
        try {
            await OrganizaAPI.del('/tarefas/' + id);
            window.location.href = 'tarefas.html';
        } catch (erro) {
            mensagem.textContent = erro.message;
        }
    });

    await carregar();
});
