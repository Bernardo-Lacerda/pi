<?php
class AdminController
{
    public static function listarUsuarios(): void
    {
        Auth::exigirAdmin();
        $busca = isset($_GET['busca']) ? trim($_GET['busca']) : null;
        Resposta::json(['usuarios' => Usuario::listarTodos($busca ?: null)]);
    }

    public static function removerUsuario(int $id): void
    {
        $admin = Auth::exigirAdmin();
        Auth::exigirCsrf();
        if ((int) $admin['id'] === $id) {
            Resposta::erro('Voce nao pode remover sua propria conta de administrador por aqui.', 400);
        }
        Usuario::excluir($id);
        Resposta::json(['ok' => true]);
    }
}
