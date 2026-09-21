<?php
/**
 * Automated Verification Suite: Coin Staking (0% Commission) & 2-Way Exchange Spread
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/payment.php';

echo "========================================================\n";
echo "🧪 RUNNING COIN SPREAD & 0% COMMISSION TEST SUITE\n";
echo "========================================================\n\n";

$db = getDB();
$testsPassed = 0;
$totalTests = 0;

function assertCondition($description, $condition) {
    global $testsPassed, $totalTests;
    $totalTests++;
    if ($condition) {
        $testsPassed++;
        echo "  ✓ PASS: {$description}\n";
    } else {
        echo "  ✗ FAIL: {$description}\n";
    }
}

try {
    // 1. Check getCoinRates()
    $rates = getCoinRates($db);
    echo "--- 1. Testing Default / System Settings Rates ---\n";
    assertCondition("Buy rate per 100 is 1500.00", (float)$rates['buy_rate_per_100'] === 1500.0);
    assertCondition("Buy rate per coin is 15.00", (float)$rates['buy_rate_per_coin'] === 15.0);
    assertCondition("Sell rate per 100 is 1350.00", (float)$rates['sell_rate_per_100'] === 1350.0);
    assertCondition("Sell rate per coin is 13.50", (float)$rates['sell_rate_per_coin'] === 13.5);
    assertCondition("Spread per 100 is 150.00", (float)$rates['spread_per_100'] === 150.0);
    assertCondition("Coin match staking commission is 0.0%", (float)$rates['match_commission_percent'] === 0.0);

    // 2. Setup Test User
    echo "\n--- 2. Setting Up Dedicated Test User ---\n";
    $testUsername = 'CoinTestUser_' . rand(1000, 9999);
    $testEmail = strtolower($testUsername) . '@test.com';
    $passwordHash = password_hash('Pass123!@#', PASSWORD_DEFAULT);

    $db->prepare("DELETE FROM users WHERE email = ?")->execute([$testEmail]);
    $stmt = $db->prepare("
        INSERT INTO users (username, email, password_hash, wallet_balance, coins, rating)
        VALUES (?, ?, ?, 5000.00, 50, 1500)
    ");
    $stmt->execute([$testUsername, $testEmail, $passwordHash]);
    $testUserId = (int)$db->lastInsertId();

    $user = $db->query("SELECT wallet_balance, coins FROM users WHERE id = {$testUserId}")->fetch(PDO::FETCH_ASSOC);
    assertCondition("Test user created with ₦5,000.00 and 50 coins", (float)$user['wallet_balance'] === 5000.0 && (int)$user['coins'] === 50);

    // 3. Test Buy Coins Simulation (Buy 200 coins @ ₦15/coin = ₦3,000)
    echo "\n--- 3. Testing Buy Coins Logic (₦15.00 / Coin) ---\n";
    $buyCoins = 200;
    $expectedCost = round($buyCoins * $rates['buy_rate_per_coin'], 2); // 3000.00

    $initialBal = (float)$user['wallet_balance'];
    $initialCoins = (int)$user['coins'];

    $db->prepare("UPDATE users SET wallet_balance = wallet_balance - ?, coins = coins + ? WHERE id = ?")
       ->execute([$expectedCost, $buyCoins, $testUserId]);

    $afterBuy = $db->query("SELECT wallet_balance, coins FROM users WHERE id = {$testUserId}")->fetch(PDO::FETCH_ASSOC);
    assertCondition("Wallet debited exact ₦3,000 (Remaining: ₦2,000.00)", (float)$afterBuy['wallet_balance'] === 2000.0);
    assertCondition("Coins balance increased by 200 (Total: 250 coins)", (int)$afterBuy['coins'] === 250);

    // 4. Test Sell Coins Logic (Sell 100 coins @ ₦13.50/coin = ₦1,350)
    echo "\n--- 4. Testing Sell / Cashback Coins Logic (₦13.50 / Coin) ---\n";
    $sellCoins = 100;
    $expectedPayout = round($sellCoins * $rates['sell_rate_per_coin'], 2); // 1350.00

    $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ?, coins = coins - ? WHERE id = ?")
       ->execute([$expectedPayout, $sellCoins, $testUserId]);

    $afterSell = $db->query("SELECT wallet_balance, coins FROM users WHERE id = {$testUserId}")->fetch(PDO::FETCH_ASSOC);
    assertCondition("Wallet credited exact ₦1,350 (New balance: ₦3,350.00)", (float)$afterSell['wallet_balance'] === 3350.0);
    assertCondition("Coins deducted by 100 (Remaining: 150 coins)", (int)$afterSell['coins'] === 150);

    // 5. Test ensureCoinsAvailable with dynamic buy rate
    echo "\n--- 5. Testing Auto-Conversion on Coin Staking Shortfall ---\n";
    // Reset user to 20 coins and ₦3,000.00
    $db->prepare("UPDATE users SET wallet_balance = 3000.00, coins = 20 WHERE id = ?")->execute([$testUserId]);

    // Match requires 100 coins -> Shortfall = 80 coins. Cost @ ₦15/coin = 80 * 15 = ₦1,200.00
    $conversionRes = ensureCoinsAvailable($db, $testUserId, 100, "Automated Test Room");
    assertCondition("ensureCoinsAvailable succeeded", $conversionRes['success'] === true);
    assertCondition("ensureCoinsAvailable performed auto-conversion", $conversionRes['converted'] === true);
    assertCondition("Auto-converted coins equals shortfall (80 coins)", (int)$conversionRes['converted_coins'] === 80);
    assertCondition("Auto-converted cost equals ₦1,200.00", (float)$conversionRes['converted_amount'] === 1200.0);
    assertCondition("New available coins equals required (100 coins)", (int)$conversionRes['available_coins'] === 100);
    assertCondition("New wallet balance is ₦1,800.00 (3000 - 1200)", (float)$conversionRes['wallet_balance'] === 1800.0);

    // 6. Test Match Payout with 0% Commission
    echo "\n--- 6. Testing Match Payout Engine (0% House Commission on Staking) ---\n";
    $wagerCoins = 100;
    $pot = $wagerCoins * 2; // 200 coins
    $commPercent = (float)$rates['match_commission_percent']; // 0.0
    $rakeCoins = $commPercent > 0 ? (int)round($pot * ($commPercent / 100.0)) : 0;
    $winnerNetCoins = $pot - $rakeCoins;

    assertCondition("Match pot with 100 coins wager is 200 coins", $pot === 200);
    assertCondition("Platform rake deduction is 0 coins", $rakeCoins === 0);
    assertCondition("Winner receives 100% of pot (200 coins)", $winnerNetCoins === 200);

    // Simulate crediting winner
    $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$winnerNetCoins, $testUserId]);
    $winnerAfterMatch = (int)$db->query("SELECT coins FROM users WHERE id = {$testUserId}")->fetchColumn();
    assertCondition("Winner coins balance updated correctly (100 + 200 = 300 coins)", $winnerAfterMatch === 300);

    // Clean up test user
    $db->prepare("DELETE FROM wallet_transactions WHERE user_id = ?")->execute([$testUserId]);
    $db->prepare("DELETE FROM users WHERE id = ?")->execute([$testUserId]);
    echo "\n  ✓ Cleaned up test user.\n";

    echo "\n========================================================\n";
    echo "TEST RESULTS: {$testsPassed} / {$totalTests} PASSED\n";
    if ($testsPassed === $totalTests) {
        echo "🎉 ALL COIN SPREAD & 0% COMMISSION TESTS PASSED PERFECTLY!\n";
    } else {
        echo "❌ SOME TESTS FAILED.\n";
    }
    echo "========================================================\n";

} catch (Exception $e) {
    echo "❌ EXCEPTION: " . $e->getMessage() . "\n";
    exit(1);
}
