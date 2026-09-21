<?php
require_once __DIR__ . '/config/db.php';

$currentUser = getCurrentUser();
if (!$currentUser) {
    header('Location: index.php#auth-card');
    exit;
}

// Fetch fresh user data from database
$db = getDB();
$stmt = $db->prepare("
    SELECT id, username, email, rating, coins, wallet_balance, package, package_expiry,
           daily_games_left, last_daily_reset, wins, losses, draws, total_chopped,
           tournaments_hosted, tournaments_joined, avatar_url, avatar_color, country, country_code, title,
           role, permissions_json, is_banned
    FROM users WHERE id = ?
");
$stmt->execute([$currentUser['id']]);
$user = $stmt->fetch();

if (!$user) {
    session_destroy();
    header('Location: index.php#auth-card');
    exit;
}

// Handle daily games reset if a new calendar day has started
$today = date('Y-m-d');
if ($user['last_daily_reset'] !== $today) {
    $resetQuota = 10;
    if ($user['package'] === 'silver') $resetQuota = 25;
    elseif ($user['package'] === 'gold') $resetQuota = 50;
    elseif ($user['package'] === 'vip_oba') $resetQuota = 999;

    $db->prepare("UPDATE users SET daily_games_left = ?, last_daily_reset = ? WHERE id = ?")
       ->execute([$resetQuota, $today, $user['id']]);
    $user['daily_games_left'] = $resetQuota;
    $user['last_daily_reset'] = $today;
    $_SESSION['user'] = $user;
}

// Helper formatting
$formattedPlayerId = '#ND-' . str_pad($user['id'], 5, '0', STR_PAD_LEFT);
$avatarUrl = !empty($user['avatar_url']) ? htmlspecialchars($user['avatar_url']) : '';
$username = htmlspecialchars($user['username']);
$email = htmlspecialchars($user['email']);
$rating = (int)$user['rating'];
$coins = (int)$user['coins'];
$walletBalance = (float)$user['wallet_balance'];
$package = $user['package'] ?: 'free';
$dailyGamesLeft = (int)$user['daily_games_left'];
$gamesWon = (int)$user['wins'];
$gamesLost = (int)$user['losses'];
$gamesDraw = (int)$user['draws'];
$totalPlayed = $gamesWon + $gamesLost + $gamesDraw;
$winRate = $totalPlayed > 0 ? round(($gamesWon / $totalPlayed) * 100, 1) : 0;
$tournamentsHosted = (int)$user['tournaments_hosted'];
$tournamentsJoined = (int)$user['tournaments_joined'];

// Rank title helper
function getRankTitle($rating) {
    if ($rating >= 2200) return 'Grandmaster Oba';
    if ($rating >= 1900) return 'National Master';
    if ($rating >= 1600) return 'Lagos Street Champion';
    if ($rating >= 1300) return 'Senior Hustler';
    return 'Street Player';
}
$rankTitle = getRankTitle($rating);

// Package display helper
function getPackageBadge($pkg) {
    switch ($pkg) {
        case 'vip_oba':
            return ['label' => '👑 Oba VIP Master', 'class' => 'pkg-vip'];
        case 'gold':
            return ['label' => '🥇 Gold Champion', 'class' => 'pkg-gold'];
        case 'silver':
            return ['label' => '🥈 Silver Hustler', 'class' => 'pkg-silver'];
        case 'free':
        default:
            return ['label' => '🥉 Free Rookie', 'class' => 'pkg-free'];
    }
}
$pkgBadge = getPackageBadge($package);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $username ?> - Player Command Portal | Naija Draughts</title>
  <meta name="description" content="Nigerian Draughts Champion Dashboard. Manage profile, challenges, live games, P2P matches, wallet, and tournament participation.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="home.css?v=<?= filemtime(__DIR__ . '/home.css') ?>">
  <link rel="stylesheet" href="style.css?v=<?= filemtime(__DIR__ . '/style.css') ?>">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="alternate icon" href="favicon.ico">
  <link rel="apple-touch-icon" href="icons/icon-192.png">
  <meta name="theme-color" content="#10b981">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
<body class="dashboard-body" data-user-id="<?= (int)$user['id'] ?>" data-username="<?= $username ?>">

  <!-- ================= TOP HEADER & MASTER NAVIGATION MENU ================= -->
  <header class="home-header">
    <div class="nav-container">
      <a href="dashboard.php" class="brand-wrap">
        <div class="flag-stripes">
          <span class="stripe green"></span>
          <span class="stripe white"></span>
          <span class="stripe green"></span>
        </div>
        <div class="brand-text">
          <span class="brand-title">NAIJA DRAUGHTS</span>
          <span class="brand-tagline">CHAMPION COMMAND PORTAL</span>
        </div>
      </a>

      <!-- Functional Navigation Menu -->
      <nav class="dash-main-nav">
        <ul class="dash-nav-links">
          
          <!-- 1. GAME DROPDOWN (9 REQUIRED OPTIONS) -->
          <li class="nav-dropdown-item">
            <button type="button" class="dash-nav-btn dropdown-toggle" id="btn-dropdown-game" aria-haspopup="true">
              <span class="icon">🎮</span> GAME <span class="arrow">▾</span>
            </button>
            <ul class="dropdown-menu" id="menu-game">
              <li><button type="button" class="dropdown-link" onclick="openCreateGameModal()"><span class="icon">➕</span> Create Game</button></li>
              <li><button type="button" class="dropdown-link" onclick="switchGameLobbyFilter('live_games')"><span class="icon">🔴</span> Live Games</button></li>
              <li><button type="button" class="dropdown-link" onclick="switchGameLobbyFilter('awaiting_opponent')"><span class="icon">⏳</span> Awaiting Opponent</button></li>
              <li><button type="button" class="dropdown-link" onclick="switchGameLobbyFilter('all_games')"><span class="icon">📋</span> All Games</button></li>
              <li><button type="button" class="dropdown-link" onclick="switchGameLobbyFilter('p2p_games')"><span class="icon">⚔️</span> P2P Games</button></li>
              <li><button type="button" class="dropdown-link highlight" onclick="triggerRandomOpponentMatch()"><span class="icon">⚡</span> Random Opponent (1-Click)</button></li>
              <li><button type="button" class="dropdown-link" onclick="switchGameLobbyFilter('tournament_games')"><span class="icon">🏆</span> Tournament Games</button></li>
              <li><button type="button" class="dropdown-link" onclick="switchGameLobbyFilter('completed_games')"><span class="icon">🏁</span> Completed Games</button></li>
              <li><button type="button" class="dropdown-link" onclick="switchGameLobbyFilter('daily_player_games')"><span class="icon">🎯</span> Daily Player Games</button></li>
            </ul>
          </li>

          <!-- 2. TOURNAMENTS DROPDOWN -->
          <li class="nav-dropdown-item">
            <button type="button" class="dash-nav-btn dropdown-toggle" id="btn-dropdown-tournaments" aria-haspopup="true">
              <span class="icon">🏆</span> TOURNAMENTS <span class="arrow">▾</span>
            </button>
            <ul class="dropdown-menu" id="menu-tournaments">
              <li><button type="button" class="dropdown-link" onclick="openHostTournamentModal()"><span class="icon">🚀</span> Start Tournament</button></li>
              <li><button type="button" class="dropdown-link" onclick="activateMainTab('tournaments')"><span class="icon">🏅</span> Join Tournament</button></li>
            </ul>
          </li>

          <!-- 3. PUZZLES & TRAPS DIRECT LINK (PROMINENT TOP-LEVEL) -->
          <li>
            <a href="puzzles.php" class="dash-nav-btn nav-btn-puzzles" id="btn-nav-puzzles" style="color: #fde047; font-weight: 800; border: 1px solid rgba(245, 158, 11, 0.6); background: rgba(245, 158, 11, 0.2); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 0 12px rgba(245, 158, 11, 0.25);" title="Tactical Draughts Puzzles & Traps">
              <span class="icon">🧩</span> PUZZLES
              <span class="tab-badge" style="background:#f59e0b; color:#000; font-size: 0.68rem; font-weight: 900; padding: 1px 5px; border-radius: 4px;">8</span>
            </a>
          </li>

          <!-- 4. MESSAGES WITH UNREAD BADGE -->
          <li>
            <button type="button" class="dash-nav-btn" id="btn-nav-messages" onclick="activateMainTab('messages')">
              <span class="icon">✉️</span> MESSAGES
              <span class="nav-counter-badge" id="nav-msg-counter" style="display:none;">0</span>
            </button>
          </li>

          <!-- 5. AMOUNT IN ACCOUNT (WALLET BALANCE PILL & QUICK TOP-UP) -->
          <li>
            <button type="button" class="nav-wallet-pill" id="btn-nav-wallet" onclick="openWalletModal()" title="View Wallet & Add Funds">
              <span class="wallet-icon">💰</span>
              <span class="wallet-val" id="nav-wallet-val">₦<?= number_format($walletBalance, 2) ?></span>
              <span class="wallet-divider">|</span>
              <span class="coins-val" id="nav-coins-val"><?= number_format($coins) ?> 🪙</span>
              <span class="wallet-action-btn">+ Fund</span>
            </button>
          </li>

          <!-- 6. ACTION DROPDOWN (INVITATIONS, FOLLOWINGS, PUZZLES, WHATSAPP, PACKAGE) -->
          <li class="nav-dropdown-item">
            <button type="button" class="dash-nav-btn dropdown-toggle" id="btn-dropdown-actions" aria-haspopup="true">
              <span class="icon">⚡</span> ACTION <span class="arrow">▾</span>
              <span class="nav-counter-badge" id="nav-invites-counter" style="display:none;">0</span>
            </button>
            <ul class="dropdown-menu" id="menu-actions">
              <li>
                <button type="button" class="dropdown-link" onclick="activateMainTab('invitations')">
                  <span class="icon">⚔️</span> Game Invitations
                  <span class="badge-mini" id="drop-invites-badge" style="display:none;">0</span>
                </button>
              </li>
              <li>
                <button type="button" class="dropdown-link" onclick="activateMainTab('followings')">
                  <span class="icon">👥</span> Followings
                </button>
              </li>
              <li>
                <a href="puzzles.php" class="dropdown-link" style="color: #fde047; font-weight: 700;">
                  <span class="icon">🧩</span> Tactical Puzzles & Traps
                </a>
              </li>
              <li>
                <button type="button" class="dropdown-link whatsapp-link" onclick="openWhatsAppModal()">
                  <span class="icon">💬</span> Join WhatsApp Group
                </button>
              </li>
              <li>
                <button type="button" class="dropdown-link" onclick="openPackageModal()">
                  <span class="icon">💎</span> Manage Package
                </button>
              </li>
            </ul>
          </li>

        </ul>
      </nav>

      <!-- Right User Controls -->
      <div class="dash-header-user">
        <?php if (!empty($user['role']) && in_array($user['role'], ['admin', 'super_admin'])): ?>
        <a href="admin.php" class="btn btn-secondary btn-small" style="background:rgba(245,158,11,0.18); border-color:#f59e0b; color:#fde047; font-weight:800;" title="Open Admin Command Center">
          <span class="icon">🛡️</span> Admin Panel
        </a>
        <?php endif; ?>
        <a href="game.php" class="btn btn-primary btn-small">
          <span class="icon">🎮</span> Enter Arena &rarr;
        </a>
        <button type="button" class="btn btn-secondary btn-small" id="btn-dash-logout" onclick="handleDashboardLogout()">
          Sign Out
        </button>
      </div>

    </div>
  </header>

  <!-- ================= MAIN DASHBOARD CONTAINER ================= -->
  <main class="dash-container">

    <!-- ================= 1. HERO PLAYER PROFILE CARD ================= -->
    <section class="dash-profile-hero">
      <div class="profile-hero-inner">
        
        <!-- Avatar Column with Upload Picture Trigger -->
        <div class="profile-avatar-col">
          <div class="avatar-frame" id="avatar-container">
            <?php if (!empty($avatarUrl)): ?>
              <img src="<?= $avatarUrl ?>" alt="<?= $username ?>" class="avatar-img" id="user-avatar-img">
            <?php else: ?>
              <div class="avatar-placeholder" id="avatar-placeholder-crown">👑</div>
            <?php endif; ?>
            
            <!-- Hidden File Input for Picture Upload -->
            <input type="file" id="avatar-file-input" accept="image/png,image/jpeg,image/webp,image/gif" style="display: none;">
            
            <!-- Upload Overlay -->
            <button type="button" class="avatar-upload-trigger" id="btn-trigger-upload" title="Upload New Profile Picture">
              <span class="cam-icon">📷</span>
              <span class="txt">Upload Picture</span>
            </button>
          </div>
          <div id="upload-status" class="upload-status-text"></div>
        </div>

        <!-- Identity & Details Column -->
        <div class="profile-identity-col">
          <div class="identity-header">
            <h1 class="player-name"><?= $username ?></h1>
            <span class="verified-badge" title="Verified Nigerian Draughts Champion">✓ Verified</span>
            <span class="player-id-pill" id="player-id-pill" onclick="copyPlayerId('<?= $formattedPlayerId ?>')" title="Click to copy ID">
              <span class="id-label">ID:</span> <?= $formattedPlayerId ?>
              <span class="copy-icon">📋</span>
            </span>
          </div>

          <div class="identity-meta-row">
            <span class="meta-item"><span class="meta-icon">✉️</span> <?= $email ?></span>
            <span class="meta-item"><span class="meta-icon">🇳🇬</span> <?= htmlspecialchars($user['country'] ?? 'Nigeria') ?></span>
            <span class="meta-item"><span class="meta-icon">🎖️</span> <strong id="hero-rank-title"><?= $rankTitle ?></strong></span>
          </div>

          <!-- Rating & Package & Daily Games Row -->
          <div class="identity-badges-row">
            
            <!-- Rating -->
            <div class="metric-pill rating-pill">
              <span class="metric-icon">⭐</span>
              <div class="metric-info">
                <span class="metric-val" id="hero-rating-val"><?= $rating ?></span>
                <span class="metric-lbl">Elo Rating</span>
              </div>
            </div>

            <!-- Coins -->
            <div class="metric-pill coins-pill" onclick="openWalletModal()">
              <span class="metric-icon">🪙</span>
              <div class="metric-info">
                <span class="metric-val" id="hero-coins-val"><?= number_format($coins) ?></span>
                <span class="metric-lbl">Coins Available</span>
              </div>
            </div>

            <!-- Package Tier -->
            <div class="metric-pill package-pill <?= $pkgBadge['class'] ?>" onclick="openPackageModal()">
              <span class="metric-icon">💎</span>
              <div class="metric-info">
                <span class="metric-val"><?= $pkgBadge['label'] ?></span>
                <span class="metric-lbl">Manage Package &rarr;</span>
              </div>
            </div>

            <!-- Daily Games Left -->
            <div class="metric-pill quota-pill">
              <span class="metric-icon">⏳</span>
              <div class="metric-info">
                <span class="metric-val" id="hero-daily-games"><?= $dailyGamesLeft ?> Left</span>
                <span class="metric-lbl">Daily Quota (Resets 00:00 WAT)</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Quick Launch Actions Column -->
        <div class="profile-actions-col">
          <button type="button" class="btn btn-primary btn-block btn-hero-cta" onclick="triggerRandomOpponentMatch()">
            <span class="icon">⚡</span> Quick Match (Random)
          </button>
          <button type="button" class="btn btn-secondary btn-block" onclick="openCreateGameModal()">
            <span class="icon">➕</span> Create Custom Game
          </button>
          <button type="button" class="btn btn-secondary btn-block whatsapp-btn" onclick="openWhatsAppModal()">
            <span class="icon">💬</span> WhatsApp Masters Group
          </button>
        </div>

      </div>

      <!-- Lifetime Stats Bar -->
      <div class="profile-stats-bar">
        <div class="stat-cell">
          <span class="stat-num win-color" id="stat-wins"><?= $gamesWon ?></span>
          <span class="stat-txt">Games Won</span>
        </div>
        <div class="stat-cell">
          <span class="stat-num draw-color" id="stat-draws"><?= $gamesDraw ?></span>
          <span class="stat-txt">Games Draw</span>
        </div>
        <div class="stat-cell">
          <span class="stat-num loss-color" id="stat-losses"><?= $gamesLost ?></span>
          <span class="stat-txt">Games Lost</span>
        </div>
        <div class="stat-cell">
          <span class="stat-num"><?= $winRate ?>%</span>
          <span class="stat-txt">Win Rate</span>
        </div>
        <div class="stat-cell">
          <span class="stat-num host-color" id="stat-hosted"><?= $tournamentsHosted ?></span>
          <span class="stat-txt">Tournaments Hosted</span>
        </div>
        <div class="stat-cell">
          <span class="stat-num join-color" id="stat-joined"><?= $tournamentsJoined ?></span>
          <span class="stat-txt">Tournaments Joined</span>
        </div>
        <div class="stat-cell wallet-cell" onclick="openWalletModal()">
          <span class="stat-num naira-color" id="stat-wallet">₦<?= number_format($walletBalance, 2) ?></span>
          <span class="stat-txt">Account Balance (+ Fund)</span>
        </div>
      </div>
    </section>

    <!-- ================= 2. DASHBOARD MAIN TABBED INTERFACE ================= -->
    <div class="dash-tabs-nav">
      <button type="button" class="dash-tab-btn active" data-tab="lobby" onclick="activateMainTab('lobby')">
        <span class="icon">🎮</span> Game Center Lobby
      </button>
      <button type="button" class="dash-tab-btn" data-tab="messages" onclick="activateMainTab('messages')">
        <span class="icon">✉️</span> Messages
        <span class="tab-badge" id="tab-msg-badge" style="display:none;">0</span>
      </button>
      <button type="button" class="dash-tab-btn" data-tab="invitations" onclick="activateMainTab('invitations')">
        <span class="icon">⚔️</span> Invitations & Challenges
        <span class="tab-badge" id="tab-inv-badge" style="display:none;">0</span>
      </button>
      <button type="button" class="dash-tab-btn" data-tab="followings" onclick="activateMainTab('followings')">
        <span class="icon">👥</span> Followings & Friends
      </button>
      <button type="button" class="dash-tab-btn" data-tab="wallet" onclick="activateMainTab('wallet')">
        <span class="icon">💰</span> Wallet & Packages
      </button>
      <button type="button" class="dash-tab-btn" data-tab="tournaments" onclick="activateMainTab('tournaments')">
        <span class="icon">🏆</span> Tournaments Hub
      </button>
      <a href="puzzles.php" class="dash-tab-btn" id="tab-puzzles-btn" style="text-decoration:none; background: linear-gradient(135deg, rgba(245, 166, 35, 0.2), rgba(217, 119, 6, 0.3)); border-color: rgba(245, 166, 35, 0.6); color: #fef08a; font-weight: 700;">
        <span class="icon">🧩</span> Tactical Puzzles
        <span class="tab-badge" style="background:#f59e0b; color:#000; font-weight:900;">8 PUZZLES</span>
      </a>
    </div>

    <!-- ================= TAB 1: GAME CENTER LOBBY ================= -->
    <section class="dash-tab-panel active" id="panel-lobby">
      
      <!-- Tactical Puzzles & Trap Academy Promotional Banner -->
      <div class="trap-academy-hero-banner" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98)); border: 1px solid rgba(245, 166, 35, 0.5); border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <div>
          <h3 style="margin: 0 0 4px 0; color: #fde047; font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
            <span>🧩</span> Tactical Draughts Puzzles & Trap Academy
          </h3>
          <p style="margin: 0; color: #cbd5e1; font-size: 0.88rem;">Solve tactical puzzles across 4 skill tiers (Very Simple to Grandmaster). Master Nigerian Highway traps, Oba sacrifices, and multi-jump counterstrikes with interactive hints!</p>
        </div>
        <a href="puzzles.php" class="btn btn-primary" id="btn-hero-puzzles" style="background: linear-gradient(135deg, #f59e0b, #d97706); border-color: #f59e0b; color: #000; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 0 15px rgba(245, 158, 11, 0.35);">
          <span>🧩</span> Solve Tactical Puzzles &rarr;
        </a>
      </div>

      <!-- Lobby Sub-filter Pills -->
      <div class="lobby-filter-bar">
        <div class="filter-pills-group">
          <button type="button" class="filter-pill active" data-filter="all_games" onclick="switchGameLobbyFilter('all_games')">All Games</button>
          <button type="button" class="filter-pill" data-filter="awaiting_opponent" onclick="switchGameLobbyFilter('awaiting_opponent')">⏳ Awaiting Opponent</button>
          <button type="button" class="filter-pill" data-filter="live_games" onclick="switchGameLobbyFilter('live_games')">🔴 Live Games</button>
          <button type="button" class="filter-pill" data-filter="p2p_games" onclick="switchGameLobbyFilter('p2p_games')">⚔️ P2P Games</button>
          <button type="button" class="filter-pill" data-filter="tournament_games" onclick="switchGameLobbyFilter('tournament_games')">🏆 Tournament Games</button>
          <button type="button" class="filter-pill" data-filter="completed_games" onclick="switchGameLobbyFilter('completed_games')">🏁 Completed Games</button>
          <button type="button" class="filter-pill" data-filter="daily_player_games" onclick="switchGameLobbyFilter('daily_player_games')">🎯 Daily Player Games</button>
        </div>

        <div class="lobby-action-buttons">
          <button type="button" class="btn btn-primary btn-small" onclick="triggerRandomOpponentMatch()">
            <span class="icon">⚡</span> Random Opponent
          </button>
          <button type="button" class="btn btn-secondary btn-small" onclick="openCreateGameModal()">
            <span class="icon">➕</span> Create Game
          </button>
          <button type="button" class="btn btn-icon" onclick="reloadLobbyGames()" title="Refresh Lobby">
            🔄
          </button>
        </div>
      </div>

      <!-- Games Table Container -->
      <div class="lobby-table-wrapper">
        <table class="dash-table" id="lobby-games-table">
          <thead>
            <tr>
              <th>Room Code</th>
              <th>Game Type</th>
              <th>Host (Player 1)</th>
              <th>Opponent (Player 2)</th>
              <th>Time Control</th>
              <th>Wager</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="lobby-table-body">
            <tr>
              <td colspan="8" class="text-center">Loading live game rooms...</td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>

    <!-- ================= TAB 2: MESSAGES INBOX ================= -->
    <section class="dash-tab-panel" id="panel-messages">
      <div class="messages-container">
        
        <!-- Left: Conversations List -->
        <div class="msg-threads-sidebar">
          <div class="msg-threads-header">
            <h3>Player Messages</h3>
            <button type="button" class="btn btn-primary btn-small" onclick="openNewMessageModal()">+ New Message</button>
          </div>
          <div class="msg-threads-list" id="msg-threads-list">
            <div class="empty-state">No conversations yet. Challenge a champion or message a friend!</div>
          </div>
        </div>

        <!-- Right: Active Conversation Chat Pane -->
        <div class="msg-chat-pane" id="msg-chat-pane">
          <div class="msg-chat-header" id="msg-chat-header">
            <span class="active-peer-name" id="active-peer-name">Select a conversation</span>
          </div>
          <div class="msg-bubbles-box" id="msg-bubbles-box">
            <div class="msg-welcome-note">Select or start a conversation to communicate with Nigerian Draughts players.</div>
          </div>
          <form class="msg-input-bar" id="msg-send-form" onsubmit="handleSendMessage(event)">
            <input type="text" id="msg-text-input" placeholder="Type your message to opponent..." autocomplete="off">
            <button type="submit" class="btn btn-primary btn-small">Send &rarr;</button>
          </form>
        </div>

      </div>
    </section>

    <!-- ================= TAB 3: GAME INVITATIONS ================= -->
    <section class="dash-tab-panel" id="panel-invitations">
      <div class="invitations-layout">
        
        <!-- Pending Challenges Received -->
        <div class="inv-card">
          <div class="inv-card-header">
            <h3>⚔️ Match Challenges Received</h3>
            <span class="badge-pill" id="pending-invites-count">0 Pending</span>
          </div>
          <div class="inv-list" id="received-invitations-list">
            <div class="empty-state">No pending challenge invitations received.</div>
          </div>
        </div>

        <!-- Challenges Sent / Send New Challenge -->
        <div class="inv-card">
          <div class="inv-card-header">
            <h3>📤 Sent Challenges & New Challenge</h3>
            <button type="button" class="btn btn-primary btn-small" onclick="openSendChallengeModal()">+ Challenge Player</button>
          </div>
          <div class="inv-list" id="sent-invitations-list">
            <div class="empty-state">No active outgoing challenges.</div>
          </div>
        </div>

      </div>
    </section>

    <!-- ================= TAB 4: SOCIAL & FOLLOWINGS ================= -->
    <section class="dash-tab-panel" id="panel-followings">
      <div class="social-layout">
        
        <!-- Followings List -->
        <div class="social-card">
          <div class="social-card-header">
            <h3>👥 Followed Champions & Rivals</h3>
            <span class="badge-pill" id="followings-count">0 Following</span>
          </div>
          <div class="followings-list" id="followings-list">
            <div class="empty-state">You are not following any players yet. Browse the Leaderboard or recent matches!</div>
          </div>
        </div>

        <!-- WhatsApp Masters Community Feature Card -->
        <div class="social-card whatsapp-promo-card">
          <div class="whatsapp-card-inner">
            <div class="whatsapp-hero-badge">🇳🇬 OFFICIAL COMMUNITY</div>
            <h2>Nigeria Draughts Masters WhatsApp</h2>
            <p>
              Connect directly with 500+ Nigerian street draughts grandmasters, organizers, and enthusiasts from Lagos, Abuja, Ibadan, Port Harcourt, and diaspora!
            </p>
            <ul class="whatsapp-perks-list">
              <li>🏆 Daily cash P2P tournament announcements</li>
              <li>🧠 Advanced Nigerian 10x10 flying king tactical breakdowns</li>
              <li>⚡ Instant matchmaking during peak street hours</li>
              <li>👑 Direct line to platform moderators & tournament hosts</li>
            </ul>
            <button type="button" class="btn btn-whatsapp btn-large" onclick="openWhatsAppModal()">
              <span class="icon">💬</span> Join WhatsApp Masters Group Now &rarr;
            </button>
          </div>
        </div>

      </div>
    </section>

    <!-- ================= TAB 5: WALLET & PACKAGES ================= -->
    <section class="dash-tab-panel" id="panel-wallet">
      <div class="wallet-layout">
        
        <!-- Balance Overview & Deposit -->
        <div class="wallet-overview-card">
          <div class="wallet-balances-row">
            <div class="bal-box">
              <span class="bal-label">Naira Cash Balance</span>
              <h2 class="bal-val naira-color" id="wallet-card-naira">₦<?= number_format($walletBalance, 2) ?></h2>
              <span class="bal-sub">Available for P2P wagers & withdrawals</span>
            </div>
            <div class="bal-box">
              <span class="bal-label">Virtual Game Coins</span>
              <h2 class="bal-val coin-color" id="wallet-card-coins"><?= number_format($coins) ?> 🪙</h2>
              <span class="bal-sub">Used for tournament buy-ins & perks</span>
            </div>
          </div>

          <div class="wallet-actions-row">
            <button type="button" class="btn btn-primary btn-large" onclick="openDepositModal()">
              <span class="icon">💳</span> Fund Account (Deposit Naira)
            </button>
            <button type="button" class="btn btn-secondary btn-large" onclick="openWithdrawModal()">
              <span class="icon">🏦</span> Withdraw to Bank
            </button>
            <button type="button" class="btn btn-secondary btn-large" onclick="openCoinBuyModal()">
              <span class="icon">🪙</span> Buy Coins with Naira
            </button>
          </div>
        </div>

        <!-- Package Subscriptions Grid -->
        <div class="packages-section">
          <h2 class="section-heading">Monetization & VIP Player Packages</h2>
          <p class="section-sub">Upgrade your tier to unlock higher daily games, host official tournaments, and get VIP crown styling.</p>

          <div class="packages-grid">
            
            <!-- Tier 1: Free Rookie -->
            <div class="pkg-card <?= $package === 'free' ? 'active-tier' : '' ?>">
              <?php if ($package === 'free'): ?><div class="current-tier-tag">CURRENT PLAN</div><?php endif; ?>
              <div class="pkg-icon">🥉</div>
              <h3 class="pkg-title">Free Rookie</h3>
              <div class="pkg-price">₦0 <span>/ forever</span></div>
              <ul class="pkg-features">
                <li>✓ 10 games per day quota</li>
                <li>✓ Standard 10x10 matchmaking</li>
                <li>✓ Casual AI engine practice</li>
                <li>✓ Community chat access</li>
                <li>✗ Cannot host tournaments</li>
              </ul>
              <?php if ($package === 'free'): ?>
                <button type="button" class="btn btn-secondary btn-block disabled" disabled>Active Plan</button>
              <?php else: ?>
                <button type="button" class="btn btn-secondary btn-block" disabled>Standard</button>
              <?php endif; ?>
            </div>

            <!-- Tier 2: Silver Hustler -->
            <div class="pkg-card <?= $package === 'silver' ? 'active-tier' : '' ?>">
              <?php if ($package === 'silver'): ?><div class="current-tier-tag">CURRENT PLAN</div><?php endif; ?>
              <div class="pkg-icon">🥈</div>
              <h3 class="pkg-title">Silver Hustler</h3>
              <div class="pkg-price">₦1,500 <span>/ month</span></div>
              <ul class="pkg-features">
                <li>✓ <strong>25 games per day quota</strong></li>
                <li>✓ <strong>100 free bonus coins</strong> per month</li>
                <li>✓ Access to Expert AI Engine</li>
                <li>✓ Silver avatar border</li>
                <li>✓ Access to P2P coin wagers</li>
                <li>✓ Match move replays</li>
              </ul>
              <?php if ($package === 'silver'): ?>
                <button type="button" class="btn btn-secondary btn-block disabled" disabled>Active Plan</button>
              <?php else: ?>
                <button type="button" class="btn btn-primary btn-block" onclick="upgradePackageTier('silver', 1500)">
                  Upgrade to Silver &rarr;
                </button>
              <?php endif; ?>
            </div>

            <!-- Tier 3: Gold Champion -->
            <div class="pkg-card <?= $package === 'gold' ? 'active-tier' : '' ?> highlight-card">
              <?php if ($package === 'gold'): ?><div class="current-tier-tag">CURRENT PLAN</div><?php endif; ?>
              <div class="pkg-ribbon">POPULAR</div>
              <div class="pkg-icon">🥇</div>
              <h3 class="pkg-title">Gold Champion</h3>
              <div class="pkg-price">₦3,500 <span>/ month</span></div>
              <ul class="pkg-features">
                <li>✓ <strong>50 games per day quota</strong></li>
                <li>✓ <strong>300 free bonus coins</strong> per month</li>
                <li>✓ <strong>Grandmaster AI with Telemetry HUD</strong></li>
                <li>✓ <strong>Host up to 3 tournaments/mo</strong></li>
                <li>✓ Gold glowing avatar frame</li>
                <li>✓ Priority matchmaking queue</li>
                <li>✓ Deep AI analysis evaluator</li>
              </ul>
              <?php if ($package === 'gold'): ?>
                <button type="button" class="btn btn-secondary btn-block disabled" disabled>Active Plan</button>
              <?php else: ?>
                <button type="button" class="btn btn-primary btn-block" onclick="upgradePackageTier('gold', 3500)">
                  Upgrade to Gold &rarr;
                </button>
              <?php endif; ?>
            </div>

            <!-- Tier 4: Oba VIP Master -->
            <div class="pkg-card <?= $package === 'vip_oba' ? 'active-tier' : '' ?> vip-card">
              <?php if ($package === 'vip_oba'): ?><div class="current-tier-tag">CURRENT PLAN</div><?php endif; ?>
              <div class="pkg-ribbon gold-ribbon">ULTIMATE VIP</div>
              <div class="pkg-icon">👑</div>
              <h3 class="pkg-title">Oba VIP Master</h3>
              <div class="pkg-price">₦7,500 <span>/ month</span></div>
              <ul class="pkg-features">
                <li>✓ <strong>UNLIMITED games per day</strong></li>
                <li>✓ <strong>1,000 free bonus coins</strong> per month</li>
                <li>✓ <strong>Unlimited tournament hosting</strong></li>
                <li>✓ <strong>0% platform fee</strong> on P2P wagers</li>
                <li>✓ Oba Crown badge & VIP leaderboard priority</li>
                <li>✓ Direct access to WhatsApp Grandmasters Lounge</li>
              </ul>
              <?php if ($package === 'vip_oba'): ?>
                <button type="button" class="btn btn-secondary btn-block disabled" disabled>Active Plan</button>
              <?php else: ?>
                <button type="button" class="btn btn-primary btn-block" onclick="upgradePackageTier('vip_oba', 7500)">
                  👑 Become Oba VIP &rarr;
                </button>
              <?php endif; ?>
            </div>

          </div>
        </div>

        <!-- Recent Transactions Ledger -->
        <div class="transactions-section">
          <h3>Wallet Transaction History</h3>
          <div class="trans-table-wrapper">
            <table class="dash-table" id="trans-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Balance After</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody id="trans-table-body">
                <tr>
                  <td colspan="6" class="text-center">Loading transactions...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>

    <!-- ================= TAB 6: TOURNAMENTS HUB ================= -->
    <section class="dash-tab-panel" id="panel-tournaments">
      <div class="tournaments-layout">
        
        <div class="tournaments-action-banner">
          <div>
            <h2>🏆 Nigerian Draughts Championships & Cups</h2>
            <p>Compete for cash and coin prize pools under official Nigerian 10x10 knockout rules.</p>
          </div>
          <button type="button" class="btn btn-primary btn-large" onclick="openHostTournamentModal()">
            <span class="icon">🚀</span> Start / Host Tournament
          </button>
        </div>

        <!-- Active Tournaments List -->
        <div class="tournaments-grid" id="tournaments-grid">
          <div class="empty-state">Loading active championships...</div>
        </div>

      </div>
    </section>

  </main>

  <!-- ================= MODALS SECTION ================= -->

  <!-- 1. CREATE GAME MODAL -->
  <div class="home-modal-overlay" id="modal-create-game">
    <div class="home-modal-dialog create-game-modal-card">
      <div class="home-modal-header">
        <h3 class="home-modal-title">🎮 Create New Draughts Match</h3>
        <button type="button" class="btn-close-home-modal" onclick="closeModal('modal-create-game')" title="Close">&times;</button>
      </div>
      <form id="form-create-game" onsubmit="handleCreateGameSubmit(event)" class="create-game-form-wrapper">
        <div class="home-modal-body create-game-modal-body">
          <div class="create-game-grid">
            
            <!-- Section 1: Format & Rules -->
            <div class="create-game-section-title">
              <span>🎮</span> 1. Match Format & Rules
            </div>

            <!-- Game Type: 1 Player / 2 Player segmented options -->
            <div class="form-group create-game-full">
              <label class="form-label-bold" style="margin-bottom: 6px; display: block; font-weight: 600;">Game Type</label>
              <div class="segmented-options" id="create-game-type-segmented">
                <button type="button" class="segmented-btn active" data-type="1p" id="btn-type-1p" onclick="selectCreateGameType('1p')">👤 1 Player (vs AI)</button>
                <button type="button" class="segmented-btn" data-type="2p" id="btn-type-2p" onclick="selectCreateGameType('2p')">👥 2 Player (Online Room)</button>
              </div>
              <input type="hidden" id="create-game-type" value="1p">
            </div>

            <!-- AI Engine Strength (Visible for 1-Player vs AI) -->
            <div class="form-group" id="create-ai-difficulty-wrap">
              <label for="create-ai-difficulty" style="font-weight: 600;">🤖 AI Engine Strength</label>
              <select id="create-ai-difficulty" class="form-control">
                <option value="beginner">Beginner (Level 1 - Casual)</option>
                <option value="intermediate">Intermediate (Level 2 - Club Player)</option>
                <option value="advanced">Advanced (Level 3 - State Contender)</option>
                <option value="expert" selected>Expert (Level 4 - National Master)</option>
                <option value="master">Master (Level 5 - Grandmaster Oba)</option>
                <option value="grandmaster">Grandmaster (Level 6 - World Champion Engine)</option>
              </select>
            </div>

            <!-- Rule Type dropdown -->
            <div class="form-group">
              <label for="create-rule-type" style="font-weight: 600;">Rule Type</label>
              <select id="create-rule-type" class="form-control">
                <option value="nigeria" selected>🇳🇬 Nigeria (Free Choice, Flying Kings)</option>
                <option value="ghana">🇬🇭 Ghana (Damii - Immediate Crown Stop, 16-Move 3v1)</option>
                <option value="international">🌍 International (FMJD - Strict Majority Capture)</option>
              </select>
            </div>

            <!-- Section 2: Stakes & Time -->
            <div class="create-game-section-title">
              <span>⏱️</span> 2. Stakes & Time Controls
            </div>

            <!-- Coins Required to Play (Required) dropdown -->
            <div class="form-group">
              <label for="create-coins-required" style="font-weight: 600;">Coins Required to Play <span style="color: #ef4444;">*</span></label>
              <select id="create-coins-required" class="form-control" onchange="handleCoinsDropdownChange(this.value)">
                <option value="free" selected>Free</option>
                <option value="10">10 coins</option>
                <option value="20">20 coins</option>
                <option value="30">30 coins</option>
                <option value="40">40 coins</option>
                <option value="50">50 coins</option>
                <option value="100">100 coins</option>
                <option value="500">500 coins</option>
                <option value="600">600 coins</option>
                <option value="700">700 coins</option>
                <option value="800">800 coins</option>
                <option value="900">900 coins</option>
                <option value="1000">1000 coins</option>
                <option value="custom">Type coins</option>
              </select>
              <div id="create-custom-coins-wrap" class="custom-coins-input-wrap">
                <input type="number" id="create-custom-coins-val" class="form-control" placeholder="Enter coin amount (e.g. 250)" min="1" max="100000">
              </div>
              <small class="form-hint" style="margin-top: 6px; display: block; color: var(--gold-400); font-size: 0.82rem;">
                💡 <em>Have Naira in your wallet? Any coin shortfall will automatically convert from your Naira balance (₦1 = 1 Coin)!</em>
              </small>
            </div>

            <!-- Player Time dropdown -->
            <div class="form-group">
              <label for="create-player-time" style="font-weight: 600;">Player Time</label>
              <select id="create-player-time" class="form-control">
                <option value="none">None</option>
                <option value="1">1 min</option>
                <option value="3">3 min</option>
                <option value="4">4 min</option>
                <option value="5" selected>5 min</option>
                <option value="6">6 min</option>
                <option value="7">7 min</option>
                <option value="8">8 min</option>
                <option value="9">9 min</option>
                <option value="10">10 min</option>
                <option value="15">15 min</option>
                <option value="20">20 min</option>
                <option value="30">30 minute</option>
              </select>
            </div>

            <!-- Player 1 Short (Handicap) dropdown -->
            <div class="form-group">
              <label for="create-p1-short" style="font-weight: 600;">Player 1 Short (Handicap)</label>
              <select id="create-p1-short" class="form-control">
                <option value="0" selected>None</option>
                <option value="1">1 piece</option>
                <option value="2">2 pieces</option>
                <option value="3">3 pieces</option>
                <option value="4">4 pieces</option>
                <option value="5">5 pieces</option>
              </select>
            </div>

            <!-- Section 3: Board & Conditions -->
            <div class="create-game-section-title">
              <span>🎨</span> 3. Board Theme & Conditions
            </div>

            <!-- Modifications (Conditions) dropdown -->
            <div class="form-group">
              <label for="create-modifications" style="font-weight: 600;">Modifications (Conditions)</label>
              <select id="create-modifications" class="form-control">
                <option value="none" selected>None</option>
                <option value="crown_start_left_left">Crown start left left</option>
                <option value="crown_start_middle_middle">Crown start middle middle</option>
                <option value="draw_odds_p2">2nd player find draw</option>
                <option value="adv_1m">1 min advantage</option>
                <option value="adv_3m">3 min advantage</option>
                <option value="adv_5m">5 min advantage</option>
                <option value="adv_7m">7 min advantage</option>
                <option value="inc_1s">1 second increment</option>
                <option value="inc_3s">3 second increment</option>
                <option value="inc_5s">5 second increment</option>
                <option value="ten_aside">Ten aside</option>
                <option value="random_ten_aside">Random ten aside</option>
              </select>
            </div>

            <!-- Board Type dropdown -->
            <div class="form-group">
              <label for="create-board-type" style="font-weight: 600;">Board Type</label>
              <select id="create-board-type" class="form-control">
                <option value="default" selected>Default Classic</option>
                <option value="eco_giant">Eco Giant</option>
                <option value="golden_state">Golden State</option>
                <option value="safari_land">Safari Land</option>
                <option value="mineral_grove">Mineral Grove</option>
                <option value="diamond_coast">Diamond Coast</option>
              </select>
            </div>

            <!-- Section 4: Rules & Toggles -->
            <div class="create-game-section-title">
              <span>⚙️</span> 4. Match Rules & Gameplay Toggles
            </div>

            <!-- Settings: 7 ON/OFF toggle switches -->
            <div class="form-group create-game-full">
              <div class="toggles-grid">
                <div class="toggle-switch-item">
                  <span class="toggle-label-text">↩️ Undo allowed</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="toggle-undo-allowed" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-switch-item">
                  <span class="toggle-label-text">🔒 Private game</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="toggle-private-game">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-switch-item">
                  <span class="toggle-label-text">🏆 To win</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="toggle-to-win" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-switch-item">
                  <span class="toggle-label-text">🔇 Disable chat</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="toggle-disable-chat">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-switch-item">
                  <span class="toggle-label-text">🔊 Sound on</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="toggle-sound-on" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-switch-item">
                  <span class="toggle-label-text">✨ Highlight moves</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="toggle-highlight-moves" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-switch-item" style="grid-column: 1 / -1;">
                  <span class="toggle-label-text">🔬 Analysis mode</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="toggle-analysis-mode">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="home-modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-create-game')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-large" id="btn-submit-create-game">
            ⚡ Create Game &rarr;
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 2. WHATSAPP COMMUNITY MODAL -->
  <div class="home-modal-overlay" id="modal-whatsapp">
    <div class="home-modal-dialog whatsapp-modal-theme">
      <div class="home-modal-header whatsapp-modal-header">
        <h3 class="home-modal-title">💬 Nigeria Draughts Masters Community</h3>
        <button type="button" class="btn-close-home-modal" onclick="closeModal('modal-whatsapp')">&times;</button>
      </div>
      <div class="home-modal-body text-center">
        <div class="whatsapp-circle-icon">🇳🇬</div>
        <h3>Join 500+ Champions on WhatsApp</h3>
        <p class="whatsapp-dialog-desc">
          Get direct access to daily Nigerian street challenges, grandmaster move analysis, weekend tournament pairings, and real-time community banter.
        </p>
        <div class="whatsapp-rules-box">
          <strong>Community Guidelines:</strong>
          <ul>
            <li>Respect all draughts masters and players</li>
            <li>Zero cheating or illegal software promotion</li>
            <li>Keep discussions focused on Nigerian Draughts & matches</li>
          </ul>
        </div>
        <a href="https://chat.whatsapp.com/G5qK2vDraughtsMastersNG" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-block btn-large" style="margin-top: 16px;">
          🚀 Open WhatsApp Group & Join Now
        </a>
      </div>
    </div>
  </div>

  <!-- 3. DEPOSIT / TOP-UP MODAL -->
  <div class="home-modal-overlay" id="modal-deposit">
    <div class="home-modal-dialog">
      <div class="home-modal-header">
        <h3 class="home-modal-title">💳 Fund Naira Wallet</h3>
        <button type="button" class="btn-close-home-modal" onclick="closeModal('modal-deposit')">&times;</button>
      </div>
      <div class="home-modal-body">
        <p class="form-hint">Select amount to instantly top up your account balance:</p>
        <div class="topup-presets-grid">
          <button type="button" class="topup-preset-btn" onclick="submitDeposit(500)">₦500</button>
          <button type="button" class="topup-preset-btn active" onclick="submitDeposit(1000)">₦1,000</button>
          <button type="button" class="topup-preset-btn" onclick="submitDeposit(2500)">₦2,500</button>
          <button type="button" class="topup-preset-btn" onclick="submitDeposit(5000)">₦5,000</button>
          <button type="button" class="topup-preset-btn" onclick="submitDeposit(10000)">₦10,000</button>
        </div>
        <form onsubmit="handleCustomDeposit(event)" style="margin-top: 16px;">
          <div class="form-group">
            <label for="custom-deposit-amt">Or Enter Custom Amount (₦)</label>
            <input type="number" id="custom-deposit-amt" class="form-control" placeholder="e.g. 3000" min="100" max="500000" required>
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-large">
            Deposit Funds Now &rarr;
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- WITHDRAWAL MODAL -->
  <div class="home-modal-overlay" id="modal-withdraw">
    <div class="home-modal-dialog">
      <div class="home-modal-header">
        <h3 class="home-modal-title">🏦 Cash Out / Bank Withdrawal</h3>
        <button type="button" class="btn-close-home-modal" onclick="closeModal('modal-withdraw')">&times;</button>
      </div>
      <div class="home-modal-body">
        <p class="form-hint">Withdraw your match winnings directly to your Nigerian bank. Min: ₦1,000.</p>
        <form id="form-withdraw" onsubmit="handleWithdrawalSubmit(event)">
          <div class="form-group">
            <label for="withdraw-amt">Amount to Withdraw (₦)</label>
            <input type="number" id="withdraw-amt" class="form-control" placeholder="Min ₦1,000" min="1000" step="100" required>
          </div>
          <div class="form-group">
            <label for="withdraw-bank">Destination Nigerian Bank</label>
            <select id="withdraw-bank" class="form-control" required>
              <option value="">-- Choose Your Bank --</option>
              <option value="044|Access Bank">Access Bank</option>
              <option value="058|Guaranty Trust Bank (GTBank)">Guaranty Trust Bank (GTBank)</option>
              <option value="057|Zenith Bank">Zenith Bank</option>
              <option value="011|First Bank of Nigeria">First Bank of Nigeria</option>
              <option value="033|United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
              <option value="999992|OPay Digital Services">OPay Digital Services</option>
              <option value="999991|PalmPay">PalmPay</option>
              <option value="090267|Kuda Microfinance Bank">Kuda Microfinance Bank</option>
              <option value="214|First City Monument Bank (FCMB)">FCMB</option>
              <option value="221|Stanbic IBTC Bank">Stanbic IBTC Bank</option>
              <option value="035|Wema Bank (ALAT)">Wema Bank (ALAT)</option>
              <option value="070|Fidelity Bank">Fidelity Bank</option>
            </select>
          </div>
          <div class="form-group">
            <label for="withdraw-account-num">10-Digit Account Number (NUBAN)</label>
            <input type="text" id="withdraw-account-num" class="form-control" placeholder="0123456789" maxlength="10" pattern="[0-9]{10}" required>
          </div>
          <div class="form-group">
            <label for="withdraw-account-name">Account Holder Full Name</label>
            <input type="text" id="withdraw-account-name" class="form-control" placeholder="Must match your bank name" required>
          </div>
          <button type="submit" id="btn-submit-withdraw" class="btn btn-primary btn-block btn-large">
            Confirm Bank Withdrawal &rarr;
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- 4. BUY COINS MODAL -->
  <div class="home-modal-overlay" id="modal-buy-coins">
    <div class="home-modal-dialog">
      <div class="home-modal-header">
        <h3 class="home-modal-title">🪙 Exchange Naira for Coins</h3>
        <button type="button" class="btn-close-home-modal" onclick="closeModal('modal-buy-coins')">&times;</button>
      </div>
      <div class="home-modal-body">
        <p class="form-hint">Rate: ₦1 = 1 Coin. Balance available: <strong id="buy-coins-wallet-avail">₦<?= number_format($walletBalance, 2) ?></strong></p>
        <div class="coin-presets-grid">
          <button type="button" class="coin-pack-btn" onclick="exchangeCoins(100, 100)">
            <span class="c-val">100 🪙</span>
            <span class="c-price">₦100</span>
          </button>
          <button type="button" class="coin-pack-btn" onclick="exchangeCoins(300, 300)">
            <span class="c-val">300 🪙</span>
            <span class="c-price">₦300</span>
          </button>
          <button type="button" class="coin-pack-btn" onclick="exchangeCoins(500, 500)">
            <span class="c-val">500 🪙</span>
            <span class="c-price">₦500</span>
          </button>
          <button type="button" class="coin-pack-btn" onclick="exchangeCoins(1000, 1000)">
            <span class="c-val">1,000 🪙</span>
            <span class="c-price">₦1,000</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 5. SEND CHALLENGE MODAL -->
  <div class="home-modal-overlay" id="modal-send-challenge">
    <div class="home-modal-dialog">
      <div class="home-modal-header">
        <h3 class="home-modal-title">⚔️ Challenge a Player</h3>
        <button type="button" class="btn-close-home-modal" onclick="closeModal('modal-send-challenge')">&times;</button>
      </div>
      <div class="home-modal-body">
        <form id="form-send-challenge" onsubmit="handleSendChallengeSubmit(event)">
          <div class="form-group">
            <label for="challenge-player-id">Opponent Player ID or Username</label>
            <input type="text" id="challenge-player-id" class="form-control" placeholder="e.g. 14 or #ND-00014 or LagosChamp" required>
          </div>
          <div class="form-group">
            <label for="challenge-time-control">Time Control</label>
            <select id="challenge-time-control" class="form-control">
              <option value="rapid_5">5 Minutes (Rapid)</option>
              <option value="blitz_3">3 Minutes (Blitz)</option>
              <option value="classical_10">10 Minutes (Classical)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="challenge-wager">Coin Wager</label>
            <select id="challenge-wager" class="form-control">
              <option value="0">Friendly (0 Coins)</option>
              <option value="50">50 Coins</option>
              <option value="100">100 Coins</option>
              <option value="250">250 Coins</option>
              <option value="500">500 Coins</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-large">Send Match Challenge &rarr;</button>
        </form>
      </div>
    </div>
  </div>

  <!-- 6. HOST TOURNAMENT MODAL -->
  <div class="home-modal-overlay" id="modal-host-tournament">
    <div class="home-modal-dialog">
      <div class="home-modal-header">
        <h3 class="home-modal-title">🚀 Host Official Tournament</h3>
        <button type="button" class="btn-close-home-modal" onclick="closeModal('modal-host-tournament')">&times;</button>
      </div>
      <div class="home-modal-body">
        <form id="form-host-tournament" onsubmit="handleHostTournamentSubmit(event)">
          <div class="form-group">
            <label for="tourn-title">Tournament Name</label>
            <input type="text" id="tourn-title" class="form-control" placeholder="e.g. Lagos Island Sunday Cup" required>
          </div>
          <div class="form-group">
            <label for="tourn-entry-fee">Entry Fee (Coins)</label>
            <select id="tourn-entry-fee" class="form-control">
              <option value="0">Free (0 Coins)</option>
              <option value="50">50 Coins Entry</option>
              <option value="100">100 Coins Entry</option>
              <option value="250">250 Coins Entry</option>
              <option value="500">500 Coins Entry</option>
            </select>
          </div>
          <div class="form-group">
            <label for="tourn-entry-naira">Cash Entry Stake (₦ Naira - Optional)</label>
            <input type="number" id="tourn-entry-naira" class="form-control" placeholder="0.00 (e.g. 1000)" min="0" step="100">
          </div>
          <div class="form-group">
            <label for="tourn-prize-naira">Cash Prize Pool (₦ Naira - Optional)</label>
            <input type="number" id="tourn-prize-naira" class="form-control" placeholder="0.00 (e.g. 50000)" min="0" step="500">
          </div>
          <div class="form-group">
            <label for="tourn-max-players">Knockout Bracket Size</label>
            <select id="tourn-max-players" class="form-control">
              <option value="8">8 Players (Quarterfinals Knockout)</option>
              <option value="16">16 Players (Championship Cup)</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-large">Launch Tournament & Open Registration &rarr;</button>
        </form>
      </div>
    </div>
  </div>

  <!-- 7. NEW MESSAGE MODAL -->
  <div class="home-modal-overlay" id="modal-new-message">
    <div class="home-modal-dialog">
      <div class="home-modal-header">
        <h3 class="home-modal-title">✉️ New Direct Message</h3>
        <button type="button" class="btn-close-home-modal" onclick="closeModal('modal-new-message')">&times;</button>
      </div>
      <div class="home-modal-body">
        <form id="form-new-message" onsubmit="handleStartNewConversation(event)">
          <div class="form-group">
            <label for="new-msg-peer">Recipient Username or Player ID</label>
            <input type="text" id="new-msg-peer" class="form-control" placeholder="e.g. 12 or #ND-00012 or LagosChamp" required>
          </div>
          <div class="form-group">
            <label for="new-msg-text">Message Content</label>
            <textarea id="new-msg-text" class="form-control" rows="3" placeholder="Challenge you to a 10x10 showdown!" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-large">Send Message &rarr;</button>
        </form>
      </div>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div id="dash-toast-container" class="dash-toast-container"></div>

  <!-- Client-side Logic Script -->
  <script src="js/dashboard.js?v=<?= filemtime(__DIR__ . '/js/dashboard.js') ?>"></script>
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      });
    }
  </script>
</body>
</html>
