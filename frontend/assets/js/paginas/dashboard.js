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
        } else {
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
        }

        renderizarGraficoSemanal(tarefas);
    } catch (erro) {
        document.querySelector('#lista-prazos').innerHTML = '<p class="text-danger">' + OrganizaUI.escapar(erro.message) + '</p>';
    }
});

function inicioDaSemana(data) {
    const d = new Date(data);
    const diaDaSemana = d.getDay();
    const diferenca = diaDaSemana === 0 ? 6 : diaDaSemana - 1;
    d.setDate(d.getDate() - diferenca);
    d.setHours(0, 0, 0, 0);
    return d;
}

function renderizarGraficoSemanal(tarefas) {
    const grafico = document.querySelector('#grafico-semanal');
    if (!grafico) {
        return;
    }

    const numeroDeSemanas = 6;
    const semanaAtual = inicioDaSemana(new Date());
    const semanas = [];
    for (let i = numeroDeSemanas - 1; i >= 0; i--) {
        const inicio = new Date(semanaAtual);
        inicio.setDate(inicio.getDate() - i * 7);
        const fim = new Date(inicio);
        fim.setDate(fim.getDate() + 7);
        semanas.push({ inicio: inicio, fim: fim, total: 0 });
    }

    tarefas.forEach(function (tarefa) {
        if (tarefa.status !== 'concluida' || !tarefa.concluida_em) {
            return;
        }
        const dataConclusao = new Date(tarefa.concluida_em.replace(' ', 'T'));
        semanas.forEach(function (semana) {
            if (dataConclusao >= semana.inicio && dataConclusao < semana.fim) {
                semana.total += 1;
            }
        });
    });

    const maximo = Math.max(1, ...semanas.map(function (semana) { return semana.total; }));
    grafico.innerHTML = '';
    semanas.forEach(function (semana) {
        const altura = Math.round((semana.total / maximo) * 100);
        const rotulo = semana.inicio.getDate() + '/' + (semana.inicio.getMonth() + 1);
        const coluna = document.createElement('div');
        coluna.className = 'coluna-semana';
        coluna.innerHTML =
            '<span class="pequeno mb-1">' + semana.total + '</span>' +
            '<div class="barra-semana" style="height: ' + Math.max(altura, 3) + '%;"></div>' +
            '<span class="pequeno text-secondary mt-2">' + rotulo + '</span>';
        grafico.appendChild(coluna);
    });
}
