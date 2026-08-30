<?php
class Usuario
{
    public static function buscarPorId(int $id): ?array
    {
        $stmt = Database::conectar()->prepare(
            'SELECT id, nome, email, tipo_usuario, ativo, notificar_prazos, resumo_diario, criado_em, atualizado_em
             FROM usuarios WHERE id = ?'
        );
        $stmt->execute([$id]);
        $usuario = $stmt->fetch();
        return $usuario ?: null;
    }

    public static function buscarPorEmail(string $email): ?array
    {
        $stmt = Database::conectar()->prepare('SELECT * FROM usuarios WHERE email = ?');
        $stmt->execute([$email]);
        $usuario = $stmt->fetch();
        return $usuario ?: null;
    }

    public static function criar(string $nome, string $email, string $senha): int
    {
        $pdo = Database::conectar();
        $hash = password_hash($senha, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)');
        $stmt->execute([$nome, $email, $hash]);
        return (int) $pdo->lastInsertId();
    }

    public static function atualizarPerfil(int $id, string $nome, string $email): void
    {
        $stmt = Database::conectar()->prepare('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?');
        $stmt->execute([$nome, $email, $id]);
    }

    public static function atualizarSenha(int $id, string $novaSenha): void
    {
        $hash = password_hash($novaSenha, PASSWORD_DEFAULT);
        $stmt = Database::conectar()->prepare('UPDATE usuarios SET senha = ? WHERE id = ?');
        $stmt->execute([$hash, $id]);
    }

    public static function atualizarPreferencias(int $id, bool $notificarPrazos, bool $resumoDiario): void
    {
        $stmt = Database::conectar()->prepare(
            'UPDATE usuarios SET notificar_prazos = ?, resumo_diario = ? WHERE id = ?'
        );
        $stmt->execute([$notificarPrazos ? 1 : 0, $resumoDiario ? 1 : 0, $id]);
    }

    public static function desativar(int $id): void
    {
        Database::conectar()->prepare('UPDATE usuarios SET ativo = 0 WHERE id = ?')->execute([$id]);
    }

    public static function excluir(int $id): void
    {
        Database::conectar()->prepare('DELETE FROM usuarios WHERE id = ?')->execute([$id]);
    }

    public static function listarTodos(?string $busca = null): array
    {
        $pdo = Database::conectar();
        if ($busca) {
            $stmt = $pdo->prepare(
                'SELECT id, nome, email, tipo_usuario, ativo, criado_em FROM usuarios
                 WHERE nome LIKE ? OR email LIKE ? ORDER BY criado_em DESC'
            );
            $termo = '%' . $busca . '%';
            $stmt->execute([$termo, $termo]);
        } else {
            $stmt = $pdo->query('SELECT id, nome, email, tipo_usuario, ativo, criado_em FROM usuarios ORDER BY criado_em DESC');
        }
        return $stmt->fetchAll();
    }
}
