document.addEventListener('DOMContentLoaded', async function () {
    const form = document.querySelector('#form-perfil');
    if (!form) {
        return;
    }

    function iniciais(nome) {
        const partes = nome.trim().split(/\s+/);
        const letras = partes.slice(0, 2).map(function (p) { return p.charAt(0).toUpperCase(); });
        return letras.join('') || '?';
    }

    function preencher(usuario) {
        document.querySelector('#nome').value = usuario.nome;
        document.querySelector('#email').value = usuario.email;
        document.querySelector('#exibir-nome').textContent = usuario.nome;
        document.querySelector('#exibir-email').textContent = usuario.email;
        document.querySelector('#avatar-iniciais').textContent = iniciais(usuario.nome);
    }

    try {
        const dados = await OrganizaAPI.get('/perfil');
        preencher(dados.usuario);
    } catch (erro) {
        OrganizaUI.mostrarMensagem(form, erro.message, 'erro');
    }

    form.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        const nome = document.querySelector('#nome').value.trim();
        const email = document.querySelector('#email').value.trim();
        try {
            const dados = await OrganizaAPI.put('/perfil', { nome: nome, email: email });
            preencher(dados.usuario);
            OrganizaUI.mostrarMensagem(form, 'Suas informações foram atualizadas.', 'sucesso');
        } catch (erro) {
            OrganizaUI.mostrarMensagem(form, erro.message, 'erro');
        }
    });

    document.querySelector('#btn-excluir-conta').addEventListener('click', async function () {
        if (!window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
            return;
        }
        try {
            await OrganizaAPI.del('/auth/conta');
            window.location.href = 'index.html';
        } catch (erro) {
            OrganizaUI.mostrarMensagem(form, erro.message, 'erro');
        }
    });
});
