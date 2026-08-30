<?php
class AuthController
{
    public static function registrar(): void
    {
        Auth::exigirCsrf();
        $dados = Requisicao::corpo();
        $nome = trim($dados['nome'] ?? '');
        $email = trim(strtolower($dados['email'] ?? ''));
        $senha = $dados['senha'] ?? '';

        if ($nome === '' || $email === '' || strlen($senha) < 6) {
            Resposta::erro('Preencha nome, email e uma senha com pelo menos 6 caracteres.', 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Resposta::erro('Email invalido.', 422);
        }
        if (Usuario::buscarPorEmail($email)) {
            Resposta::erro('Este email ja esta cadastrado.', 409);
        }

        $id = Usuario::criar($nome, $email, $senha);
        $usuario = Usuario::buscarPorId($id);
        Auth::login($usuario);
        Resposta::json(['usuario' => $usuario, 'csrf_token' => Auth::gerarCsrfToken()], 201);
    }

    public static function login(): void
    {
        Auth::exigirCsrf();
        $dados = Requisicao::corpo();
        $email = trim(strtolower($dados['email'] ?? ''));
        $senha = $dados['senha'] ?? '';

        $usuario = Usuario::buscarPorEmail($email);
        if (!$usuario || !$usuario['ativo'] || !password_verify($senha, $usuario['senha'])) {
            Resposta::erro('Email ou senha invalidos.', 401);
        }

        Auth::login($usuario);
        unset($usuario['senha']);
        Resposta::json(['usuario' => $usuario, 'csrf_token' => Auth::gerarCsrfToken()]);
    }

    public static function logout(): void
    {
        Auth::exigirCsrf();
        Auth::logout();
        Resposta::json(['ok' => true]);
    }
}
