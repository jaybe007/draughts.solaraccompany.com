<?php
/**
 * Naija Draughts - Payment Gateway & Monetization Engine Configuration
 * Supports Paystack & Flutterwave with Local Interactive Dev Simulator.
 */

// Load environment variables if available
require_once __DIR__ . '/env.php';

// API Keys (overridable via environment variables)
define('PAYSTACK_SECRET_KEY', getenv('PAYSTACK_SECRET_KEY') ?: '');
define('PAYSTACK_PUBLIC_KEY', getenv('PAYSTACK_PUBLIC_KEY') ?: '');
define('FLUTTERWAVE_SECRET_KEY', getenv('FLUTTERWAVE_SECRET_KEY') ?: '');
define('FLUTTERWAVE_PUBLIC_KEY', getenv('FLUTTERWAVE_PUBLIC_KEY') ?: '');

// Rake Rates
define('STANDARD_HOUSE_RAKE_PERCENT', 8.0); // 8% standard house rake on cash wagers
define('VIP_OBA_HOUSE_RAKE_PERCENT', 4.0);    // 4% discounted rake for VIP Oba Champions

// Auto-detect Dev Simulator mode
$isDev = empty(PAYSTACK_SECRET_KEY) || (
    !empty($_SERVER['HTTP_HOST']) && (
        strpos($_SERVER['HTTP_HOST'], 'localhost') !== false ||
        strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false
    )
) || php_sapi_name() === 'cli';

define('PAYMENT_DEV_MODE', getenv('PAYMENT_DEV_MODE') !== false ? filter_var(getenv('PAYMENT_DEV_MODE'), FILTER_VALIDATE_BOOLEAN) : $isDev);

/**
 * Returns supported Nigerian commercial & fintech banks for withdrawal.
 */
function getNigerianBanks() {
    return [
        ['code' => '044', 'name' => 'Access Bank'],
        ['code' => '058', 'name' => 'Guaranty Trust Bank (GTBank)'],
        ['code' => '057', 'name' => 'Zenith Bank'],
        ['code' => '011', 'name' => 'First Bank of Nigeria'],
        ['code' => '033', 'name' => 'United Bank for Africa (UBA)'],
        ['code' => '999992', 'name' => 'OPay Digital Services'],
        ['code' => '999991', 'name' => 'PalmPay'],
        ['code' => '090267', 'name' => 'Kuda Microfinance Bank'],
        ['code' => '214', 'name' => 'First City Monument Bank (FCMB)'],
        ['code' => '221', 'name' => 'Stanbic IBTC Bank'],
        ['code' => '035', 'name' => 'Wema Bank (ALAT)'],
        ['code' => '070', 'name' => 'Fidelity Bank']
    ];
}

/**
 * Returns supported global and African withdrawal channels.
 */
function getWithdrawalChannels() {
    return [
        [
            'id' => 'nigerian_bank',
            'name' => 'Nigerian Bank Transfer (NUBAN)',
            'icon' => '🇳🇬',
            'currency' => 'NGN',
            'min_amount_naira' => 1000,
            'description' => 'Fast payout to 12 Nigerian commercial & fintech banks (GTBank, Zenith, Access, OPay, PalmPay, Kuda, etc.)'
        ],
        [
            'id' => 'usdt_crypto',
            'name' => 'USDT Crypto (TRC-20 / BEP-20)',
            'icon' => '🌐',
            'currency' => 'USD',
            'min_amount_naira' => 7500,
            'description' => 'Instant borderless payout to any TRC-20 or BEP-20 wallet address. No banking restrictions.'
        ],
        [
            'id' => 'ghana_momo',
            'name' => 'Ghana Mobile Money (MTN / Telecel / AirtelTigo)',
            'icon' => '🇬🇭',
            'currency' => 'GHS',
            'min_amount_naira' => 3000,
            'description' => 'Direct payout to Ghana Mobile Money wallets (MTN MoMo, Telecel Cash, AirtelTigo Money).'
        ],
        [
            'id' => 'kenya_mpesa',
            'name' => 'Kenya M-Pesa (Safaricom)',
            'icon' => '🇰🇪',
            'currency' => 'KES',
            'min_amount_naira' => 3000,
            'description' => 'Direct payout to Kenya Safaricom M-Pesa mobile numbers.'
        ],
        [
            'id' => 'paypal',
            'name' => 'PayPal Global Payout',
            'icon' => '🌍',
            'currency' => 'USD',
            'min_amount_naira' => 15000,
            'description' => 'International transfer directly to your verified PayPal account email.'
        ]
    ];
}

/**
 * Returns supported currencies, symbols, exchange rates, and deposit limits.
 */
function getSupportedCurrencies($db = null) {
    $currencies = [
        'NGN' => ['code' => 'NGN', 'symbol' => '₦', 'name' => 'Nigerian Naira', 'rate_to_naira' => 1.0, 'min_deposit' => 500.0, 'flag' => '🇳🇬'],
        'USD' => ['code' => 'USD', 'symbol' => '$', 'name' => 'US Dollar', 'rate_to_naira' => 1500.0, 'min_deposit' => 1.0, 'flag' => '🇺🇸'],
        'EUR' => ['code' => 'EUR', 'symbol' => '€', 'name' => 'Euro', 'rate_to_naira' => 1650.0, 'min_deposit' => 1.0, 'flag' => '🇪🇺'],
        'GBP' => ['code' => 'GBP', 'symbol' => '£', 'name' => 'British Pound', 'rate_to_naira' => 1950.0, 'min_deposit' => 1.0, 'flag' => '🇬🇧'],
        'GHS' => ['code' => 'GHS', 'symbol' => 'GH₵', 'name' => 'Ghanaian Cedi', 'rate_to_naira' => 100.0, 'min_deposit' => 15.0, 'flag' => '🇬🇭'],
        'KES' => ['code' => 'KES', 'symbol' => 'KSh', 'name' => 'Kenyan Shilling', 'rate_to_naira' => 12.0, 'min_deposit' => 150.0, 'flag' => '🇰🇪']
    ];

    if ($db instanceof PDO) {
        try {
            $stmt = $db->query("SELECT setting_key, setting_value FROM system_settings WHERE setting_key LIKE 'fx_rate_%'");
            if ($stmt) {
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $c = strtoupper(str_replace('fx_rate_', '', $row['setting_key']));
                    if (isset($currencies[$c]) && is_numeric($row['setting_value'])) {
                        $currencies[$c]['rate_to_naira'] = max(0.0001, (float)$row['setting_value']);
                    }
                }
            }
        } catch (Exception $e) {}
    }

    return $currencies;
}

/**
 * Standard global Coin Bundles priced in user's currency.
 */
function getCoinBundles($currency = 'NGN', $db = null) {
    $currencies = getSupportedCurrencies($db);
    $c = strtoupper(trim($currency ?: 'NGN'));
    if (!isset($currencies[$c])) $c = 'NGN';
    $fx = $currencies[$c]['rate_to_naira'];
    $symbol = $currencies[$c]['symbol'];

    $bundles = [
        [
            'id' => 'bundle_100',
            'coins' => 100,
            'bonus_coins' => 0,
            'total_coins' => 100,
            'title' => 'Rookie Stack',
            'base_naira' => 1500,
            'badge' => 'Starter'
        ],
        [
            'id' => 'bundle_550',
            'coins' => 500,
            'bonus_coins' => 50,
            'total_coins' => 550,
            'title' => 'Street Contender Pack',
            'base_naira' => 7500,
            'badge' => '+10% Bonus 🔥'
        ],
        [
            'id' => 'bundle_1200',
            'coins' => 1000,
            'bonus_coins' => 200,
            'total_coins' => 1200,
            'title' => 'National Master Chest',
            'base_naira' => 15000,
            'badge' => '+20% Bonus ⚡'
        ],
        [
            'id' => 'bundle_3200',
            'coins' => 2500,
            'bonus_coins' => 700,
            'total_coins' => 3200,
            'title' => 'Grandmaster Oba Vault',
            'base_naira' => 37500,
            'badge' => '+28% Bonus 👑'
        ]
    ];

    foreach ($bundles as &$b) {
        $price = round($b['base_naira'] / $fx, 2);
        if ($c === 'NGN') $price = (int)$b['base_naira'];
        $b['currency'] = $c;
        $b['currency_symbol'] = $symbol;
        $b['price'] = $price;
        $b['formatted_price'] = $symbol . number_format($price, $c === 'NGN' ? 0 : 2);
    }

    return $bundles;
}

/**
 * Calculates platform house rake and winner payout for staked matches.
 */
function calculateMatchPayout($totalPot, $isVipOba = false) {
    $rakePercent = $isVipOba ? VIP_OBA_HOUSE_RAKE_PERCENT : STANDARD_HOUSE_RAKE_PERCENT;
    $rakeAmount = round(($totalPot * ($rakePercent / 100.0)), 2);
    $winnerPayout = round($totalPot - $rakeAmount, 2);

    return [
        'total_pot' => (float)$totalPot,
        'rake_percent' => (float)$rakePercent,
        'rake_amount' => (float)$rakeAmount,
        'winner_payout' => (float)$winnerPayout,
        'is_vip_discount' => $isVipOba
    ];
}

/**
 * Initializes a multi-currency deposit checkout transaction.
 */
function initializeDepositTransaction($email, $amount, $currencyOrMeta = 'NGN', $metadata = []) {
    if (is_array($currencyOrMeta)) {
        $metadata = $currencyOrMeta;
        $currency = 'NGN';
    } else {
        $currency = strtoupper(trim($currencyOrMeta ?: 'NGN'));
    }

    $supported = getSupportedCurrencies();
    if (!isset($supported[$currency])) {
        $currency = 'NGN';
    }

    $rateToNaira = $supported[$currency]['rate_to_naira'] ?? 1.0;
    $amountNaira = round($amount * $rateToNaira, 2);

    $reference = 'ND_' . date('YmdHis') . '_' . strtoupper(bin2hex(random_bytes(4)));

    // 1. Live Flutterwave Multi-Currency (Supports USD, GHS, EUR, GBP, KES, NGN, Mobile Money, Apple Pay)
    if (!PAYMENT_DEV_MODE && !empty(FLUTTERWAVE_SECRET_KEY) && ($currency !== 'NGN' || empty(PAYSTACK_SECRET_KEY))) {
        $url = 'https://api.flutterwave.com/v3/payments';
        $redirectUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . 
                       '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . 
                       '/nigerian-draughts/dashboard.php?payment_ref=' . urlencode($reference);

        $payload = [
            'tx_ref' => $reference,
            'amount' => (float)$amount,
            'currency' => $currency,
            'redirect_url' => $redirectUrl,
            'customer' => [
                'email' => $email,
                'name' => $metadata['username'] ?? 'Champion Player'
            ],
            'customizations' => [
                'title' => 'Naija Draughts Arena',
                'description' => "Wallet Funding ({$currency} {$amount})",
                'logo' => 'https://draughts.solaraccompany.com/favicon.svg'
            ],
            'meta' => array_merge($metadata, [
                'currency' => $currency,
                'fx_rate' => $rateToNaira,
                'amount_naira' => $amountNaira,
                'platform' => 'NaijaDraughtsArena'
            ])
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . FLUTTERWAVE_SECRET_KEY,
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $err = curl_error($ch);
        curl_close($ch);

        if (!$err) {
            $res = json_decode($response, true);
            if (!empty($res['status']) && $res['status'] === 'success' && !empty($res['data']['link'])) {
                return [
                    'success' => true,
                    'reference' => $reference,
                    'authorization_url' => $res['data']['link'],
                    'currency' => $currency,
                    'amount' => (float)$amount,
                    'amount_naira' => (float)$amountNaira,
                    'dev_mode' => false
                ];
            }
        }
    }

    // 2. Live Paystack API (for NGN)
    if (!PAYMENT_DEV_MODE && !empty(PAYSTACK_SECRET_KEY) && $currency === 'NGN') {
        $url = 'https://api.paystack.co/transaction/initialize';
        $fields = [
            'email' => $email,
            'amount' => (int)($amountNaira * 100), // Amount in Kobo
            'reference' => $reference,
            'metadata' => array_merge($metadata, ['platform' => 'NaijaDraughtsArena', 'currency' => 'NGN'])
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . PAYSTACK_SECRET_KEY,
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $err = curl_error($ch);
        curl_close($ch);

        if (!$err) {
            $res = json_decode($response, true);
            if (!empty($res['status']) && !empty($res['data']['authorization_url'])) {
                return [
                    'success' => true,
                    'reference' => $reference,
                    'authorization_url' => $res['data']['authorization_url'],
                    'access_code' => $res['data']['access_code'],
                    'currency' => 'NGN',
                    'amount' => (float)$amountNaira,
                    'amount_naira' => (float)$amountNaira,
                    'dev_mode' => false
                ];
            }
        }
    }

    // 3. Interactive Dev Simulation Fallback
    $currSymbol = $supported[$currency]['symbol'] ?? '₦';
    return [
        'success' => true,
        'reference' => 'ND_SIM_' . strtoupper(bin2hex(random_bytes(5))),
        'amount' => (float)$amount,
        'currency' => $currency,
        'amount_naira' => (float)$amountNaira,
        'dev_mode' => true,
        'message' => "Simulated {$currSymbol}" . number_format($amount, 2) . " checkout initiated for testing (Credited as ₦" . number_format($amountNaira, 2) . ")."
    ];
}

/**
 * Verifies a payment reference (Flutterwave, Paystack, or Dev Simulator).
 */
function verifyDepositTransaction($reference) {
    if (empty($reference)) {
        return ['success' => false, 'message' => 'Empty transaction reference.'];
    }

    // Dev Simulation handling
    if (strpos($reference, 'ND_SIM_') === 0 || PAYMENT_DEV_MODE) {
        return [
            'success' => true,
            'reference' => $reference,
            'channel' => 'simulator',
            'dev_mode' => true,
            'message' => 'Simulation payment verified successfully.'
        ];
    }

    // Live Flutterwave Verification
    if (!empty(FLUTTERWAVE_SECRET_KEY)) {
        $url = 'https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=' . rawurlencode($reference);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . FLUTTERWAVE_SECRET_KEY,
            'Content-Type: application/json'
        ]);
        $response = curl_exec($ch);
        $err = curl_error($ch);
        curl_close($ch);

        if (!$err) {
            $res = json_decode($response, true);
            if (!empty($res['status']) && $res['status'] === 'success' && !empty($res['data']['status']) && $res['data']['status'] === 'successful') {
                $flwData = $res['data'];
                $paidAmount = (float)$flwData['amount'];
                $paidCurrency = strtoupper($flwData['currency'] ?? 'NGN');
                $supported = getSupportedCurrencies();
                $fx = $supported[$paidCurrency]['rate_to_naira'] ?? 1.0;
                $amountNaira = round($paidAmount * $fx, 2);

                return [
                    'success' => true,
                    'reference' => $reference,
                    'amount' => $amountNaira,
                    'paid_amount' => $paidAmount,
                    'currency' => $paidCurrency,
                    'channel' => $flwData['payment_type'] ?? 'flutterwave',
                    'paid_at' => $flwData['created_at'] ?? date('Y-m-d H:i:s'),
                    'dev_mode' => false
                ];
            }
        }
    }

    // Live Paystack API verification
    if (!empty(PAYSTACK_SECRET_KEY)) {
        $url = 'https://api.paystack.co/transaction/verify/' . rawurlencode($reference);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . PAYSTACK_SECRET_KEY,
            'Content-Type: application/json'
        ]);
        $response = curl_exec($ch);
        $err = curl_error($ch);
        curl_close($ch);

        if (!$err) {
            $res = json_decode($response, true);
            if (!empty($res['status']) && !empty($res['data']['status']) && $res['data']['status'] === 'success') {
                $amountNaira = $res['data']['amount'] / 100.0;
                return [
                    'success' => true,
                    'reference' => $reference,
                    'amount' => $amountNaira,
                    'paid_amount' => $amountNaira,
                    'currency' => 'NGN',
                    'channel' => $res['data']['channel'] ?? 'paystack',
                    'paid_at' => $res['data']['paid_at'] ?? date('Y-m-d H:i:s'),
                    'dev_mode' => false
                ];
            }
        }
    }

    return ['success' => false, 'message' => 'Payment verification failed.'];
}

/**
 * Retrieves dynamic coin exchange rates and staking commission from system_settings.
 * Defaults:
 *   Buy Rate: ₦1,500 per 100 Coins (₦15.00 / coin)
 *   Sell Rate: ₦1,350 per 100 Coins (₦13.50 / coin)
 *   Match Commission: 0% (No platform commission deducted from match winners)
 *
 * @param PDO|null $db
 * @return array
 */
function getCoinRates($db = null) {
    static $cachedRates = null;
    if ($cachedRates !== null && $db === null) {
        return $cachedRates;
    }

    $buyPer100 = 1500.0;
    $sellPer100 = 1350.0;
    $matchCommission = 0.0;

    if ($db instanceof PDO) {
        try {
            $stmt = $db->query("SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN ('coin_buy_rate_per_100', 'coin_sell_rate_per_100', 'coin_match_commission_percent')");
            if ($stmt) {
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    if ($row['setting_key'] === 'coin_buy_rate_per_100' && is_numeric($row['setting_value'])) {
                        $buyPer100 = max(1.0, (float)$row['setting_value']);
                    } elseif ($row['setting_key'] === 'coin_sell_rate_per_100' && is_numeric($row['setting_value'])) {
                        $sellPer100 = max(1.0, (float)$row['setting_value']);
                    } elseif ($row['setting_key'] === 'coin_match_commission_percent' && is_numeric($row['setting_value'])) {
                        $matchCommission = max(0.0, min(100.0, (float)$row['setting_value']));
                    }
                }
            }
        } catch (Exception $e) {
            // Fallback to defaults
        }
    }

    $buyPerCoin = round($buyPer100 / 100.0, 4);
    $sellPerCoin = round($sellPer100 / 100.0, 4);
    $spreadPer100 = round($buyPer100 - $sellPer100, 2);

    $cachedRates = [
        'buy_rate_per_100' => $buyPer100,
        'buy_rate_per_coin' => $buyPerCoin,
        'sell_rate_per_100' => $sellPer100,
        'sell_rate_per_coin' => $sellPerCoin,
        'spread_per_100' => $spreadPer100,
        'match_commission_percent' => $matchCommission
    ];

    return $cachedRates;
}

/**
 * Ensures user has at least $requiredCoins.
 * If user has fewer coins, but sufficient Naira in wallet_balance,
 * seamlessly auto-converts the shortfall from wallet_balance into coins at the official buy rate!
 *
 * @param PDO $db
 * @param int $userId
 * @param int $requiredCoins
 * @param string $context
 * @return array
 */
function ensureCoinsAvailable($db, $userId, $requiredCoins, $context = 'Match Staking') {
    $requiredCoins = (int)$requiredCoins;
    if ($requiredCoins <= 0) {
        return ['success' => true, 'converted' => false, 'converted_amount' => 0, 'converted_coins' => 0];
    }

    $stmt = $db->prepare("SELECT id, coins, wallet_balance FROM users WHERE id = ?");
    $stmt->execute([(int)$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        return ['success' => false, 'message' => 'User not found.'];
    }

    $currentCoins = (int)$user['coins'];
    $currentNaira = (float)$user['wallet_balance'];

    // 1. If user already has enough coins, proceed directly
    if ($currentCoins >= $requiredCoins) {
        return [
            'success' => true,
            'converted' => false,
            'converted_amount' => 0,
            'converted_coins' => 0,
            'available_coins' => $currentCoins,
            'wallet_balance' => $currentNaira
        ];
    }

    // 2. User has a coin shortfall
    $shortfall = $requiredCoins - $currentCoins;
    $rates = getCoinRates($db);
    $nairaCost = round($shortfall * $rates['buy_rate_per_coin'], 2);

    // 3. Check if user has enough Naira to cover the shortfall
    if ($currentNaira < $nairaCost) {
        $affordableCoins = (int)floor($currentNaira / max(0.01, $rates['buy_rate_per_coin']));
        $shortfallRemaining = max(1, $shortfall - $affordableCoins);
        return [
            'success' => false,
            'converted' => false,
            'converted_amount' => 0,
            'converted_coins' => 0,
            'available_coins' => $currentCoins,
            'wallet_balance' => $currentNaira,
            'shortfall' => $shortfall,
            'message' => "Insufficient coins! You need {$requiredCoins} coins (you have {$currentCoins} coins). Purchasing the {$shortfall} coins shortfall costs ₦" . number_format($nairaCost, 2) . " (Rate: ₦" . number_format($rates['buy_rate_per_100'], 2) . " / 100 Coins). Your wallet balance is ₦" . number_format($currentNaira, 2) . ". Please fund your wallet."
        ];
    }

    // 4. Auto-convert Naira to Coins seamlessly at the official Buy Rate
    $newBal = round($currentNaira - $nairaCost, 2);
    $newCoins = $currentCoins + $shortfall;

    $db->prepare("UPDATE users SET wallet_balance = wallet_balance - ?, coins = coins + ? WHERE id = ?")
       ->execute([$nairaCost, $shortfall, $userId]);

    $db->prepare("
        INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
        VALUES (?, 'coin_exchange', ?, ?, ?, 'completed', ?, ?)
    ")->execute([
        $userId,
        -$nairaCost,
        $shortfall,
        $newBal,
        'AUTO-BUY-' . strtoupper(bin2hex(random_bytes(3))),
        "Auto-Exchange: Purchased {$shortfall} Coins for ₦" . number_format($nairaCost, 2) . " (@ ₦" . number_format($rates['buy_rate_per_100'], 2) . "/100 Coins) for {$context}"
    ]);

    if (isset($_SESSION['user']) && (int)$_SESSION['user']['id'] === (int)$userId) {
        $_SESSION['user']['wallet_balance'] = $newBal;
        $_SESSION['user']['coins'] = $newCoins;
    }

    return [
        'success' => true,
        'converted' => true,
        'converted_amount' => $nairaCost,
        'converted_coins' => $shortfall,
        'available_coins' => $newCoins,
        'wallet_balance' => $newBal
    ];
}

/**
 * PaymentGateway Class Wrapper
 */
class PaymentGateway {
    public static function getNigerianBanks() {
        return getNigerianBanks();
    }

    public static function getWithdrawalChannels() {
        return getWithdrawalChannels();
    }

    public static function getSupportedCurrencies($db = null) {
        return getSupportedCurrencies($db);
    }

    public static function getCoinBundles($currency = 'NGN', $db = null) {
        return getCoinBundles($currency, $db);
    }

    public static function getCoinRates($db = null) {
        return getCoinRates($db);
    }

    public static function calculateMatchPayout($totalPot, $isVipOba = false) {
        return calculateMatchPayout($totalPot, $isVipOba);
    }

    public static function initializeTransaction($amountNaira, $email, $username = '', $metadata = []) {
        $currency = $metadata['currency'] ?? 'NGN';
        return initializeDepositTransaction($email, $amountNaira, $currency, array_merge($metadata, ['username' => $username]));
    }

    public static function verifyTransaction($reference) {
        return verifyDepositTransaction($reference);
    }

    public static function ensureCoinsAvailable($db, $userId, $requiredCoins, $context = 'Match Staking') {
        return ensureCoinsAvailable($db, $userId, $requiredCoins, $context);
    }
}

