document.addEventListener('DOMContentLoaded', async function () {
    const form = document.querySelector('#form-tarefa');
    if (!form) {
        return;
    }

    const selectLista = document.querySelector('#lista');
    try {
        const dados = await OrganizaAPI.get('/listas');
        selectLista.innerHTML = '<option value="">Sem lista</option>';
        dados.listas.forEach(function (lista) {
            const opcao = document.createElement('option');
            opcao.value = lista.id;
            opcao.textContent = lista.nome;
            selectLista.appendChild(opcao);
        });
    } catch (erro) {
        OrganizaUI.mostrarMensagem(form, erro.message, 'erro');
    }

    form.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        const corpo = {
            titulo: document.querySelector('#titulo-tarefa').value.trim(),
            descricao: document.querySelector('#descricao').value.trim(),
            lista_id: selectLista.value || null,
            prioridade: document.querySelector('#prioridade').value,
            prazo: document.querySelector('#prazo').value || null,
        };
        try {
            await OrganizaAPI.post('/tarefas', corpo);
            window.location.href = 'tarefas.html';
        } catch (erro) {
            OrganizaUI.mostrarMensagem(form, erro.message, 'erro');
        }
    });
});
