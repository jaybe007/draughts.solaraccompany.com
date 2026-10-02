<?php
/**
 * Seeds and initializes Multi-Currency Exchange Rates & International Spread settings in system_settings.
 */
require_once __DIR__ . '/../config/db.php';

try {
    $db = getDB();
    $defaults = [
        'fx_rate_usd' => ['1500.00', 'US Dollar (USD) and USDT exchange rate: ₦ per $1.00 USD'],
        'fx_rate_eur' => ['1650.00', 'Euro (EUR) exchange rate: ₦ per €1.00 EUR'],
        'fx_rate_gbp' => ['1950.00', 'British Pound (GBP) exchange rate: ₦ per £1.00 GBP'],
        'fx_rate_ghs' => ['100.00', 'Ghana Cedi (GHS) Mobile Money exchange rate: ₦ per GH₵1.00 GHS'],
        'fx_rate_kes' => ['12.00', 'Kenya Shilling (KES) M-Pesa exchange rate: ₦ per KSh1.00 KES'],
        'fx_withdrawal_spread_percent' => ['0', 'Additional international cashout spread / processing fee percentage (0 = 0%)']
    ];

    $checkStmt = $db->prepare("SELECT COUNT(*) FROM system_settings WHERE setting_key = ?");
    $insertStmt = $db->prepare("INSERT INTO system_settings (setting_key, setting_value, description, updated_by) VALUES (?, ?, ?, 'System')");

    foreach ($defaults as $key => [$val, $desc]) {
        $checkStmt->execute([$key]);
        if ((int)$checkStmt->fetchColumn() === 0) {
            $insertStmt->execute([$key, $val, $desc]);
            echo "✓ Seeded setting '{$key}' = '{$val}'\n";
        } else {
            echo "- Setting '{$key}' already exists.\n";
        }
    }
    echo "FX settings setup completed successfully!\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
