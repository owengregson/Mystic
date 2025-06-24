<?php
declare(strict_types=1);

/* -------- paths -------- */

function cfg(): array
{
    static $c = null;
    if ($c) return $c;
    $f = __DIR__ . '/config.json';
    if (!is_readable($f)) throw new RuntimeException('config.json missing');
    return $c = json_decode(file_get_contents($f), true, 512, JSON_THROW_ON_ERROR);
}

function users_store(): string
{
    return dirname(__DIR__) . '/database/users/users.json';
}

function logs_dir(): string
{
    return dirname(__DIR__) . '/database/logs';
}

/* -------- logging -------- */

function log_write(string $level, string $msg, array $ctx = []): void
{
    $level = strtoupper($level);
    if (!in_array($level, ['INFO','WARNING','ERROR'], true)) $level = 'INFO';

    $dir = logs_dir();
    if (!is_dir($dir)) mkdir($dir, 0700, true);

    $file = $dir . '/' . gmdate('Y-m-d') . '.json';
    $fp   = fopen($file, 'c+');
    flock($fp, LOCK_EX);

    $content = stream_get_contents($fp) ?: '[]';
    $log     = json_decode($content, true) ?? [];

    $log[] = [
        'ts'     => gmdate('c'),
        'level'  => $level,
        'msg'    => $msg,
        'ctx'    => $ctx
    ];

    rewind($fp); ftruncate($fp, 0);
    fwrite($fp, json_encode($log, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    flock($fp, LOCK_UN); fclose($fp);
}

function respond(int $code, array $payload): never
{
    http_response_code($code);
    exit(json_encode($payload));
}
