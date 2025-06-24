<?php
declare(strict_types=1);
header('Content-Type: application/json');

require_once dirname(__DIR__) . '/lib.php';

/* ------ guard ------ */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error'=>'Method Not Allowed']));
}

/* ------ input ------ */
$p      = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$level  = strtoupper($p['level']  ?? 'INFO');   // INFO | WARNING | ERROR
$msg    = trim($p['message'] ?? '');
$ctx    = $p['context'] ?? [];

if ($msg === '') {
    http_response_code(400);
    exit(json_encode(['error'=>'Missing message']));
}

/* ------ write ------ */
log_write($level, $msg, $ctx);

echo json_encode(['success'=>true]);
