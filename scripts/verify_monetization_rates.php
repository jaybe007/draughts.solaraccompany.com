<?php
/**
 * Test & Verification Suite for Multi-Currency & Coin Monetization Engine
 */
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/payment.php';

echo "========================================================\n";
echo "🔍 MONETIZATION & MULTI-CURRENCY SPREAD VERIFICATION\n";
echo "========================================================\n\n";

$db = getDB();

// 1. Verify Coin Rates
$rates = getCoinRates($db);
echo "1. Coin Rates:\n";
echo "   - Buy Rate per 100:  ₦" . number_format($rates['buy_rate_per_100'], 2) . "\n";
echo "   - Sell Rate per 100: ₦" . number_format($rates['sell_rate_per_100'], 2) . "\n";
echo "   - Spread per 100:    ₦" . number_format($rates['spread_per_100'], 2) . " (" . round(($rates['spread_per_100'] / $rates['buy_rate_per_100']) * 100, 1) . "% House Margin)\n";
assert($rates['buy_rate_per_100'] == 1500.0, "Expected buy rate 1500");
assert($rates['sell_rate_per_100'] == 1350.0, "Expected sell rate 1350");
assert($rates['spread_per_100'] == 150.0, "Expected spread 150");
echo "   ✓ Coin rates validated successfully.\n\n";

// 2. Verify Supported Currencies
$currencies = getSupportedCurrencies($db);
echo "2. Multi-Currency Exchange Rates:\n";
foreach ($currencies as $code => $c) {
    echo "   - {$c['flag']} {$code} ({$c['name']}): 1 {$code} = ₦" . number_format($c['rate_to_naira'], 2) . " (Min deposit: {$c['symbol']}{$c['min_deposit']})\n";
}
assert(isset($currencies['USD']) && $currencies['USD']['rate_to_naira'] == 1500.0, "Expected USD rate 1500");
assert(isset($currencies['GHS']) && $currencies['GHS']['rate_to_naira'] == 100.0, "Expected GHS rate 100");
assert(isset($currencies['KES']) && $currencies['KES']['rate_to_naira'] == 12.0, "Expected KES rate 12");
echo "   ✓ Multi-currency rates validated successfully.\n\n";

// 3. Verify Withdrawal Channels & Dynamic Rates
$channels = getWithdrawalChannels($db);
echo "3. Withdrawal Channels & Payout FX:\n";
foreach ($channels as $ch) {
    echo "   - {$ch['icon']} {$ch['name']} ({$ch['currency']}): Rate = ₦" . number_format($ch['rate_to_naira'], 2) . " | Min: ₦" . number_format($ch['min_amount_naira']) . "\n";
}
assert(count($channels) === 5, "Expected 5 withdrawal channels");
echo "   ✓ Withdrawal channels validated successfully.\n\n";

// 4. Mathematical Simulation of Bureau De Change Spread
echo "4. Mathematical Simulation of Profit per 1,000 Coins:\n";
$coins = 1000;
$costNaira = ($coins / 100.0) * $rates['buy_rate_per_100']; // 15,000
$cashoutNaira = ($coins / 100.0) * $rates['sell_rate_per_100']; // 13,500
$houseNairaProfit = $costNaira - $cashoutNaira; // 1,500

$costUsd = $costNaira / $currencies['USD']['rate_to_naira']; // $10.00
$cashoutUsd = $cashoutNaira / $currencies['USD']['rate_to_naira']; // $9.00
$houseUsdProfit = $costUsd - $cashoutUsd; // $1.00

$costGhs = $costNaira / $currencies['GHS']['rate_to_naira']; // GH₵ 150.00
$cashoutGhs = $cashoutNaira / $currencies['GHS']['rate_to_naira']; // GH₵ 135.00
$houseGhsProfit = $costGhs - $cashoutGhs; // GH₵ 15.00

echo "   - Deposit 1,000 Coins via USD:  Player pays \${$costUsd}  | Cashout: \${$cashoutUsd}  | Platform Profit: \${$houseUsdProfit} (10%)\n";
echo "   - Deposit 1,000 Coins via GHS:  Player pays GH₵{$costGhs} | Cashout: GH₵{$cashoutGhs} | Platform Profit: GH₵{$houseGhsProfit} (10%)\n";
echo "   - Deposit 1,000 Coins via NGN:  Player pays ₦{$costNaira} | Cashout: ₦{$cashoutNaira} | Platform Profit: ₦{$houseNairaProfit} (10%)\n";

assert($houseUsdProfit == 1.0, "Expected USD profit 1.00");
assert($houseGhsProfit == 15.0, "Expected GHS profit 15.00");
assert($houseNairaProfit == 1500.0, "Expected NGN profit 1500.00");
echo "   ✓ Bureau De Change spread is 100% mathematically uniform across all currencies!\n\n";

echo "========================================================\n";
echo "🎉 ALL MONETIZATION & SPREAD CHECKS PASSED!\n";
echo "========================================================\n";
