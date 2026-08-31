<?php
class NotificacaoController
{
    public static function listar(): void
    {
        $usuario = Auth::exigirLogin();
        Resposta::json(['notificacoes' => Notificacao::listarPorUsuario((int) $usuario['id'])]);
    }

    public static function marcarLida(int $id): void
    {
        $usuario = Auth::exigirLogin();
        Auth::exigirCsrf();
        if (!Notificacao::marcarComoLida($id, (int) $usuario['id'])) {
            Resposta::erro('Notificacao nao encontrada.', 404);
        }
        Resposta::json(['ok' => true]);
    }

    public static function marcarTodasLidas(): void
    {
        $usuario = Auth::exigirLogin();
        Auth::exigirCsrf();
        Notificacao::marcarTodasComoLidas((int) $usuario['id']);
        Resposta::json(['ok' => true]);
    }
}
