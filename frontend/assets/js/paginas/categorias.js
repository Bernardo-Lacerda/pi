document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('#lista-categorias');
    const botaoCriar = document.querySelector('#btn-criar-lista');
    const campoNome = document.querySelector('#nome-lista');

    async function carregar() {
        if (!container) {
            return;
        }
        try {
            const dados = await OrganizaAPI.get('/listas');
            renderizar(dados.listas);
        } catch (erro) {
            container.innerHTML = '<p class="text-danger">' + OrganizaUI.escapar(erro.message) + '</p>';
        }
    }

    function renderizar(listas) {
        container.innerHTML = '';
        if (listas.length === 0) {
            container.innerHTML = '<p class="text-secondary">Nenhuma lista ainda.</p>';
            return;
        }
        listas.forEach(function (lista) {
            const coluna = document.createElement('div');
            coluna.className = 'col-md-6 col-lg-3';
            coluna.innerHTML =
                '<div class="border-top pt-3"><h2 class="h4 titulo">' + OrganizaUI.escapar(lista.nome) + '</h2>' +
                '<p class="text-secondary">' + lista.total_tarefas + ' tarefa(s) nesta lista</p></div>';
            container.appendChild(coluna);
        });
    }

    if (botaoCriar) {
        botaoCriar.addEventListener('click', async function () {
            const nome = campoNome.value.trim();
            if (!nome) {
                return;
            }
            try {
                await OrganizaAPI.post('/listas', { nome: nome });
                campoNome.value = '';
                carregar();
            } catch (erro) {
                alert(erro.message);
            }
        });
    }

    carregar();
});
