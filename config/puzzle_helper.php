<?php
/**
 * config/puzzle_helper.php
 * Helper functions for Tactical Puzzles:
 * - Permission and RBAC verification (Admins & delegated puzzle managers)
 * - 10x10 Draughts board square conversion and FEN builder
 * - Saving, updating, deleting puzzles
 * - Conversion across all rulesets (Nigerian Highway, International FMJD, Ghanaian Damii)
 */

require_once __DIR__ . '/db.php';

/**
 * Checks if a user has permission to create, edit, or manage puzzles.
 */
/**
 * Checks if a user has permission to create, edit, or manage puzzles.
 * Authorized: Super Admins, Admins, Puzzle Masters, Content Creators,
 * or ANY user explicitly granted the 'manage_puzzles' permission.
 */
function canUserManagePuzzles($user) {
    if (!$user) {
        return false;
    }

    $db = null;
    $userId = null;

    // Handle numeric or string user ID
    if (is_numeric($user)) {
        $userId = (int)$user;
    } elseif (is_array($user) && !empty($user['id'])) {
        $userId = (int)$user['id'];
    }

    if (!$userId) {
        return false;
    }

    // If an array was provided, do quick checks first
    if (is_array($user)) {
        if (!empty($user['is_banned'])) {
            return false;
        }

        $role = $user['role'] ?? 'player';
        if (in_array($role, ['admin', 'super_admin', 'puzzle_master', 'puzzle_creator', 'creator', 'instructor', 'moderator'])) {
            return true;
        }

        $perms = [];
        if (!empty($user['permissions_json'])) {
            $perms = is_array($user['permissions_json']) 
                ? $user['permissions_json'] 
                : (json_decode($user['permissions_json'], true) ?: []);
        } elseif (!empty($user['permissions']) && is_array($user['permissions'])) {
            $perms = $user['permissions'];
        }

        if (in_array('manage_puzzles', $perms)) {
            return true;
        }
    }

    // Query fresh state from database to ensure newly assigned permissions/roles take effect immediately
    try {
        $db = getDB();
        $stmt = $db->prepare("SELECT id, role, permissions_json, is_banned FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $fresh = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$fresh || !empty($fresh['is_banned'])) {
            return false;
        }

        // Synchronize active session if available
        if (session_status() === PHP_SESSION_ACTIVE && isset($_SESSION['user']) && (int)($_SESSION['user']['id'] ?? 0) === $userId) {
            $_SESSION['user']['role'] = $fresh['role'];
            $_SESSION['user']['permissions_json'] = $fresh['permissions_json'];
        }

        if (in_array($fresh['role'], ['admin', 'super_admin', 'puzzle_master', 'puzzle_creator', 'creator', 'instructor', 'moderator'])) {
            return true;
        }

        $freshPerms = json_decode($fresh['permissions_json'] ?? '[]', true) ?: [];
        return in_array('manage_puzzles', $freshPerms);
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Converts standard 10x10 draughts square (1 to 50) to (row, col) coordinates.
 */
function sqToCoords10x10($sq) {
    $sq = (int)$sq;
    if ($sq < 1 || $sq > 50) return null;
    $r = (int)floor(($sq - 1) / 5);
    $c = (($sq - 1) % 5) * 2 + ($r % 2 === 0 ? 1 : 0);
    return ['r' => $r, 'c' => $c, 'square' => $sq];
}

/**
 * Converts row and col on 10x10 board to square number 1..50 (or null if not a dark square).
 */
function coordsToSq10x10($r, $c) {
    $r = (int)$r;
    $c = (int)$c;
    if ($r < 0 || $r > 9 || $c < 0 || $c > 9) return null;
    if (($r + $c) % 2 === 0) return null; // Light square
    return ($r * 5) + (int)floor($c / 2) + 1;
}

/**
 * Builds the board piece array [{r, c, square, player, isKing}] from piece lists.
 */
function buildPiecesArray($whiteMen = [], $whiteKings = [], $blackMen = [], $blackKings = []) {
    $board = [];

    // Helper to clean square list
    $cleanList = function($input) {
        if (is_string($input)) {
            $parts = preg_split('/[\s,]+/', trim($input));
            return array_filter(array_map('intval', $parts), fn($s) => $s >= 1 && $s <= 50);
        }
        if (is_array($input)) {
            return array_filter(array_map('intval', $input), fn($s) => $s >= 1 && $s <= 50);
        }
        return [];
    };

    $wm = $cleanList($whiteMen);
    $wk = $cleanList($whiteKings);
    $bm = $cleanList($blackMen);
    $bk = $cleanList($blackKings);

    foreach ($wm as $sq) {
        $coords = sqToCoords10x10($sq);
        if ($coords) $board[] = ['r' => $coords['r'], 'c' => $coords['c'], 'square' => $sq, 'player' => 1, 'isKing' => false];
    }
    foreach ($wk as $sq) {
        $coords = sqToCoords10x10($sq);
        if ($coords) $board[] = ['r' => $coords['r'], 'c' => $coords['c'], 'square' => $sq, 'player' => 1, 'isKing' => true];
    }
    foreach ($bm as $sq) {
        $coords = sqToCoords10x10($sq);
        if ($coords) $board[] = ['r' => $coords['r'], 'c' => $coords['c'], 'square' => $sq, 'player' => 2, 'isKing' => false];
    }
    foreach ($bk as $sq) {
        $coords = sqToCoords10x10($sq);
        if ($coords) $board[] = ['r' => $coords['r'], 'c' => $coords['c'], 'square' => $sq, 'player' => 2, 'isKing' => true];
    }

    return $board;
}

/**
 * Builds standard FEN representation from piece lists.
 */
function buildDraughtsFen($whiteMen = [], $whiteKings = [], $blackMen = [], $blackKings = [], $sideToMove = 'white') {
    $clean = function($arr) {
        if (is_string($arr)) $arr = preg_split('/[\s,]+/', trim($arr));
        return array_values(array_unique(array_filter(array_map('intval', (array)$arr), fn($s) => $s >= 1 && $s <= 50)));
    };

    $wm = $clean($whiteMen);
    $wk = $clean($whiteKings);
    $bm = $clean($blackMen);
    $bk = $clean($blackKings);

    $wPieces = [];
    foreach ($wm as $s) $wPieces[] = (string)$s;
    foreach ($wk as $s) $wPieces[] = 'K' . $s;

    $bPieces = [];
    foreach ($bm as $s) $bPieces[] = (string)$s;
    foreach ($bk as $s) $bPieces[] = 'K' . $s;

    $side = ($sideToMove === 'black' || $sideToMove === 'B' || $sideToMove === 2) ? 'B' : 'W';
    return "{$side}:W" . implode(',', $wPieces) . ":B" . implode(',', $bPieces);
}

/**
 * Saves or updates a full puzzle record with solution steps, hints, and themes.
 */
function saveFullPuzzleRecord(PDO $db, array $data) {
    $id = trim($data['id'] ?? '');
    if (empty($id)) {
        $rulesetPrefix = substr($data['ruleset'] ?? 'ng', 0, 2);
        $id = 'puz_' . $rulesetPrefix . '_' . date('ymd') . '_' . bin2hex(random_bytes(3));
    }

    $ruleset = in_array($data['ruleset'] ?? '', ['nigeria', 'ghana', 'international']) ? $data['ruleset'] : 'nigeria';
    $board = $data['board'] ?? [];
    if (empty($board) && !empty($data['white_pieces'])) {
        $board = buildPiecesArray(
            $data['white_pieces'] ?? [],
            $data['white_kings'] ?? [],
            $data['black_pieces'] ?? [],
            $data['black_kings'] ?? []
        );
    }

    $fen = trim($data['fen'] ?? '');
    if (empty($fen)) {
        $wm = []; $wk = []; $bm = []; $bk = [];
        foreach ($board as $p) {
            if ($p['player'] == 1 && empty($p['isKing'])) $wm[] = $p['square'];
            elseif ($p['player'] == 1 && !empty($p['isKing'])) $wk[] = $p['square'];
            elseif ($p['player'] == 2 && empty($p['isKing'])) $bm[] = $p['square'];
            elseif ($p['player'] == 2 && !empty($p['isKing'])) $bk[] = $p['square'];
        }
        $fen = buildDraughtsFen($wm, $wk, $bm, $bk, $data['side_to_move'] ?? 'white');
    }

    // Ruleset and ID specific hash to satisfy unique constraint across distinct puzzle records
    $posHash = hash('sha256', $id . '_' . $ruleset . '_' . json_encode($board));

    $tier = max(1, min(12, (int)($data['difficulty_tier'] ?? 3)));
    $rating = max(800, min(3000, (int)($data['rating'] ?? 1500)));
    $category = in_array($data['category'] ?? '', ['tactical', 'strategic', 'endgame']) ? $data['category'] : 'tactical';
    $description = trim($data['title'] ?? ($data['description'] ?? 'Tactical Combination'));
    $explanation = trim($data['explanation'] ?? '');
    $sideToMove = ($data['side_to_move'] ?? 'white') === 'black' ? 'black' : 'white';

    // Upsert puzzle
    $stmt = $db->prepare("
        INSERT INTO puzzles 
        (id, ruleset, board_size, side_to_move, difficulty_tier, rating, human_score, engine_depth,
         category, game_phase, solution_uniqueness, quality_score, evaluation, fen, position_json,
         position_hash, description, explanation, is_daily, times_served, times_solved)
        VALUES 
        (:id, :ruleset, 10, :side, :tier, :rating, 60, 12, :category, 'middlegame', 'unique', 90, 4.5,
         :fen, :pos_json, :pos_hash, :desc, :expl, 0, 0, 0)
        ON DUPLICATE KEY UPDATE
            ruleset = VALUES(ruleset),
            side_to_move = VALUES(side_to_move),
            difficulty_tier = VALUES(difficulty_tier),
            rating = VALUES(rating),
            category = VALUES(category),
            fen = VALUES(fen),
            position_json = VALUES(position_json),
            position_hash = VALUES(position_hash),
            description = VALUES(description),
            explanation = VALUES(explanation)
    ");

    $stmt->execute([
        ':id' => $id,
        ':ruleset' => $ruleset,
        ':side' => $sideToMove,
        ':tier' => $tier,
        ':rating' => $rating,
        ':category' => $category,
        ':fen' => $fen,
        ':pos_json' => json_encode($board),
        ':pos_hash' => $posHash,
        ':desc' => substr($description, 0, 255),
        ':expl' => $explanation
    ]);

    // Clean existing children
    $db->prepare("DELETE FROM puzzle_solutions WHERE puzzle_id = ?")->execute([$id]);
    $db->prepare("DELETE FROM puzzle_hints WHERE puzzle_id = ?")->execute([$id]);
    $db->prepare("DELETE FROM puzzle_themes WHERE puzzle_id = ?")->execute([$id]);

    // Insert Solution Steps
    $solutions = $data['solution'] ?? $data['steps'] ?? [];
    if (!empty($solutions) && is_array($solutions)) {
        $solStmt = $db->prepare("
            INSERT INTO puzzle_solutions 
            (puzzle_id, step_number, mover, from_sq, to_sq, hops_json, notation, note, is_opponent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stepNum = 0;
        foreach ($solutions as $s) {
            $from = (int)($s['from'] ?? $s['from_sq'] ?? 0);
            $to = (int)($s['to'] ?? $s['to_sq'] ?? 0);
            $isOpp = !empty($s['isOpponent']) || !empty($s['is_opponent']);
            $mover = (int)($s['mover'] ?? ($isOpp ? 2 : 1));
            $notation = trim($s['notation'] ?? "{$from}-{$to}");
            $note = trim($s['note'] ?? '');
            $hops = !empty($s['hops']) ? (is_array($s['hops']) ? json_encode($s['hops']) : $s['hops']) : '[]';

            $solStmt->execute([
                $id,
                $stepNum++,
                $mover,
                $from,
                $to,
                $hops,
                substr($notation, 0, 40),
                $note ?: null,
                $isOpp ? 1 : 0
            ]);
        }
    }

    // Insert Hints (Level 1, 2, 3)
    $hints = $data['hints'] ?? [];
    if (!empty($hints) && is_array($hints)) {
        $hintStmt = $db->prepare("
            INSERT INTO puzzle_hints (puzzle_id, level, hint_text) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE hint_text = VALUES(hint_text)
        ");
        $fallbackLevel = 1;
        $usedLevels = [];
        foreach ($hints as $lvl => $hText) {
            $lvlNum = (is_numeric($lvl) && (int)$lvl >= 1 && (int)$lvl <= 3 && !in_array((int)$lvl, $usedLevels))
                ? (int)$lvl
                : $fallbackLevel;

            while (in_array($lvlNum, $usedLevels) && $lvlNum <= 3) {
                $lvlNum++;
            }
            if ($lvlNum > 3) break;

            $usedLevels[] = $lvlNum;
            $fallbackLevel = $lvlNum + 1;

            if (!empty(trim($hText))) {
                $hintStmt->execute([$id, $lvlNum, substr(trim($hText), 0, 255)]);
            }
        }
    }

    // Insert Themes
    $themes = $data['themes'] ?? [];
    if (is_string($themes)) {
        $themes = array_map('trim', explode(',', $themes));
    }
    if (!empty($themes) && is_array($themes)) {
        $thmStmt = $db->prepare("INSERT IGNORE INTO puzzle_themes (puzzle_id, theme) VALUES (?, ?)");
        foreach ($themes as $thm) {
            $t = trim($thm);
            if (!empty($t)) {
                $thmStmt->execute([$id, substr($t, 0, 64)]);
            }
        }
    }

    return $id;
}

/**
 * Canonical ruleset definitions for draughts puzzle conversions.
 */
function getCanonicalRulesets() {
    return [
        'nigeria' => [
            'name' => 'Nigerian Highway',
            'prefix' => 'puz_ng_',
            'flag' => '🇳🇬',
            'theme' => 'Nigerian Highway',
            'tagline' => 'Free-choice capture & Highway fly-past'
        ],
        'international' => [
            'name' => 'FMJD International',
            'prefix' => 'puz_fmjd_',
            'flag' => '🌍',
            'theme' => 'FMJD Majority',
            'tagline' => 'Majority capture compulsory ruleset'
        ],
        'ghana' => [
            'name' => 'Ghanaian Damii',
            'prefix' => 'puz_gh_',
            'flag' => '🇬🇭',
            'theme' => 'Ghana Damii',
            'tagline' => 'Immediate crown stop & Damii tactics'
        ]
    ];
}

/**
 * Converts an existing puzzle to a single target ruleset type.
 */
function convertPuzzleToRuleset(PDO $db, $sourcePuzzleId, $targetRuleset) {
    $targetRuleset = strtolower(trim($targetRuleset));
    if ($targetRuleset === 'all') {
        return convertPuzzleToAllTypes($db, $sourcePuzzleId);
    }
    return convertPuzzleToSpecificTypes($db, $sourcePuzzleId, [$targetRuleset]);
}

/**
 * Converts an existing puzzle into specific target ruleset types (e.g. ['international', 'ghana']).
 */
function convertPuzzleToSpecificTypes(PDO $db, $sourcePuzzleId, array $targetRulesets) {
    // 1. Fetch Source Puzzle
    $stmt = $db->prepare("SELECT * FROM puzzles WHERE id = ?");
    $stmt->execute([$sourcePuzzleId]);
    $src = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$src) {
        throw new Exception("Source puzzle '{$sourcePuzzleId}' not found.");
    }

    // 2. Fetch Source Solutions
    $solStmt = $db->prepare("SELECT * FROM puzzle_solutions WHERE puzzle_id = ? ORDER BY step_number ASC");
    $solStmt->execute([$sourcePuzzleId]);
    $solutions = $solStmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Fetch Source Hints
    $hintStmt = $db->prepare("SELECT level, hint_text FROM puzzle_hints WHERE puzzle_id = ? ORDER BY level ASC");
    $hintStmt->execute([$sourcePuzzleId]);
    $hintRows = $hintStmt->fetchAll(PDO::FETCH_ASSOC);
    $hints = [];
    foreach ($hintRows as $h) {
        $hints[$h['level']] = $h['hint_text'];
    }

    // 4. Fetch Source Themes
    $thmStmt = $db->prepare("SELECT theme FROM puzzle_themes WHERE puzzle_id = ?");
    $thmStmt->execute([$sourcePuzzleId]);
    $baseThemes = $thmStmt->fetchAll(PDO::FETCH_COLUMN);

    $allRulesets = getCanonicalRulesets();
    $board = json_decode($src['position_json'] ?: '[]', true);
    $createdCount = 0;
    $results = [];

    // Strip previous ruleset flags from title
    $cleanTitle = preg_replace('/\s*\[(Nigeria|Ghana|FMJD|International)[^\]]*\]/i', '', $src['description']);
    $cleanTitle = trim($cleanTitle);

    foreach ($targetRulesets as $rawTarget) {
        $targetRset = strtolower(trim($rawTarget));
        if (!isset($allRulesets[$targetRset])) {
            continue;
        }

        $meta = $allRulesets[$targetRset];

        if ($targetRset === $src['ruleset']) {
            // Already exists in this ruleset, ensure proper theme is attached
            $db->prepare("INSERT IGNORE INTO puzzle_themes (puzzle_id, theme) VALUES (?, ?)")
               ->execute([$src['id'], $meta['theme']]);
            $results[$targetRset] = [
                'id' => $src['id'],
                'status' => 'original',
                'ruleset' => $targetRset,
                'name' => $meta['name'],
                'flag' => $meta['flag']
            ];
            continue;
        }

        // Generate clean, deterministic target puzzle ID based on source and target ruleset
        $targetId = $meta['prefix'] . substr(md5($sourcePuzzleId . '_' . $targetRset), 0, 10);
        $targetTitle = "{$cleanTitle} [{$meta['name']} {$meta['flag']}]";

        // Build target themes list
        $targetThemes = array_values(array_unique(array_merge($baseThemes, [$meta['theme']])));

        $newPuzzleData = [
            'id' => $targetId,
            'ruleset' => $targetRset,
            'title' => $targetTitle,
            'explanation' => $src['explanation'] . "\n\n(Converted for {$meta['name']} ruleset with authentic piece mechanics).",
            'category' => $src['category'],
            'difficulty_tier' => (int)$src['difficulty_tier'],
            'rating' => (int)$src['rating'],
            'board' => $board,
            'fen' => $src['fen'],
            'side_to_move' => $src['side_to_move'],
            'solution' => $solutions,
            'hints' => $hints,
            'themes' => $targetThemes
        ];

        saveFullPuzzleRecord($db, $newPuzzleData);
        $createdCount++;
        $results[$targetRset] = [
            'id' => $targetId,
            'status' => 'converted',
            'ruleset' => $targetRset,
            'name' => $meta['name'],
            'flag' => $meta['flag']
        ];
    }

    return [
        'source_id' => $sourcePuzzleId,
        'source_ruleset' => $src['ruleset'],
        'converted_count' => $createdCount,
        'converted_ids' => array_values(array_map(fn($v) => $v['id'], $results)),
        'variants' => $results
    ];
}

/**
 * Converts an existing puzzle across all 3 ruleset types:
 * - Nigerian Highway (nigeria)
 * - International FMJD (international)
 * - Ghanaian Damii (ghana)
 */
function convertPuzzleToAllTypes(PDO $db, $sourcePuzzleId) {
    return convertPuzzleToSpecificTypes($db, $sourcePuzzleId, ['international', 'nigeria', 'ghana']);
}

/**
 * Permanently deletes a puzzle and its child data.
 */
function deleteFullPuzzleRecord(PDO $db, $puzzleId) {
    $db->prepare("DELETE FROM puzzle_solutions WHERE puzzle_id = ?")->execute([$puzzleId]);
    $db->prepare("DELETE FROM puzzle_hints WHERE puzzle_id = ?")->execute([$puzzleId]);
    $db->prepare("DELETE FROM puzzle_themes WHERE puzzle_id = ?")->execute([$puzzleId]);
    $stmt = $db->prepare("DELETE FROM puzzles WHERE id = ?");
    $stmt->execute([$puzzleId]);
    return $stmt->rowCount() > 0;
}

/**
 * Formats a full puzzle record with solution, hints, and tags.
 */
function formatFullPuzzle(PDO $db, array $p): array {
    $pid = $p['id'];

    // Fetch solution steps
    $solStmt = $db->prepare("SELECT * FROM puzzle_solutions WHERE puzzle_id = :id ORDER BY step_number ASC");
    $solStmt->execute([':id' => $pid]);
    $solRows = $solStmt->fetchAll();

    $solution = [];
    $opponentBlunder = null;

    foreach ($solRows as $r) {
        $stepData = [
            'step' => (int)$r['step_number'],
            'mover' => (int)$r['mover'],
            'from' => (int)$r['from_sq'],
            'to' => (int)$r['to_sq'],
            'hops' => json_decode($r['hops_json'] ?: '[]', true),
            'notation' => $r['notation'],
            'note' => $r['note'],
            'isOpponent' => (bool)$r['is_opponent']
        ];
        $solution[] = $stepData;

        if ($r['is_opponent'] && $opponentBlunder === null) {
            $opponentBlunder = $stepData;
        }
    }

    // Fetch progressive hints
    $hintStmt = $db->prepare("SELECT level, hint_text FROM puzzle_hints WHERE puzzle_id = :id ORDER BY level ASC");
    $hintStmt->execute([':id' => $pid]);
    $hintRows = $hintStmt->fetchAll();
    $hints = [1 => '', 2 => '', 3 => ''];
    foreach ($hintRows as $h) {
        $hints[(int)$h['level']] = $h['hint_text'];
    }

    // Fetch themes
    $thmStmt = $db->prepare("SELECT theme FROM puzzle_themes WHERE puzzle_id = :id");
    $thmStmt->execute([':id' => $pid]);
    $themes = $thmStmt->fetchAll(PDO::FETCH_COLUMN);

    $initialBoard = json_decode($p['position_json'] ?: '[]', true);

    return [
        'id' => $p['id'],
        'ruleset' => $p['ruleset'],
        'title' => $p['description'],
        'description' => $p['description'],
        'explanation' => $p['explanation'],
        'category' => $p['category'],
        'difficulty_tier' => (int)$p['difficulty_tier'],
        'rating' => (int)$p['rating'],
        'human_score' => (int)$p['human_score'],
        'quality_score' => (int)$p['quality_score'],
        'fen' => $p['fen'],
        'initialBoard' => $initialBoard,
        'solution' => $solution,
        'opponentBlunder' => $opponentBlunder,
        'hints' => $hints,
        'hint' => $hints[1] ?: ($hints[2] ?: $hints[3]),
        'themes' => $themes,
        'times_served' => (int)$p['times_served'],
        'times_solved' => (int)$p['times_solved']
    ];
}
