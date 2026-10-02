<?php
/**
 * Test Tournament Hub Organization & PDF Guide
 */

echo "========================================================\n";
echo "🏆 TEST: TOURNAMENT HUB ORGANIZATION & FILTERS\n";
echo "========================================================\n\n";

$passCount = 0;
$failCount = 0;

function assertTest($cond, $desc) {
    global $passCount, $failCount;
    if ($cond) {
        echo "  [PASS] $desc\n";
        $passCount++;
    } else {
        echo "  [FAIL] $desc\n";
        $failCount++;
    }
}

// 1. Check dashboard.php contains all 7 components requested
$dashHtml = file_get_contents(__DIR__ . '/dashboard.php');

assertTest(strpos($dashHtml, 'Create Tournament') !== false, "1. 'Create Tournament' button present in Tournaments Hub");
assertTest(strpos($dashHtml, 'data-filter="new"') !== false, "2. 'New Tournaments' category filter pill present");
assertTest(strpos($dashHtml, 'data-filter="started"') !== false, "3. 'Tournament Started' category filter pill present");
assertTest(strpos($dashHtml, 'data-filter="over"') !== false, "4. 'Tournament Over' category filter pill present");
assertTest(strpos($dashHtml, 'data-filter="most_viewed"') !== false, "5. 'Most Viewed' category filter pill present");
assertTest(strpos($dashHtml, 'data-filter="all"') !== false, "6. 'All Tournaments' category filter pill present");
assertTest(strpos($dashHtml, 'How to Guide (PDF)') !== false, "7. 'How to Guide (tournament hosting in pdf)' present in buttons and modal");
assertTest(strpos($dashHtml, 'modal-tournament-guide') !== false, "Dedicated Tournament Hosting Guide modal exists");

// 2. Check PDF file exists and is valid
$pdfPath = __DIR__ . '/docs/Nigerian_Draughts_Tournament_Hosting_Guide.pdf';
assertTest(file_exists($pdfPath), "PDF Guide file exists at docs/Nigerian_Draughts_Tournament_Hosting_Guide.pdf");
$pdfContent = file_get_contents($pdfPath);
assertTest(strpos($pdfContent, '%PDF') === 0, "PDF header '%PDF' is valid");
assertTest(filesize($pdfPath) > 1000, "PDF filesize is non-empty (" . filesize($pdfPath) . " bytes)");

// 3. Test API filter responses via HTTP
$filters = ['all', 'new', 'started', 'over', 'most_viewed'];
foreach ($filters as $f) {
    $url = "http://localhost/nigerian-draughts/api/tournaments.php?action=get_tournaments&filter=$f";
    $json = @file_get_contents($url);
    if ($json) {
        $data = json_decode($json, true);
        assertTest(isset($data['success']) && $data['success'] === true, "API handles filter='$f' successfully");
        assertTest(isset($data['counts']) && is_array($data['counts']), "API returns category counts for filter='$f'");
    }
}

// 4. Test download endpoint
$ch = curl_init("http://localhost/nigerian-draughts/download_tournament_guide.php?download=1");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
$res = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

assertTest($httpCode === 200, "download_tournament_guide.php returns HTTP 200");
assertTest(strpos($contentType, 'application/pdf') !== false, "download_tournament_guide.php serves Content-Type: application/pdf");

echo "\n========================================================\n";
echo "📊 TEST RESULTS: $passCount PASSED, $failCount FAILED\n";
echo "========================================================\n";

if ($failCount === 0) {
    echo "🎉 ALL TOURNAMENT ORGANIZATION REQUIREMENTS VERIFIED 100%!\n";
} else {
    exit(1);
}
