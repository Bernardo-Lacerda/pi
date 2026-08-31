<?php
class Lista
{
    public static function listarPorUsuario(int $usuarioId): array
    {
        $stmt = Database::conectar()->prepare(
            'SELECT l.*, (SELECT COUNT(*) FROM tarefas t WHERE t.lista_id = l.id) AS total_tarefas
             FROM listas l WHERE l.usuario_id = ? ORDER BY l.nome'
        );
        $stmt->execute([$usuarioId]);
        return $stmt->fetchAll();
    }

    public static function buscarPorId(int $id, int $usuarioId): ?array
    {
        $stmt = Database::conectar()->prepare('SELECT * FROM listas WHERE id = ? AND usuario_id = ?');
        $stmt->execute([$id, $usuarioId]);
        $lista = $stmt->fetch();
        return $lista ?: null;
    }

    public static function buscarPorNome(int $usuarioId, string $nome): ?array
    {
        $stmt = Database::conectar()->prepare('SELECT * FROM listas WHERE usuario_id = ? AND nome = ?');
        $stmt->execute([$usuarioId, $nome]);
        $lista = $stmt->fetch();
        return $lista ?: null;
    }

    public static function criar(int $usuarioId, string $nome): int
    {
        $pdo = Database::conectar();
        $stmt = $pdo->prepare('INSERT INTO listas (nome, usuario_id) VALUES (?, ?)');
        $stmt->execute([$nome, $usuarioId]);
        return (int) $pdo->lastInsertId();
    }

    public static function atualizar(int $id, int $usuarioId, string $nome): bool
    {
        $stmt = Database::conectar()->prepare('UPDATE listas SET nome = ? WHERE id = ? AND usuario_id = ?');
        $stmt->execute([$nome, $id, $usuarioId]);
        return $stmt->rowCount() > 0;
    }

    public static function excluir(int $id, int $usuarioId): bool
    {
        $stmt = Database::conectar()->prepare('DELETE FROM listas WHERE id = ? AND usuario_id = ?');
        $stmt->execute([$id, $usuarioId]);
        return $stmt->rowCount() > 0;
    }
}
