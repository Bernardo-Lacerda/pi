<?php
class Auth
{
    private static ?array $usuarioCache = null;

    public static function iniciarSessao(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax']);
            session_start();
        }
    }

    public static function login(array $usuario): void
    {
        session_regenerate_id(true);
        $_SESSION['usuario_id'] = $usuario['id'];
        self::$usuarioCache = null;
        self::gerarCsrfToken();
    }

    public static function logout(): void
    {
        $_SESSION = [];
        session_destroy();
        self::$usuarioCache = null;
    }

    public static function logado(): bool
    {
        return isset($_SESSION['usuario_id']);
    }

    public static function usuarioAtual(bool $recarregar = false): ?array
    {
        if (!self::logado()) {
            return null;
        }
        if (self::$usuarioCache === null || $recarregar) {
            self::$usuarioCache = Usuario::buscarPorId((int) $_SESSION['usuario_id']);
        }
        return self::$usuarioCache;
    }

    public static function exigirLogin(): array
    {
        $usuario = self::usuarioAtual();
        if (!$usuario) {
            Resposta::erro('E necessario estar autenticado.', 401);
        }
        return $usuario;
    }

    public static function exigirAdmin(): array
    {
        $usuario = self::exigirLogin();
        if ($usuario['tipo_usuario'] !== 'admin') {
            Resposta::erro('Acesso restrito ao administrador.', 403);
        }
        return $usuario;
    }

    public static function gerarCsrfToken(): string
    {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function exigirCsrf(): void
    {
        $token = Requisicao::cabecalhoCsrf();
        if (!$token || empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
            Resposta::erro('Token CSRF ausente ou invalido.', 403);
        }
    }
}
