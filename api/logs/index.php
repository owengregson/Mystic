<?php
declare(strict_types=1);
header('Content-Type: application/json');

require_once dirname(__DIR__) . '/lib.php';

/* ------ guard ------ */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Method Not Allowed']);
}

/* ------ input ------ */
$p      = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$level  = strtoupper($p['level']  ?? 'INFO');   // INFO | WARNING | ERROR
$msg    = trim($p['message'] ?? '');
$ctx    = $p['context'] ?? [];

if ($msg === '') {
    respond(400, ['error' => 'Missing message']);
}

/* ------ write ------ */
log_write($level, $msg, $ctx);

respond(200, ['success' => true]);
