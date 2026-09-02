document.addEventListener('DOMContentLoaded', function () {
    const corpo = document.querySelector('#corpo-calendario');
    const titulo = document.querySelector('#titulo-calendario');
    if (!corpo || !titulo) {
        return;
    }

    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    let referencia = new Date();
    referencia.setDate(1);

    async function carregar() {
        titulo.textContent = nomesMeses[referencia.getMonth()] + ' ' + referencia.getFullYear();
        try {
            const dados = await OrganizaAPI.get('/tarefas');
            renderizar(dados.tarefas);
        } catch (erro) {
            corpo.innerHTML = '<tr><td colspan="7" class="text-danger">' + OrganizaUI.escapar(erro.message) + '</td></tr>';
        }
    }

    function renderizar(tarefas) {
        const porDia = {};
        tarefas.forEach(function (tarefa) {
            if (!tarefa.prazo) {
                return;
            }
            const partes = tarefa.prazo.split('-');
            const ano = parseInt(partes[0], 10);
            const mes = parseInt(partes[1], 10) - 1;
            const dia = parseInt(partes[2], 10);
            if (ano === referencia.getFullYear() && mes === referencia.getMonth()) {
                porDia[dia] = porDia[dia] || [];
                porDia[dia].push(tarefa);
            }
        });

        const primeiroDiaSemana = new Date(referencia.getFullYear(), referencia.getMonth(), 1).getDay();
        const totalDias = new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0).getDate();

        corpo.innerHTML = '';
        let linha = document.createElement('tr');
        for (let i = 0; i < primeiroDiaSemana; i++) {
            linha.appendChild(document.createElement('td'));
        }

        for (let dia = 1; dia <= totalDias; dia++) {
            const celula = document.createElement('td');
            const tarefasDoDia = porDia[dia];
            if (tarefasDoDia) {
                celula.className = 'table-warning';
                celula.innerHTML = '<strong>' + dia + '</strong>';
                tarefasDoDia.forEach(function (tarefa) {
                    const linhaTarefa = document.createElement('div');
                    linhaTarefa.className = 'small text-start mt-2';
                    linhaTarefa.textContent = tarefa.titulo;
                    celula.appendChild(linhaTarefa);
                });
            } else {
                celula.textContent = String(dia);
            }
            linha.appendChild(celula);

            if ((primeiroDiaSemana + dia) % 7 === 0) {
                corpo.appendChild(linha);
                linha = document.createElement('tr');
            }
        }

        if (linha.children.length > 0) {
            while (linha.children.length < 7) {
                linha.appendChild(document.createElement('td'));
            }
            corpo.appendChild(linha);
        }
    }

    const botaoAnterior = document.querySelector('#btn-mes-anterior');
    const botaoProximo = document.querySelector('#btn-mes-proximo');
    const botaoHoje = document.querySelector('#btn-mes-hoje');

    if (botaoAnterior) {
        botaoAnterior.addEventListener('click', function () {
            referencia.setMonth(referencia.getMonth() - 1);
            carregar();
        });
    }
    if (botaoProximo) {
        botaoProximo.addEventListener('click', function () {
            referencia.setMonth(referencia.getMonth() + 1);
            carregar();
        });
    }
    if (botaoHoje) {
        botaoHoje.addEventListener('click', function () {
            referencia = new Date();
            referencia.setDate(1);
            carregar();
        });
    }

    carregar();
});
