<?php
require_once __DIR__ . '/../config/db.php';
try {
  $db = getDB();
  $tables = $db->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(PDO::FETCH_COLUMN);
  print_r($tables);
  $hasChat = in_array('chat_messages', $tables);
  echo "has chat_messages: " . ($hasChat ? 'YES' : 'NO') . "\n";
  if (!$hasChat) {
    echo "Creating chat_messages table...\n";
    $db->exec("CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      username TEXT NOT NULL,
      message TEXT NOT NULL,
      is_shout INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Created chat_messages!\n";
  }
} catch (Exception $e) {
  echo "Error: " . $e->getMessage() . "\n";
}
