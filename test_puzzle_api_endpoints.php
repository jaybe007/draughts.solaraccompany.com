<?php
/**
 * test_puzzle_api_endpoints.php
 * Direct functional tests for API endpoints:
 * - api/puzzles.php?action=check_permission
 * - api/puzzles.php?action=create_custom_puzzle
 * - api/puzzles.php?action=convert_puzzle
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/puzzle_helper.php';

$db = getDB();
$passed = 0;
$failed = 0;

function assertEndpoint($desc, $cond) {
    global $passed, $failed;
    if ($cond) {
        echo "  [PASS] {$desc}\n";
        $passed++;
    } else {
        echo "  [FAIL] {$desc}\n";
        $failed++;
    }
}

echo "=========================================================\n";
echo "🌐 PUZZLE REST API FUNCTIONAL VERIFICATION SUITE\n";
echo "=========================================================\n\n";

$createdPids = [];
$rnd = rand(1000, 9999);

try {
    // 1. Setup mock session with creator user
    $_SESSION['user'] = [
        'id' => 99999,
        'username' => 'ApiTestCreator',
        'role' => 'creator',
        'permissions_json' => json_encode(['manage_puzzles']),
        'is_banned' => 0
    ];

    assertEndpoint("User session recognized by canUserManagePuzzles", canUserManagePuzzles($_SESSION['user']));

    // 2. Direct test of create_custom_puzzle logic
    $puzzleData = [
        'title' => "API Cross-Ruleset Combination {$rnd}",
        'ruleset' => 'all', // Instructs auto-conversion across all types
        'category' => 'tactical',
        'difficulty_tier' => 5,
        'rating' => 1750,
        'white_pieces' => [31, 32, 33, 38],
        'white_kings' => [44],
        'black_pieces' => [18, 19, 23, 24],
        'black_kings' => [5],
        'solution' => [
            ['mover' => 1, 'from' => 31, 'to' => 27, 'notation' => '31-27'],
            ['mover' => 2, 'from' => 23, 'to' => 31, 'notation' => '23x31', 'isOpponent' => true],
            ['mover' => 1, 'from' => 44, 'to' => 13, 'notation' => '44x13']
        ],
        'hints' => ['Sacrifice piece on 27', 'Trap the black king', 'Play 31-27!'],
        'themes' => 'Coup de la Bombe, Street Trap',
        'explanation' => 'White gives up 31-27 to open the diagonal for the king on 44.'
    ];

    $puzzleData['ruleset'] = 'nigeria';
    $baseId = saveFullPuzzleRecord($db, $puzzleData);
    $createdPids[] = $baseId;
    assertEndpoint("Base puzzle record created via API logic (ID: {$baseId})", !empty($baseId));

    $conversion = convertPuzzleToAllTypes($db, $baseId);
    assertEndpoint("Auto-converted into International FMJD and Ghanaian Damii", $conversion['converted_count'] === 2);
    foreach ($conversion['variants'] as $v) {
        $createdPids[] = $v['id'];
    }

    // 3. Verify converted records in database
    $fmjdPid = $conversion['variants']['international']['id'];
    $fmjdPuzzle = $db->query("SELECT * FROM puzzles WHERE id = '{$fmjdPid}'")->fetch(PDO::FETCH_ASSOC);
    assertEndpoint("International FMJD record has correct ruleset 'international'", $fmjdPuzzle && $fmjdPuzzle['ruleset'] === 'international');

    $ghanaPid = $conversion['variants']['ghana']['id'];
    $ghanaPuzzle = $db->query("SELECT * FROM puzzles WHERE id = '{$ghanaPid}'")->fetch(PDO::FETCH_ASSOC);
    assertEndpoint("Ghanaian Damii record has correct ruleset 'ghana'", $ghanaPuzzle && $ghanaPuzzle['ruleset'] === 'ghana');

    // 4. Verify converted_ids in conversion result
    assertEndpoint("Conversion result provides converted_ids array", !empty($conversion['converted_ids']) && in_array($fmjdPid, $conversion['converted_ids']));

    // 5. Verify formatFullPuzzle structure for frontend hydration
    $formatted = formatFullPuzzle($db, $fmjdPuzzle);
    assertEndpoint("formatFullPuzzle returns ruleset", $formatted['ruleset'] === 'international');
    assertEndpoint("formatFullPuzzle returns initialBoard array", is_array($formatted['initialBoard']) && count($formatted['initialBoard']) > 0);
    assertEndpoint("formatFullPuzzle returns solution array", is_array($formatted['solution']) && count($formatted['solution']) === 3);
    assertEndpoint("formatFullPuzzle returns progressive hints", is_array($formatted['hints']) && !empty($formatted['hints'][1]));

} catch (Exception $e) {
    echo "  [FAIL] Exception: " . $e->getMessage() . "\n";
    $failed++;
} finally {
    foreach ($createdPids as $pid) {
        if (!empty($pid)) {
            deleteFullPuzzleRecord($db, $pid);
        }
    }
}

echo "\n=========================================================\n";
echo "📊 RESULTS: {$passed} PASSED, {$failed} FAILED\n";
echo "=========================================================\n";
exit($failed > 0 ? 1 : 0);
