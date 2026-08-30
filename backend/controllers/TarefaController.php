<?php
class TarefaController
{
    public static function listar(): void
    {
        $usuario = Auth::exigirLogin();
        $status = $_GET['status'] ?? null;
        $listaId = isset($_GET['lista_id']) ? (int) $_GET['lista_id'] : null;
        Resposta::json(['tarefas' => Tarefa::listarPorUsuario((int) $usuario['id'], $status, $listaId)]);
    }

    public static function exibir(int $id): void
    {
        $usuario = Auth::exigirLogin();
        $tarefa = Tarefa::buscarPorId($id, (int) $usuario['id']);
        if (!$tarefa) {
            Resposta::erro('Tarefa nao encontrada.', 404);
        }
        Resposta::json(['tarefa' => $tarefa]);
    }

    public static function criar(): void
    {
        $usuario = Auth::exigirLogin();
        Auth::exigirCsrf();
        $dados = Requisicao::corpo();
        self::validar($dados);
        $id = Tarefa::criar((int) $usuario['id'], $dados);
        Resposta::json(['tarefa' => Tarefa::buscarPorId($id, (int) $usuario['id'])], 201);
    }

    public static function atualizar(int $id): void
    {
        $usuario = Auth::exigirLogin();
        Auth::exigirCsrf();
        $dados = Requisicao::corpo();
        self::validar($dados);
        if (!Tarefa::atualizar($id, (int) $usuario['id'], $dados)) {
            Resposta::erro('Tarefa nao encontrada.', 404);
        }
        Resposta::json(['tarefa' => Tarefa::buscarPorId($id, (int) $usuario['id'])]);
    }

    public static function atualizarStatus(int $id): void
    {
        $usuario = Auth::exigirLogin();
        Auth::exigirCsrf();
        $status = Requisicao::corpo()['status'] ?? '';
        if (!in_array($status, ['pendente', 'em_progresso', 'concluida'], true)) {
            Resposta::erro('Status invalido.', 422);
        }
        if (!Tarefa::atualizarStatus($id, (int) $usuario['id'], $status)) {
            Resposta::erro('Tarefa nao encontrada.', 404);
        }
        Resposta::json(['ok' => true]);
    }

    public static function excluir(int $id): void
    {
        $usuario = Auth::exigirLogin();
        Auth::exigirCsrf();
        if (!Tarefa::excluir($id, (int) $usuario['id'])) {
            Resposta::erro('Tarefa nao encontrada.', 404);
        }
        Resposta::json(['ok' => true]);
    }

    private static function validar(array $dados): void
    {
        if (trim($dados['titulo'] ?? '') === '') {
            Resposta::erro('O titulo da tarefa e obrigatorio.', 422);
        }
    }
}
