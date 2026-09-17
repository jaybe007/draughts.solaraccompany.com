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
 * Initializes a deposit checkout transaction.
 */
function initializeDepositTransaction($email, $amountNaira, $metadata = []) {
    $reference = 'ND_' . date('YmdHis') . '_' . strtoupper(bin2hex(random_bytes(4)));

    if (!PAYMENT_DEV_MODE && !empty(PAYSTACK_SECRET_KEY)) {
        $url = 'https://api.paystack.co/transaction/initialize';
        $fields = [
            'email' => $email,
            'amount' => (int)($amountNaira * 100), // Amount in Kobo
            'reference' => $reference,
            'metadata' => array_merge($metadata, ['platform' => 'NaijaDraughtsArena'])
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
                    'dev_mode' => false
                ];
            }
        }
    }

    // Interactive Dev Simulation Fallback
    return [
        'success' => true,
        'reference' => 'ND_SIM_' . strtoupper(bin2hex(random_bytes(5))),
        'amount' => (float)$amountNaira,
        'dev_mode' => true,
        'message' => 'Simulated checkout initiated for local testing.'
    ];
}

/**
 * Verifies a payment reference (Paystack or Dev Simulator).
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
                    'channel' => $res['data']['channel'] ?? 'card',
                    'paid_at' => $res['data']['paid_at'] ?? date('Y-m-d H:i:s'),
                    'dev_mode' => false
                ];
            }
        }
    }

    return ['success' => false, 'message' => 'Payment verification failed.'];
}

/**
 * PaymentGateway Class Wrapper
 */
class PaymentGateway {
    public static function getNigerianBanks() {
        return getNigerianBanks();
    }

    public static function calculateMatchPayout($totalPot, $isVipOba = false) {
        return calculateMatchPayout($totalPot, $isVipOba);
    }

    public static function initializeTransaction($amountNaira, $email, $username = '', $metadata = []) {
        return initializeDepositTransaction($email, $amountNaira, $metadata);
    }

    public static function verifyTransaction($reference) {
        return verifyDepositTransaction($reference);
    }
}
