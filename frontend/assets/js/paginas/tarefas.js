document.addEventListener('DOMContentLoaded', async function () {
    const lista = document.querySelector('#lista-tarefas');
    if (!lista) {
        return;
    }

    const filtroStatus = document.querySelector('#filtro-status');
    const filtroLista = document.querySelector('#filtro-lista');
    const filtroPrioridade = document.querySelector('#filtro-prioridade');
    let nomesListas = {};

    async function carregarListas() {
        try {
            const dados = await OrganizaAPI.get('/listas');
            dados.listas.forEach(function (item) {
                nomesListas[item.id] = item.nome;
                const opcao = document.createElement('option');
                opcao.value = item.id;
                opcao.textContent = item.nome;
                filtroLista.appendChild(opcao);
            });
        } catch (erro) {
            filtroLista.disabled = true;
        }
    }

    async function carregarTarefas() {
        const parametros = new URLSearchParams();
        if (filtroStatus.value) {
            parametros.set('status', filtroStatus.value);
        }
        if (filtroLista.value) {
            parametros.set('lista_id', filtroLista.value);
        }
        const consulta = parametros.toString();
        try {
            const dados = await OrganizaAPI.get('/tarefas' + (consulta ? '?' + consulta : ''));
            let tarefas = dados.tarefas;
            if (filtroPrioridade.value) {
                tarefas = tarefas.filter(function (tarefa) {
                    return tarefa.prioridade === filtroPrioridade.value;
                });
            }
            renderizar(tarefas);
        } catch (erro) {
            lista.innerHTML = '<p class="text-danger">' + OrganizaUI.escapar(erro.message) + '</p>';
        }
    }

    function renderizar(tarefas) {
        lista.innerHTML = '';
        if (tarefas.length === 0) {
            lista.innerHTML = '<p class="text-secondary">Nenhuma tarefa encontrada.</p>';
            return;
        }
        tarefas.forEach(function (tarefa) {
            const nomeLista = tarefa.lista_id ? (nomesListas[tarefa.lista_id] || 'Lista removida') : 'Sem lista';
            const item = document.createElement('a');
            item.href = 'tarefa-visualizar.html?id=' + tarefa.id;
            item.className = 'list-group-item list-group-item-action py-3';
            item.innerHTML =
                '<div class="row align-items-center">' +
                '<div class="col-md-6"><strong>' + OrganizaUI.escapar(tarefa.titulo) + '</strong>' +
                '<div class="text-secondary small">' + (tarefa.prazo || 'Sem prazo') + ' &middot; ' + OrganizaUI.escapar(nomeLista) + '</div></div>' +
                '<div class="col-md-3"><span class="badge text-bg-light">' + OrganizaUI.rotulosPrioridade[tarefa.prioridade] + '</span> ' +
                '<span class="badge text-bg-light">' + OrganizaUI.rotulosStatus[tarefa.status] + '</span></div>' +
                '<div class="col-md-3 text-md-end mt-2 mt-md-0"><span class="link-escuro">Abrir tarefa &#8594;</span></div>' +
                '</div>';
            lista.appendChild(item);
        });
    }

    filtroStatus.addEventListener('change', carregarTarefas);
    filtroLista.addEventListener('change', carregarTarefas);
    filtroPrioridade.addEventListener('change', carregarTarefas);

    await carregarListas();
    await carregarTarefas();
});
