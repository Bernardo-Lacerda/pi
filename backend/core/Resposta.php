<?php
class Resposta
{
    public static function json($dados, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($dados, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function erro(string $mensagem, int $status = 400): void
    {
        self::json(['erro' => $mensagem], $status);
    }
}
