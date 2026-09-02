document.addEventListener('DOMContentLoaded', async function () {
    const form = document.querySelector('#form-tarefa');
    if (!form) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');
    const mensagem = document.querySelector('#mensagem-tarefa');
    const selectLista = document.querySelector('#lista');

    if (!id) {
        mensagem.textContent = 'Nenhuma tarefa informada.';
        form.classList.add('d-none');
        return;
    }

    document.querySelector('#link-descartar').href = 'tarefa-visualizar.html?id=' + id;

    try {
        const dadosListas = await OrganizaAPI.get('/listas');
        dadosListas.listas.forEach(function (item) {
            const opcao = document.createElement('option');
            opcao.value = item.id;
            opcao.textContent = item.nome;
            selectLista.appendChild(opcao);
        });

        const dados = await OrganizaAPI.get('/tarefas/' + id);
        const tarefa = dados.tarefa;
        document.querySelector('#titulo-tarefa').value = tarefa.titulo;
        document.querySelector('#descricao').value = tarefa.descricao || '';
        document.querySelector('#prioridade').value = tarefa.prioridade;
        document.querySelector('#status').value = tarefa.status;
        document.querySelector('#prazo').value = tarefa.prazo || '';
        selectLista.value = tarefa.lista_id || '';
    } catch (erro) {
        mensagem.textContent = erro.message;
        form.classList.add('d-none');
        return;
    }

    form.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        const corpo = {
            titulo: document.querySelector('#titulo-tarefa').value.trim(),
            descricao: document.querySelector('#descricao').value.trim(),
            lista_id: selectLista.value || null,
            prioridade: document.querySelector('#prioridade').value,
            status: document.querySelector('#status').value,
            prazo: document.querySelector('#prazo').value || null,
        };
        try {
            await OrganizaAPI.put('/tarefas/' + id, corpo);
            window.location.href = 'tarefa-visualizar.html?id=' + id;
        } catch (erro) {
            mensagem.textContent = erro.message;
        }
    });
});
