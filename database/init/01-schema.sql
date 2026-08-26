CREATE TABLE usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    senha VARCHAR(255) NOT NULL,

    tipo_usuario ENUM('usuario', 'admin')
        NOT NULL
        DEFAULT 'usuario',

    ativo BOOLEAN
        NOT NULL
        DEFAULT TRUE,

    notificar_prazos BOOLEAN
        NOT NULL
        DEFAULT TRUE,

    resumo_diario BOOLEAN
        NOT NULL
        DEFAULT TRUE,

    criado_em TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    atualizado_em TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE listas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,

    usuario_id INT UNSIGNED NOT NULL,

    criado_em TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_listas_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_lista_usuario
        UNIQUE (usuario_id, nome)
);


CREATE TABLE tarefas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    titulo VARCHAR(200) NOT NULL,

    descricao TEXT,

    prazo DATE,

    prioridade ENUM(
        'baixa',
        'media',
        'alta'
    )
        NOT NULL
        DEFAULT 'media',

    status ENUM(
        'pendente',
        'em_progresso',
        'concluida'
    )
        NOT NULL
        DEFAULT 'pendente',

    usuario_id INT UNSIGNED NOT NULL,

    lista_id INT UNSIGNED NULL,

    concluida_em DATETIME NULL,

    criado_em TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    atualizado_em TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tarefas_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tarefas_lista
        FOREIGN KEY (lista_id)
        REFERENCES listas(id)
        ON DELETE SET NULL
);


CREATE TABLE notificacoes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT UNSIGNED NOT NULL,

    titulo VARCHAR(150) NOT NULL,

    descricao TEXT,

    tipo ENUM(
        'informacao',
        'prazo',
        'conclusao'
    )
        NOT NULL
        DEFAULT 'informacao',

    lida BOOLEAN
        NOT NULL
        DEFAULT FALSE,

    criado_em TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notificacoes_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);


CREATE TABLE recuperacoes_senha (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT UNSIGNED NOT NULL,

    token_hash VARCHAR(255) NOT NULL UNIQUE,

    expira_em DATETIME NOT NULL,

    usado_em DATETIME NULL,

    criado_em TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recuperacoes_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_tarefas_usuario
ON tarefas(usuario_id);


CREATE INDEX idx_tarefas_status
ON tarefas(status);


CREATE INDEX idx_tarefas_prazo
ON tarefas(prazo);


CREATE INDEX idx_notificacoes_usuario
ON notificacoes(usuario_id);