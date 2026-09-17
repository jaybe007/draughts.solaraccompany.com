<?php
require_once __DIR__ . '/../config/db.php';
$db = getDB();

$rows = $db->query("SELECT id, position_json, ruleset, difficulty_tier FROM puzzles")->fetchAll(PDO::FETCH_ASSOC);
$faulty = [];

foreach ($rows as $r) {
    $board = json_decode($r['position_json'], true);
    if (!is_array($board)) continue;
    foreach ($board as $p) {
        if ($p['player'] == 1 && $p['r'] == 0 && empty($p['isKing'])) {
            $faulty[] = ['id' => $r['id'], 'issue' => 'White man at r=0'];
            break;
        }
        if ($p['player'] == 2 && $p['r'] == 9 && empty($p['isKing'])) {
            $faulty[] = ['id' => $r['id'], 'issue' => 'Black man at r=9'];
            break;
        }
    }
}

echo "Total faulty puzzles in MySQL DB: " . count($faulty) . "\n";
if (count($faulty) > 0) {
    echo "Sample faulty:\n";
    foreach (array_slice($faulty, 0, 10) as $f) {
        echo "  - {$f['id']}: {$f['issue']}\n";
    }
}
