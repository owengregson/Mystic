<?php
require_once dirname(__DIR__) . '/lib.php';
function simulated_user_count(\DateTimeInterface $dt = null): int {
    $tz = new DateTimeZone('America/Los_Angeles');
    $dt = $dt
        ? (new DateTimeImmutable($dt->format(DATE_RFC3339)))->setTimezone($tz)
        : new DateTimeImmutable('now', $tz);

    $min = 500; $max = 1400; $range = $max - $min;

    // daily parabola peaking at 17:00
    $sec = (int)$dt->format('G')*3600 + (int)$dt->format('i')*60 + (int)$dt->format('s');
    $t = ($sec - 17*3600) / 43200;
    $daily = max(0, 1 - $t*$t);

    // seasonal parabola peaking mid-year
    $doy = (int)$dt->format('z');
    $s = ($doy - 182.5) / 182.5;
    $season = max(0, 1 - $s*$s);

    // slow noise
    $mb = floor($dt->getTimestamp() / 300);
    $n1 = abs(sin($mb * 12.9898) * 43758.5453);
    $slow = $n1 - floor($n1);

    // combine base
    $baseF = $daily*0.6 + $season*0.3 + $slow*0.1;
    $baseF = min(1, max(0, $baseF));
    $baseC = $min + $baseF * $range;

    // high-freq noise
    $b5 = floor($dt->getTimestamp() / 5);
    $r  = abs(sin($b5 * 0.7) * 10000);
    $f  = $r - floor($r);
    $mag = floor($f * 2) + 1;
    $sign = sin($b5 * 1.3) >= 0 ? 1 : -1;
    $hf = $mag * $sign;

    $count = (int)round($baseC) + $hf;
    return max($min, min($max, $count));
}

function simulated_node_count(\DateTimeInterface $dt = null): int {
    $tz    = new DateTimeZone('America/Los_Angeles');
    $now   = $dt
           ? (new DateTimeImmutable($dt->format(DATE_RFC3339)))->setTimezone($tz)
           : new DateTimeImmutable('now', $tz);

    $start = new DateTimeImmutable('2025-06-21 00:00:00', $tz);
    $delta = $now->getTimestamp() - $start->getTimestamp();
    if ($delta <= 0) {
        return 50;
    }

    $weeks = $delta / 604800.0;  // 604,800 = 7 * 24 * 3600

    // linear (weeks) + log curve
    $count = 51
           + $weeks
           + log($weeks + 1);

    return (int) round($count);
}

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
respond(200, [
    'timestamp' => time(),
    'status'    => 'online',
    'nodes'     => simulated_node_count(),
    'users'     => simulated_user_count(),
]);
