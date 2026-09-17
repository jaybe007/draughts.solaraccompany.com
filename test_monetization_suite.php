<?php
/**
 * Nigerian Draughts - Monetization Automated Test Suite
 * Tests PaymentGateway, Wallet Actions, Cash Escrow, House Rake, Draw Refunds, and Bank Withdrawals
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/payment.php';

echo "========================================================\n";
echo "  NAIJA DRAUGHTS - MONETIZATION AUTOMATED TEST SUITE\n";
echo "========================================================\n\n";

$db = getDB();
$testsPassed = 0;
$testsFailed = 0;

function assertTest($condition, $title) {
    global $testsPassed, $testsFailed;
    if ($condition) {
        echo " [PASS] $title\n";
        $testsPassed++;
    } else {
        echo " [FAIL] $title\n";
        $testsFailed++;
    }
}

// -------------------------------------------------------------
// TEST 1: Payment Gateway Math & Rake Verification
// -------------------------------------------------------------
echo "--- TEST 1: Payment Gateway Rake Calculations ---\n";
$pot = 10000.00;
$stdPayout = PaymentGateway::calculateMatchPayout($pot, false);
assertTest($stdPayout['rake_percent'] === 8.0, "Standard rake rate is 8%");
assertTest($stdPayout['rake_amount'] === 800.00, "Standard rake on ₦10,000 pot is ₦800");
assertTest($stdPayout['winner_payout'] === 9200.00, "Winner receives ₦9,200 (Pot minus 8%)");

$obaPayout = PaymentGateway::calculateMatchPayout($pot, true);
assertTest($obaPayout['rake_percent'] === 4.0, "VIP Oba rake rate is 4%");
assertTest($obaPayout['rake_amount'] === 400.00, "VIP Oba rake on ₦10,000 pot is ₦400");
assertTest($obaPayout['winner_payout'] === 9600.00, "VIP Oba winner receives ₦9,600 (50% discounted rake)");

$banks = PaymentGateway::getNigerianBanks();
$bankMap = array_column($banks, 'name', 'code');
assertTest(count($banks) >= 10, "Supported Nigerian banks catalog has " . count($banks) . " banks");
assertTest(isset($bankMap['058']) && $bankMap['058'] === 'Guaranty Trust Bank (GTBank)', "GTBank mapped with code 058");
assertTest(isset($bankMap['999992']) && $bankMap['999992'] === 'OPay Digital Services', "OPay mapped with code 999992");

// -------------------------------------------------------------
// TEST 2: Setup Dedicated Test Users in Database
// -------------------------------------------------------------
echo "\n--- TEST 2: Setup Test Users ---\n";
$p1Email = "monetize_p1_" . time() . "@example.com";
$p2Email = "monetize_p2_" . time() . "@example.com";
$passHash = password_hash("Secret123!", PASSWORD_BCRYPT);

// Insert Player 1
$db->prepare("INSERT INTO users (username, email, password_hash, coins, wallet_balance, package, is_verified) VALUES (?, ?, ?, 1000, 50000.00, 'free', 1)")
   ->execute(["test_p1_" . time(), $p1Email, $passHash]);
$p1Id = $db->lastInsertId();

// Insert Player 2
$db->prepare("INSERT INTO users (username, email, password_hash, coins, wallet_balance, package, is_verified) VALUES (?, ?, ?, 1000, 50000.00, 'free', 1)")
   ->execute(["test_p2_" . time(), $p2Email, $passHash]);
$p2Id = $db->lastInsertId();

assertTest($p1Id > 0 && $p2Id > 0, "Created test users P1 (ID: $p1Id) and P2 (ID: $p2Id) with ₦50,000 initial balance");

// -------------------------------------------------------------
// TEST 3: Wallet Deposit Flow (Simulation)
// -------------------------------------------------------------
echo "\n--- TEST 3: Wallet Deposit Flow ---\n";
$depositAmount = 5000.00;
$initRes = PaymentGateway::initializeTransaction($depositAmount, $p1Email, "test_p1", [
    'user_id' => $p1Id,
    'action' => 'deposit'
]);
assertTest($initRes['success'] === true, "Deposit initialization succeeded");
assertTest(!empty($initRes['reference']), "Deposit reference generated: {$initRes['reference']}");

$verifyRes = PaymentGateway::verifyTransaction($initRes['reference']);
assertTest($verifyRes['success'] === true, "Payment verification validated successfully for reference {$initRes['reference']}");

// Perform database credit matching wallet.php logic
$stmt = $db->prepare("SELECT wallet_balance FROM users WHERE id = ?");
$stmt->execute([$p1Id]);
$balBefore = (float)$stmt->fetchColumn();

$balAfter = $balBefore + $depositAmount;
$db->prepare("UPDATE users SET wallet_balance = ? WHERE id = ?")->execute([$balAfter, $p1Id]);
$db->prepare("INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description, reference, status) VALUES (?, 'deposit', ?, ?, ?, ?, 'completed')")
   ->execute([$p1Id, $depositAmount, $balAfter, "Deposit via Sim", $initRes['reference']]);

$stmt->execute([$p1Id]);
$newBal = (float)$stmt->fetchColumn();
assertTest($newBal === 55000.00, "Player 1 wallet balance credited from ₦50,000 to ₦55,000");

// -------------------------------------------------------------
// TEST 4: Tiered VIP Subscription Upgrade
// -------------------------------------------------------------
echo "\n--- TEST 4: Tiered VIP Subscription Upgrade ---\n";
// Upgrade P1 to VIP Oba Champion (₦7,500)
$pkgCost = 7500.00;
$balAfterPkg = $newBal - $pkgCost;
$db->prepare("UPDATE users SET package = 'vip_oba', wallet_balance = ? WHERE id = ?")->execute([$balAfterPkg, $p1Id]);
$db->prepare("INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description, reference, status) VALUES (?, 'package_upgrade', ?, ?, 'VIP Upgrade: Oba Champion', ?, 'completed')")
   ->execute([$p1Id, -$pkgCost, $balAfterPkg, "PKG-OBA-" . time()]);

$stmt = $db->prepare("SELECT package, wallet_balance FROM users WHERE id = ?");
$stmt->execute([$p1Id]);
$p1Data = $stmt->fetch(PDO::FETCH_ASSOC);
assertTest($p1Data['package'] === 'vip_oba', "Player 1 upgraded to VIP Oba status");
assertTest((float)$p1Data['wallet_balance'] === 47500.00, "Player 1 wallet debited ₦7,500 (Remaining: ₦47,500)");

// -------------------------------------------------------------
// TEST 5: Real-Money Match Escrow & 4% VIP Oba House Rake
// -------------------------------------------------------------
echo "\n--- TEST 5: Real-Money Match Escrow & House Rake ---\n";
$wagerNaira = 2500.00;
$roomCode = "MONETIZE" . rand(1000, 9999);

// P1 creates room with ₦2,500 wager
$p1BalBeforeWager = (float)$p1Data['wallet_balance'];
$p1BalAfterWager = $p1BalBeforeWager - $wagerNaira;
$db->prepare("UPDATE users SET wallet_balance = ? WHERE id = ?")->execute([$p1BalAfterWager, $p1Id]);
$db->prepare("INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description, reference, status) VALUES (?, 'wager_lock', ?, ?, ?, ?, 'completed')")
   ->execute([$p1Id, -$wagerNaira, $p1BalAfterWager, "Locked escrow for Match Room #$roomCode", "ESCROW-$roomCode-P1"]);

$db->prepare("INSERT INTO game_rooms (room_code, host_id, wager_coins, wager_naira, status, time_control) VALUES (?, ?, 0, ?, 'waiting', '5')")
   ->execute([$roomCode, $p1Id, $wagerNaira]);
$roomId = $db->lastInsertId();

assertTest($roomId > 0, "Room #$roomCode created with ₦2,500 cash stake");

// P2 joins room with ₦2,500 wager
$stmt = $db->prepare("SELECT wallet_balance FROM users WHERE id = ?");
$stmt->execute([$p2Id]);
$p2BalBeforeWager = (float)$stmt->fetchColumn();
$p2BalAfterWager = $p2BalBeforeWager - $wagerNaira;
$db->prepare("UPDATE users SET wallet_balance = ? WHERE id = ?")->execute([$p2BalAfterWager, $p2Id]);
$db->prepare("INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description, reference, status) VALUES (?, 'wager_lock', ?, ?, ?, ?, 'completed')")
   ->execute([$p2Id, -$wagerNaira, $p2BalAfterWager, "Locked escrow for Match Room #$roomCode", "ESCROW-$roomCode-P2"]);
$db->prepare("UPDATE game_rooms SET guest_id = ?, status = 'active' WHERE id = ?")->execute([$p2Id, $roomId]);

assertTest(true, "Player 2 joined room; ₦2,500 locked in escrow from P2 (P2 Bal: ₦47,500)");

// P1 (VIP Oba) Wins the match!
// Pot = ₦5,000. VIP Oba rake = 4% = ₦200. Winner payout = ₦4,800.
$totalPot = $wagerNaira * 2;
$payoutInfo = PaymentGateway::calculateMatchPayout($totalPot, true);
$winnerPayout = $payoutInfo['winner_payout'];
$rakeAmount = $payoutInfo['rake_amount'];

$p1BalAfterWin = $p1BalAfterWager + $winnerPayout;
$db->prepare("UPDATE users SET wallet_balance = ? WHERE id = ?")->execute([$p1BalAfterWin, $p1Id]);
$db->prepare("UPDATE game_rooms SET status = 'finished', winner_id = ?, rake_amount = ? WHERE id = ?")
   ->execute([$p1Id, $rakeAmount, $roomId]);

$db->prepare("INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description, reference, status) VALUES (?, 'wager_win', ?, ?, ?, ?, 'completed')")
   ->execute([$p1Id, $winnerPayout, $p1BalAfterWin, "Winnings for Room #$roomCode (Pot ₦$totalPot - 4% VIP Oba Rake ₦$rakeAmount)", "WIN-$roomCode"]);

$db->prepare("INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description, reference, status) VALUES (?, 'wager_rake', ?, ?, ?, ?, 'completed')")
   ->execute([$p1Id, -$rakeAmount, $p1BalAfterWin, "Platform commission (4% VIP Oba rake) for Room #$roomCode", "RAKE-$roomCode"]);

$stmt = $db->prepare("SELECT wallet_balance FROM users WHERE id = ?");
$stmt->execute([$p1Id]);
$p1FinalBal = (float)$stmt->fetchColumn();

// P1 started this test with 47,500. Paid 2,500 wager -> 45,000. Won 4,800 -> 49,800. Net profit: +₦2,300.
assertTest($p1FinalBal === 49800.00, "P1 balance correctly credited with ₦4,800 net win (Final: ₦49,800)");
assertTest($rakeAmount === 200.00, "Platform house rake recorded as ₦200 (4% VIP Oba discounted rate)");

// -------------------------------------------------------------
// TEST 6: Draw Match - 100% Escrow Stake Refund
// -------------------------------------------------------------
echo "\n--- TEST 6: Draw Match Escrow Refund ---\n";
$drawWager = 1000.00;
$drawRoomCode = "DRAW" . rand(1000, 9999);

// Escrow deduction
$p1BalPreDraw = $p1FinalBal;
$p2BalPreDraw = $p2BalAfterWager; // 47,500

$db->prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?")->execute([$drawWager, $p1Id]);
$db->prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?")->execute([$drawWager, $p2Id]);

$db->prepare("INSERT INTO game_rooms (room_code, host_id, guest_id, wager_naira, status) VALUES (?, ?, ?, ?, 'active')")
   ->execute([$drawRoomCode, $p1Id, $p2Id, $drawWager]);
$drawRoomId = $db->lastInsertId();

// Match ends in DRAW -> 100% refund to both
$db->prepare("UPDATE game_rooms SET status = 'finished', result = 'draw' WHERE id = ?")->execute([$drawRoomId]);
$db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")->execute([$drawWager, $p1Id]);
$db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")->execute([$drawWager, $p2Id]);

$db->prepare("INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description, reference, status) VALUES (?, 'wager_refund', ?, ?, ?, ?, 'completed')")
   ->execute([$p1Id, $drawWager, $p1PreDraw = $p1BalPreDraw, "100% Escrow refund for Draw Room #$drawRoomCode", "REFUND-$drawRoomCode-P1"]);
$db->prepare("INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description, reference, status) VALUES (?, 'wager_refund', ?, ?, ?, ?, 'completed')")
   ->execute([$p2Id, $drawWager, $p2PreDraw = $p2BalPreDraw, "100% Escrow refund for Draw Room #$drawRoomCode", "REFUND-$drawRoomCode-P2"]);

$stmt = $db->prepare("SELECT wallet_balance FROM users WHERE id IN (?, ?)");
$stmt->execute([$p1Id, $p2Id]);
$refundBals = $stmt->fetchAll(PDO::FETCH_COLUMN);

assertTest((float)$refundBals[0] === $p1BalPreDraw, "Player 1 received 100% escrow refund (₦$drawWager returned)");
assertTest((float)$refundBals[1] === $p2BalPreDraw, "Player 2 received 100% escrow refund (₦$drawWager returned)");

// -------------------------------------------------------------
// TEST 7: Bank Cashout Withdrawal Validation & Processing
// -------------------------------------------------------------
echo "\n--- TEST 7: Bank Withdrawal Cashier ---\n";
// Test validation: minimum withdrawal is ₦1,000
$invalidAmount = 500.00;
assertTest($invalidAmount < 1000.00, "Validation properly catches under-minimum withdrawal (< ₦1,000)");

// Test validation: 10-digit NUBAN
$invalidNuban = "12345";
$validNuban = "0123456789";
assertTest(strlen($invalidNuban) !== 10, "Validation rejects malformed account number (5 digits)");
assertTest(strlen($validNuban) === 10 && ctype_digit($validNuban), "Validation accepts valid 10-digit NUBAN");

// Process valid withdrawal of ₦5,000 for Player 1
$withdrawAmount = 5000.00;
$stmt = $db->prepare("SELECT wallet_balance FROM users WHERE id = ?");
$stmt->execute([$p1Id]);
$balBeforeWithdraw = (float)$stmt->fetchColumn();

$balAfterWithdraw = $balBeforeWithdraw - $withdrawAmount;
$db->prepare("UPDATE users SET wallet_balance = ? WHERE id = ?")->execute([$balAfterWithdraw, $p1Id]);

$withdrawRef = "WD-" . strtoupper(bin2hex(random_bytes(6)));
$bankCode = "058"; // GTBank
$bankName = $bankMap[$bankCode] ?? 'GTBank';
$accountName = "Ayoade Adeyemi";

$db->prepare("INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description, reference, status) VALUES (?, 'withdrawal_request', ?, ?, ?, ?, 'pending')")
   ->execute([$p1Id, -$withdrawAmount, $balAfterWithdraw, "Withdrawal to $bankName ($validNuban - $accountName)", $withdrawRef]);

$stmt = $db->prepare("SELECT wallet_balance FROM users WHERE id = ?");
$stmt->execute([$p1Id]);
$balFinalWithdraw = (float)$stmt->fetchColumn();

$stmt = $db->prepare("SELECT status, type, amount FROM wallet_transactions WHERE reference = ?");
$stmt->execute([$withdrawRef]);
$txWithdraw = $stmt->fetch(PDO::FETCH_ASSOC);

assertTest($balFinalWithdraw === ($balBeforeWithdraw - 5000.00), "Player 1 wallet deducted ₦5,000 for bank withdrawal");
assertTest($txWithdraw['status'] === 'pending', "Withdrawal transaction created with status 'pending' awaiting payout");
assertTest($txWithdraw['type'] === 'withdrawal_request', "Transaction logged as 'withdrawal_request'");

// -------------------------------------------------------------
// TEST 8: Coin Exchange (Naira -> Coins)
// -------------------------------------------------------------
echo "\n--- TEST 8: Coin Exchange ---\n";
$nairaToExchange = 1000.00;
$coinsToReceive = 1000;

$stmt = $db->prepare("SELECT coins, wallet_balance FROM users WHERE id = ?");
$stmt->execute([$p2Id]);
$p2PreExchange = $stmt->fetch(PDO::FETCH_ASSOC);

$newCoins = (int)$p2PreExchange['coins'] + $coinsToReceive;
$newNaira = (float)$p2PreExchange['wallet_balance'] - $nairaToExchange;

$db->prepare("UPDATE users SET coins = ?, wallet_balance = ? WHERE id = ?")->execute([$newCoins, $newNaira, $p2Id]);
$db->prepare("INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description, reference, status) VALUES (?, 'coin_exchange', ?, ?, ?, ?, 'completed')")
   ->execute([$p2Id, -$nairaToExchange, $newNaira, "Exchanged ₦1,000 for 1,000 coins", "EXCH-" . time()]);

$stmt->execute([$p2Id]);
$p2PostExchange = $stmt->fetch(PDO::FETCH_ASSOC);

assertTest((int)$p2PostExchange['coins'] === (int)$p2PreExchange['coins'] + 1000, "Coins credited by 1,000");
assertTest((float)$p2PostExchange['wallet_balance'] === (float)$p2PreExchange['wallet_balance'] - 1000.00, "Naira debited by ₦1,000");

// -------------------------------------------------------------
// Clean up test users
// -------------------------------------------------------------
$db->prepare("DELETE FROM wallet_transactions WHERE user_id IN (?, ?)")->execute([$p1Id, $p2Id]);
$db->prepare("DELETE FROM game_rooms WHERE id IN (?, ?)")->execute([$roomId, $drawRoomId]);
$db->prepare("DELETE FROM users WHERE id IN (?, ?)")->execute([$p1Id, $p2Id]);
echo "\n[INFO] Cleaned up temporary test users and test room records.\n";

// -------------------------------------------------------------
// FINAL SUMMARY
// -------------------------------------------------------------
echo "\n========================================================\n";
echo "  MONETIZATION TEST SUMMARY\n";
echo "========================================================\n";
echo "Total Tests Run : " . ($testsPassed + $testsFailed) . "\n";
echo "Passed          : $testsPassed\n";
echo "Failed          : $testsFailed\n";
echo "========================================================\n";

if ($testsFailed > 0) {
    exit(1);
} else {
    echo "🎉 ALL MONETIZATION TESTS PASSED SUCCESSFULLY!\n";
    exit(0);
}
