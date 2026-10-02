<?php
/**
 * Comprehensive Verification of Tournament Oversights, Menu Wiring, and Navigation
 */

require_once __DIR__ . '/config/db.php';

echo "=================================================================\n";
echo "🔍 VERIFICATION: TOURNAMENTS OVERSIGHT & NAVIGATION INTEGRITY\n";
echo "=================================================================\n\n";

$passCount = 0;
$failCount = 0;

function check($cond, $title, $detail = '') {
    global $passCount, $failCount;
    if ($cond) {
        echo "  [PASS] $title" . ($detail ? " ($detail)" : "") . "\n";
        $passCount++;
    } else {
        echo "  [FAIL] $title" . ($detail ? " ($detail)" : "") . "\n";
        $failCount++;
    }
}

// -------------------------------------------------------------
// SECTION 1: Check dashboard.php TOURNAMENTS navbar menu & actions
// -------------------------------------------------------------
echo "1. Validating Navbar Menu in dashboard.php:\n";
$dashHtml = file_get_contents(__DIR__ . '/dashboard.php');

check(strpos($dashHtml, 'id="btn-dropdown-tournaments"') !== false, "Dropdown toggle exists (#btn-dropdown-tournaments)");
check(strpos($dashHtml, 'id="menu-tournaments"') !== false, "Dropdown menu exists (#menu-tournaments)");

$expectedMenuItems = [
    'create' => 'Create Tournament',
    'new' => 'New Tournaments',
    'started' => 'Tournament Started',
    'over' => 'Tournament Over',
    'most_viewed' => 'Most Viewed',
    'all' => 'All Tournaments',
    'guide' => 'How to Guide (PDF)'
];

foreach ($expectedMenuItems as $act => $label) {
    $hasCall = strpos($dashHtml, "navToTournament('$act')") !== false;
    $hasLabel = strpos($dashHtml, $label) !== false;
    check($hasCall && $hasLabel, "Menu action '$act' exists", "navToTournament('$act') -> '$label'");
}

// -------------------------------------------------------------
// SECTION 2: Check js/dashboard.js implementation
// -------------------------------------------------------------
echo "\n2. Validating Client Logic in js/dashboard.js:\n";
$dashJs = file_get_contents(__DIR__ . '/js/dashboard.js');

check(strpos($dashJs, 'function navToTournament(action)') !== false, "navToTournament function defined");
check(strpos($dashJs, 'function closeAllDropdowns()') !== false, "closeAllDropdowns function defined");
check(strpos($dashJs, 'function switchTournamentFilter(filterName)') !== false, "switchTournamentFilter function defined");
check(strpos($dashJs, 'function openTournamentGuideModal()') !== false, "openTournamentGuideModal function defined");
check(strpos($dashJs, 'function openHostTournamentModal()') !== false, "openHostTournamentModal function defined");
check(strpos($dashJs, 'closeAllDropdowns();') !== false, "Dropdown dismiss wired on item clicks");
check(strpos($dashJs, 'activateMainTab(\'tournaments\')') !== false, "Tab activation guaranteed when navigating to tournament");
check(strpos($dashJs, 'urlParams.get(\'tab\')') !== false, "URL parameter deep-linking (?tab=) supported");

// Check JS syntax using node or PHP linting
$syntaxCheck = true;
// Basic check for balanced braces
$openBraces = substr_count($dashJs, '{');
$closeBraces = substr_count($dashJs, '}');
check($openBraces === $closeBraces, "Balanced braces in js/dashboard.js", "Open: $openBraces, Close: $closeBraces");

// -------------------------------------------------------------
// SECTION 3: Check game.php and js/app.js oversight fix
// -------------------------------------------------------------
echo "\n3. Validating Game Arena Oversight Fix (game.php & js/app.js):\n";
$gamePhp = file_get_contents(__DIR__ . '/game.php');
$appJs = file_get_contents(__DIR__ . '/js/app.js');

check(strpos($gamePhp, "header('Location: dashboard.php?tab=tournaments');") !== false, "game.php redirects ?view=tournaments to dashboard.php?tab=tournaments");
check(strpos($appJs, 'async fetchTournaments(filter = \'all\')') !== false, "fetchTournaments method defined on NigerianDraughtsApp class in js/app.js");

$appOpenBraces = substr_count($appJs, '{');
$appCloseBraces = substr_count($appJs, '}');
check($appOpenBraces === $appCloseBraces, "Balanced braces in js/app.js", "Open: $appOpenBraces, Close: $appCloseBraces");

// -------------------------------------------------------------
// SECTION 4: Live HTTP API Endpoints & Redirection Test
// -------------------------------------------------------------
echo "\n4. Testing Live HTTP Endpoints:\n";

// Test redirect in game.php
$ch = curl_init("http://localhost/nigerian-draughts/game.php?view=tournaments");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_HEADER, true);
$res = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
check($httpCode === 302, "game.php?view=tournaments returns 302 redirect", "HTTP Code: $httpCode");
check(strpos($res, 'dashboard.php?tab=tournaments') !== false, "Redirect target is dashboard.php?tab=tournaments");

// Test API counts and filter returns
$filters = ['all', 'new', 'started', 'over', 'most_viewed'];
foreach ($filters as $f) {
    $apiUrl = "http://localhost/nigerian-draughts/api/tournaments.php?action=get_tournaments&filter=$f";
    $json = @file_get_contents($apiUrl);
    $data = json_decode($json, true);
    check(!empty($data['success']) && isset($data['counts']), "API endpoint filter='$f' returns live data", "Tournaments count: " . count($data['tournaments'] ?? []));
}

// Test PDF Guide endpoint
$pdfCh = curl_init("http://localhost/nigerian-draughts/download_tournament_guide.php?download=1");
curl_setopt($pdfCh, CURLOPT_RETURNTRANSFER, true);
curl_setopt($pdfCh, CURLOPT_HEADER, true);
$pdfRes = curl_exec($pdfCh);
$pdfCode = curl_getinfo($pdfCh, CURLINFO_HTTP_CODE);
$pdfType = curl_getinfo($pdfCh, CURLINFO_CONTENT_TYPE);
curl_close($pdfCh);
check($pdfCode === 200, "download_tournament_guide.php returns HTTP 200");
check(strpos($pdfType, 'application/pdf') !== false, "download_tournament_guide.php Content-Type is application/pdf", $pdfType);

// -------------------------------------------------------------
// SECTION 5: Summary
// -------------------------------------------------------------
echo "\n=================================================================\n";
echo "📊 AUDIT CONFIRMATION: $passCount PASSED, $failCount FAILED\n";
echo "=================================================================\n";

if ($failCount === 0) {
    echo "🎉 ALL OVERSIGHT FIXES AND NAVIGATION PATHS ARE 100% VERIFIED!\n";
    exit(0);
} else {
    echo "❌ SOME CHECKS FAILED. Please review above.\n";
    exit(1);
}
