<?php
class ListaController
{
    public static function listar(): void
    {
        $usuario = Auth::exigirLogin();
        Resposta::json(['listas' => Lista::listarPorUsuario((int) $usuario['id'])]);
    }

    public static function criar(): void
    {
        $usuario = Auth::exigirLogin();
        Auth::exigirCsrf();
        $nome = trim(Requisicao::corpo()['nome'] ?? '');
        if ($nome === '') {
            Resposta::erro('Informe um nome para a lista.', 422);
        }
        if (Lista::buscarPorNome((int) $usuario['id'], $nome)) {
            Resposta::erro('Voce ja tem uma lista com esse nome.', 409);
        }
        $id = Lista::criar((int) $usuario['id'], $nome);
        Resposta::json(['lista' => Lista::buscarPorId($id, (int) $usuario['id'])], 201);
    }

    public static function atualizar(int $id): void
    {
        $usuario = Auth::exigirLogin();
        Auth::exigirCsrf();
        $nome = trim(Requisicao::corpo()['nome'] ?? '');
        if ($nome === '') {
            Resposta::erro('Informe um nome para a lista.', 422);
        }
        if (!Lista::atualizar($id, (int) $usuario['id'], $nome)) {
            Resposta::erro('Lista nao encontrada.', 404);
        }
        Resposta::json(['lista' => Lista::buscarPorId($id, (int) $usuario['id'])]);
    }

    public static function excluir(int $id): void
    {
        $usuario = Auth::exigirLogin();
        Auth::exigirCsrf();
        if (!Lista::excluir($id, (int) $usuario['id'])) {
            Resposta::erro('Lista nao encontrada.', 404);
        }
        Resposta::json(['ok' => true]);
    }
}
