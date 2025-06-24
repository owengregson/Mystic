<?php
declare(strict_types=1);
header('Content-Type: application/json');

require_once dirname(__DIR__) . '/lib.php';

function fail(int $c, string $m, array $ctx = []): never {
    log_write('WARNING', $m, $ctx);
    http_response_code($c);
    exit(json_encode(['error'=>$m]));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405,'Method Not Allowed');

$p    = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$user = $p['username'] ?? '';
$pass = $p['password'] ?? '';
$key  = $p['token']    ?? '';

if ($key !== cfg()['registration']['creation_key'])
    fail(403,'Forbidden registration key', ['user'=>$user]);

if (!preg_match('/^[A-Za-z0-9_]{3,16}$/',$user))
    fail(422,'Bad username format');
if (strlen($pass) < 8)
    fail(422,'Password too short');

$store = users_store();
$fp = fopen($store,'c+'); flock($fp,LOCK_EX);
$data  = stream_get_contents($fp) ?: '{"users":[]}';
$db    = json_decode($data,true);

foreach ($db['users'] as $u)
    if (hash_equals($u['username'], $user))
        { flock($fp,LOCK_UN); fclose($fp); fail(409,'Username in use'); }

$db['users'][] = [
    'username'=>$user,
    'password_hash'=>password_hash($pass,PASSWORD_DEFAULT),
    'created_at'=>gmdate('c')
];

rewind($fp); ftruncate($fp,0);
fwrite($fp,json_encode($db,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
flock($fp,LOCK_UN); fclose($fp);

log_write('INFO','User registered',['user'=>$user,'ip'=>$_SERVER['REMOTE_ADDR']??'']);

echo json_encode(['success'=>true]);
