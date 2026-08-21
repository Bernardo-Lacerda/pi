if (!document.querySelector('nav')) {
    var marca = document.querySelector('main > .navbar-brand');
    if (marca) {
        marca.remove();
    }
    var navegacao = document.createElement('nav');
    navegacao.className = 'navbar border-bottom mb-4';
    navegacao.innerHTML = '<div class="container d-flex flex-wrap align-items-center gap-3"><a class="navbar-brand titulo me-auto" href="index.html">organiza<span>+</span></a><div class="navbar-nav flex-row flex-wrap gap-2"><a class="nav-link" href="dashboard.html">Dashboard</a><a class="nav-link" href="tarefas.html">Tarefas</a><a class="nav-link" href="categorias.html">Listas</a><a class="nav-link" href="calendario.html">Calendário</a><a class="nav-link" href="notificacoes.html">Notificações</a><a class="nav-link" href="perfil.html">Perfil</a><a class="nav-link" href="admin.html">Administração</a><a class="nav-link" href="index.html">Início</a></div></div>';
    document.body.prepend(navegacao);
}

document.querySelectorAll('[data-confirmar]').forEach(function (botao) {
    botao.addEventListener('click', function () {
        botao.textContent = botao.dataset.confirmar;
        botao.classList.add('disabled');
    });
});

var senha = document.querySelector('#senha');
var confirmarSenha = document.querySelector('#confirmar');
if (senha && confirmarSenha) {
    confirmarSenha.form.addEventListener('submit', function (evento) {
        if (senha.value !== confirmarSenha.value) {
            evento.preventDefault();
            confirmarSenha.setCustomValidity('As senhas precisam ser iguais.');
            confirmarSenha.reportValidity();
        } else {
            confirmarSenha.setCustomValidity('');
        }
    });
}
