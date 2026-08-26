<?php

define('APP_ENV', getenv('APP_ENV') ?: 'development');
define('APP_URL', getenv('APP_URL') ?: 'http://localhost:8080');

define('DB_HOST', getenv('DB_HOST') ?: 'db');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'organiza_plus');
define('DB_USER', getenv('DB_USER') ?: 'organiza_user');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: '');