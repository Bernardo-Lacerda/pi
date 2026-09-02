document.addEventListener('DOMContentLoaded', async function () {
    const container = document.querySelector('#lista-concluidas');
    if (!container) {
        return;
    }

    try {
        const dadosListas = await OrganizaAPI.get('/listas');
        const nomesListas = {};
        dadosListas.listas.forEach(function (item) {
            nomesListas[item.id] = item.nome;
        });

        const dados = await OrganizaAPI.get('/tarefas?status=concluida');
        renderizar(dados.tarefas, nomesListas);
    } catch (erro) {
        container.innerHTML = '<p class="text-danger">' + OrganizaUI.escapar(erro.message) + '</p>';
    }

    function renderizar(tarefas, nomesListas) {
        container.innerHTML = '';
        if (tarefas.length === 0) {
            container.innerHTML = '<p class="text-secondary">Nenhuma tarefa concluída ainda.</p>';
            return;
        }
        tarefas.forEach(function (tarefa) {
            const nomeLista = tarefa.lista_id ? (nomesListas[tarefa.lista_id] || 'Lista removida') : 'Sem lista';
            const item = document.createElement('a');
            item.href = 'tarefa-visualizar.html?id=' + tarefa.id;
            item.className = 'list-group-item list-group-item-action py-3';
            item.innerHTML =
                '<div class="text-decoration-line-through">' + OrganizaUI.escapar(tarefa.titulo) + '</div><small class="text-secondary">Concluída em ' +
                OrganizaUI.escapar(tarefa.concluida_em || '') + ' · ' + OrganizaUI.escapar(nomeLista) + '</small>';
            container.appendChild(item);
        });
    }
});
