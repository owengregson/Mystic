<?php
declare(strict_types=1);
header('Content-Type: application/json');

require_once dirname(__DIR__) . '/lib.php';

/* -------- helpers -------- */

function fail(int $c, string $m, array $ctx = []): never
{
    log_write('WARNING', $m, $ctx);
    respond($c, ['error' => $m]);
}

function verify_turnstile(string $token): bool
{
    $secret = cfg()['cloudflare']['site_private_key'];
    $body   = http_build_query([
        'secret'   => $secret,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
    ]);
    $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $body,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 4
    ]);
    $out = curl_exec($ch);
    curl_close($ch);
    if (!$out) return false;
    return (json_decode($out, true)['success'] ?? false) === true;
}

/* -------- request -------- */

if ($_SERVER['REQUEST_METHOD'] !== 'POST')
    fail(405, 'Method Not Allowed');

$p        = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$user     = $p['username']              ?? '';
$pass     = $p['password']              ?? '';
$captcha  = $p['cf-turnstile-response'] ?? '';

if ($user === '' || $pass === '') fail(400, 'Missing credentials');
if ($captcha  === '')             fail(400, 'Captcha token missing');
if (!verify_turnstile($captcha))  fail(403, 'Captcha failed');

$store = users_store();
if (!is_readable($store)) fail(500, 'Storage error');

$records = json_decode(file_get_contents($store), true)['users'] ?? [];
$acc = null;
foreach ($records as $r) if (hash_equals($r['username'], $user)) { $acc = $r; break; }

if (!$acc || !password_verify($pass, $acc['password_hash']))
    fail(401, 'Invalid username or password', ['user'=>$user]);

session_start([
    'cookie_httponly'=>true,
    'cookie_secure'  =>true,
    'cookie_samesite'=>'Lax'
]);
$_SESSION['user'] = $user;

log_write('INFO', 'User login', ['user'=>$user,'ip'=>$_SERVER['REMOTE_ADDR']??'']);

respond(200, ['success' => true]);
