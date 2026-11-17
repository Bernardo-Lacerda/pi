document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('#lista-categorias');
    const botaoAbrirCriar = document.querySelector('#btn-abrir-criar-lista');
    const botaoSalvar = document.querySelector('#btn-salvar-lista');
    const campoNome = document.querySelector('#nome-lista');
    const campoId = document.querySelector('#lista-id');
    const tituloModal = document.querySelector('#titulo-modal-lista');
    const modalEl = document.querySelector('#modal-lista');
    const modal = modalEl ? new bootstrap.Modal(modalEl) : null;

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
                '<div class="border-top pt-3 d-flex flex-column h-100">' +
                '<h2 class="h4 titulo">' + OrganizaUI.escapar(lista.nome) + '</h2>' +
                '<p class="text-secondary flex-grow-1">' + lista.total_tarefas + ' tarefa(s) nesta lista</p>' +
                '<div class="d-flex gap-2">' +
                '<button class="btn btn-sm btn-outline-dark btn-editar-lista" data-bs-toggle="modal" data-bs-target="#modal-lista" data-id="' + lista.id + '" data-nome="' + OrganizaUI.escapar(lista.nome) + '">Editar</button>' +
                '<button class="btn btn-sm btn-outline-danger btn-excluir-lista" data-id="' + lista.id + '">Excluir</button>' +
                '</div></div>';
            container.appendChild(coluna);
        });
    }

    function abrirParaCriar() {
        campoId.value = '';
        campoNome.value = '';
        tituloModal.textContent = 'Criar uma nova lista';
        botaoSalvar.textContent = 'Criar lista';
    }

    function abrirParaEditar(id, nome) {
        campoId.value = id;
        campoNome.value = nome;
        tituloModal.textContent = 'Editar lista';
        botaoSalvar.textContent = 'Salvar';
    }

    if (botaoAbrirCriar) {
        botaoAbrirCriar.addEventListener('click', abrirParaCriar);
    }

    if (botaoSalvar) {
        botaoSalvar.addEventListener('click', async function () {
            const nome = campoNome.value.trim();
            if (!nome) {
                return;
            }
            try {
                if (campoId.value) {
                    await OrganizaAPI.put('/listas/' + campoId.value, { nome: nome });
                } else {
                    await OrganizaAPI.post('/listas', { nome: nome });
                }
                if (modal) {
                    modal.hide();
                }
                campoNome.value = '';
                campoId.value = '';
                carregar();
            } catch (erro) {
                alert(erro.message);
            }
        });
    }

    if (container) {
        container.addEventListener('click', async function (evento) {
            const botaoEditar = evento.target.closest('.btn-editar-lista');
            if (botaoEditar) {
                abrirParaEditar(botaoEditar.dataset.id, botaoEditar.dataset.nome);
                return;
            }
            const botaoExcluir = evento.target.closest('.btn-excluir-lista');
            if (botaoExcluir) {
                if (!window.confirm('Tem certeza que deseja excluir esta lista? As tarefas dela ficam sem lista.')) {
                    return;
                }
                try {
                    await OrganizaAPI.del('/listas/' + botaoExcluir.dataset.id);
                    carregar();
                } catch (erro) {
                    alert(erro.message);
                }
            }
        });
    }

    carregar();
});
