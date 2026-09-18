<?php
require_once __DIR__ . '/config/db.php';
try {
    $pdo = getDB();
    $sql = file_get_contents(__DIR__ . '/database/puzzle_schema.sql');
    $pdo->exec($sql);
    echo "Puzzle schema migrated successfully!" . PHP_EOL;
    $tables = $pdo->query('SHOW TABLES LIKE "puzzle%"')->fetchAll(PDO::FETCH_COLUMN);
    echo "Created puzzle tables: " . implode(", ", $tables) . PHP_EOL;
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . PHP_EOL;
}
