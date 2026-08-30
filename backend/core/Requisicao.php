<?php
class Requisicao
{
    public static function metodo(): string
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    public static function corpo(): array
    {
        $bruto = file_get_contents('php://input');
        if (!$bruto) {
            return [];
        }
        $dados = json_decode($bruto, true);
        return is_array($dados) ? $dados : [];
    }

    public static function segmentos(): array
    {
        $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $uri = preg_replace('#^/api/?#', '', (string) $uri);
        return array_values(array_filter(explode('/', $uri), fn($p) => $p !== ''));
    }

    public static function cabecalhoCsrf(): ?string
    {
        return $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    }
}
