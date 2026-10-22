document.addEventListener('DOMContentLoaded', async function () {
    const saudacao = document.querySelector('#saudacao');
    if (!saudacao) {
        return;
    }

    const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const agora = new Date();
    document.querySelector('#data-hoje').textContent = diasSemana[agora.getDay()] + ', ' + agora.getDate() + ' de ' + meses[agora.getMonth()];

    try {
        const perfil = await OrganizaAPI.get('/perfil');
        const primeiroNome = perfil.usuario.nome.split(' ')[0];
        saudacao.textContent = 'Bom dia, ' + primeiroNome + '. Veja o que merece atenção hoje.';
        document.querySelector('#link-nome-usuario').textContent = perfil.usuario.nome;
    } catch (erro) {
        saudacao.textContent = 'Veja o que merece atenção hoje.';
    }

    try {
        const dados = await OrganizaAPI.get('/tarefas');
        const tarefas = dados.tarefas;
        document.querySelector('#contagem-pendentes').textContent = tarefas.filter(function (t) { return t.status === 'pendente'; }).length;
        document.querySelector('#contagem-andamento').textContent = tarefas.filter(function (t) { return t.status === 'em_progresso'; }).length;
        document.querySelector('#contagem-concluidas').textContent = tarefas.filter(function (t) { return t.status === 'concluida'; }).length;

        const lista = document.querySelector('#lista-prazos');
        const proximos = tarefas.filter(function (t) { return t.status !== 'concluida' && t.prazo; }).slice(0, 3);
        lista.innerHTML = '';
        if (proximos.length === 0) {
            lista.innerHTML = '<p class="text-secondary">Nenhum prazo próximo.</p>';
            return;
        }
        proximos.forEach(function (tarefa) {
            const item = document.createElement('a');
            item.href = 'tarefa-visualizar.html?id=' + tarefa.id;
            item.className = 'list-group-item list-group-item-action py-3';
            item.innerHTML =
                '<div class="d-flex justify-content-between"><strong>' + OrganizaUI.escapar(tarefa.titulo) + '</strong><span class="badge text-bg-light">' +
                OrganizaUI.rotulosPrioridade[tarefa.prioridade] + '</span></div><small class="text-secondary">vence em ' +
                OrganizaUI.escapar(tarefa.prazo) + '</small>';
            lista.appendChild(item);
        });
    } catch (erro) {
        document.querySelector('#lista-prazos').innerHTML = '<p class="text-danger">' + OrganizaUI.escapar(erro.message) + '</p>';
    }
});
