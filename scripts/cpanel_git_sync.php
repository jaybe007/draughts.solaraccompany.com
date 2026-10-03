<?php
/**
 * Safe cPanel Git Sync Helper
 * Solves "Your local changes would be overwritten by merge: config/db.php"
 */
header('Content-Type: text/plain; charset=utf-8');

$key = $_GET['key'] ?? '';
if ($key !== 'naija_sync_secret') {
    http_response_code(403);
    die("Access denied. Please pass ?key=naija_sync_secret to authenticate.\n");
}

$repoDir = dirname(__DIR__);
chdir($repoDir);

echo "========================================================\n";
echo "🔄 NAIJA DRAUGHTS — CPANEL GIT DEPLOYMENT HELPER\n";
echo "========================================================\n\n";
echo "Repository Path: {$repoDir}\n\n";

$action = $_GET['action'] ?? 'sync';

if ($action === 'stash_pop') {
    echo "Restoring stashed config/db.php...\n";
    $popOut = shell_exec('git stash pop 2>&1');
    echo ($popOut ?: "No output") . "\n\n";
} else {
    echo "Step 1: Stashing local uncommitted edits (e.g. config/db.php)...\n";
    $stashOut = shell_exec('git stash 2>&1');
    echo ($stashOut ?: "No output") . "\n\n";

    echo "Step 2: Pulling latest commits from GitHub origin main...\n";
    $pullOut = shell_exec('git pull origin main 2>&1');
    echo ($pullOut ?: "No output") . "\n\n";

    echo "Step 3: Restoring stashed edits (e.g. config/db.php)...\n";
    $popOut = shell_exec('git stash pop 2>&1');
    echo ($popOut ?: "No output") . "\n\n";

    echo "Step 4: Running migrations if pending...\n";
    if (file_exists(__DIR__ . '/../database/migrate_puzzle_rbac.php')) {
        $migOut = shell_exec('php ' . escapeshellarg(__DIR__ . '/../database/migrate_puzzle_rbac.php') . ' 2>&1');
        echo ($migOut ?: "Migration output empty") . "\n\n";
    }

    echo "Step 5: Verifying Git Status...\n";
    $statusOut = shell_exec('git status 2>&1');
    echo ($statusOut ?: "No output") . "\n\n";
}

echo "========================================================\n";
echo "✓ Finished! Deployment complete.\n";
echo "========================================================\n";
