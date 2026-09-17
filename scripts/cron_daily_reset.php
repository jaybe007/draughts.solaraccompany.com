<?php
/**
 * Naija Draughts - Midnight Scheduled Cron Job
 * Run via crontab: 0 0 * * * php /path/to/scripts/cron_daily_reset.php
 *
 * Responsibilities:
 *  1. Resets daily match quotas for all players.
 *  2. Downgrades expired VIP subscriptions to Free.
 *  3. Archives stale waiting rooms older than 24 hours and refunds escrow stakes.
 */

require_once dirname(__DIR__) . '/config/db.php';

$today = date('Y-m-d');
$now = date('Y-m-d H:i:s');

echo "========================================================\n";
echo "  NAIJA DRAUGHTS - MIDNIGHT CRON MAINTENANCE [$now]\n";
echo "========================================================\n";

try {
    $db = getDB();

    // 1. Check & Downgrade Expired VIP Packages
    $expireStmt = $db->prepare("
        UPDATE users 
        SET package = 'free', package_expiry = NULL 
        WHERE package_expiry IS NOT NULL AND package_expiry <= NOW() AND package != 'free'
    ");
    $expireStmt->execute();
    $expiredCount = $expireStmt->rowCount();
    echo "[1/3] Downgraded {$expiredCount} expired VIP subscription(s) to Free tier.\n";

    // 2. Reset Daily Match Quotas
    // Free: 10, Silver: 25, Gold: 50, VIP Oba: 999
    $resetFree = $db->exec("UPDATE users SET daily_games_left = 10, last_daily_reset = '$today' WHERE package = 'free' AND (last_daily_reset IS NULL OR last_daily_reset != '$today')");
    $resetSilver = $db->exec("UPDATE users SET daily_games_left = 25, last_daily_reset = '$today' WHERE package = 'silver' AND (last_daily_reset IS NULL OR last_daily_reset != '$today')");
    $resetGold = $db->exec("UPDATE users SET daily_games_left = 50, last_daily_reset = '$today' WHERE package = 'gold' AND (last_daily_reset IS NULL OR last_daily_reset != '$today')");
    $resetVip = $db->exec("UPDATE users SET daily_games_left = 999, last_daily_reset = '$today' WHERE package = 'vip_oba' AND (last_daily_reset IS NULL OR last_daily_reset != '$today')");

    $totalReset = (int)$resetFree + (int)$resetSilver + (int)$resetGold + (int)$resetVip;
    echo "[2/3] Reset daily game quotas for {$totalReset} player account(s) (Free: {$resetFree}, Silver: {$resetSilver}, Gold: {$resetGold}, VIP Oba: {$resetVip}).\n";

    // 3. Clean up Stale Waiting Rooms (>24h) with Escrow Refund
    $staleRoomsStmt = $db->query("
        SELECT id, room_code, host_id, wager_coins, wager_naira 
        FROM game_rooms 
        WHERE status = 'waiting' AND created_at <= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ");
    $staleRooms = $staleRoomsStmt->fetchAll(PDO::FETCH_ASSOC);
    $refundedRoomsCount = 0;

    foreach ($staleRooms as $r) {
        $roomId = (int)$r['id'];
        $hostId = (int)$r['host_id'];
        $wCoins = (int)($r['wager_coins'] ?? 0);
        $wNaira = (float)($r['wager_naira'] ?? 0);
        $code   = $r['room_code'];

        if ($hostId > 0) {
            // Refund Coins if any
            if ($wCoins > 0) {
                $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$wCoins, $hostId]);
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                    VALUES (?, 'wager_refund', 0, ?, ?)
                ")->execute([$hostId, $wCoins, "Expired Room Refund: {$code}"]);
            }
            // Refund Naira if any
            if ($wNaira > 0) {
                $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")->execute([$wNaira, $hostId]);
                $newBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$hostId}")->fetchColumn();
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                    VALUES (?, 'wager_refund', ?, 0, ?, 'completed', ?, ?)
                ")->execute([$hostId, $wNaira, $newBal, "REFUND-{$code}-EXP", "Expired Room Cash Refund: Match Room {$code}"]);
            }
        }

        $db->prepare("UPDATE game_rooms SET status = 'abandoned' WHERE id = ?")->execute([$roomId]);
        $refundedRoomsCount++;
    }

    echo "[3/3] Cleaned up {$refundedRoomsCount} stale waiting room(s) older than 24 hours with full escrow refunds.\n";
    echo "========================================================\n";
    echo "✅ CRON MAINTENANCE COMPLETED SUCCESSFULLY.\n";
    echo "========================================================\n";
    exit(0);

} catch (Exception $e) {
    echo "❌ CRON ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
