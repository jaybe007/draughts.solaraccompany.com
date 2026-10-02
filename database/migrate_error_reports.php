<?php
/**
 * Migration: System Error Reports & Intelligent Diagnostic Solutions
 * Creates the `system_error_reports` table for real-time monitoring and resolution.
 */
require_once __DIR__ . '/../config/db.php';

try {
    $db = getDB();
    echo "========================================================\n";
    echo "🚨  STARTING ERROR REPORTS SYSTEM MIGRATION\n";
    echo "========================================================\n\n";

    $db->exec("
        CREATE TABLE IF NOT EXISTS system_error_reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            error_level VARCHAR(20) NOT NULL DEFAULT 'error',
            category VARCHAR(50) NOT NULL DEFAULT 'general',
            message TEXT NOT NULL,
            file VARCHAR(255) NULL,
            line INT NULL,
            stack_trace TEXT NULL,
            context_json LONGTEXT NULL,
            suggested_solution TEXT NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'unresolved',
            occurrence_count INT DEFAULT 1,
            resolved_by VARCHAR(50) NULL,
            resolved_at DATETIME NULL,
            last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_status (status),
            INDEX idx_category (category),
            INDEX idx_created (created_at),
            INDEX idx_last_seen (last_seen_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "  ✓ Created / verified 'system_error_reports' table.\n";

    // Add occurrence_count column if missing
    try {
        $db->exec("ALTER TABLE system_error_reports ADD COLUMN occurrence_count INT DEFAULT 1 AFTER status");
        echo "  ✓ Added 'occurrence_count' column.\n";
    } catch (Exception $e) {
        // Already exists
    }

    // Add last_seen_at column if missing
    try {
        $db->exec("ALTER TABLE system_error_reports ADD COLUMN last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER resolved_at");
        echo "  ✓ Added 'last_seen_at' column.\n";
    } catch (Exception $e) {
        // Already exists
    }

    // Seed a sample diagnostic record to demonstrate the system
    $count = (int)$db->query("SELECT COUNT(*) FROM system_error_reports")->fetchColumn();
    if ($count === 0) {
        $stmt = $db->prepare("
            INSERT INTO system_error_reports 
            (error_level, category, message, file, line, stack_trace, context_json, suggested_solution, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'unresolved')
        ");
        $stmt->execute([
            'warning',
            'payment',
            'Flutterwave webhook received unverified hash header signature',
            'config/payment.php',
            372,
            '#0 config/payment.php(372): verifyWebhookSignature()\n#1 api/webhooks.php(45): handleFlutterwaveEvent()',
            json_encode(['ip' => '127.0.0.1', 'gateway' => 'flutterwave', 'action' => 'webhook_verify']),
            'Verify that FLUTTERWAVE_SECRET_KEY in your .env or cPanel environment matches the secret hash configured in your Flutterwave Merchant Dashboard (Settings > Webhooks).'
        ]);
        echo "  ✓ Seeded introductory diagnostic error report.\n";
    }

    echo "\n========================================================\n";
    echo "🎉 ERROR REPORTS MIGRATION COMPLETED SUCCESSFULLY!\n";
    echo "========================================================\n";
    exit(0);

} catch (Exception $e) {
    echo "❌ MIGRATION FAILED: " . $e->getMessage() . "\n";
    exit(1);
}
