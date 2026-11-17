<?php
class Notificacao
{
    public static function listarPorUsuario(int $usuarioId): array
    {
        $stmt = Database::conectar()->prepare(
            'SELECT * FROM notificacoes WHERE usuario_id = ? ORDER BY criado_em DESC LIMIT 50'
        );
        $stmt->execute([$usuarioId]);
        return $stmt->fetchAll();
    }

    public static function criar(int $usuarioId, string $titulo, ?string $descricao, string $tipo): int
    {
        $pdo = Database::conectar();
        $stmt = $pdo->prepare('INSERT INTO notificacoes (usuario_id, titulo, descricao, tipo) VALUES (?, ?, ?, ?)');
        $stmt->execute([$usuarioId, $titulo, $descricao, $tipo]);
        return (int) $pdo->lastInsertId();
    }

    public static function marcarComoLida(int $id, int $usuarioId): bool
    {
        $pdo = Database::conectar();
        $stmt = $pdo->prepare('UPDATE notificacoes SET lida = 1 WHERE id = ? AND usuario_id = ?');
        $stmt->execute([$id, $usuarioId]);
        if ($stmt->rowCount() > 0) {
            return true;
        }
        $verificar = $pdo->prepare('SELECT 1 FROM notificacoes WHERE id = ? AND usuario_id = ?');
        $verificar->execute([$id, $usuarioId]);
        return (bool) $verificar->fetchColumn();
    }

    public static function marcarTodasComoLidas(int $usuarioId): void
    {
        Database::conectar()->prepare('UPDATE notificacoes SET lida = 1 WHERE usuario_id = ?')->execute([$usuarioId]);
    }
}
