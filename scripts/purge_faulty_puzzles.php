<?php
require_once __DIR__ . '/../config/db.php';
$db = getDB();

$rows = $db->query("SELECT id, position_json FROM puzzles")->fetchAll(PDO::FETCH_ASSOC);
$toDelete = [];

foreach ($rows as $r) {
    $board = json_decode($r['position_json'], true);
    if (!is_array($board)) continue;
    foreach ($board as $p) {
        if (($p['player'] == 1 && $p['r'] == 0 && empty($p['isKing'])) ||
            ($p['player'] == 2 && $p['r'] == 9 && empty($p['isKing']))) {
            $toDelete[] = $r['id'];
            break;
        }
    }
}

echo "Found " . count($toDelete) . " faulty puzzles to purge from database.\n";

if (count($toDelete) > 0) {
    $db->beginTransaction();
    $inPlaceholders = implode(',', array_fill(0, count($toDelete), '?'));
    
    $stmt1 = $db->prepare("DELETE FROM puzzle_solutions WHERE puzzle_id IN ($inPlaceholders)");
    $stmt1->execute($toDelete);
    
    $stmt2 = $db->prepare("DELETE FROM puzzle_hints WHERE puzzle_id IN ($inPlaceholders)");
    $stmt2->execute($toDelete);
    
    $stmt3 = $db->prepare("DELETE FROM puzzle_themes WHERE puzzle_id IN ($inPlaceholders)");
    $stmt3->execute($toDelete);
    
    $stmt4 = $db->prepare("DELETE FROM puzzles WHERE id IN ($inPlaceholders)");
    $stmt4->execute($toDelete);
    
    $db->commit();
    echo "✅ Successfully purged " . count($toDelete) . " faulty puzzles from database!\n";
}
