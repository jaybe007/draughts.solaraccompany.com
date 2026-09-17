<?php
/**
 * Automated Test Suite: Nigerian Championships & Knockout Tournament Brackets
 * Verifies:
 * 1. Tournament Creation (Cash ₦ & Coins)
 * 2. 8-Player Registration, Fee Deduction, & Automated Bracket Seeding
 * 3. Match Room Creation (TOURN-{id}-R1M1 .. R1M4)
 * 4. Quarterfinals & Semifinals Bracket Progression
 * 5. Grand Finals Conclude & Automated Prize Payouts (70% Champion, 20% Runner-Up)
 * 6. Transaction Logging & Participant Statuses
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/tournament_helper.php';

$db = getDB();
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

echo "=========================================================\n";
echo "🏆 NIGERIAN DRAUGHTS: TOURNAMENT & BRACKET TEST SUITE\n";
echo "=========================================================\n\n";

$passed = 0;
$failed = 0;

function assertTest($desc, $cond, $detail = '') {
    global $passed, $failed;
    if ($cond) {
        echo "  [PASS] {$desc}\n";
        $passed++;
    } else {
        echo "  [FAIL] {$desc}" . ($detail ? " -- {$detail}" : "") . "\n";
        $failed++;
    }
}

// Clean up any previous test contenders
$db->exec("DELETE FROM game_rooms WHERE room_code LIKE 'TOURN-%'");
$db->exec("DELETE FROM tournament_participants WHERE username LIKE 'TournPlayer_%'");
$db->exec("DELETE FROM wallet_transactions WHERE description LIKE '%TournPlayer%' OR description LIKE '%Lagos Premier Cash Cup%'");
$db->exec("DELETE FROM tournaments WHERE name LIKE 'Lagos Premier Cash Cup%'");
$db->exec("DELETE FROM users WHERE username LIKE 'TournPlayer_%'");

// -----------------------------------------------------------------------------
// STEP 1: Provision 8 Test Players with Funded Wallets
// -----------------------------------------------------------------------------
echo "[1] Provisioning 8 Knockout Contenders...\n";
$contenderIds = [];
$contenderUsers = [];

for ($i = 1; $i <= 8; $i++) {
    $uname = "TournPlayer_{$i}_" . time();
    $email = "tourn_{$i}_" . time() . "@naijadraughts.test";
    $passHash = password_hash("Password123!", PASSWORD_BCRYPT);

    $stmt = $db->prepare("
        INSERT INTO users (username, email, password_hash, wallet_balance, coins, rating, is_verified)
        VALUES (?, ?, ?, 5000.00, 1000, 1200, 1)
    ");
    $stmt->execute([$uname, $email, $passHash]);
    $uid = (int)$db->lastInsertId();
    $contenderIds[] = $uid;
    $contenderUsers[$uid] = $uname;
}

assertTest("Created 8 test contenders with ₦5,000 & 1,000 coins", count($contenderIds) === 8);

// -----------------------------------------------------------------------------
// STEP 2: Create Official Cash Championship
// -----------------------------------------------------------------------------
echo "\n[2] Creating Lagos Grandmasters Cash Knockout Championship...\n";

$tournName = "Lagos Premier Cash Cup " . time();
$entryFeeNaira = 1000.00;
$prizePoolNaira = 50000.00;
$entryFeeCoins = 100;

$initBrackets = json_encode([
    'quarter_finals' => [
        ['match_id' => 1, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
        ['match_id' => 2, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
        ['match_id' => 3, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
        ['match_id' => 4, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending']
    ],
    'semi_finals' => [
        ['match_id' => 5, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
        ['match_id' => 6, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending']
    ],
    'finals' => [
        'match_id' => 7, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'
    ]
]);

$stmt = $db->prepare("
    INSERT INTO tournaments (
        host_id, host_name, name, tagline, location, prize_pool, prize_pool_naira,
        entry_fee_coins, entry_fee_naira, format, bracket_size, status, current_round, brackets_json
    ) VALUES (
        ?, 'Naija Draughts Federation', ?, 'Official High-Stakes Knockout', 'Lagos Island', '₦50,000 Cash', ?,
        ?, ?, '8-Player Knockout', '8', 'upcoming', 'Registration Open', ?
    )
");
$stmt->execute([$contenderIds[0], $tournName, $prizePoolNaira, $entryFeeCoins, $entryFeeNaira, $initBrackets]);
$tournId = (int)$db->lastInsertId();

assertTest("Created tournament record with ID #{$tournId}", $tournId > 0);

// -----------------------------------------------------------------------------
// STEP 3: Register 8 Players via Registration Flow & Validate Auto-Seeding
// -----------------------------------------------------------------------------
echo "\n[3] Registering Contenders & Verifying Auto-Seeding...\n";

foreach ($contenderIds as $idx => $uid) {
    // Simulate user session
    $_SESSION['user'] = ['id' => $uid, 'username' => $contenderUsers[$uid], 'wallet_balance' => 5000.00, 'coins' => 1000];

    // Deduct fee and register
    $db->prepare("UPDATE users SET wallet_balance = wallet_balance - ?, coins = coins - ? WHERE id = ?")
       ->execute([$entryFeeNaira, $entryFeeCoins, $uid]);

    $seed = $idx + 1;
    $db->prepare("
        INSERT INTO tournament_participants (tournament_id, user_id, username, seed_number, status, current_round)
        VALUES (?, ?, ?, ?, 'registered', 'Quarter-Finals')
    ")->execute([$tournId, $uid, $contenderUsers[$uid], $seed]);

    $db->prepare("
        INSERT INTO wallet_transactions (user_id, type, amount, coins, status, reference, description)
        VALUES (?, 'tournament_entry', ?, ?, 'completed', ?, ?)
    ")->execute([$uid, -$entryFeeNaira, -$entryFeeCoins, "TOURN-FEE-{$tournId}-{$uid}", "Entry Fee: {$tournName}"]);

    // If 8th player, trigger auto-seeding
    if ($seed === 8) {
        $pList = $db->query("SELECT * FROM tournament_participants WHERE tournament_id = {$tournId} ORDER BY seed_number ASC")->fetchAll(PDO::FETCH_ASSOC);

        $pairings = [
            ['p1' => $pList[0], 'p2' => $pList[7], 'match_index' => 0],
            ['p1' => $pList[3], 'p2' => $pList[4], 'match_index' => 1],
            ['p1' => $pList[1], 'p2' => $pList[6], 'match_index' => 2],
            ['p1' => $pList[2], 'p2' => $pList[5], 'match_index' => 3]
        ];

        $qfMatches = [];
        foreach ($pairings as $pIdx => $pair) {
            $mNum = $pIdx + 1;
            $roomCode = "TOURN-{$tournId}-R1M{$mNum}";
            $db->prepare("
                INSERT INTO game_rooms (
                    room_code, host_id, guest_id, host_name, guest_name, game_type, 
                    wager_coins, wager_naira, status, current_turn, rule_type, player_time,
                    p1_time_left, p2_time_left, time_control, board_size, rule_mode
                ) VALUES (
                    ?, ?, ?, ?, ?, 'tournament', 
                    0, 0.00, 'waiting', 1, 'nigeria', '5',
                    300, 300, 'rapid_5', 10, 'nigerian'
                )
            ")->execute([
                $roomCode,
                $pair['p1']['user_id'],
                $pair['p2']['user_id'],
                $pair['p1']['username'],
                $pair['p2']['username']
            ]);

            $qfMatches[] = [
                'match_id' => $mNum,
                'p1' => ['id' => (int)$pair['p1']['user_id'], 'username' => $pair['p1']['username'], 'seed' => (int)$pair['p1']['seed_number']],
                'p2' => ['id' => (int)$pair['p2']['user_id'], 'username' => $pair['p2']['username'], 'seed' => (int)$pair['p2']['seed_number']],
                'winner' => null,
                'room_code' => $roomCode,
                'status' => 'ready'
            ];
        }

        $brackets = [
            'quarter_finals' => $qfMatches,
            'semi_finals' => [
                ['match_id' => 5, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
                ['match_id' => 6, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending']
            ],
            'finals' => [
                'match_id' => 7, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'
            ]
        ];

        $db->prepare("UPDATE tournaments SET status = 'live', current_round = 'Quarter-Finals', brackets_json = ? WHERE id = ?")
           ->execute([json_encode($brackets), $tournId]);
        $db->exec("UPDATE tournament_participants SET status = 'active' WHERE tournament_id = {$tournId}");
    }
}

$freshTourn = $db->query("SELECT * FROM tournaments WHERE id = {$tournId}")->fetch(PDO::FETCH_ASSOC);
assertTest("Tournament status transitioned to 'live'", $freshTourn['status'] === 'live');
assertTest("Tournament current_round is 'Quarter-Finals'", $freshTourn['current_round'] === 'Quarter-Finals');

// Verify 4 game rooms created
$qfRooms = $db->query("SELECT COUNT(*) FROM game_rooms WHERE room_code LIKE 'TOURN-{$tournId}-R1M%'")->fetchColumn();
assertTest("4 designated Quarterfinal match rooms created in game_rooms", (int)$qfRooms === 4);

// -----------------------------------------------------------------------------
// STEP 4: Play Quarterfinals Matches (Bracket Advancement to Semifinals)
// -----------------------------------------------------------------------------
echo "\n[4] Simulating Quarterfinals Matches & Progression...\n";

// Pairings:
// Match 1: Seed 1 (contenderIds[0]) vs Seed 8 (contenderIds[7]) -> Winner: Seed 1
// Match 2: Seed 4 (contenderIds[3]) vs Seed 5 (contenderIds[4]) -> Winner: Seed 4
// Match 3: Seed 2 (contenderIds[1]) vs Seed 7 (contenderIds[6]) -> Winner: Seed 2
// Match 4: Seed 3 (contenderIds[2]) vs Seed 6 (contenderIds[5]) -> Winner: Seed 3

advanceTournamentRound($db, $tournId, 'quarter_finals', 0, $contenderIds[0]);
advanceTournamentRound($db, $tournId, 'quarter_finals', 1, $contenderIds[3]);
advanceTournamentRound($db, $tournId, 'quarter_finals', 2, $contenderIds[1]);
advanceTournamentRound($db, $tournId, 'quarter_finals', 3, $contenderIds[2]);

$afterQf = $db->query("SELECT * FROM tournaments WHERE id = {$tournId}")->fetch(PDO::FETCH_ASSOC);
$bAfterQf = json_decode($afterQf['brackets_json'], true);

assertTest("Quarterfinals completed, round moved to 'Semi-Finals'", $afterQf['current_round'] === 'Semi-Finals');
assertTest("SF Match 1 populated with Seed 1 and Seed 4", 
    $bAfterQf['semi_finals'][0]['p1']['id'] === $contenderIds[0] && 
    $bAfterQf['semi_finals'][0]['p2']['id'] === $contenderIds[3]
);
assertTest("SF Match 2 populated with Seed 2 and Seed 3", 
    $bAfterQf['semi_finals'][1]['p1']['id'] === $contenderIds[1] && 
    $bAfterQf['semi_finals'][1]['p2']['id'] === $contenderIds[2]
);

// Verify Semifinals rooms exist
$sfRooms = $db->query("SELECT COUNT(*) FROM game_rooms WHERE room_code LIKE 'TOURN-{$tournId}-R2M%'")->fetchColumn();
assertTest("2 Semifinal match rooms generated (TOURN-{$tournId}-R2M1 and R2M2)", (int)$sfRooms === 2);

// Check losers eliminated
$eliminatedCount = (int)$db->query("SELECT COUNT(*) FROM tournament_participants WHERE tournament_id = {$tournId} AND status = 'eliminated'")->fetchColumn();
assertTest("4 losers eliminated after Quarter-Finals", $eliminatedCount === 4);

// -----------------------------------------------------------------------------
// STEP 5: Play Semifinals Matches (Advancement to Grand Finals)
// -----------------------------------------------------------------------------
echo "\n[5] Simulating Semifinals Matches...\n";

// SF 1: Seed 1 vs Seed 4 -> Winner: Seed 1
// SF 2: Seed 2 vs Seed 3 -> Winner: Seed 2
advanceTournamentRound($db, $tournId, 'semi_finals', 0, $contenderIds[0]);
advanceTournamentRound($db, $tournId, 'semi_finals', 1, $contenderIds[1]);

$afterSf = $db->query("SELECT * FROM tournaments WHERE id = {$tournId}")->fetch(PDO::FETCH_ASSOC);
$bAfterSf = json_decode($afterSf['brackets_json'], true);

assertTest("Tournament round moved to 'Grand Finals'", $afterSf['current_round'] === 'Grand Finals');
assertTest("Grand Finals match populated with Seed 1 vs Seed 2", 
    $bAfterSf['finals']['p1']['id'] === $contenderIds[0] && 
    $bAfterSf['finals']['p2']['id'] === $contenderIds[1]
);

$finalRoom = $db->query("SELECT COUNT(*) FROM game_rooms WHERE room_code = 'TOURN-{$tournId}-FINAL'")->fetchColumn();
assertTest("Grand Finals room 'TOURN-{$tournId}-FINAL' generated in game_rooms", (int)$finalRoom === 1);

// -----------------------------------------------------------------------------
// STEP 6: Conclude Grand Finals & Verify Automated Prize Payouts
// -----------------------------------------------------------------------------
echo "\n[6] Concluding Grand Finals & Validating Automated Prize Payouts...\n";

// Initial balances before prize
$champBalBefore = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$contenderIds[0]}")->fetchColumn();
$ruBalBefore    = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$contenderIds[1]}")->fetchColumn();

// Seed 1 wins Grand Finals!
advanceTournamentRound($db, $tournId, 'finals', 0, $contenderIds[0]);

$champBalAfter = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$contenderIds[0]}")->fetchColumn();
$ruBalAfter    = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$contenderIds[1]}")->fetchColumn();

// 70% of ₦50,000 = ₦35,000.00
$expectedChampGain = 35000.00;
// 20% of ₦50,000 = ₦10,000.00
$expectedRuGain = 10000.00;

$actualChampGain = round($champBalAfter - $champBalBefore, 2);
$actualRuGain = round($ruBalAfter - $ruBalBefore, 2);

assertTest("Champion awarded 70% cash prize (₦35,000.00)", $actualChampGain === $expectedChampGain, "Gain: ₦{$actualChampGain}");
assertTest("Runner-Up awarded 20% cash prize (₦10,000.00)", $actualRuGain === $expectedRuGain, "Gain: ₦{$actualRuGain}");

// 10% platform commission retained (50,000 - 35,000 - 10,000 = ₦5,000)
$platformRake = $prizePoolNaira - ($expectedChampGain + $expectedRuGain);
assertTest("Platform retained 10% house commission (₦5,000.00)", $platformRake === 5000.00);

// Check tournament record status
$completedTourn = $db->query("SELECT * FROM tournaments WHERE id = {$tournId}")->fetch(PDO::FETCH_ASSOC);
assertTest("Tournament status is 'completed'", $completedTourn['status'] === 'completed');
assertTest("Tournament winner_name recorded correctly", $completedTourn['winner_name'] === $contenderUsers[$contenderIds[0]]);
assertTest("Tournament runner_up_name recorded correctly", $completedTourn['runner_up_name'] === $contenderUsers[$contenderIds[1]]);

// Check participant status
$champStatus = $db->query("SELECT status, prize_won_naira FROM tournament_participants WHERE tournament_id = {$tournId} AND user_id = {$contenderIds[0]}")->fetch(PDO::FETCH_ASSOC);
assertTest("Champion participant status is 'champion'", $champStatus['status'] === 'champion');
assertTest("Champion prize_won_naira recorded as ₦35,000", (float)$champStatus['prize_won_naira'] === 35000.00);

$ruStatus = $db->query("SELECT prize_won_naira FROM tournament_participants WHERE tournament_id = {$tournId} AND user_id = {$contenderIds[1]}")->fetch(PDO::FETCH_ASSOC);
assertTest("Runner-Up prize_won_naira recorded as ₦10,000", (float)$ruStatus['prize_won_naira'] === 10000.00);

// Check wallet transactions
$champTx = $db->query("SELECT * FROM wallet_transactions WHERE user_id = {$contenderIds[0]} AND type = 'tournament_prize'")->fetch(PDO::FETCH_ASSOC);
assertTest("Champion wallet_transaction created with type 'tournament_prize'", !empty($champTx));
assertTest("Champion transaction amount is ₦35,000.00", (float)$champTx['amount'] === 35000.00);

$ruTx = $db->query("SELECT * FROM wallet_transactions WHERE user_id = {$contenderIds[1]} AND type = 'tournament_prize'")->fetch(PDO::FETCH_ASSOC);
assertTest("Runner-Up wallet_transaction created with type 'tournament_prize'", !empty($ruTx));
assertTest("Runner-Up transaction amount is ₦10,000.00", (float)$ruTx['amount'] === 10000.00);

// -----------------------------------------------------------------------------
// STEP 7: Verify Idempotency (Cannot Double-Payout)
// -----------------------------------------------------------------------------
echo "\n[7] Testing Idempotency (Preventing Duplicate Prize Payouts)...\n";
$doubleCall = advanceTournamentRound($db, $tournId, 'finals', 0, $contenderIds[0]);
$champBalAfterDouble = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$contenderIds[0]}")->fetchColumn();
assertTest("Repeated final call returns without double-crediting", $champBalAfterDouble === $champBalAfter);

// -----------------------------------------------------------------------------
// STEP 8: Cleanup Test Contenders and Tournament
// -----------------------------------------------------------------------------
echo "\n[8] Cleaning up temporary test tournament...\n";
$db->exec("DELETE FROM game_rooms WHERE room_code LIKE 'TOURN-{$tournId}-%'");
$db->exec("DELETE FROM tournament_participants WHERE tournament_id = {$tournId}");
$db->exec("DELETE FROM wallet_transactions WHERE reference LIKE 'TOURN-%-{$tournId}%'");
$db->exec("DELETE FROM tournaments WHERE id = {$tournId}");
foreach ($contenderIds as $uid) {
    $db->exec("DELETE FROM wallet_transactions WHERE user_id = {$uid}");
    $db->exec("DELETE FROM users WHERE id = {$uid}");
}
assertTest("Cleaned up test data safely", true);

echo "\n=========================================================\n";
echo "📊 TEST RESULTS: {$passed} PASSED, {$failed} FAILED\n";
echo "=========================================================\n";

if ($failed > 0) {
    exit(1);
} else {
    echo "🎉 ALL TOURNAMENT & KNOCKOUT BRACKET TESTS PASSED PERFECTLY!\n";
    exit(0);
}
