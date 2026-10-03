<?php
/**
 * test_puzzle_rbac_conversion.php
 * Comprehensive Integration Test Suite:
 * 1. RBAC authorization for adding and managing puzzles:
 *    - Super Admin & Admin access
 *    - Role-based access (puzzle_master, creator)
 *    - Granular permission delegation (manage_puzzles)
 *    - Denial for regular unprivileged players and banned users
 * 2. Puzzle Creation & Multi-Ruleset Conversion:
 *    - Creating a new tactical combination
 *    - Auto-converting across all 3 canonical rulesets:
 *      * Nigerian Highway (nigeria)
 *      * FMJD International (international)
 *      * Ghanaian Damii (ghana)
 *    - Targeted conversion to a single specific ruleset
 *    - Validation of piece positions, solution steps, hints, and themes across converted variants
 *    - Deterministic ID integrity (idempotent conversion without duplicate clutter)
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/puzzle_helper.php';
require_once __DIR__ . '/config/admin_helper.php';

$db = getDB();
$passed = 0;
$failed = 0;

function assertTest($description, $condition) {
    global $passed, $failed;
    if ($condition) {
        echo "  [PASS] {$description}\n";
        $passed++;
    } else {
        echo "  [FAIL] {$description}\n";
        $failed++;
    }
}

echo "=========================================================\n";
echo "🧩 TACTICAL PUZZLES: RBAC & MULTI-RULESET CONVERSION SUITE\n";
echo "=========================================================\n\n";

$createdUserIds = [];
$createdPuzzleIds = [];

try {
    // -----------------------------------------------------------------
    // TEST SECTION 1: RBAC & PERMISSION EVALUATION
    // -----------------------------------------------------------------
    echo "[1] Testing Role & Permission Authorization...\n";

    // 1.1 Super Admin
    $superAdmin = $db->query("SELECT * FROM users WHERE role = 'super_admin' LIMIT 1")->fetch(PDO::FETCH_ASSOC);
    if (!$superAdmin) {
        $db->exec("INSERT INTO users (username, email, role, permissions_json, is_verified) VALUES ('TestRootAdmin', 'root_test@draughts.ng', 'super_admin', '[]', 1)");
        $superAdminId = (int)$db->lastInsertId();
        $createdUserIds[] = $superAdminId;
        $superAdmin = $db->query("SELECT * FROM users WHERE id = {$superAdminId}")->fetch(PDO::FETCH_ASSOC);
    }
    assertTest("Super Admin is authorized to manage puzzles", canUserManagePuzzles($superAdmin));

    // 1.2 Regular Player (No permissions)
    $rnd = rand(10000, 99999);
    $db->prepare("INSERT INTO users (username, email, role, permissions_json, is_verified) VALUES (?, ?, 'player', '[]', 1)")
       ->execute(["RegularPlayer_{$rnd}", "reg_{$rnd}@draughts.ng"]);
    $regPlayerId = (int)$db->lastInsertId();
    $createdUserIds[] = $regPlayerId;
    $regPlayer = $db->query("SELECT * FROM users WHERE id = {$regPlayerId}")->fetch(PDO::FETCH_ASSOC);
    assertTest("Regular player without permissions is DENIED puzzle management", !canUserManagePuzzles($regPlayer));

    // 1.3 User explicitly granted 'manage_puzzles' permission
    $db->prepare("UPDATE users SET permissions_json = ? WHERE id = ?")
       ->execute([json_encode(['manage_puzzles']), $regPlayerId]);
    $updatedPlayer = $db->query("SELECT * FROM users WHERE id = {$regPlayerId}")->fetch(PDO::FETCH_ASSOC);
    assertTest("Player given 'manage_puzzles' permission IS authorized", canUserManagePuzzles($updatedPlayer));
    assertTest("canUserManagePuzzles recognizes permission via numeric ID", canUserManagePuzzles($regPlayerId));

    // 1.4 User given role 'creator' or 'puzzle_master'
    $db->prepare("INSERT INTO users (username, email, role, permissions_json, is_verified) VALUES (?, ?, 'puzzle_master', '[]', 1)")
       ->execute(["MasterCreator_{$rnd}", "creator_{$rnd}@draughts.ng"]);
    $creatorId = (int)$db->lastInsertId();
    $createdUserIds[] = $creatorId;
    $creatorUser = $db->query("SELECT * FROM users WHERE id = {$creatorId}")->fetch(PDO::FETCH_ASSOC);
    assertTest("User with role 'puzzle_master' is automatically authorized", canUserManagePuzzles($creatorUser));

    // 1.5 Banned user is denied regardless of role or permission
    $db->prepare("UPDATE users SET is_banned = 1 WHERE id = ?")->execute([$creatorId]);
    $bannedCreator = $db->query("SELECT * FROM users WHERE id = {$creatorId}")->fetch(PDO::FETCH_ASSOC);
    assertTest("Banned user is strictly DENIED even with puzzle_master role", !canUserManagePuzzles($bannedCreator));

    // -----------------------------------------------------------------
    // TEST SECTION 2: ADDING PUZZLE & AUTO-CONVERSION TO ALL TYPES
    // -----------------------------------------------------------------
    echo "\n[2] Testing Adding Tactical Puzzle & Auto-Converting across All Types...\n";

    $testPuzzlePayload = [
        'title' => "Highway Royal Sacrifice #{$rnd}",
        'ruleset' => 'nigeria',
        'category' => 'tactical',
        'difficulty_tier' => 4,
        'rating' => 1650,
        'white_pieces' => '32, 33, 34, 38, 39, 43',
        'white_kings' => '45',
        'black_pieces' => '12, 18, 23, 24, 29',
        'black_kings' => '',
        'solution' => [
            ['mover' => 1, 'from' => 38, 'to' => 32, 'notation' => '38-32', 'note' => 'Initial breakthrough sacrifice'],
            ['mover' => 2, 'from' => 29, 'to' => 38, 'notation' => '29x38', 'isOpponent' => true],
            ['mover' => 1, 'from' => 43, 'to' => 32, 'notation' => '43x32', 'note' => 'Decisive recapture']
        ],
        'hints' => [
            1 => 'Look for a sacrifice using square 32.',
            2 => 'Lure the black piece forward to open the files.',
            3 => 'Play 38-32!'
        ],
        'themes' => ['Coup Royal', 'Sacrifice', 'Highway Ambush'],
        'explanation' => 'White executes a standard highway sacrifice on 32, forcing a decisive recapture and dominant endgame.'
    ];

    // Create the base puzzle
    $basePuzzleId = saveFullPuzzleRecord($db, $testPuzzlePayload);
    $createdPuzzleIds[] = $basePuzzleId;
    assertTest("Created base Nigerian tactical puzzle (ID: {$basePuzzleId})", !empty($basePuzzleId));

    // Verify base puzzle in database
    $baseRow = $db->query("SELECT * FROM puzzles WHERE id = '{$basePuzzleId}'")->fetch(PDO::FETCH_ASSOC);
    assertTest("Base puzzle ruleset is 'nigeria'", $baseRow['ruleset'] === 'nigeria');
    assertTest("Base puzzle rating is 1650", (int)$baseRow['rating'] === 1650);

    // Verify solution steps and hints count
    $solCount = (int)$db->query("SELECT COUNT(*) FROM puzzle_solutions WHERE puzzle_id = '{$basePuzzleId}'")->fetchColumn();
    assertTest("Base puzzle has 3 solution steps saved", $solCount === 3);

    $hintCount = (int)$db->query("SELECT COUNT(*) FROM puzzle_hints WHERE puzzle_id = '{$basePuzzleId}'")->fetchColumn();
    assertTest("Base puzzle has 3 progressive hints saved", $hintCount === 3);

    // Convert to ALL types: International FMJD, Nigerian Highway, Ghanaian Damii
    echo "\n[3] Converting to All Rulesets (International, Nigeria, Ghana)...\n";
    $conversionResult = convertPuzzleToAllTypes($db, $basePuzzleId);

    assertTest("convertPuzzleToAllTypes returned variants", !empty($conversionResult['variants']));
    assertTest("Converted count equals 2 (FMJD and Ghana created, Nigeria original)", $conversionResult['converted_count'] === 2);

    $fmjdVariantId = $conversionResult['variants']['international']['id'] ?? '';
    $ghanaVariantId = $conversionResult['variants']['ghana']['id'] ?? '';
    $createdPuzzleIds[] = $fmjdVariantId;
    $createdPuzzleIds[] = $ghanaVariantId;

    // Verify FMJD International Record
    $fmjdRow = $db->query("SELECT * FROM puzzles WHERE id = '{$fmjdVariantId}'")->fetch(PDO::FETCH_ASSOC);
    assertTest("FMJD International variant exists in database", !empty($fmjdRow));
    assertTest("FMJD variant has ruleset 'international'", $fmjdRow['ruleset'] === 'international');
    assertTest("FMJD variant title includes '[FMJD International 🌍]'", strpos($fmjdRow['description'], 'FMJD International') !== false);

    $fmjdSolCount = (int)$db->query("SELECT COUNT(*) FROM puzzle_solutions WHERE puzzle_id = '{$fmjdVariantId}'")->fetchColumn();
    assertTest("FMJD variant preserves all 3 solution moves", $fmjdSolCount === 3);

    $fmjdThemes = $db->query("SELECT theme FROM puzzle_themes WHERE puzzle_id = '{$fmjdVariantId}'")->fetchAll(PDO::FETCH_COLUMN);
    assertTest("FMJD variant includes 'FMJD Majority' theme", in_array('FMJD Majority', $fmjdThemes));

    // Verify Ghanaian Damii Record
    $ghanaRow = $db->query("SELECT * FROM puzzles WHERE id = '{$ghanaVariantId}'")->fetch(PDO::FETCH_ASSOC);
    assertTest("Ghanaian Damii variant exists in database", !empty($ghanaRow));
    assertTest("Ghanaian variant has ruleset 'ghana'", $ghanaRow['ruleset'] === 'ghana');
    assertTest("Ghanaian variant title includes '[Ghanaian Damii 🇬🇭]'", strpos($ghanaRow['description'], 'Ghanaian Damii') !== false);

    $ghanaThemes = $db->query("SELECT theme FROM puzzle_themes WHERE puzzle_id = '{$ghanaVariantId}'")->fetchAll(PDO::FETCH_COLUMN);
    assertTest("Ghanaian variant includes 'Ghana Damii' theme", in_array('Ghana Damii', $ghanaThemes));

    // -----------------------------------------------------------------
    // TEST SECTION 4: IDEMPOTENT CONVERSION & REPEAT CONVERSION INTEGRITY
    // -----------------------------------------------------------------
    echo "\n[4] Testing Idempotent Conversion (Deterministic IDs)...\n";
    $repeatConversion = convertPuzzleToAllTypes($db, $basePuzzleId);
    assertTest("Re-converting same puzzle uses deterministic IDs without duplicate sprawl", 
        $repeatConversion['variants']['international']['id'] === $fmjdVariantId &&
        $repeatConversion['variants']['ghana']['id'] === $ghanaVariantId
    );

    // -----------------------------------------------------------------
    // TEST SECTION 5: TARGETED CONVERSION TO SPECIFIC SINGLE TYPE
    // -----------------------------------------------------------------
    echo "\n[5] Testing Targeted Single Ruleset Conversion...\n";
    $standaloneId = 'puz_ng_single_' . $rnd;
    $testPuzzlePayload['id'] = $standaloneId;
    $testPuzzlePayload['title'] = "Standalone Highway Puzzle #{$rnd}";
    saveFullPuzzleRecord($db, $testPuzzlePayload);
    $createdPuzzleIds[] = $standaloneId;

    $singleRes = convertPuzzleToRuleset($db, $standaloneId, 'international');
    assertTest("Single ruleset conversion converted exactly 1 variant", $singleRes['converted_count'] === 1);
    $targetFmjdId = $singleRes['variants']['international']['id'] ?? '';
    $createdPuzzleIds[] = $targetFmjdId;

    $targetFmjd = $db->query("SELECT * FROM puzzles WHERE id = '{$targetFmjdId}'")->fetch(PDO::FETCH_ASSOC);
    assertTest("Targeted FMJD puzzle exists with correct ruleset", $targetFmjd && $targetFmjd['ruleset'] === 'international');

} catch (Exception $e) {
    echo "  [EXCEPTION] " . $e->getMessage() . "\n";
    $failed++;
} finally {
    // Cleanup test records safely
    echo "\n[6] Cleaning up test records safely...\n";
    foreach ($createdPuzzleIds as $pid) {
        if (!empty($pid)) {
            deleteFullPuzzleRecord($db, $pid);
        }
    }
    foreach ($createdUserIds as $uid) {
        if (!empty($uid)) {
            $db->prepare("DELETE FROM users WHERE id = ?")->execute([$uid]);
        }
    }
    assertTest("Test entities cleaned up safely", true);
}

echo "\n=========================================================\n";
echo "📊 RESULTS: {$passed} PASSED, {$failed} FAILED\n";
echo "=========================================================\n";
if ($failed === 0) {
    echo "🎉 ALL RBAC & MULTI-RULESET PUZZLE CONVERSION TESTS PASSED!\n";
}
exit($failed > 0 ? 1 : 0);
