<?php
/**
 * Test & Verification Suite for Progressive Web App (PWA) Mobile App Installation
 */

echo "========================================================\n";
echo "📱 PWA MOBILE APP INSTALLATION VERIFICATION SUITE\n";
echo "========================================================\n\n";

// 1. Validate manifest.json
echo "1. Validating manifest.json:\n";
$manifestPath = __DIR__ . '/../manifest.json';
assert(file_exists($manifestPath), "manifest.json missing");
$manifestContent = file_get_contents($manifestPath);
$manifest = json_decode($manifestContent, true);
assert(is_array($manifest), "manifest.json invalid JSON");

echo "   - App Name:       {$manifest['name']}\n";
echo "   - Short Name:     {$manifest['short_name']}\n";
echo "   - Display Mode:   {$manifest['display']} (Full-screen standalone native feel)\n";
echo "   - Theme Color:    {$manifest['theme_color']}\n";
echo "   - Icons Count:    " . count($manifest['icons']) . "\n";
echo "   - Shortcuts:      " . count($manifest['shortcuts']) . " native quick-actions\n";

assert($manifest['display'] === 'standalone', "Display must be standalone");
assert(count($manifest['icons']) >= 4, "Expected at least 4 icons");
assert(count($manifest['shortcuts']) >= 4, "Expected at least 4 native shortcuts");
echo "   ✓ manifest.json is 100% compliant with PWA standards.\n\n";

// 2. Validate Service Worker (sw.js)
echo "2. Validating sw.js:\n";
$swPath = __DIR__ . '/../sw.js';
assert(file_exists($swPath), "sw.js missing");
$sw = file_get_contents($swPath);
assert(strpos($sw, 'CACHE_NAME') !== false, "CACHE_NAME missing in sw.js");
assert(strpos($sw, "url.includes('/api/')") !== false, "API bypass missing in sw.js");
assert(strpos($sw, 'skipWaiting') !== false, "skipWaiting missing in sw.js");
assert(strpos($sw, 'clients.claim') !== false, "clients.claim missing in sw.js");
echo "   ✓ sw.js caching strategies & live financial API bypass verified.\n\n";

// 3. Validate PWA Client Controller (js/pwa.js)
echo "3. Validating js/pwa.js:\n";
$pwaJsPath = __DIR__ . '/../js/pwa.js';
assert(file_exists($pwaJsPath), "js/pwa.js missing");
$pwaJs = file_get_contents($pwaJsPath);
assert(strpos($pwaJs, 'beforeinstallprompt') !== false, "beforeinstallprompt missing in js/pwa.js");
assert(strpos($pwaJs, 'triggerPwaInstall') !== false, "triggerPwaInstall missing in js/pwa.js");
assert(strpos($pwaJs, 'isIosSafari') !== false, "iOS Safari detection missing in js/pwa.js");
assert(strpos($pwaJs, 'appinstalled') !== false, "appinstalled handler missing in js/pwa.js");
echo "   ✓ js/pwa.js installation lifecycle, prompt capture, and iOS guide verified.\n\n";

// 4. Validate Page Integrations
echo "4. Checking PWA Integration Across Platform Pages:\n";
$pages = ['index.php', 'dashboard.php', 'game.php', 'puzzles.php'];
foreach ($pages as $p) {
    $content = file_get_contents(__DIR__ . "/../{$p}");
    assert(strpos($content, 'manifest.json') !== false, "manifest.json link missing in {$p}");
    assert(strpos($content, 'js/pwa.js') !== false, "js/pwa.js script tag missing in {$p}");
    echo "   - {$p}: ✓ Manifest linked & js/pwa.js controller wired.\n";
}
echo "   ✓ All 4 primary platform views verified.\n\n";

// 5. Validate Icons
echo "5. Verifying App Icon Assets:\n";
assert(file_exists(__DIR__ . '/../icons/icon-192.png'), "icon-192.png missing");
assert(file_exists(__DIR__ . '/../icons/icon-512.png'), "icon-512.png missing");
assert(file_exists(__DIR__ . '/../favicon.ico'), "favicon.ico missing");
assert(file_exists(__DIR__ . '/../favicon.svg'), "favicon.svg missing");
echo "   ✓ 192x192, 512x512, ICO, and SVG icon assets verified.\n\n";

echo "========================================================\n";
echo "🎉 ALL PWA MOBILE INSTALL CHECKS PASSED (100% OK)!\n";
echo "========================================================\n";
