<?php

require_once __DIR__ . '/config.php';

class Database
{
    private static ?PDO $conexao = null;

    public static function conectar(): PDO
    {
        if (self::$conexao === null) {
            try {
                $dsn = 'mysql:host=' . DB_HOST .
                       ';port=' . DB_PORT .
                       ';dbname=' . DB_NAME .
                       ';charset=utf8mb4';

                self::$conexao = new PDO(
                    $dsn,
                    DB_USER,
                    DB_PASSWORD,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false
                    ]
                );

            } catch (PDOException $erro) {
                throw new Exception(
                    'Erro ao conectar com o banco de dados: ' .
                    $erro->getMessage()
                );
            }
        }

        return self::$conexao;
    }
}