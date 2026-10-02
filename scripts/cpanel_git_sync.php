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

echo "Step 1: Stashing local uncommitted edits (e.g. config/db.php)...\n";
$stashOut = shell_exec('git stash 2>&1');
echo ($stashOut ?: "No output") . "\n\n";

echo "Step 2: Pulling latest commits from GitHub origin main...\n";
$pullOut = shell_exec('git pull origin main 2>&1');
echo ($pullOut ?: "No output") . "\n\n";

echo "Step 3: Verifying Git Status...\n";
$statusOut = shell_exec('git status 2>&1');
echo ($statusOut ?: "No output") . "\n\n";

echo "========================================================\n";
echo "✓ Finished! You can now refresh cPanel Git Version Control.\n";
echo "========================================================\n";
