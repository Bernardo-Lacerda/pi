<?php
class PerfilController
{
    public static function exibir(): void
    {
        Resposta::json(['usuario' => Auth::exigirLogin()]);
    }

    public static function atualizar(): void
    {
        $usuario = Auth::exigirLogin();
        Auth::exigirCsrf();
        $dados = Requisicao::corpo();
        $nome = trim($dados['nome'] ?? '');
        $email = trim(strtolower($dados['email'] ?? ''));
        if ($nome === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Resposta::erro('Informe um nome e um email validos.', 422);
        }
        $existente = Usuario::buscarPorEmail($email);
        if ($existente && (int) $existente['id'] !== (int) $usuario['id']) {
            Resposta::erro('Este email ja esta em uso por outra conta.', 409);
        }
        Usuario::atualizarPerfil((int) $usuario['id'], $nome, $email);
        Resposta::json(['usuario' => Usuario::buscarPorId((int) $usuario['id'])]);
    }

    public static function atualizarSenha(): void
    {
        $usuario = Auth::exigirLogin();
        Auth::exigirCsrf();
        $dados = Requisicao::corpo();
        $completo = Usuario::buscarPorEmail($usuario['email']);
        if (!password_verify($dados['senha_atual'] ?? '', $completo['senha'])) {
            Resposta::erro('Senha atual incorreta.', 401);
        }
        if (strlen($dados['senha_nova'] ?? '') < 6) {
            Resposta::erro('A nova senha deve ter pelo menos 6 caracteres.', 422);
        }
        Usuario::atualizarSenha((int) $usuario['id'], $dados['senha_nova']);
        Resposta::json(['ok' => true]);
    }

    public static function atualizarPreferencias(): void
    {
        $usuario = Auth::exigirLogin();
        Auth::exigirCsrf();
        $dados = Requisicao::corpo();
        Usuario::atualizarPreferencias(
            (int) $usuario['id'],
            !empty($dados['notificar_prazos']),
            !empty($dados['resumo_diario'])
        );
        Resposta::json(['usuario' => Usuario::buscarPorId((int) $usuario['id'])]);
    }
}
