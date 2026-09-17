<?php
require_once __DIR__ . '/../config/db.php';
$db = getDB();
$c = $db->query("SELECT COUNT(*) FROM puzzles")->fetchColumn();
echo "Total puzzles in DB: {$c}\n";

$byRuleset = $db->query("SELECT ruleset, COUNT(*) as cnt FROM puzzles GROUP BY ruleset")->fetchAll(PDO::FETCH_ASSOC);
echo "By ruleset:\n";
foreach ($byRuleset as $row) {
    echo "  {$row['ruleset']}: {$row['cnt']}\n";
}

$byTier = $db->query("SELECT difficulty_tier, COUNT(*) as cnt FROM puzzles GROUP BY difficulty_tier ORDER BY difficulty_tier")->fetchAll(PDO::FETCH_ASSOC);
echo "By tier:\n";
foreach ($byTier as $row) {
    echo "  Tier {$row['difficulty_tier']}: {$row['cnt']}\n";
}
