window.OrganizaUI = {
    rotulosPrioridade: { baixa: 'Baixa', media: 'Média', alta: 'Alta' },
    rotulosStatus: { pendente: 'Pendente', em_progresso: 'Em andamento', concluida: 'Concluída' },

    mostrarMensagem: function (form, texto, tipo) {
        let caixa = form.querySelector('.organiza-mensagem');
        if (!caixa) {
            caixa = document.createElement('div');
            caixa.className = 'organiza-mensagem mb-3';
            form.prepend(caixa);
        }
        caixa.textContent = texto;
        caixa.className = 'organiza-mensagem mb-3 ' + (tipo === 'erro' ? 'text-danger' : 'text-success');
    },

    escapar: function (texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    },
};
