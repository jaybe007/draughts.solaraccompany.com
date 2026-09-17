<?php
/**
 * Professional Draughts Puzzle REST API (api/puzzles.php)
 * 
 * Supports:
 * - ?action=random        (Fetch random verified puzzle by ruleset/tier/rating)
 * - ?action=daily         (Fetch deterministic Daily Puzzle)
 * - ?action=get           (Fetch specific puzzle by ID)
 * - ?action=solution      (Fetch verified solution sequence)
 * - ?action=hint          (Progressive hints: Level 1, 2, 3)
 * - ?action=attempt       (Log attempt, update Elo, record stats)
 * - ?action=stats         (Telemetry and difficulty distribution)
 * - ?action=list          (Paginated catalogue for UI navigation)
 * - ?action=save_batch    (Save verified engine puzzles into database)
 */

require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? $_POST['action'] ?? 'random';
$db = getDB();
$currentUser = getCurrentUser();

try {
    switch ($action) {

        // =====================================================================
        // 1. GET RANDOM PUZZLE
        // =====================================================================
        case 'random': {
            $ruleset = $_GET['ruleset'] ?? 'nigeria';
            $tier = isset($_GET['tier']) && $_GET['tier'] !== '' && $_GET['tier'] !== 'all' ? (int)$_GET['tier'] : null;
            $minRating = isset($_GET['min_rating']) ? (int)$_GET['min_rating'] : null;
            $maxRating = isset($_GET['max_rating']) ? (int)$_GET['max_rating'] : null;
            $exclude = !empty($_GET['exclude']) ? explode(',', $_GET['exclude']) : [];

            $sql = "SELECT p.* FROM puzzles p WHERE p.ruleset = :ruleset";
            $params = [':ruleset' => $ruleset];

            $theme = $_GET['theme'] ?? null;
            if (!empty($theme)) {
                $sql .= " AND EXISTS (SELECT 1 FROM puzzle_themes pt WHERE pt.puzzle_id = p.id AND (pt.theme = :theme OR pt.theme LIKE :themeLike))";
                $params[':theme'] = $theme;
                $params[':themeLike'] = '%' . $theme . '%';
            }

            if ($tier !== null && $tier >= 1 && $tier <= 12) {
                $sql .= " AND p.difficulty_tier = :tier";
                $params[':tier'] = $tier;
            }

            if ($minRating !== null) {
                $sql .= " AND p.rating >= :minRating";
                $params[':minRating'] = $minRating;
            }

            if ($maxRating !== null) {
                $sql .= " AND p.rating <= :maxRating";
                $params[':maxRating'] = $maxRating;
            }

            if (!empty($exclude)) {
                $placeholders = [];
                foreach ($exclude as $i => $exId) {
                    $key = ":ex_" . $i;
                    $placeholders[] = $key;
                    $params[$key] = trim($exId);
                }
                $sql .= " AND p.id NOT IN (" . implode(',', $placeholders) . ")";
            }

            $sql .= " ORDER BY RAND() LIMIT 1";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $puzzle = $stmt->fetch();

            // Fallback if exclude filtered everything out
            if (!$puzzle && !empty($exclude)) {
                $fallbackStmt = $db->prepare("SELECT p.* FROM puzzles p WHERE p.ruleset = :ruleset ORDER BY RAND() LIMIT 1");
                $fallbackStmt->execute([':ruleset' => $ruleset]);
                $puzzle = $fallbackStmt->fetch();
            }

            if (!$puzzle) {
                // Fallback to any puzzle in db
                $anyStmt = $db->query("SELECT p.* FROM puzzles p ORDER BY RAND() LIMIT 1");
                $puzzle = $anyStmt->fetch();
            }

            if (!$puzzle) {
                jsonResponse(['success' => false, 'message' => 'No puzzles found matching criteria.'], 404);
            }

            // Increment times_served
            $incStmt = $db->prepare("UPDATE puzzles SET times_served = times_served + 1 WHERE id = :id");
            $incStmt->execute([':id' => $puzzle['id']]);

            $puzzleData = formatFullPuzzle($db, $puzzle);
            jsonResponse(['success' => true, 'puzzle' => $puzzleData]);
            break;
        }

        // =====================================================================
        // 2. GET DAILY PUZZLE
        // =====================================================================
        case 'daily': {
            $ruleset = $_GET['ruleset'] ?? 'nigeria';
            $today = date('Y-m-d');

            // Look for explicit daily puzzle
            $stmt = $db->prepare("SELECT * FROM puzzles WHERE daily_date = :today AND ruleset = :ruleset LIMIT 1");
            $stmt->execute([':today' => $today, ':ruleset' => $ruleset]);
            $puzzle = $stmt->fetch();

            if (!$puzzle) {
                // Deterministic daily puzzle based on date hash
                $allStmt = $db->prepare("SELECT id FROM puzzles WHERE ruleset = :ruleset ORDER BY id ASC");
                $allStmt->execute([':ruleset' => $ruleset]);
                $ids = $allStmt->fetchAll(PDO::FETCH_COLUMN);

                if (!empty($ids)) {
                    $index = abs(crc32($today . '_' . $ruleset)) % count($ids);
                    $selectedId = $ids[$index];
                    $stmt = $db->prepare("SELECT * FROM puzzles WHERE id = :id LIMIT 1");
                    $stmt->execute([':id' => $selectedId]);
                    $puzzle = $stmt->fetch();
                }
            }

            if (!$puzzle) {
                // Fallback to any random puzzle
                $stmt = $db->query("SELECT * FROM puzzles ORDER BY RAND() LIMIT 1");
                $puzzle = $stmt->fetch();
            }

            if (!$puzzle) {
                jsonResponse(['success' => false, 'message' => 'No daily puzzle available.'], 404);
            }

            $puzzleData = formatFullPuzzle($db, $puzzle);
            jsonResponse(['success' => true, 'puzzle' => $puzzleData, 'is_daily' => true, 'date' => $today]);
            break;
        }

        // =====================================================================
        // 3. GET PUZZLE BY ID
        // =====================================================================
        case 'get': {
            $id = $_GET['id'] ?? '';
            if (!$id) {
                jsonResponse(['success' => false, 'message' => 'Puzzle ID is required.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM puzzles WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $puzzle = $stmt->fetch();

            if (!$puzzle) {
                jsonResponse(['success' => false, 'message' => 'Puzzle not found.'], 404);
            }

            $puzzleData = formatFullPuzzle($db, $puzzle);
            jsonResponse(['success' => true, 'puzzle' => $puzzleData]);
            break;
        }

        // =====================================================================
        // 4. GET SOLUTION FOR PUZZLE
        // =====================================================================
        case 'solution': {
            $id = $_GET['id'] ?? '';
            if (!$id) {
                jsonResponse(['success' => false, 'message' => 'Puzzle ID is required.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM puzzle_solutions WHERE puzzle_id = :id ORDER BY step_number ASC");
            $stmt->execute([':id' => $id]);
            $solutions = $stmt->fetchAll();

            $formatted = [];
            foreach ($solutions as $sol) {
                $formatted[] = [
                    'step' => (int)$sol['step_number'],
                    'mover' => (int)$sol['mover'],
                    'from' => (int)$sol['from_sq'],
                    'to' => (int)$sol['to_sq'],
                    'hops' => json_decode($sol['hops_json'] ?: '[]', true),
                    'notation' => $sol['notation'],
                    'note' => $sol['note'],
                    'isOpponent' => (bool)$sol['is_opponent']
                ];
            }

            jsonResponse(['success' => true, 'puzzle_id' => $id, 'solution' => $formatted]);
            break;
        }

        // =====================================================================
        // 5. GET PROGRESSIVE HINT
        // =====================================================================
        case 'hint': {
            $id = $_GET['id'] ?? '';
            $level = isset($_GET['level']) ? (int)$_GET['level'] : 1;
            if (!$id) {
                jsonResponse(['success' => false, 'message' => 'Puzzle ID is required.'], 400);
            }

            $level = max(1, min(3, $level));

            $stmt = $db->prepare("SELECT hint_text FROM puzzle_hints WHERE puzzle_id = :id AND level = :level LIMIT 1");
            $stmt->execute([':id' => $id, ':level' => $level]);
            $hint = $stmt->fetchColumn();

            if (!$hint) {
                // If specific level not found, grab any hint or first move
                $fallbackStmt = $db->prepare("SELECT hint_text FROM puzzle_hints WHERE puzzle_id = :id ORDER BY level ASC LIMIT 1");
                $fallbackStmt->execute([':id' => $id]);
                $hint = $fallbackStmt->fetchColumn() ?: 'Look for compulsory capture opportunities and forced tactical sacrifices.';
            }

            jsonResponse([
                'success' => true,
                'puzzle_id' => $id,
                'level' => $level,
                'hint' => $hint
            ]);
            break;
        }

        // =====================================================================
        // 6. RECORD ATTEMPT & UPDATE ELO
        // =====================================================================
        case 'attempt': {
            $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            $puzzleId = $input['puzzle_id'] ?? '';
            $isCorrect = !empty($input['is_correct']);
            $timeTakenMs = (int)($input['time_taken_ms'] ?? 0);
            $hintsUsed = (int)($input['hints_used'] ?? 0);

            if (!$puzzleId) {
                jsonResponse(['success' => false, 'message' => 'puzzle_id required.'], 400);
            }

            $stmt = $db->prepare("SELECT id, rating FROM puzzles WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $puzzleId]);
            $puzzle = $stmt->fetch();

            if (!$puzzle) {
                jsonResponse(['success' => false, 'message' => 'Puzzle not found.'], 404);
            }

            $puzzleRating = (int)$puzzle['rating'];

            // Update puzzle times_solved if correct
            if ($isCorrect) {
                $db->prepare("UPDATE puzzles SET times_solved = times_solved + 1 WHERE id = :id")->execute([':id' => $puzzleId]);
            }

            $ratingBefore = 1500;
            $ratingAfter = 1500;
            $ratingDelta = 0;
            $coinsEarned = 0;

            if ($currentUser) {
                $userId = (int)$currentUser['id'];
                $ratingBefore = (int)($currentUser['rating'] ?? 1500);

                // Elo Calculation
                // Expected score: E = 1 / (1 + 10^((R_puz - R_usr)/400))
                $exponent = ($puzzleRating - $ratingBefore) / 400.0;
                $expected = 1.0 / (1.0 + pow(10, $exponent));
                $actual = $isCorrect ? 1.0 : 0.0;

                // Hint penalty reduces gain
                if ($isCorrect && $hintsUsed > 0) {
                    $actual = max(0.5, 1.0 - ($hintsUsed * 0.2));
                }

                $k = 32;
                $ratingDelta = (int)round($k * ($actual - $expected));

                // Don't drop rating below 100
                $ratingAfter = max(100, $ratingBefore + $ratingDelta);

                if ($isCorrect) {
                    $coinsEarned = 25 + ($hintsUsed === 0 ? 15 : 0);
                }

                // Update User Profile
                $updUser = $db->prepare("
                    UPDATE users 
                    SET rating = :rating, 
                        coins = coins + :coins 
                    WHERE id = :id
                ");
                $updUser->execute([
                    ':rating' => $ratingAfter,
                    ':coins' => $coinsEarned,
                    ':id' => $userId
                ]);

                // Insert into puzzle_attempts
                $insAtt = $db->prepare("
                    INSERT INTO puzzle_attempts 
                    (puzzle_id, user_id, is_correct, time_taken_ms, hints_used, rating_before, rating_after)
                    VALUES (:pid, :uid, :corr, :time_ms, :hints, :rbefore, :rafter)
                ");
                $insAtt->execute([
                    ':pid' => $puzzleId,
                    ':uid' => $userId,
                    ':corr' => $isCorrect ? 1 : 0,
                    ':time_ms' => $timeTakenMs,
                    ':hints' => $hintsUsed,
                    ':rbefore' => $ratingBefore,
                    ':rafter' => $ratingAfter
                ]);
            }

            jsonResponse([
                'success' => true,
                'puzzle_id' => $puzzleId,
                'is_correct' => $isCorrect,
                'rating_before' => $ratingBefore,
                'rating_after' => $ratingAfter,
                'rating_delta' => $ratingDelta,
                'coins_earned' => $coinsEarned
            ]);
            break;
        }

        // =====================================================================
        // 7. GET OVERALL PUZZLE STATISTICS & TELEMETRY
        // =====================================================================
        case 'stats': {
            $rulesetCounts = $db->query("
                SELECT ruleset, COUNT(*) as count, AVG(rating) as avg_rating, AVG(quality_score) as avg_quality
                FROM puzzles 
                GROUP BY ruleset
            ")->fetchAll();

            $tierCounts = $db->query("
                SELECT difficulty_tier, COUNT(*) as count, AVG(rating) as avg_rating
                FROM puzzles 
                GROUP BY difficulty_tier 
                ORDER BY difficulty_tier ASC
            ")->fetchAll();

            $totalCount = (int)$db->query("SELECT COUNT(*) FROM puzzles")->fetchColumn();
            $totalAttempts = (int)$db->query("SELECT COUNT(*) FROM puzzle_attempts")->fetchColumn();
            $totalSolved = (int)$db->query("SELECT COUNT(*) FROM puzzle_attempts WHERE is_correct = 1")->fetchColumn();

            $userStats = null;
            if ($currentUser) {
                $uid = (int)$currentUser['id'];
                $userAttempts = $db->prepare("
                    SELECT COUNT(*) as total, 
                           SUM(is_correct) as solved, 
                           AVG(time_taken_ms) as avg_time
                    FROM puzzle_attempts 
                    WHERE user_id = :uid
                ");
                $userAttempts->execute([':uid' => $uid]);
                $userStats = $userAttempts->fetch();
                $userStats['current_rating'] = (int)$currentUser['rating'];
            }

            jsonResponse([
                'success' => true,
                'total_puzzles' => $totalCount,
                'total_attempts' => $totalAttempts,
                'total_solved' => $totalSolved,
                'accuracy' => $totalAttempts > 0 ? round(($totalSolved / $totalAttempts) * 100, 1) : 0,
                'by_ruleset' => $rulesetCounts,
                'by_tier' => $tierCounts,
                'user_stats' => $userStats
            ]);
            break;
        }

        // =====================================================================
        // 8. LIST PUZZLES (PAGINATED CATALOGUE)
        // =====================================================================
        case 'list': {
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = min(100, max(5, (int)($_GET['limit'] ?? 24)));
            $offset = ($page - 1) * $limit;

            $ruleset = $_GET['ruleset'] ?? null;
            $tier = isset($_GET['tier']) && $_GET['tier'] !== '' && $_GET['tier'] !== 'all' ? (int)$_GET['tier'] : null;
            $category = $_GET['category'] ?? null;

            $where = [];
            $params = [];

            if ($ruleset) {
                $where[] = "ruleset = :ruleset";
                $params[':ruleset'] = $ruleset;
            }
            if ($tier !== null) {
                $where[] = "difficulty_tier = :tier";
                $params[':tier'] = $tier;
            }
            if ($category) {
                $where[] = "category = :category";
                $params[':category'] = $category;
            }
            $theme = $_GET['theme'] ?? null;
            if (!empty($theme)) {
                $where[] = "EXISTS (SELECT 1 FROM puzzle_themes pt WHERE pt.puzzle_id = puzzles.id AND (pt.theme = :theme OR pt.theme LIKE :themeLike))";
                $params[':theme'] = $theme;
                $params[':themeLike'] = '%' . $theme . '%';
            }

            $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

            $countStmt = $db->prepare("SELECT COUNT(*) FROM puzzles $whereSql");
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();

            $sql = "SELECT id, ruleset, difficulty_tier, rating, category, description, quality_score, times_solved, times_served 
                    FROM puzzles 
                    $whereSql 
                    ORDER BY difficulty_tier ASC, rating ASC, id ASC 
                    LIMIT :limit OFFSET :offset";
            
            $stmt = $db->prepare($sql);
            foreach ($params as $k => $v) {
                $stmt->bindValue($k, $v);
            }
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $items = $stmt->fetchAll();

            jsonResponse([
                'success' => true,
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'total_pages' => ceil($total / $limit),
                'puzzles' => $items
            ]);
            break;
        }

        // =====================================================================
        // 9. SAVE BATCH (Ingest generated and validated engine puzzles)
        // =====================================================================
        case 'save_batch': {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input || empty($input['puzzles'])) {
                jsonResponse(['success' => false, 'message' => 'puzzles array is required.'], 400);
            }

            $puzzles = $input['puzzles'];
            $batchId = $input['batch_id'] ?? ('batch_' . date('Ymd_His') . '_' . substr(bin2hex(random_bytes(4)), 0, 6));
            $ruleset = $input['ruleset'] ?? 'nigeria';

            $db->beginTransaction();
            $inserted = 0;
            $skippedDuplicates = 0;

            $stmtPuz = $db->prepare("
                INSERT INTO puzzles 
                (id, ruleset, board_size, side_to_move, difficulty_tier, rating, human_score, engine_depth, 
                 category, game_phase, solution_uniqueness, quality_score, evaluation, fen, position_json, 
                 position_hash, description, explanation)
                VALUES 
                (:id, :ruleset, :board_size, :side_to_move, :difficulty_tier, :rating, :human_score, :engine_depth,
                 :category, :game_phase, :solution_uniqueness, :quality_score, :evaluation, :fen, :position_json,
                 :position_hash, :description, :explanation)
                ON DUPLICATE KEY UPDATE 
                    rating = VALUES(rating),
                    quality_score = VALUES(quality_score),
                    explanation = VALUES(explanation)
            ");

            $stmtSol = $db->prepare("
                INSERT INTO puzzle_solutions 
                (puzzle_id, step_number, mover, from_sq, to_sq, hops_json, notation, note, is_opponent)
                VALUES 
                (:pid, :step, :mover, :from_sq, :to_sq, :hops, :notation, :note, :is_opp)
            ");

            $stmtHint = $db->prepare("
                INSERT INTO puzzle_hints (puzzle_id, level, hint_text)
                VALUES (:pid, :lvl, :hint)
                ON DUPLICATE KEY UPDATE hint_text = VALUES(hint_text)
            ");

            $stmtTheme = $db->prepare("
                INSERT IGNORE INTO puzzle_themes (puzzle_id, theme)
                VALUES (:pid, :thm)
            ");

            foreach ($puzzles as $p) {
                // Compute or sanitize fields
                $pid = $p['id'];
                $pHash = $p['position_hash'] ?? $p['hash'] ?? hash('sha256', json_encode($p['initialBoard'] ?? []));

                // Check duplicate position hash
                $dupCheck = $db->prepare("SELECT id FROM puzzles WHERE position_hash = :hash AND id != :id LIMIT 1");
                $dupCheck->execute([':hash' => $pHash, ':id' => $pid]);
                if ($dupCheck->fetch()) {
                    $skippedDuplicates++;
                    continue;
                }

                $diffTier = (int)($p['difficulty_tier'] ?? $p['difficulty']['tier'] ?? $p['tier'] ?? 1);
                $rating = (int)($p['rating'] ?? $p['difficulty']['rating'] ?? 1500);
                $humanScore = (int)($p['human_score'] ?? $p['difficulty']['human_score'] ?? 50);
                $engineDepth = (int)($p['engine_depth'] ?? $p['difficulty']['engine_depth'] ?? 10);
                $category = $p['category'] ?? $p['classification']['category'] ?? 'tactical';
                $gamePhase = $p['game_phase'] ?? $p['classification']['game_phase'] ?? 'middlegame';
                $uniqueness = $p['solution_uniqueness'] ?? $p['solution']['uniqueness'] ?? 'unique';
                $qualityScore = (int)($p['quality_score'] ?? $p['quality']['score'] ?? 85);
                $eval = (float)($p['evaluation'] ?? $p['solution']['evaluation'] ?? 4.5);

                $stmtPuz->execute([
                    ':id' => $pid,
                    ':ruleset' => $p['ruleset'] ?? $ruleset,
                    ':board_size' => 10,
                    ':side_to_move' => 'white',
                    ':difficulty_tier' => $diffTier,
                    ':rating' => $rating,
                    ':human_score' => $humanScore,
                    ':engine_depth' => $engineDepth,
                    ':category' => $category,
                    ':game_phase' => $gamePhase,
                    ':solution_uniqueness' => $uniqueness,
                    ':quality_score' => $qualityScore,
                    ':evaluation' => $eval,
                    ':fen' => $p['fen'] ?? '',
                    ':position_json' => json_encode($p['initialBoard'] ?? []),
                    ':position_hash' => $pHash,
                    ':description' => substr($p['title'] ?? $p['description'] ?? 'Tactical Combination', 0, 255),
                    ':explanation' => $p['explanation'] ?? ''
                ]);

                // Clear old solutions/hints if updating
                $db->prepare("DELETE FROM puzzle_solutions WHERE puzzle_id = :id")->execute([':id' => $pid]);
                $db->prepare("DELETE FROM puzzle_hints WHERE puzzle_id = :id")->execute([':id' => $pid]);
                $db->prepare("DELETE FROM puzzle_themes WHERE puzzle_id = :id")->execute([':id' => $pid]);

                // Insert solution sequence
                $solSteps = !empty($p['solution']['steps']) ? $p['solution']['steps'] : (!empty($p['solution']) && is_array($p['solution']) ? $p['solution'] : []);
                if (!empty($solSteps) && is_array($solSteps)) {
                    $stepIdx = 0;
                    foreach ($solSteps as $step) {
                        if (!is_array($step)) continue;
                        $fromSq = (int)($step['fromSq'] ?? (is_numeric($step['from'] ?? null) ? $step['from'] : 0));
                        $toSq = (int)($step['toSq'] ?? (is_numeric($step['to'] ?? null) ? $step['to'] : 0));
                        $isOpp = !empty($step['is_opponent']) || !empty($step['isOpponent']) || !empty($step['isAi']);
                        $notation = $step['notation'] ?? ($fromSq . '-' . $toSq);

                        $stmtSol->execute([
                            ':pid' => $pid,
                            ':step' => $stepIdx++,
                            ':mover' => (int)($step['mover'] ?? ($isOpp ? 2 : 1)),
                            ':from_sq' => $fromSq,
                            ':to_sq' => $toSq,
                            ':hops' => json_encode($step['hops'] ?? []),
                            ':notation' => $notation,
                            ':note' => $step['note'] ?? null,
                            ':is_opp' => $isOpp ? 1 : 0
                        ]);
                    }
                }

                // Insert hints
                $hintsList = $p['hints'] ?? null;
                if (!empty($hintsList) && is_array($hintsList)) {
                    foreach ($hintsList as $lvl => $hText) {
                        $levelNum = is_numeric($lvl) ? ((int)$lvl <= 2 ? (int)$lvl + 1 : (int)$lvl) : 1;
                        if ($levelNum >= 1 && $levelNum <= 3) {
                            $stmtHint->execute([
                                ':pid' => $pid,
                                ':lvl' => $levelNum,
                                ':hint' => substr($hText, 0, 255)
                            ]);
                        }
                    }
                } elseif (!empty($p['hint'])) {
                    $stmtHint->execute([':pid' => $pid, ':lvl' => 1, ':hint' => substr($p['hint'], 0, 255)]);
                }

                // Insert themes
                $themesList = $p['themes'] ?? $p['classification']['themes'] ?? [];
                if (!empty($themesList) && is_array($themesList)) {
                    foreach ($themesList as $thm) {
                        if (is_string($thm)) {
                            $stmtTheme->execute([':pid' => $pid, ':thm' => substr(trim($thm), 0, 64)]);
                        }
                    }
                }

                $inserted++;
            }

            // Telemetry Log
            $logStmt = $db->prepare("
                INSERT INTO puzzle_generation_logs 
                (batch_id, ruleset, requested_count, accepted_count, rejected_count, duplicates_count, 
                 invalid_count, ambiguous_count, avg_quality_score, avg_difficulty)
                VALUES 
                (:bid, :rset, :req, :acc, :rej, :dup, :inv, :amb, :avg_q, :avg_d)
            ");
            $logStmt->execute([
                ':bid' => $batchId,
                ':rset' => $ruleset,
                ':req' => count($puzzles),
                ':acc' => $inserted,
                ':rej' => (int)($input['rejected_count'] ?? 0),
                ':dup' => $skippedDuplicates + (int)($input['duplicates_count'] ?? 0),
                ':inv' => (int)($input['invalid_count'] ?? 0),
                ':amb' => (int)($input['ambiguous_count'] ?? 0),
                ':avg_q' => (float)($input['avg_quality'] ?? 85.0),
                ':avg_d' => (float)($input['avg_difficulty'] ?? 50.0)
            ]);

            $db->commit();

            jsonResponse([
                'success' => true,
                'batch_id' => $batchId,
                'inserted' => $inserted,
                'skipped_duplicates' => $skippedDuplicates
            ]);
            break;
        }

        default:
            jsonResponse(['success' => false, 'message' => "Unknown action '{$action}'"], 400);
    }

} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    jsonResponse(['success' => false, 'message' => 'Server Error: ' . $e->getMessage()], 500);
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
