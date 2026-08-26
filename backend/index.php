<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config/Database.php';

try {

    $conexao = Database::conectar();

    $consulta = $conexao->query('SELECT DATABASE() AS banco');

    $resultado = $consulta->fetch();

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Conexão com o banco realizada com sucesso!',
        'banco' => $resultado['banco']
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $erro) {

    http_response_code(500);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => $erro->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}