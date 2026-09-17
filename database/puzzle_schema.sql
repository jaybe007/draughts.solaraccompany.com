-- =============================================================================
-- Professional Draughts Puzzle Generation Engine Database Schema
-- Supports millions of puzzles with high-performance indexing
-- =============================================================================

-- 1. Puzzles Master Table
CREATE TABLE IF NOT EXISTS `puzzles` (
  `id` VARCHAR(64) PRIMARY KEY,
  `ruleset` ENUM('nigeria', 'ghana', 'international') NOT NULL DEFAULT 'nigeria',
  `board_size` TINYINT NOT NULL DEFAULT 10,
  `side_to_move` ENUM('white', 'black') NOT NULL,
  `difficulty_tier` TINYINT NOT NULL, -- 1 to 12
  `rating` INT NOT NULL DEFAULT 1500,
  `human_score` TINYINT NOT NULL DEFAULT 50,
  `engine_depth` TINYINT NOT NULL DEFAULT 10,
  `category` ENUM('tactical', 'strategic', 'endgame') NOT NULL DEFAULT 'tactical',
  `game_phase` ENUM('opening', 'early_middlegame', 'middlegame', 'late_middlegame', 'endgame') NOT NULL DEFAULT 'middlegame',
  `solution_uniqueness` ENUM('unique', 'nearly_unique', 'multiple_good_moves', 'only_move', 'forced_draw') NOT NULL DEFAULT 'unique',
  `quality_score` TINYINT NOT NULL DEFAULT 85,
  `evaluation` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  `fen` VARCHAR(255) NOT NULL,
  `position_json` JSON NOT NULL,
  `position_hash` VARCHAR(64) NOT NULL UNIQUE,
  `description` VARCHAR(255) NOT NULL,
  `explanation` TEXT NOT NULL,
  `is_daily` TINYINT(1) DEFAULT 0,
  `daily_date` DATE DEFAULT NULL,
  `times_served` INT DEFAULT 0,
  `times_solved` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ruleset_tier` (`ruleset`, `difficulty_tier`),
  INDEX `idx_ruleset_rating` (`ruleset`, `rating`),
  INDEX `idx_category` (`category`),
  INDEX `idx_daily` (`daily_date`, `ruleset`),
  INDEX `idx_quality` (`quality_score`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Puzzle Solutions Table (Sequence of moves & PV)
CREATE TABLE IF NOT EXISTS `puzzle_solutions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `puzzle_id` VARCHAR(64) NOT NULL,
  `step_number` TINYINT NOT NULL,
  `mover` TINYINT NOT NULL, -- 1 = White, 2 = Black
  `from_sq` TINYINT NOT NULL,
  `to_sq` TINYINT NOT NULL,
  `hops_json` JSON DEFAULT NULL,
  `notation` VARCHAR(40) NOT NULL,
  `note` VARCHAR(255) DEFAULT NULL,
  `is_opponent` TINYINT(1) DEFAULT 0,
  INDEX `idx_puz_step` (`puzzle_id`, `step_number`),
  CONSTRAINT `fk_puz_sol` FOREIGN KEY (`puzzle_id`) REFERENCES `puzzles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Puzzle Hints Table (3 Progressive Levels)
CREATE TABLE IF NOT EXISTS `puzzle_hints` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `puzzle_id` VARCHAR(64) NOT NULL,
  `level` TINYINT NOT NULL, -- 1: General, 2: Tactical, 3: Specific
  `hint_text` VARCHAR(255) NOT NULL,
  UNIQUE KEY `uk_puz_hint` (`puzzle_id`, `level`),
  CONSTRAINT `fk_puz_hint` FOREIGN KEY (`puzzle_id`) REFERENCES `puzzles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Puzzle Themes Mapping (Normalized many-to-many)
CREATE TABLE IF NOT EXISTS `puzzle_themes` (
  `puzzle_id` VARCHAR(64) NOT NULL,
  `theme` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`puzzle_id`, `theme`),
  INDEX `idx_theme` (`theme`),
  CONSTRAINT `fk_puz_theme` FOREIGN KEY (`puzzle_id`) REFERENCES `puzzles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Puzzle User Attempts (Progress Tracking & Adaptive Rating)
CREATE TABLE IF NOT EXISTS `puzzle_attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `puzzle_id` VARCHAR(64) NOT NULL,
  `user_id` INT NOT NULL,
  `is_correct` TINYINT(1) NOT NULL,
  `time_taken_ms` INT NOT NULL,
  `hints_used` TINYINT DEFAULT 0,
  `rating_before` INT NOT NULL,
  `rating_after` INT NOT NULL,
  `attempted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_attempts` (`user_id`, `attempted_at`),
  INDEX `idx_puzzle_attempts` (`puzzle_id`),
  CONSTRAINT `fk_puz_att_puz` FOREIGN KEY (`puzzle_id`) REFERENCES `puzzles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_puz_att_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Puzzle Telemetry & Batch Generation Logs
CREATE TABLE IF NOT EXISTS `puzzle_generation_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_id` VARCHAR(64) NOT NULL,
  `ruleset` VARCHAR(20) NOT NULL,
  `requested_count` INT NOT NULL,
  `accepted_count` INT NOT NULL,
  `rejected_count` INT NOT NULL,
  `duplicates_count` INT NOT NULL,
  `invalid_count` INT NOT NULL,
  `ambiguous_count` INT NOT NULL,
  `avg_quality_score` DECIMAL(5,2) NOT NULL,
  `avg_difficulty` DECIMAL(5,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
