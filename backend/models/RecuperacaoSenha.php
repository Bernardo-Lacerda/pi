<?php
class RecuperacaoSenha
{
    public static function criar(int $usuarioId): string
    {
        $pdo = Database::conectar();
        $token = bin2hex(random_bytes(32));
        $hash = hash('sha256', $token);
        $expira = date('Y-m-d H:i:s', strtotime('+1 hour'));
        $stmt = $pdo->prepare('INSERT INTO recuperacoes_senha (usuario_id, token_hash, expira_em) VALUES (?, ?, ?)');
        $stmt->execute([$usuarioId, $hash, $expira]);
        return $token;
    }

    public static function consumir(string $token): ?int
    {
        if ($token === '') {
            return null;
        }
        $hash = hash('sha256', $token);
        $pdo = Database::conectar();
        $stmt = $pdo->prepare(
            'SELECT id, usuario_id FROM recuperacoes_senha WHERE token_hash = ? AND usado_em IS NULL AND expira_em > NOW()'
        );
        $stmt->execute([$hash]);
        $linha = $stmt->fetch();
        if (!$linha) {
            return null;
        }
        $pdo->prepare('UPDATE recuperacoes_senha SET usado_em = NOW() WHERE id = ?')->execute([$linha['id']]);
        return (int) $linha['usuario_id'];
    }
}
