<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/core/Resposta.php';
require_once __DIR__ . '/core/Requisicao.php';
require_once __DIR__ . '/core/Auth.php';
require_once __DIR__ . '/models/Usuario.php';
require_once __DIR__ . '/models/Tarefa.php';
require_once __DIR__ . '/models/RecuperacaoSenha.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/TarefaController.php';
require_once __DIR__ . '/controllers/AdminController.php';

Auth::iniciarSessao();

$metodo = Requisicao::metodo();
$partes = Requisicao::segmentos();
$recurso = $partes[0] ?? '';
$sub1 = $partes[1] ?? null;
$sub2 = $partes[2] ?? null;

try {
    switch (true) {
        case $recurso === 'auth' && $sub1 === 'csrf' && $metodo === 'GET':
            AuthController::csrf();
            break;
        case $recurso === 'auth' && $sub1 === 'registrar' && $metodo === 'POST':
            AuthController::registrar();
            break;
        case $recurso === 'auth' && $sub1 === 'login' && $metodo === 'POST':
            AuthController::login();
            break;
        case $recurso === 'auth' && $sub1 === 'logout' && $metodo === 'POST':
            AuthController::logout();
            break;
        case $recurso === 'auth' && $sub1 === 'recuperar-senha' && $metodo === 'POST':
            AuthController::solicitarRecuperacao();
            break;
        case $recurso === 'auth' && $sub1 === 'redefinir-senha' && $metodo === 'POST':
            AuthController::redefinirSenha();
            break;
        case $recurso === 'auth' && $sub1 === 'conta' && $metodo === 'DELETE':
            AuthController::excluirConta();
            break;

        case $recurso === 'tarefas' && $sub1 === null && $metodo === 'GET':
            TarefaController::listar();
            break;
        case $recurso === 'tarefas' && $sub1 === null && $metodo === 'POST':
            TarefaController::criar();
            break;
        case $recurso === 'tarefas' && is_numeric($sub1) && $sub2 === null && $metodo === 'GET':
            TarefaController::exibir((int) $sub1);
            break;
        case $recurso === 'tarefas' && is_numeric($sub1) && $sub2 === null && $metodo === 'PUT':
            TarefaController::atualizar((int) $sub1);
            break;
        case $recurso === 'tarefas' && is_numeric($sub1) && $sub2 === 'status' && $metodo === 'PUT':
            TarefaController::atualizarStatus((int) $sub1);
            break;
        case $recurso === 'tarefas' && is_numeric($sub1) && $sub2 === null && $metodo === 'DELETE':
            TarefaController::excluir((int) $sub1);
            break;

        case $recurso === 'admin' && $sub1 === 'usuarios' && $sub2 === null && $metodo === 'GET':
            AdminController::listarUsuarios();
            break;
        case $recurso === 'admin' && $sub1 === 'usuarios' && is_numeric($sub2) && $metodo === 'DELETE':
            AdminController::removerUsuario((int) $sub2);
            break;

        default:
            Resposta::erro('Rota nao encontrada.', 404);
    }
} catch (Throwable $e) {
    error_log($e->getMessage());
    Resposta::erro('Erro interno do servidor.', 500);
}
