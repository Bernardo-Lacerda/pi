document.addEventListener('DOMContentLoaded', function () {
    const tabela = document.querySelector('#tabela-usuarios');
    if (!tabela) {
        return;
    }

    const busca = document.querySelector('#busca-usuario');
    const mensagem = document.querySelector('#mensagem-admin');

    async function carregar() {
        const termo = busca.value.trim();
        const consulta = termo ? '?busca=' + encodeURIComponent(termo) : '';
        try {
            const dados = await OrganizaAPI.get('/admin/usuarios' + consulta);
            renderizar(dados.usuarios);
        } catch (erro) {
            mensagem.textContent = erro.message;
        }
    }

    function renderizar(usuarios) {
        tabela.innerHTML = '';
        if (usuarios.length === 0) {
            tabela.innerHTML = '<tr><td colspan="4" class="text-secondary">Nenhum usuário encontrado.</td></tr>';
            return;
        }
        usuarios.forEach(function (usuario) {
            const linha = document.createElement('tr');
            const statusBadge = usuario.ativo == 1
                ? '<span class="badge text-bg-success">Conta ativa</span>'
                : '<span class="badge text-bg-secondary">Conta desativada</span>';
            linha.innerHTML =
                '<td>' + OrganizaUI.escapar(usuario.nome) + '</td>' +
                '<td>' + OrganizaUI.escapar(usuario.email) + '</td>' +
                '<td>' + statusBadge + '</td>' +
                '<td><button type="button" class="btn btn-sm btn-outline-danger" data-id="' + usuario.id + '">Remover</button></td>';
            tabela.appendChild(linha);
        });
    }

    tabela.addEventListener('click', async function (evento) {
        const botao = evento.target.closest('button[data-id]');
        if (!botao) {
            return;
        }
        if (!window.confirm('Remover este usuário?')) {
            return;
        }
        try {
            await OrganizaAPI.del('/admin/usuarios/' + botao.dataset.id);
            await carregar();
        } catch (erro) {
            mensagem.textContent = erro.message;
        }
    });

    let temporizador = null;
    busca.addEventListener('input', function () {
        clearTimeout(temporizador);
        temporizador = setTimeout(carregar, 300);
    });

    carregar();
});
