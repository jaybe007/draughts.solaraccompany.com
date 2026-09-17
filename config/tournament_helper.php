<?php
/**
 * Naija Draughts - Tournament Engine Helper Library
 * Provides shared logic for bracket advancement, seed pairings, and prize payouts.
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/payment.php';

function advanceTournamentRound($db, $tournId, $round, $matchIndex, $winnerId) {
    $stmt = $db->prepare("SELECT * FROM tournaments WHERE id = ?");
    $stmt->execute([$tournId]);
    $tourn = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tourn) return false;

    $brackets = json_decode($tourn['brackets_json'] ?? '{}', true);

    $wUser = $db->query("SELECT id, username FROM users WHERE id = {$winnerId}")->fetch(PDO::FETCH_ASSOC);
    if (!$wUser) return false;

    if ($round === 'quarter_finals') {
        if (!isset($brackets['quarter_finals'][$matchIndex])) return false;

        $m = &$brackets['quarter_finals'][$matchIndex];
        if (($m['status'] ?? '') === 'completed') return true;

        $m['winner'] = ['id' => (int)$wUser['id'], 'username' => $wUser['username']];
        $m['status'] = 'completed';

        $p1Id = (int)($m['p1']['id'] ?? 0);
        $p2Id = (int)($m['p2']['id'] ?? 0);
        $loserId = ($p1Id === (int)$winnerId) ? $p2Id : $p1Id;
        $db->prepare("UPDATE tournament_participants SET status = 'eliminated' WHERE tournament_id = ? AND user_id = ?")->execute([$tournId, $loserId]);
        $db->prepare("UPDATE tournament_participants SET current_round = 'Semi-Finals' WHERE tournament_id = ? AND user_id = ?")->execute([$tournId, $winnerId]);

        $sfIdx = ($matchIndex < 2) ? 0 : 1;
        $pSlot = ($matchIndex % 2 === 0) ? 'p1' : 'p2';

        $brackets['semi_finals'][$sfIdx][$pSlot] = ['id' => (int)$wUser['id'], 'username' => $wUser['username']];

        if (!empty($brackets['semi_finals'][$sfIdx]['p1']) && !empty($brackets['semi_finals'][$sfIdx]['p2'])) {
            $sfP1 = $brackets['semi_finals'][$sfIdx]['p1'];
            $sfP2 = $brackets['semi_finals'][$sfIdx]['p2'];
            $roomCode = "TOURN-{$tournId}-R2M" . ($sfIdx + 1);

            $brackets['semi_finals'][$sfIdx]['status'] = 'ready';
            $brackets['semi_finals'][$sfIdx]['room_code'] = $roomCode;

            $db->prepare("
                INSERT INTO game_rooms (
                    room_code, host_id, guest_id, host_name, guest_name, game_type, 
                    wager_coins, wager_naira, status, current_turn, rule_type, player_time,
                    p1_time_left, p2_time_left, time_control, board_size, rule_mode
                ) VALUES (?, ?, ?, ?, ?, 'tournament', 0, 0.00, 'waiting', 1, 'nigeria', '5', 300, 300, 'rapid_5', 10, 'nigerian')
            ")->execute([$roomCode, $sfP1['id'], $sfP2['id'], $sfP1['username'], $sfP2['username']]);
        }

        $allQfDone = true;
        foreach ($brackets['quarter_finals'] as $qf) {
            if (empty($qf['winner'])) { $allQfDone = false; break; }
        }
        if ($allQfDone) {
            $db->prepare("UPDATE tournaments SET current_round = 'Semi-Finals' WHERE id = ?")->execute([$tournId]);
        }

    } elseif ($round === 'semi_finals') {
        if (!isset($brackets['semi_finals'][$matchIndex])) return false;

        $m = &$brackets['semi_finals'][$matchIndex];
        if (($m['status'] ?? '') === 'completed') return true;

        $m['winner'] = ['id' => (int)$wUser['id'], 'username' => $wUser['username']];
        $m['status'] = 'completed';

        $p1Id = (int)($m['p1']['id'] ?? 0);
        $p2Id = (int)($m['p2']['id'] ?? 0);
        $loserId = ($p1Id === (int)$winnerId) ? $p2Id : $p1Id;
        $db->prepare("UPDATE tournament_participants SET status = 'eliminated' WHERE tournament_id = ? AND user_id = ?")->execute([$tournId, $loserId]);
        $db->prepare("UPDATE tournament_participants SET current_round = 'Finals' WHERE tournament_id = ? AND user_id = ?")->execute([$tournId, $winnerId]);

        $fSlot = ($matchIndex === 0) ? 'p1' : 'p2';
        $brackets['finals'][$fSlot] = ['id' => (int)$wUser['id'], 'username' => $wUser['username']];

        if (!empty($brackets['finals']['p1']) && !empty($brackets['finals']['p2'])) {
            $fP1 = $brackets['finals']['p1'];
            $fP2 = $brackets['finals']['p2'];
            $roomCode = "TOURN-{$tournId}-FINAL";

            $brackets['finals']['status'] = 'ready';
            $brackets['finals']['room_code'] = $roomCode;

            $db->prepare("
                INSERT INTO game_rooms (
                    room_code, host_id, guest_id, host_name, guest_name, game_type, 
                    wager_coins, wager_naira, status, current_turn, rule_type, player_time,
                    p1_time_left, p2_time_left, time_control, board_size, rule_mode
                ) VALUES (?, ?, ?, ?, ?, 'tournament', 0, 0.00, 'waiting', 1, 'nigeria', '5', 300, 300, 'rapid_5', 10, 'nigerian')
            ")->execute([$roomCode, $fP1['id'], $fP2['id'], $fP1['username'], $fP2['username']]);

            $db->prepare("UPDATE tournaments SET current_round = 'Grand Finals' WHERE id = ?")->execute([$tournId]);
        }

    } elseif ($round === 'finals') {
        $f = &$brackets['finals'];
        if (($f['status'] ?? '') === 'completed') return true;

        $f['winner'] = ['id' => (int)$wUser['id'], 'username' => $wUser['username']];
        $f['status'] = 'completed';

        $p1Id = (int)($f['p1']['id'] ?? 0);
        $p2Id = (int)($f['p2']['id'] ?? 0);
        $runnerUpId = ($p1Id === (int)$winnerId) ? $p2Id : $p1Id;
        $ruUser = $db->query("SELECT id, username FROM users WHERE id = {$runnerUpId}")->fetch(PDO::FETCH_ASSOC);

        $prizeNaira = (float)($tourn['prize_pool_naira'] ?? 0);
        $feeCoins   = (int)($tourn['entry_fee_coins'] ?? 0);

        $champPrizeNaira = round($prizeNaira * 0.70, 2); // 70% to Champion
        $ruPrizeNaira    = round($prizeNaira * 0.20, 2); // 20% to Runner-up

        $champCoins = round(($feeCoins * 8) * 0.70);
        $ruCoins    = round(($feeCoins * 8) * 0.20);

        if ($champPrizeNaira > 0) {
            $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")->execute([$champPrizeNaira, $winnerId]);
            $wBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$winnerId}")->fetchColumn();
            $db->prepare("
                INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                VALUES (?, 'tournament_prize', ?, 0, ?, 'completed', ?, ?)
            ")->execute([$winnerId, $champPrizeNaira, $wBal, "TOURN-WIN-{$tournId}", "🏆 1st Place Prize: {$tourn['name']} (70% Share)"]);
        }
        if ($champCoins > 0) {
            $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$champCoins, $winnerId]);
        }

        if ($ruPrizeNaira > 0 && $runnerUpId > 0) {
            $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")->execute([$ruPrizeNaira, $runnerUpId]);
            $rBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$runnerUpId}")->fetchColumn();
            $db->prepare("
                INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                VALUES (?, 'tournament_prize', ?, 0, ?, 'completed', ?, ?)
            ")->execute([$runnerUpId, $ruPrizeNaira, $rBal, "TOURN-RU-{$tournId}", "🥈 2nd Place Prize: {$tourn['name']} (20% Share)"]);
        }
        if ($ruCoins > 0 && $runnerUpId > 0) {
            $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$ruCoins, $runnerUpId]);
        }

        $db->prepare("UPDATE tournament_participants SET status = 'champion', prize_won_naira = ?, prize_won_coins = ? WHERE tournament_id = ? AND user_id = ?")
           ->execute([$champPrizeNaira, $champCoins, $tournId, $winnerId]);

        if ($runnerUpId > 0) {
            $db->prepare("UPDATE tournament_participants SET status = 'eliminated', prize_won_naira = ?, prize_won_coins = ? WHERE tournament_id = ? AND user_id = ?")
               ->execute([$ruPrizeNaira, $ruCoins, $tournId, $runnerUpId]);
        }

        $db->prepare("
            UPDATE tournaments 
            SET status = 'completed', current_round = 'Completed', winner_id = ?, winner_name = ?, runner_up_id = ?, runner_up_name = ? 
            WHERE id = ?
        ")->execute([$winnerId, $wUser['username'], $runnerUpId, ($ruUser['username'] ?? 'Runner-up'), $tournId]);
    }

    $db->prepare("UPDATE tournaments SET brackets_json = ? WHERE id = ?")->execute([json_encode($brackets), $tournId]);
    return true;
}

function checkAndAdvanceTournamentMatch($db, $roomCode, $winnerId) {
    if (!$winnerId || strpos($roomCode, 'TOURN-') !== 0) {
        return false;
    }
    if (preg_match('/^TOURN-(\d+)-(R1M[1-4]|R2M[1-2]|FINAL)$/', $roomCode, $tm)) {
        $tId = (int)$tm[1];
        $tSuffix = $tm[2];
        $tRound = ($tSuffix === 'FINAL') ? 'finals' : (strpos($tSuffix, 'R1M') === 0 ? 'quarter_finals' : 'semi_finals');
        $tIdx = ($tRound === 'finals') ? 0 : ((int)substr($tSuffix, 3) - 1);
        return advanceTournamentRound($db, $tId, $tRound, $tIdx, (int)$winnerId);
    }
    return false;
}
