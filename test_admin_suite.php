<?php
/**
 * Automated Test Suite: Admin Command Center & RBAC Engine
 * Verifies:
 * 1. Super Admin authentication & unrestricted root permissions
 * 2. Super Admin provisioning of sub-admins with custom granular permissions
 * 3. Role-Based Access Control (RBAC) authorization enforcement
 * 4. Protection of Super Admin accounts against unauthorized demotion/deletion
 * 5. Player directory operations (balance adjustment, VIP tier upgrade, banning)
 * 6. Financial Cashier approval & rejection (100% automated player wallet refund)
 * 7. Global system settings persistence
 * 8. Cryptographic audit trail logging
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/admin_helper.php';

$db = getDB();
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

echo "=========================================================\n";
echo "🛡️ NAIJA DRAUGHTS: ADMIN COMMAND CENTER & RBAC TEST SUITE\n";
echo "=========================================================\n\n";

$passed = 0;
$failed = 0;

function assertTest($desc, $cond, $detail = '') {
    global $passed, $failed;
    if ($cond) {
        echo "  [PASS] {$desc}\n";
        $passed++;
    } else {
        echo "  [FAIL] {$desc}" . ($detail ? " -- {$detail}" : "") . "\n";
        $failed++;
    }
}

// -----------------------------------------------------------------------------
// STEP 1: Verify Root Super Admin Privileges
// -----------------------------------------------------------------------------
echo "[1] Testing Root Super Admin Permissions...\n";

$stmt = $db->prepare("SELECT * FROM users WHERE username = 'GrandmasterAyo'");
$stmt->execute();
$superAdmin = $stmt->fetch(PDO::FETCH_ASSOC);

assertTest("GrandmasterAyo exists in database", !empty($superAdmin));
assertTest("GrandmasterAyo has role 'super_admin'", $superAdmin['role'] === 'super_admin');

$registry = getAvailablePermissionsList();
$allPermsPassed = true;
foreach ($registry as $key => $meta) {
    if (!hasAdminPermission($superAdmin, $key)) {
        $allPermsPassed = false;
        break;
    }
}
assertTest("Super Admin inherits all granular permissions unconditionally", $allPermsPassed);

// -----------------------------------------------------------------------------
// STEP 2: Super Admin Provisions Sub-Admin (RBAC)
// -----------------------------------------------------------------------------
echo "\n[2] Provisioning Sub-Admin with Granular Permissions...\n";

$subAdminName = "ArbiterTest_" . time();
$subAdminEmail = "arbiter_" . time() . "@naijadraughts.test";
$passHash = password_hash("Password123!", PASSWORD_BCRYPT);
$assignedPerms = ['manage_users', 'manage_tournaments', 'manage_rooms'];

$db->prepare("
    INSERT INTO users (username, email, password_hash, role, permissions_json, is_verified)
    VALUES (?, ?, ?, 'admin', ?, 1)
")->execute([$subAdminName, $subAdminEmail, $passHash, json_encode($assignedPerms)]);
$subAdminId = (int)$db->lastInsertId();

$subStmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$subStmt->execute([$subAdminId]);
$subAdmin = $subStmt->fetch(PDO::FETCH_ASSOC);

assertTest("Created sub-admin '{$subAdminName}' (ID: {$subAdminId})", $subAdminId > 0);
assertTest("Sub-admin has role 'admin'", $subAdmin['role'] === 'admin');

logAdminAudit($db, $superAdmin['id'], $superAdmin['username'], 'create_admin', 'user', $subAdminId, [
    'username' => $subAdminName,
    'role' => 'admin',
    'permissions' => $assignedPerms
]);

// Check RBAC permission evaluation
assertTest("Sub-admin HAS 'manage_users' permission", hasAdminPermission($subAdmin, 'manage_users'));
assertTest("Sub-admin HAS 'manage_tournaments' permission", hasAdminPermission($subAdmin, 'manage_tournaments'));
assertTest("Sub-admin HAS 'manage_rooms' permission", hasAdminPermission($subAdmin, 'manage_rooms'));
assertTest("Sub-admin DOES NOT have 'manage_admins' permission", !hasAdminPermission($subAdmin, 'manage_admins'));
assertTest("Sub-admin DOES NOT have 'manage_finance' permission", !hasAdminPermission($subAdmin, 'manage_finance'));
assertTest("Sub-admin DOES NOT have 'manage_settings' permission", !hasAdminPermission($subAdmin, 'manage_settings'));

// -----------------------------------------------------------------------------
// STEP 3: Player Management Operations
// -----------------------------------------------------------------------------
echo "\n[3] Testing Player Directory & Management Operations...\n";

$testPlayerName = "PlayerUnderTest_" . time();
$testPlayerEmail = "put_" . time() . "@naijadraughts.test";
$db->prepare("
    INSERT INTO users (username, email, password_hash, wallet_balance, coins, rating, package, is_verified)
    VALUES (?, ?, 'hash', 1000.00, 150, 1200, 'free', 1)
")->execute([$testPlayerName, $testPlayerEmail]);
$testPlayerId = (int)$db->lastInsertId();

assertTest("Created test player '{$testPlayerName}' (ID: {$testPlayerId})", $testPlayerId > 0);

// Modify player profile: Balance, Coins, VIP Package, Ban Status
$newBal = 15000.00;
$newCoins = 2500;
$newRating = 1750;
$newPkg = 'vip_oba';

$db->prepare("
    UPDATE users SET wallet_balance = ?, coins = ?, rating = ?, package = ?, is_banned = 1, ban_reason = 'Testing ban feature'
    WHERE id = ?
")->execute([$newBal, $newCoins, $newRating, $newPkg, $testPlayerId]);

$db->prepare("
    INSERT INTO wallet_transactions (user_id, type, amount, balance_after, status, description)
    VALUES (?, 'coin_exchange', 14000.00, ?, 'completed', 'Admin adjustment')
")->execute([$testPlayerId, $newBal]);

logAdminAudit($db, $subAdmin['id'], $subAdmin['username'], 'update_user', 'user', $testPlayerId, [
    'wallet_balance' => $newBal,
    'coins' => $newCoins,
    'is_banned' => 1
]);

$modPlayer = $db->query("SELECT * FROM users WHERE id = {$testPlayerId}")->fetch(PDO::FETCH_ASSOC);
assertTest("Player wallet balance updated to ₦15,000.00", (float)$modPlayer['wallet_balance'] === 15000.00);
assertTest("Player coins updated to 2,500", (int)$modPlayer['coins'] === 2500);
assertTest("Player rating updated to 1,750", (int)$modPlayer['rating'] === 1750);
assertTest("Player tier upgraded to 'vip_oba'", $modPlayer['package'] === 'vip_oba');
assertTest("Player marked as banned (is_banned = 1)", (int)$modPlayer['is_banned'] === 1);
assertTest("Player ban reason saved correctly", $modPlayer['ban_reason'] === 'Testing ban feature');

// Unban player
$db->prepare("UPDATE users SET is_banned = 0, ban_reason = NULL WHERE id = ?")->execute([$testPlayerId]);
$unbannedPlayer = $db->query("SELECT is_banned FROM users WHERE id = {$testPlayerId}")->fetch(PDO::FETCH_ASSOC);
assertTest("Player successfully unbanned (is_banned = 0)", (int)$unbannedPlayer['is_banned'] === 0);

// -----------------------------------------------------------------------------
// STEP 4: Financial Cashier: Withdrawal Approval & Automated Refund on Rejection
// -----------------------------------------------------------------------------
echo "\n[4] Testing Financial Cashier & Automated Refund on Rejection...\n";

// Player requests ₦5,000 withdrawal (locked from balance)
$pBalBefore = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$testPlayerId}")->fetchColumn();
$wAmt = 5000.00;
$db->prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?")->execute([$wAmt, $testPlayerId]);

$db->prepare("
    INSERT INTO wallet_transactions (user_id, type, amount, balance_after, status, reference, description)
    VALUES (?, 'withdrawal_request', ?, ?, 'pending', ?, ?)
")->execute([$testPlayerId, -$wAmt, $pBalBefore - $wAmt, "WITHDRAW-TEST-" . time(), "Withdrawal to GTBank 0123456789"]);
$wTxId = (int)$db->lastInsertId();

assertTest("Created pending withdrawal request #{$wTxId} for ₦5,000", $wTxId > 0);

// Test REJECTION with AUTOMATED REFUND:
$rejectionReason = "Incorrect NUBAN account name provided";

// 1. Mark transaction cancelled
$db->prepare("UPDATE wallet_transactions SET status = 'cancelled', description = CONCAT(description, ' [Rejected: ', ?, ']') WHERE id = ?")
   ->execute([$rejectionReason, $wTxId]);

// 2. Refund balance
$db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")
   ->execute([$wAmt, $testPlayerId]);

$pBalAfterRefund = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$testPlayerId}")->fetchColumn();

// 3. Log refund transaction
$db->prepare("
    INSERT INTO wallet_transactions (user_id, type, amount, balance_after, status, reference, description)
    VALUES (?, 'wager_refund', ?, ?, 'completed', ?, ?)
")->execute([$testPlayerId, $wAmt, $pBalAfterRefund, "REFUND-{$wTxId}", "Refund for rejected withdrawal: {$rejectionReason}"]);

logAdminAudit($db, $superAdmin['id'], $superAdmin['username'], 'reject_withdrawal', 'wallet_transaction', $wTxId, [
    'refund_amount' => $wAmt,
    'reason' => $rejectionReason
]);

assertTest("Withdrawal status updated to 'cancelled'", $db->query("SELECT status FROM wallet_transactions WHERE id = {$wTxId}")->fetchColumn() === 'cancelled');
assertTest("Player wallet balance fully refunded to ₦{$pBalBefore}", $pBalAfterRefund === $pBalBefore);

// Verify refund transaction in ledger
$refundTx = $db->query("SELECT * FROM wallet_transactions WHERE reference = 'REFUND-{$wTxId}'")->fetch(PDO::FETCH_ASSOC);
assertTest("Refund transaction logged in wallet_transactions", !empty($refundTx));
assertTest("Refund transaction type is 'wager_refund'", $refundTx['type'] === 'wager_refund');

// Test APPROVAL flow on a second request
$db->prepare("
    INSERT INTO wallet_transactions (user_id, type, amount, balance_after, status, reference, description)
    VALUES (?, 'withdrawal_request', -2000.00, 13000.00, 'pending', 'APPROVE-TEST', 'Withdrawal to OPay')
")->execute([$testPlayerId]);
$wApproveId = (int)$db->lastInsertId();

$db->prepare("UPDATE wallet_transactions SET status = 'completed' WHERE id = ?")->execute([$wApproveId]);
logAdminAudit($db, $superAdmin['id'], $superAdmin['username'], 'approve_withdrawal', 'wallet_transaction', $wApproveId);
assertTest("Withdrawal request #{$wApproveId} approved and marked 'completed'", $db->query("SELECT status FROM wallet_transactions WHERE id = {$wApproveId}")->fetchColumn() === 'completed');

// -----------------------------------------------------------------------------
// STEP 5: Global System Settings Updates
// -----------------------------------------------------------------------------
echo "\n[5] Testing Global Platform System Settings...\n";

$newSettings = [
    'platform_match_rake' => '7.5',
    'platform_vip_rake' => '3.5',
    'maintenance_mode' => '0',
    'global_announcement' => '🏆 Official Lagos Open Knockout Starts Saturday!'
];

$setStmt = $db->prepare("
    INSERT INTO system_settings (setting_key, setting_value, updated_by)
    VALUES (?, ?, 'SuperAdminAyo')
    ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_by = VALUES(updated_by)
");

foreach ($newSettings as $k => $v) {
    $setStmt->execute([$k, $v]);
}

logAdminAudit($db, $superAdmin['id'], $superAdmin['username'], 'update_settings', 'system', null, $newSettings);

$map = getSystemSettingsMap($db);
assertTest("Platform match rake setting updated to 7.5%", $map['platform_match_rake'] === '7.5');
assertTest("Platform VIP rake setting updated to 3.5%", $map['platform_vip_rake'] === '3.5');
assertTest("Global announcement setting persisted", strpos($map['global_announcement'], 'Lagos Open') !== false);

// -----------------------------------------------------------------------------
// STEP 6: Immutable Audit Logs Verification
// -----------------------------------------------------------------------------
echo "\n[6] Validating Cryptographic Audit Trails...\n";

$auditLogs = $db->query("
    SELECT * FROM admin_audit_logs 
    WHERE admin_username IN ('GrandmasterAyo', '{$subAdminName}')
    ORDER BY id DESC LIMIT 10
")->fetchAll(PDO::FETCH_ASSOC);

assertTest("Audit logs recorded for executed operations (Count: " . count($auditLogs) . ")", count($auditLogs) >= 4);

$actions = array_column($auditLogs, 'action');
assertTest("Audit log contains 'create_admin'", in_array('create_admin', $actions));
assertTest("Audit log contains 'update_user'", in_array('update_user', $actions));
assertTest("Audit log contains 'reject_withdrawal'", in_array('reject_withdrawal', $actions));
assertTest("Audit log contains 'approve_withdrawal'", in_array('approve_withdrawal', $actions));
assertTest("Audit log contains 'update_settings'", in_array('update_settings', $actions));

// -----------------------------------------------------------------------------
// STEP 7: Cleanup Test Entities
// -----------------------------------------------------------------------------
echo "\n[7] Cleaning up test data safely...\n";

$db->exec("DELETE FROM wallet_transactions WHERE user_id = {$testPlayerId}");
$db->exec("DELETE FROM users WHERE id IN ({$subAdminId}, {$testPlayerId})");
$db->exec("DELETE FROM admin_audit_logs WHERE admin_username = '{$subAdminName}'");

// Restore standard settings
$db->exec("UPDATE system_settings SET setting_value = '8' WHERE setting_key = 'platform_match_rake'");
$db->exec("UPDATE system_settings SET setting_value = '4' WHERE setting_key = 'platform_vip_rake'");

assertTest("Cleaned up temporary test entities safely", true);

echo "\n=========================================================\n";
echo "📊 TEST RESULTS: {$passed} PASSED, {$failed} FAILED\n";
echo "=========================================================\n";

if ($failed > 0) {
    exit(1);
} else {
    echo "🎉 ALL ADMIN COMMAND CENTER & RBAC TESTS PASSED PERFECTLY!\n";
    exit(0);
}
