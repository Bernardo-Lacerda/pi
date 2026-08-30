<?php
class Tarefa
{
    public static function listarPorUsuario(int $usuarioId, ?string $status = null, ?int $listaId = null): array
    {
        $sql = 'SELECT * FROM tarefas WHERE usuario_id = ?';
        $params = [$usuarioId];
        if ($status) {
            $sql .= ' AND status = ?';
            $params[] = $status;
        }
        if ($listaId) {
            $sql .= ' AND lista_id = ?';
            $params[] = $listaId;
        }
        $sql .= ' ORDER BY (prazo IS NULL), prazo ASC, criado_em DESC';
        $stmt = Database::conectar()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function buscarPorId(int $id, int $usuarioId): ?array
    {
        $stmt = Database::conectar()->prepare('SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?');
        $stmt->execute([$id, $usuarioId]);
        $tarefa = $stmt->fetch();
        return $tarefa ?: null;
    }

    public static function criar(int $usuarioId, array $dados): int
    {
        $pdo = Database::conectar();
        $status = $dados['status'] ?? 'pendente';
        $stmt = $pdo->prepare(
            'INSERT INTO tarefas (titulo, descricao, prazo, prioridade, status, usuario_id, lista_id, concluida_em)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $dados['titulo'],
            $dados['descricao'] ?? null,
            $dados['prazo'] ?: null,
            $dados['prioridade'] ?? 'media',
            $status,
            $usuarioId,
            $dados['lista_id'] ?: null,
            $status === 'concluida' ? date('Y-m-d H:i:s') : null,
        ]);
        return (int) $pdo->lastInsertId();
    }

    public static function atualizar(int $id, int $usuarioId, array $dados): bool
    {
        $status = $dados['status'] ?? 'pendente';
        $stmt = Database::conectar()->prepare(
            'UPDATE tarefas SET titulo = ?, descricao = ?, prazo = ?, prioridade = ?, status = ?, lista_id = ?, concluida_em = ?
             WHERE id = ? AND usuario_id = ?'
        );
        $stmt->execute([
            $dados['titulo'],
            $dados['descricao'] ?? null,
            $dados['prazo'] ?: null,
            $dados['prioridade'] ?? 'media',
            $status,
            $dados['lista_id'] ?: null,
            $status === 'concluida' ? date('Y-m-d H:i:s') : null,
            $id,
            $usuarioId,
        ]);
        return $stmt->rowCount() > 0;
    }

    public static function atualizarStatus(int $id, int $usuarioId, string $status): bool
    {
        $concluidaEm = $status === 'concluida' ? date('Y-m-d H:i:s') : null;
        $stmt = Database::conectar()->prepare(
            'UPDATE tarefas SET status = ?, concluida_em = ? WHERE id = ? AND usuario_id = ?'
        );
        $stmt->execute([$status, $concluidaEm, $id, $usuarioId]);
        return $stmt->rowCount() > 0;
    }

    public static function excluir(int $id, int $usuarioId): bool
    {
        $stmt = Database::conectar()->prepare('DELETE FROM tarefas WHERE id = ? AND usuario_id = ?');
        $stmt->execute([$id, $usuarioId]);
        return $stmt->rowCount() > 0;
    }
}
