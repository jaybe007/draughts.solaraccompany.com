-- =============================================================================
-- NAIJA DRAUGHTS (NIGERIAN DRAFT) DATABASE SCHEMA - PRO EDITION
-- MySQL Database: naija_draughts
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `naija_draughts` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `naija_draughts`;

-- -----------------------------------------------------------------------------
-- 1. Users Table (Player Profiles & Lifetime Statistics)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar_url` VARCHAR(255) NULL,
  `avatar_color` VARCHAR(20) DEFAULT 'green',
  `country` VARCHAR(50) DEFAULT 'Nigeria',
  `country_code` VARCHAR(10) DEFAULT 'NG',
  `title` VARCHAR(50) DEFAULT 'Street Player',
  `rating` INT DEFAULT 1200,
  `coins` INT DEFAULT 150,
  `wallet_balance` DECIMAL(10,2) DEFAULT 2500.00,
  `package` ENUM('free', 'silver', 'gold', 'vip_oba') DEFAULT 'free',
  `package_expiry` DATETIME NULL,
  `role` ENUM('player', 'admin', 'super_admin') DEFAULT 'player',
  `permissions_json` LONGTEXT NULL,
  `is_banned` TINYINT(1) DEFAULT 0,
  `ban_reason` VARCHAR(255) NULL,
  `daily_games_left` INT DEFAULT 10,
  `last_daily_reset` DATE NULL,
  `wins` INT DEFAULT 0,
  `losses` INT DEFAULT 0,
  `draws` INT DEFAULT 0,
  `total_chopped` INT DEFAULT 0,
  `tournaments_hosted` INT DEFAULT 0,
  `tournaments_joined` INT DEFAULT 0,
  `is_verified` TINYINT(1) DEFAULT 0,
  `verification_token` VARCHAR(64) NULL,
  `verification_code` VARCHAR(6) NULL,
  `verification_expires_at` DATETIME NULL,
  `email_verified_at` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_rating` (`rating` DESC),
  INDEX `idx_wins` (`wins` DESC),
  INDEX `idx_verification_token` (`verification_token`),
  INDEX `idx_verification_code` (`email`, `verification_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Matches Table (Match History, Saved Games & Replay Logs)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `matches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `player1_id` INT NULL,
  `player2_id` INT NULL,
  `player1_name` VARCHAR(50) NOT NULL DEFAULT 'Player 1',
  `player2_name` VARCHAR(50) NOT NULL DEFAULT 'Computer (AI)',
  `game_mode` ENUM('pve', 'pvp', 'eve') DEFAULT 'pve',
  `ai_difficulty` VARCHAR(20) DEFAULT 'medium',
  `board_size` INT DEFAULT 10,
  `rule_mode` VARCHAR(20) DEFAULT 'nigerian',
  `time_control` VARCHAR(20) DEFAULT 'rapid_5',
  `winner_id` INT NULL,
  `winner_name` VARCHAR(50) NULL,
  `result` ENUM('p1_won', 'p2_won', 'draw', 'in_progress') DEFAULT 'in_progress',
  `win_reason` VARCHAR(255) NULL,
  `moves_count` INT DEFAULT 0,
  `p1_chopped` INT DEFAULT 0,
  `p2_chopped` INT DEFAULT 0,
  `board_state_json` LONGTEXT NULL,
  `move_history_json` LONGTEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_player1` (`player1_id`),
  INDEX `idx_player2` (`player2_id`),
  INDEX `idx_result` (`result`),
  CONSTRAINT `fk_matches_p1` FOREIGN KEY (`player1_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_matches_p2` FOREIGN KEY (`player2_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Tournaments Table (Nigerian Championships, Brackets & Standings)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tournaments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `host_id` INT NULL,
  `host_name` VARCHAR(50) DEFAULT 'Naija Draughts Federation',
  `name` VARCHAR(100) NOT NULL,
  `tagline` VARCHAR(255) NOT NULL,
  `location` VARCHAR(100) DEFAULT 'Lagos, Nigeria',
  `prize_pool` VARCHAR(50) DEFAULT '₦1,500,000',
  `prize_pool_naira` DECIMAL(10,2) DEFAULT 0.00,
  `entry_fee_coins` INT DEFAULT 0,
  `entry_fee_naira` DECIMAL(10,2) DEFAULT 0.00,
  `max_participants` INT DEFAULT 8,
  `bracket_size` ENUM('8', '16') DEFAULT '8',
  `format` VARCHAR(50) DEFAULT '10x10 Single Elimination',
  `status` ENUM('upcoming', 'live', 'completed') DEFAULT 'upcoming',
  `current_round` VARCHAR(50) DEFAULT 'Quarter-Finals',
  `brackets_json` LONGTEXT NOT NULL,
  `winner_id` INT NULL,
  `winner_name` VARCHAR(50) NULL,
  `runner_up_id` INT NULL,
  `runner_up_name` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_tourn_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Chat Messages Table (Live Street Corner Chat)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `username` VARCHAR(50) NOT NULL DEFAULT 'Guest Player',
  `message` VARCHAR(255) NOT NULL,
  `is_shout` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_chat_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Game Rooms Table (Online 2-Player Multiplayer & Matchmaking)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `game_rooms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `room_code` VARCHAR(32) NOT NULL UNIQUE,
  `host_id` INT NULL,
  `guest_id` INT NULL,
  `host_name` VARCHAR(50) NOT NULL DEFAULT 'Host Champion',
  `guest_name` VARCHAR(50) NULL,
  `game_type` ENUM('p2p', 'random', 'tournament', 'daily_challenge', 'ai') DEFAULT 'p2p',
  `wager_coins` INT DEFAULT 0,
  `wager_naira` DECIMAL(10,2) DEFAULT 0.00,
  `rake_amount` DECIMAL(10,2) DEFAULT 0.00,
  `is_private` TINYINT(1) DEFAULT 0,
  `rule_type` VARCHAR(30) DEFAULT 'nigeria',
  `player_time` VARCHAR(20) DEFAULT '5',
  `time_increment` INT DEFAULT 0,
  `p1_short` INT DEFAULT 0,
  `modifications` VARCHAR(50) DEFAULT 'none',
  `board_type` VARCHAR(50) DEFAULT 'default',
  `settings_json` LONGTEXT NULL,
  `time_control` VARCHAR(20) DEFAULT 'rapid_5',
  `board_size` INT DEFAULT 10,
  `rule_mode` VARCHAR(20) DEFAULT 'nigerian',
  `status` ENUM('waiting', 'active', 'finished', 'abandoned') DEFAULT 'waiting',
  `current_turn` TINYINT DEFAULT 1,
  `p1_time_left` INT DEFAULT 300,
  `p2_time_left` INT DEFAULT 300,
  `last_move_time` INT NULL,
  `board_state_json` LONGTEXT NULL,
  `move_history_json` LONGTEXT NULL,
  `winner_id` INT NULL,
  `winner_name` VARCHAR(50) NULL,
  `result` ENUM('p1_won', 'p2_won', 'draw', 'in_progress') DEFAULT 'in_progress',
  `win_reason` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_room_code` (`room_code`),
  INDEX `idx_room_status` (`status`),
  INDEX `idx_game_type` (`game_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Tournament Participants Table (Championship Registrations & Seeds)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tournament_participants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tournament_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `seed_number` INT DEFAULT 1,
  `status` ENUM('registered', 'active', 'eliminated', 'champion') DEFAULT 'registered',
  `registered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_tourn_user` (`tournament_id`, `user_id`),
  INDEX `idx_tourn_id` (`tournament_id`),
  CONSTRAINT `fk_tp_tourn` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. User Messages Table (Direct Messaging / Inbox)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `sender_name` VARCHAR(50) NOT NULL,
  `receiver_name` VARCHAR(50) NOT NULL,
  `subject` VARCHAR(100) NOT NULL DEFAULT 'Player Message',
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_receiver` (`receiver_id`, `is_read`),
  INDEX `idx_sender` (`sender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. Game Invitations Table (Player-to-Player Challenges)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `game_invitations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `sender_name` VARCHAR(50) NOT NULL,
  `receiver_name` VARCHAR(50) NOT NULL,
  `room_code` VARCHAR(12) NOT NULL,
  `time_control` VARCHAR(20) DEFAULT 'rapid_5',
  `wager_coins` INT DEFAULT 0,
  `status` ENUM('pending', 'accepted', 'declined', 'expired', 'cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_inv_receiver` (`receiver_id`, `status`),
  INDEX `idx_inv_sender` (`sender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. User Follows Table (Social Connections)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_follows` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `follower_id` INT NOT NULL,
  `following_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_follow` (`follower_id`, `following_id`),
  INDEX `idx_following` (`following_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. Wallet Transactions Table (Accounting & Monetization)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `wallet_transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `type` ENUM('deposit', 'withdrawal', 'withdrawal_request', 'wager_lock', 'wager_win', 'wager_rake', 'wager_refund', 'wager_fee', 'wager_escrow', 'package_purchase', 'daily_bonus', 'coin_exchange') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `coins` INT DEFAULT 0,
  `balance_after` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'completed',
  `reference` VARCHAR(100) NULL,
  `description` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_tx_user` (`user_id`, `created_at` DESC),
  INDEX `idx_tx_ref` (`reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Seed Data
-- -----------------------------------------------------------------------------
INSERT INTO `users` (`username`, `email`, `password_hash`, `country`, `title`, `rating`, `wins`, `losses`, `draws`, `total_chopped`)
VALUES
  ('ObaOfBenin', 'oba@naijadraughts.ng', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeX6z1f5v9x0b7kL8j2mN1qP3s5t7u9vW', 'Nigeria', 'Grandmaster', 1880, 54, 4, 3, 460),
  ('LagosStreetKing', 'lagos@naijadraughts.ng', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeX6z1f5v9x0b7kL8j2mN1qP3s5t7u9vW', 'Nigeria', 'National Master', 1745, 41, 10, 5, 335),
  ('KitiKitiMaster', 'kiti@naijadraughts.ng', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeX6z1f5v9x0b7kL8j2mN1qP3s5t7u9vW', 'Nigeria', 'Street Hustler', 1625, 30, 13, 4, 240),
  ('AbujaGrandmaster', 'abuja@naijadraughts.ng', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeX6z1f5v9x0b7kL8j2mN1qP3s5t7u9vW', 'Nigeria', 'Grandmaster', 1570, 26, 11, 2, 195),
  ('AccraTactician', 'accra@naijadraughts.ng', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeX6z1f5v9x0b7kL8j2mN1qP3s5t7u9vW', 'Ghana', 'Master', 1530, 20, 9, 3, 160),
  ('DoualaEagle', 'douala@naijadraughts.ng', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeX6z1f5v9x0b7kL8j2mN1qP3s5t7u9vW', 'Cameroon', 'Master', 1490, 18, 12, 1, 142)
ON DUPLICATE KEY UPDATE `rating` = VALUES(`rating`);

-- Seed Featured Nigerian Tournaments
INSERT INTO `tournaments` (`name`, `tagline`, `location`, `prize_pool`, `format`, `status`, `current_round`, `brackets_json`)
VALUES
  (
    'Lagos Street Draughts Masters 2026',
    'The premier 10x10 street draughts showdown on the Lagos Mainland',
    'Surulere, Lagos',
    '₦2,000,000',
    '10x10 Nigerian Street Rules',
    'live',
    'Semi-Finals',
    '{"quarter_finals":[{"p1":"ObaOfBenin","p2":"DoualaEagle","winner":"ObaOfBenin","score":"2-0"},{"p1":"LagosStreetKing","p2":"PortHarcourtAce","winner":"LagosStreetKing","score":"2-1"},{"p1":"KitiKitiMaster","p2":"AccraTactician","winner":"KitiKitiMaster","score":"2-0"},{"p1":"AbujaGrandmaster","p2":"IbadanVeteran","winner":"AbujaGrandmaster","score":"2-1"}],"semi_finals":[{"p1":"ObaOfBenin","p2":"LagosStreetKing","winner":null,"score":"Ongoing"},{"p1":"KitiKitiMaster","p2":"AbujaGrandmaster","winner":null,"score":"Upcoming"}],"finals":{"p1":"TBD","p2":"TBD","winner":null}}'
  ),
  (
    'Benin Kingdom Oba Trophy',
    'Honoring centuries of cultural board strategy & flying king mastery',
    'Benin City, Edo',
    '₦1,500,000',
    '10x10 Flying Kings Cup',
    'upcoming',
    'Registration Open',
    '{"quarter_finals":[{"p1":"Seed #1","p2":"Seed #8","winner":null},{"p1":"Seed #4","p2":"Seed #5","winner":null},{"p1":"Seed #2","p2":"Seed #7","winner":null},{"p1":"Seed #3","p2":"Seed #6","winner":null}],"semi_finals":[{"p1":"TBD","p2":"TBD","winner":null},{"p1":"TBD","p2":"TBD","winner":null}],"finals":{"p1":"TBD","p2":"TBD","winner":null}}'
  ),
  (
    'Abuja National Rapid Invitational',
    'Fast-paced 5-minute Blitz & Rapid Draughts championship',
    'FCT, Abuja',
    '₦1,000,000',
    'Rapid 5 Min (10x10)',
    'completed',
    'Completed',
    '{"quarter_finals":[],"semi_finals":[],"finals":{"p1":"ObaOfBenin","p2":"AbujaGrandmaster","winner":"ObaOfBenin","score":"3-1"}}'
  )
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Seed Initial Street Corner Chat
INSERT INTO `chat_messages` (`username`, `message`, `is_shout`)
VALUES
  ('LagosStreetKing', 'Who dey challenge for 10x10? Set your timer make we play!', 0),
  ('ObaOfBenin', 'Chop am clean! No mercy on the highway!', 1),
  ('KitiKitiMaster', 'Remember ordinary seeds chop backward too o! Don’t sleep!', 0),
  ('AbujaGrandmaster', 'Tournament semi-finals is fire today! Oba vs Lagos Street King!', 0)
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`);

-- -----------------------------------------------------------------------------
-- 11. Admin Audit Logs (Immutable Administrative Tracking)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT NULL,
  `admin_username` VARCHAR(50) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `target_type` VARCHAR(50) NOT NULL,
  `target_id` VARCHAR(50) NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_admin` (`admin_id`),
  INDEX `idx_audit_action` (`action`),
  INDEX `idx_audit_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 12. System Settings (Global Platform Configurations)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(50) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `description` VARCHAR(255) NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(50) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

