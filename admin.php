<?php
/**
 * Naija Draughts - Ultra-Premium Admin Command Center
 * Role-Based Access Control (RBAC), Player Management, Financial Cashier,
 * Tournament Oversight, Arena Monitoring, System Settings, and Audit Trails.
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/admin_helper.php';

$db = getDB();
$adminUser = getAdminSessionUser($db);

if (!$adminUser) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $loginError = '';

    // 1-Click Instant Super Admin Login (Zero Friction for Developer/Admin)
    if (isset($_POST['action']) && $_POST['action'] === 'instant_superadmin') {
        $sa = $db->query("SELECT * FROM users WHERE username = 'superadmin'")->fetch(PDO::FETCH_ASSOC);
        if (!$sa) {
            $sa = $db->query("SELECT * FROM users WHERE username = 'GrandmasterAyo'")->fetch(PDO::FETCH_ASSOC);
        }
        if ($sa) {
            unset($sa['password_hash']);
            $_SESSION['user'] = $sa;
            header('Location: admin.php');
            exit;
        }
    }

    // Direct Admin Sign-In Form Handler
    if (isset($_POST['action']) && $_POST['action'] === 'admin_login') {
        $loginInput = trim($_POST['username'] ?? '');
        $passInput  = $_POST['password'] ?? '';

        $stmt = $db->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$loginInput, $loginInput]);
        $u = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($u && password_verify($passInput, $u['password_hash'])) {
            if (in_array($u['role'], ['admin', 'super_admin'])) {
                unset($u['password_hash']);
                $_SESSION['user'] = $u;
                header('Location: admin.php');
                exit;
            } else {
                $loginError = "Account '{$u['username']}' does not have Administrator privileges.";
            }
        } else {
            $loginError = "Invalid username/email or password.";
        }
    }

    // 1-Click Elevation for Logged-In Players
    if (isset($_POST['action']) && $_POST['action'] === 'claim_admin' && !empty($_SESSION['user']['id'])) {
        $allPerms = json_encode([
            'manage_admins', 'manage_users', 'manage_finance',
            'manage_tournaments', 'manage_rooms', 'manage_settings', 'view_audit_logs'
        ]);
        $db->prepare("UPDATE users SET role = 'super_admin', permissions_json = ? WHERE id = ?")
           ->execute([$allPerms, (int)$_SESSION['user']['id']]);
        $fresh = $db->query("SELECT * FROM users WHERE id = " . (int)$_SESSION['user']['id'])->fetch(PDO::FETCH_ASSOC);
        unset($fresh['password_hash']);
        $_SESSION['user'] = $fresh;
        header('Location: admin.php');
        exit;
    }

    // Case A: User is logged in as a normal player without admin role
    if (!empty($_SESSION['user'])) {
        $loggedUsername = htmlspecialchars($_SESSION['user']['username'] ?? 'Player');
        $loggedEmail = htmlspecialchars($_SESSION['user']['email'] ?? '');
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Access Restricted | Naija Draughts Admin</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@700;800;900&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="admin.css">
        </head>
        <body class="admin-body" style="align-items:center; justify-content:center; padding:20px;">
          <div class="admin-card" style="max-width:540px; width:100%; text-align:center; padding:36px 30px; margin:auto; border-color:rgba(245,158,11,0.4);">
            <div style="font-size:3.5rem; margin-bottom:12px;">🛡️</div>
            <h2 style="font-family:var(--font-heading); font-size:1.6rem; color:#ffffff; margin-bottom:8px;">Admin Authorization Required</h2>
            <p style="color:var(--text-secondary); font-size:0.92rem; line-height:1.5; margin-bottom:20px;">
              You are currently logged in as <strong style="color:#f59e0b;"><?= $loggedUsername ?></strong> (<?= $loggedEmail ?>), which has standard <strong>Player</strong> status.
            </p>

            <div style="display:flex; flex-direction:column; gap:12px;">
              <form method="POST">
                <input type="hidden" name="action" value="claim_admin">
                <button type="submit" class="btn-admin btn-admin-primary" style="width:100%; justify-content:center; padding:12px; font-size:0.95rem;">
                  👑 Elevate '<?= $loggedUsername ?>' to Super Admin
                </button>
              </form>

              <form method="POST">
                <input type="hidden" name="action" value="instant_superadmin">
                <button type="submit" class="btn-admin btn-admin-secondary" style="width:100%; justify-content:center; padding:10px;">
                  ⚡ Switch to Dedicated Super Admin (superadmin)
                </button>
              </form>

              <a href="dashboard.php" class="btn-admin btn-admin-secondary" style="width:100%; justify-content:center; padding:10px; color:var(--text-muted);">
                ← Return to Player Dashboard
              </a>
            </div>
          </div>
        </body>
        </html>
        <?php
        exit;
    }

    // Case B: User is NOT logged in - Render Dedicated Super Admin Login Portal
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign In | Naija Draughts Admin Command Center</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@700;800;900&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="admin.css">
    </head>
    <body class="admin-body" style="align-items:center; justify-content:center; padding:20px;">
      <div class="admin-card" style="max-width:480px; width:100%; padding:36px 30px; margin:auto; border-color:rgba(245,158,11,0.45); box-shadow:0 12px 48px rgba(0,0,0,0.6);">
        <div style="text-align:center; margin-bottom:24px;">
          <div class="brand-icon-shield" style="margin:0 auto 12px; width:54px; height:54px; font-size:1.8rem;">🛡️</div>
          <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:800; color:#ffffff;">Command Center Portal</h2>
          <span class="badge-command">Restricted Administrator Access</span>
        </div>

        <?php if (!empty($loginError)): ?>
          <div style="background:rgba(244,63,94,0.15); border:1px solid rgba(244,63,94,0.4); color:#fb7185; padding:10px 14px; border-radius:var(--radius-sm); font-size:0.85rem; margin-bottom:18px; text-align:center;">
            ✕ <?= htmlspecialchars($loginError) ?>
          </div>
        <?php endif; ?>

        <!-- 1-Click Instant Login (Fastest access) -->
        <form method="POST" style="margin-bottom:20px;">
          <input type="hidden" name="action" value="instant_superadmin">
          <button type="submit" class="btn-admin btn-admin-primary" style="width:100%; justify-content:center; padding:12px; font-size:0.95rem; font-weight:800;">
            ⚡ 1-Click Instant Super Admin Sign In
          </button>
        </form>

        <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
          <hr style="flex:1; border:none; border-top:1px solid var(--admin-border-subtle);">
          <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:800;">Or Enter Credentials</span>
          <hr style="flex:1; border:none; border-top:1px solid var(--admin-border-subtle);">
        </div>

        <!-- Manual Login Form -->
        <form method="POST">
          <input type="hidden" name="action" value="admin_login">
          <div class="form-group-admin">
            <label for="admin-user-input">Administrator Username or Email</label>
            <input type="text" id="admin-user-input" name="username" class="form-control-admin" value="superadmin" required autocomplete="username">
          </div>
          <div class="form-group-admin" style="margin-bottom:22px;">
            <label for="admin-pass-input">Password</label>
            <input type="password" id="admin-pass-input" name="password" class="form-control-admin" value="Admin123!" required autocomplete="current-password">
          </div>
          <button type="submit" class="btn-admin btn-admin-secondary" style="width:100%; justify-content:center; padding:11px; font-weight:700;">
            🔓 Sign In with Credentials
          </button>
        </form>

        <!-- Credentials Reference Card -->
        <div style="background:rgba(0,0,0,0.3); border:1px solid var(--admin-border-subtle); border-radius:var(--radius-sm); padding:14px; margin-top:22px; font-size:0.8rem;">
          <div style="color:var(--gold-500); font-weight:800; text-transform:uppercase; font-size:0.7rem; letter-spacing:0.06em; margin-bottom:6px;">
            👑 Official Super Admin Accounts
          </div>
          <div style="display:grid; grid-template-columns:1fr; gap:6px; color:#cbd5e1;">
            <div><strong>superadmin</strong> &bull; Password: <code style="color:#fde047;">Admin123!</code></div>
            <div><strong>GrandmasterAyo</strong> &bull; Password: <code style="color:#fde047;">Password123!</code></div>
            <div><strong>jaybe007</strong> &bull; Password: <code style="color:#fde047;">Admin123!</code></div>
          </div>
        </div>

        <div style="text-align:center; margin-top:18px;">
          <a href="index.php" style="font-size:0.82rem; color:var(--text-muted); text-decoration:none;">
            ← Return to Naija Draughts Home
          </a>
        </div>
      </div>
    </body>
    </html>
    <?php
    exit;
}

$isSuperAdmin = ($adminUser['role'] === 'super_admin');
$adminPerms = json_decode($adminUser['permissions_json'] ?? '[]', true) ?: [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Command Center | Naija Draughts</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="admin.css">
</head>
<body class="admin-body">

  <!-- ================= 1. SIDEBAR ================= -->
  <aside class="admin-sidebar" id="admin-sidebar">
    <div class="sidebar-header">
      <div class="brand-icon-shield">🛡️</div>
      <div class="brand-text-wrap">
        <h1>Naija Draughts</h1>
        <span class="badge-command">Command Center</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Core Operations</div>
      
      <button type="button" class="admin-nav-item active" data-panel="panel-overview">
        <div class="nav-label-wrap">
          <span class="nav-icon">📊</span>
          <span>Overview</span>
        </div>
      </button>

      <?php if ($isSuperAdmin || in_array('manage_admins', $adminPerms)): ?>
      <button type="button" class="admin-nav-item" data-panel="panel-admins">
        <div class="nav-label-wrap">
          <span class="nav-icon">👑</span>
          <span>Admins & RBAC</span>
        </div>
        <span class="nav-badge-pill badge-warning" id="badge-admin-count">...</span>
      </button>
      <?php endif; ?>

      <?php if ($isSuperAdmin || in_array('manage_users', $adminPerms)): ?>
      <button type="button" class="admin-nav-item" data-panel="panel-players">
        <div class="nav-label-wrap">
          <span class="nav-icon">👥</span>
          <span>Player Directory</span>
        </div>
      </button>
      <?php endif; ?>

      <div class="nav-section-label">Treasury & Arena</div>

      <?php if ($isSuperAdmin || in_array('manage_finance', $adminPerms)): ?>
      <button type="button" class="admin-nav-item" data-panel="panel-finance">
        <div class="nav-label-wrap">
          <span class="nav-icon">🏦</span>
          <span>Financial Cashier</span>
        </div>
        <span class="nav-badge-pill badge-warning" id="badge-pending-payouts" style="display:none;">0</span>
      </button>
      <?php endif; ?>

      <?php if ($isSuperAdmin || in_array('manage_tournaments', $adminPerms)): ?>
      <button type="button" class="admin-nav-item" data-panel="panel-tournaments">
        <div class="nav-label-wrap">
          <span class="nav-icon">🏆</span>
          <span>Tournaments</span>
        </div>
      </button>
      <?php endif; ?>

      <?php if ($isSuperAdmin || in_array('manage_rooms', $adminPerms)): ?>
      <button type="button" class="admin-nav-item" data-panel="panel-rooms">
        <div class="nav-label-wrap">
          <span class="nav-icon">⚔️</span>
          <span>Live Arena Rooms</span>
        </div>
        <span class="nav-badge-pill badge-live" id="badge-live-rooms" style="display:none;">0</span>
      </button>
      <?php endif; ?>

      <div class="nav-section-label">Platform Governance</div>

      <?php if ($isSuperAdmin || in_array('manage_settings', $adminPerms)): ?>
      <button type="button" class="admin-nav-item" data-panel="panel-settings">
        <div class="nav-label-wrap">
          <span class="nav-icon">⚙️</span>
          <span>Global Settings</span>
        </div>
      </button>
      <?php endif; ?>

      <?php if ($isSuperAdmin || in_array('view_audit_logs', $adminPerms)): ?>
      <button type="button" class="admin-nav-item" data-panel="panel-audit">
        <div class="nav-label-wrap">
          <span class="nav-icon">📜</span>
          <span>Audit Trails</span>
        </div>
      </button>
      <?php endif; ?>
    </nav>

    <div class="sidebar-footer">
      <div class="admin-user-pill">
        <div class="admin-avatar-mini"><?php echo strtoupper(substr($adminUser['username'], 0, 1)); ?></div>
        <div class="admin-user-meta">
          <span class="admin-name"><?php echo htmlspecialchars($adminUser['username']); ?></span>
          <span class="admin-role-badge"><?php echo $isSuperAdmin ? '👑 Super Admin' : '🛡️ Admin Staff'; ?></span>
        </div>
      </div>
      <a href="api/auth.php?action=logout" class="btn-admin-logout" title="Sign Out">🚪</a>
    </div>
  </aside>

  <!-- ================= 2. MAIN CONTAINER ================= -->
  <main class="admin-main">
    <!-- Top Navigation Bar -->
    <header class="admin-topbar">
      <div class="topbar-left">
        <h2 class="topbar-title" id="panel-heading-title">Command Center Overview</h2>
      </div>
      <div class="topbar-right">
        <a href="game.php" class="btn-topbar-link gold" target="_blank">
          <span>⚔️ Enter Arena</span>
        </a>
        <a href="dashboard.php" class="btn-topbar-link" target="_blank">
          <span>👤 Player Dashboard</span>
        </a>
      </div>
    </header>

    <!-- ================= PANEL 1: OVERVIEW ================= -->
    <section class="admin-view-panel active" id="panel-overview">
      <!-- Stat KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card gold">
          <div class="kpi-header">
            <span class="kpi-title">Gross Platform Rake</span>
            <div class="kpi-icon-pill">💰</div>
          </div>
          <div class="kpi-value gold" id="kpi-total-rake">₦0.00</div>
          <div class="kpi-subtext">Matches + Tournaments Rake</div>
        </div>

        <div class="kpi-card emerald">
          <div class="kpi-header">
            <span class="kpi-title">Total Registered Players</span>
            <div class="kpi-icon-pill">👥</div>
          </div>
          <div class="kpi-value emerald" id="kpi-total-users">0</div>
          <div class="kpi-subtext"><span id="kpi-verified-users">0</span> Verified Accounts</div>
        </div>

        <div class="kpi-card rose">
          <div class="kpi-header">
            <span class="kpi-title">Pending Bank Payouts</span>
            <div class="kpi-icon-pill">🏦</div>
          </div>
          <div class="kpi-value rose" id="kpi-pending-withdrawals">0</div>
          <div class="kpi-subtext" id="kpi-pending-amount">₦0.00 in queue</div>
        </div>

        <div class="kpi-card blue">
          <div class="kpi-header">
            <span class="kpi-title">Live Arena Matches</span>
            <div class="kpi-icon-pill">⚔️</div>
          </div>
          <div class="kpi-value" id="kpi-live-rooms">0</div>
          <div class="kpi-subtext"><span id="kpi-active-tournaments">0</span> Active Championships</div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="admin-card" style="margin-bottom: 24px;">
        <div class="card-header-bar">
          <div class="card-title-group">
            <h2>⚡ Quick Management Actions</h2>
            <p>Direct shortcuts for high-priority administrative tasks.</p>
          </div>
        </div>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <?php if ($isSuperAdmin): ?>
          <button type="button" class="btn-admin btn-admin-primary" onclick="adminApp.openCreateAdminModal()">
            <span>👑 Provision New Admin</span>
          </button>
          <?php endif; ?>
          <?php if ($isSuperAdmin || in_array('manage_finance', $adminPerms)): ?>
          <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.switchTab('panel-finance')">
            <span>💸 Review Bank Withdrawals</span>
          </button>
          <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.openManualBalanceModal()">
            <span>💰 Credit/Debit Player Wallet</span>
          </button>
          <?php endif; ?>
          <?php if ($isSuperAdmin || in_array('manage_tournaments', $adminPerms)): ?>
          <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.openCreateTournamentModal()">
            <span>🏆 Host Official Championship</span>
          </button>
          <?php endif; ?>
        </div>
      </div>

      <!-- Split View: Recent Pending Payouts & Recent Audit Trail -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(380px, 1fr)); gap:24px;">
        <!-- Recent Pending Withdrawals -->
        <div class="admin-card">
          <div class="card-header-bar">
            <div class="card-title-group">
              <h2>Pending Cashier Approvals</h2>
              <p>Player bank payouts awaiting validation.</p>
            </div>
            <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.switchTab('panel-finance')">View All &rarr;</button>
          </div>
          <div id="overview-pending-withdrawals-list">
            <p class="text-muted" style="font-size:0.85rem;">Loading pending withdrawals...</p>
          </div>
        </div>

        <!-- Recent Audit Log Stream -->
        <div class="admin-card">
          <div class="card-header-bar">
            <div class="card-title-group">
              <h2>Recent Audit Activity</h2>
              <p>Chronological security and governance stream.</p>
            </div>
            <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.switchTab('panel-audit')">Full Log &rarr;</button>
          </div>
          <div id="overview-recent-audit-list">
            <p class="text-muted" style="font-size:0.85rem;">Loading recent activity...</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= PANEL 2: ADMINS & RBAC ================= -->
    <?php if ($isSuperAdmin || in_array('manage_admins', $adminPerms)): ?>
    <section class="admin-view-panel" id="panel-admins">
      <div class="admin-card">
        <div class="card-header-bar">
          <div class="card-title-group">
            <h2>👑 Admin Staff & Role-Based Permissions (RBAC)</h2>
            <p>Super Admins can provision staff accounts and configure granular permission matrices.</p>
          </div>
          <?php if ($isSuperAdmin): ?>
          <button type="button" class="btn-admin btn-admin-primary" onclick="adminApp.openCreateAdminModal()">
            <span>➕ Provision New Admin</span>
          </button>
          <?php endif; ?>
        </div>

        <div class="admin-table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Admin Staff</th>
                <th>Role & Title</th>
                <th>Granular Permissions</th>
                <th>Account Status</th>
                <th>Joined</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody id="admins-table-body">
              <tr><td colspan="6" style="text-align:center;">Loading admin directory...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <?php endif; ?>

    <!-- ================= PANEL 3: PLAYER DIRECTORY ================= -->
    <?php if ($isSuperAdmin || in_array('manage_users', $adminPerms)): ?>
    <section class="admin-view-panel" id="panel-players">
      <div class="admin-card">
        <div class="card-header-bar">
          <div class="card-title-group">
            <h2>👥 Player Directory & Account Controls</h2>
            <p>Search players, review match histories, adjust cash balances, and manage account statuses.</p>
          </div>
          <div class="card-actions-group">
            <button type="button" class="btn-admin btn-admin-primary" onclick="adminApp.openProvisionPlayerModal()">
              <span>➕ Provision Player</span>
            </button>
            <input type="text" id="player-search-input" class="admin-search-input" placeholder="🔍 Search username or email...">
            <select id="player-package-filter" class="admin-select">
              <option value="all">All Packages</option>
              <option value="free">Free Tier</option>
              <option value="silver">Silver Tier</option>
              <option value="gold">Gold Tier</option>
              <option value="vip_oba">VIP Oba Tier</option>
            </select>
            <select id="player-status-filter" class="admin-select">
              <option value="all">All Statuses</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        <div class="admin-table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Rating</th>
                <th>Wallet Balance</th>
                <th>Coins</th>
                <th>Tier</th>
                <th>Role</th>
                <th>Status</th>
                <th style="text-align:right;">Manage</th>
              </tr>
            </thead>
            <tbody id="players-table-body">
              <tr><td colspan="8" style="text-align:center;">Loading player directory...</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
          <span style="font-size:0.82rem; color:var(--text-muted);" id="players-pagination-info">Showing players</span>
          <div style="display:flex; gap:6px;" id="players-pagination-controls">
            <!-- Dynamic page buttons -->
          </div>
        </div>
      </div>
    </section>
    <?php endif; ?>

    <!-- ================= PANEL 4: FINANCIAL CASHIER ================= -->
    <?php if ($isSuperAdmin || in_array('manage_finance', $adminPerms)): ?>
    <section class="admin-view-panel" id="panel-finance">
      <div class="admin-card">
        <div class="card-header-bar">
          <div class="card-title-group">
            <h2>🏦 Financial Cashier & Bank Payout Approvals</h2>
            <p>Validate withdrawal requests, approve direct bank payouts, or reject with automated refund.</p>
          </div>
          <div class="card-actions-group">
            <select id="withdrawal-status-filter" class="admin-select" onchange="adminApp.loadWithdrawals()">
              <option value="pending">Pending Review Only</option>
              <option value="completed">Completed Payouts</option>
              <option value="cancelled">Rejected / Refunded</option>
              <option value="all">All Transactions</option>
            </select>
            <button type="button" class="btn-admin btn-admin-primary" onclick="adminApp.openManualBalanceModal()">
              <span>💰 Manual Credit/Debit</span>
            </button>
          </div>
        </div>

        <div class="admin-table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Player</th>
                <th>Bank & Account (NUBAN)</th>
                <th>Payout Amount</th>
                <th>Current Balance</th>
                <th>Date Requested</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody id="withdrawals-table-body">
              <tr><td colspan="8" style="text-align:center;">Loading cashier requests...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <?php endif; ?>

    <!-- ================= PANEL 5: TOURNAMENTS ================= -->
    <?php if ($isSuperAdmin || in_array('manage_tournaments', $adminPerms)): ?>
    <section class="admin-view-panel" id="panel-tournaments">
      <div class="admin-card">
        <div class="card-header-bar">
          <div class="card-title-group">
            <h2>🏆 Tournaments & Knockout Championship Brackets</h2>
            <p>Oversee official cups, inspect bracket progression, force round advancements, or cancel with refunds.</p>
          </div>
          <button type="button" class="btn-admin btn-admin-primary" onclick="adminApp.openCreateTournamentModal()">
            <span>➕ Host Official Tournament</span>
          </button>
        </div>

        <div class="admin-table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Championship Name</th>
                <th>Prize Pool</th>
                <th>Entry Fee</th>
                <th>Enrolled</th>
                <th>Current Round</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody id="tournaments-table-body">
              <tr><td colspan="8" style="text-align:center;">Loading tournaments...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <?php endif; ?>

    <!-- ================= PANEL 6: LIVE ROOMS ================= -->
    <?php if ($isSuperAdmin || in_array('manage_rooms', $adminPerms)): ?>
    <section class="admin-view-panel" id="panel-rooms">
      <div class="admin-card">
        <div class="card-header-bar">
          <div class="card-title-group">
            <h2>⚔️ Live Game Arena & Match Rooms</h2>
            <p>Monitor ongoing 2-player multiplayer matches, inspect escrows, and terminate stuck games.</p>
          </div>
          <div class="card-actions-group">
            <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.clearStaleRooms()">
              <span>🧹 Clear Finished</span>
            </button>
            <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.loadRooms()">
              <span>🔄 Refresh Rooms</span>
            </button>
          </div>
        </div>

        <div class="admin-table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Room Code</th>
                <th>Host (White)</th>
                <th>Guest (Black)</th>
                <th>Cash Stake Pot</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Started</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody id="rooms-table-body">
              <tr><td colspan="8" style="text-align:center;">Loading live rooms...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <?php endif; ?>

    <!-- ================= PANEL 7: SYSTEM SETTINGS ================= -->
    <?php if ($isSuperAdmin || in_array('manage_settings', $adminPerms)): ?>
    <section class="admin-view-panel" id="panel-settings">
      <div class="admin-card">
        <div class="card-header-bar">
          <div class="card-title-group">
            <h2>⚙️ Global Platform Governance Settings</h2>
            <p>Control financial house rake rates, withdrawal minimums, maintenance mode, and announcements.</p>
          </div>
          <button type="button" class="btn-admin btn-admin-primary" onclick="adminApp.saveSettings()">
            <span>💾 Save Platform Settings</span>
          </button>
        </div>

        <form id="form-system-settings" onsubmit="adminApp.handleSettingsSubmit(event)">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
            <div class="form-group-admin">
              <label for="set-match-rake">Standard Match House Rake (%)</label>
              <input type="number" id="set-match-rake" name="platform_match_rake" class="form-control-admin" step="0.5" min="0" max="30" required>
            </div>
            <div class="form-group-admin">
              <label for="set-vip-rake">VIP Oba Discounted Rake (%)</label>
              <input type="number" id="set-vip-rake" name="platform_vip_rake" class="form-control-admin" step="0.5" min="0" max="30" required>
            </div>
            <div class="form-group-admin">
              <label for="set-tourn-commission">Tournament Commission (%)</label>
              <input type="number" id="set-tourn-commission" name="platform_tourn_commission" class="form-control-admin" step="1" min="0" max="30" required>
            </div>
            <div class="form-group-admin">
              <label for="set-min-withdrawal">Minimum Bank Withdrawal (₦)</label>
              <input type="number" id="set-min-withdrawal" name="min_withdrawal_naira" class="form-control-admin" step="100" min="500" required>
            </div>
            <div class="form-group-admin">
              <label for="set-min-deposit">Minimum Wallet Deposit (₦)</label>
              <input type="number" id="set-min-deposit" name="min_deposit_naira" class="form-control-admin" step="100" min="100" required>
            </div>
            <div class="form-group-admin">
              <label for="set-maintenance">Platform Maintenance Mode</label>
              <select id="set-maintenance" name="maintenance_mode" class="form-control-admin">
                <option value="0">🟢 Disabled (Platform Active & Online)</option>
                <option value="1">🔴 Enabled (Lock Arena for Scheduled Maintenance)</option>
              </select>
            </div>
          </div>

          <div class="form-group-admin" style="margin-top:10px;">
            <label for="set-maintenance-msg">Maintenance Message</label>
            <input type="text" id="set-maintenance-msg" name="maintenance_message" class="form-control-admin" placeholder="Message shown when maintenance is active">
          </div>

          <div class="form-group-admin">
            <label for="set-announcement">Global Broadcast Announcement Banner</label>
            <textarea id="set-announcement" name="global_announcement" class="form-control-admin" rows="3" placeholder="Broadcast notification visible to all players..."></textarea>
          </div>
        </form>
      </div>
    </section>
    <?php endif; ?>

    <!-- ================= PANEL 8: AUDIT TRAILS ================= -->
    <?php if ($isSuperAdmin || in_array('view_audit_logs', $adminPerms)): ?>
    <section class="admin-view-panel" id="panel-audit">
      <div class="admin-card">
        <div class="card-header-bar">
          <div class="card-title-group">
            <h2>📜 Immutable Administrative Audit Trails</h2>
            <p>Every admin approval, rejection, user balance change, and role assignment is cryptographically tracked.</p>
          </div>
          <div class="card-actions-group">
            <select id="audit-action-filter" class="admin-select" onchange="adminApp.loadAuditLogs()">
              <option value="">All Actions</option>
              <option value="create_admin">create_admin</option>
              <option value="update_admin_permissions">update_admin_permissions</option>
              <option value="approve_withdrawal">approve_withdrawal</option>
              <option value="reject_withdrawal">reject_withdrawal</option>
              <option value="update_user">update_user</option>
              <option value="adjust_wallet_balance">adjust_wallet_balance</option>
              <option value="cancel_tournament">cancel_tournament</option>
              <option value="update_settings">update_settings</option>
            </select>
          </div>
        </div>

        <div class="admin-table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Admin Staff</th>
                <th>Action</th>
                <th>Target</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody id="audit-table-body">
              <tr><td colspan="6" style="text-align:center;">Loading audit trails...</td></tr>
            </tbody>
          </table>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
          <span style="font-size:0.82rem; color:var(--text-muted);" id="audit-pagination-info">Showing logs</span>
          <div style="display:flex; gap:6px;" id="audit-pagination-controls"></div>
        </div>
      </div>
    </section>
    <?php endif; ?>
  </main>

  <!-- ================= MODALS ================= -->

  <!-- Modal 1: Unified Provisioning Hub (Create Admin or Promote Existing Player) -->
  <div class="admin-modal-backdrop" id="modal-create-admin">
    <div class="admin-modal-box" style="max-width: 620px;">
      <div class="admin-modal-header">
        <div>
          <h3>👑 Provision Administrator & Assign Roles</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">Create new staff or elevate existing registered players to RBAC operators.</p>
        </div>
        <button type="button" class="btn-close-modal" onclick="adminApp.closeModal('modal-create-admin')">&times;</button>
      </div>

      <div class="modal-tabs">
        <button type="button" class="modal-tab-btn active" id="tab-btn-new-staff" onclick="adminApp.switchProvisionTab('new')">
          <span>➕ Create New Staff</span>
        </button>
        <button type="button" class="modal-tab-btn" id="tab-btn-promote-player" onclick="adminApp.switchProvisionTab('promote')">
          <span>⭐ Promote Existing Player</span>
        </button>
      </div>

      <form id="form-create-admin" onsubmit="adminApp.handleCreateAdminSubmit(event)">
        <input type="hidden" id="provision-mode" value="new">
        <div class="admin-modal-body">

          <!-- Pane A: Create New Staff -->
          <div id="pane-new-staff">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
              <div class="form-group-admin">
                <label for="new-admin-username">Username</label>
                <input type="text" id="new-admin-username" class="form-control-admin" placeholder="e.g. ArbiterIbrahim" minlength="3">
              </div>
              <div class="form-group-admin">
                <label for="new-admin-email">Email Address</label>
                <input type="email" id="new-admin-email" class="form-control-admin" placeholder="staff@naijadraughts.ng">
              </div>
            </div>

            <div class="form-group-admin">
              <label for="new-admin-password">Password</label>
              <div class="password-input-wrapper">
                <input type="password" id="new-admin-password" class="form-control-admin" placeholder="Minimum 6 characters" minlength="6">
                <div class="password-actions-inline">
                  <button type="button" class="btn-inline-tool" onclick="adminApp.generateRandomPassword('new-admin-password')">🎲 Generate</button>
                  <button type="button" class="btn-inline-tool" onclick="adminApp.togglePasswordVisibility('new-admin-password', this)">👁️</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pane B: Promote Existing Player -->
          <div id="pane-promote-player" style="display:none;">
            <div class="form-group-admin">
              <label for="promote-user-select">Select Registered Player to Elevate</label>
              <select id="promote-user-select" class="form-control-admin">
                <option value="">Choose player from directory...</option>
              </select>
              <small style="color:var(--text-muted); font-size:0.75rem; margin-top:4px; display:block;">
                Selected player retains their rating, coin balance, and game history while acquiring staff privileges.
              </small>
            </div>
          </div>

          <!-- Common Fields -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:8px;">
            <div class="form-group-admin">
              <label for="new-admin-role">Administrative Role</label>
              <select id="new-admin-role" class="form-control-admin" onchange="adminApp.onRoleChange(this.value)">
                <option value="admin">Operations Admin (Selected Permissions)</option>
                <option value="super_admin">👑 Super Administrator (Full Root Access)</option>
              </select>
            </div>
            <div class="form-group-admin">
              <label for="new-admin-title">Staff Title / Designation</label>
              <input type="text" id="new-admin-title" class="form-control-admin" placeholder="e.g. Chief Tournament Arbiter" value="Operations Arbiter">
            </div>
          </div>

          <!-- 1-Click Role Presets -->
          <div class="form-group-admin" id="create-presets-section">
            <label style="margin-bottom:4px;">1-Click Role Presets</label>
            <div class="role-preset-grid">
              <button type="button" class="role-preset-card" onclick="adminApp.applyRolePreset('super_admin')">
                <span>👑 Super Admin</span>
              </button>
              <button type="button" class="role-preset-card" onclick="adminApp.applyRolePreset('treasury')">
                <span>🏦 Treasury & Cashier</span>
              </button>
              <button type="button" class="role-preset-card" onclick="adminApp.applyRolePreset('tournament')">
                <span>🏆 Tournament Arbiter</span>
              </button>
              <button type="button" class="role-preset-card" onclick="adminApp.applyRolePreset('moderator')">
                <span>🛡️ Community Moderator</span>
              </button>
              <button type="button" class="role-preset-card" onclick="adminApp.applyRolePreset('custom')">
                <span>⚙️ Custom Matrix</span>
              </button>
            </div>
          </div>

          <!-- Permissions Section -->
          <div class="form-group-admin" id="create-permissions-section">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <label style="margin-bottom:0;">Granular Permissions</label>
              <button type="button" class="btn-admin btn-admin-secondary" style="padding:2px 8px; font-size:0.75rem;" onclick="adminApp.toggleAllPermissions('form-create-admin')">Toggle All</button>
            </div>
            <div class="permission-grid" id="create-admin-permissions-grid">
              <!-- Populated dynamically -->
            </div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.closeModal('modal-create-admin')">Cancel</button>
          <button type="submit" class="btn-admin btn-admin-primary" id="btn-submit-provision">Provision Staff &rarr;</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 1B: Provision New Player Account -->
  <div class="admin-modal-backdrop" id="modal-provision-player">
    <div class="admin-modal-box" style="max-width: 580px;">
      <div class="admin-modal-header">
        <div>
          <h3>👤 Provision New Player Account</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">Register a player account with initial cash balance, coins, and VIP status.</p>
        </div>
        <button type="button" class="btn-close-modal" onclick="adminApp.closeModal('modal-provision-player')">&times;</button>
      </div>
      <form id="form-provision-player" onsubmit="adminApp.handleProvisionPlayerSubmit(event)">
        <div class="admin-modal-body">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group-admin">
              <label for="prov-player-username">Player Username</label>
              <input type="text" id="prov-player-username" class="form-control-admin" placeholder="e.g. LagosSniper" required minlength="3">
            </div>
            <div class="form-group-admin">
              <label for="prov-player-email">Email Address</label>
              <input type="email" id="prov-player-email" class="form-control-admin" placeholder="player@example.com" required>
            </div>
          </div>

          <div class="form-group-admin">
            <label for="prov-player-password">Password</label>
            <div class="password-input-wrapper">
              <input type="password" id="prov-player-password" class="form-control-admin" placeholder="Minimum 6 characters" required minlength="6">
              <div class="password-actions-inline">
                <button type="button" class="btn-inline-tool" onclick="adminApp.generateRandomPassword('prov-player-password')">🎲 Generate</button>
                <button type="button" class="btn-inline-tool" onclick="adminApp.togglePasswordVisibility('prov-player-password', this)">👁️</button>
              </div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group-admin">
              <label for="prov-player-balance">Starting Cash Balance (₦)</label>
              <input type="number" id="prov-player-balance" class="form-control-admin" step="100" min="0" value="0" required>
            </div>
            <div class="form-group-admin">
              <label for="prov-player-coins">Starting Coins (🪙)</label>
              <input type="number" id="prov-player-coins" class="form-control-admin" step="50" min="0" value="500" required>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group-admin">
              <label for="prov-player-rating">Rating Elo</label>
              <input type="number" id="prov-player-rating" class="form-control-admin" step="10" min="100" value="1200" required>
            </div>
            <div class="form-group-admin">
              <label for="prov-player-package">VIP Membership Tier</label>
              <select id="prov-player-package" class="form-control-admin">
                <option value="free">Free Player</option>
                <option value="silver">Silver Tier</option>
                <option value="gold">Gold Tier</option>
                <option value="vip_oba">👑 VIP Oba</option>
              </select>
            </div>
          </div>

          <div class="form-group-admin">
            <label for="prov-player-title">Street Title / Designation</label>
            <input type="text" id="prov-player-title" class="form-control-admin" placeholder="e.g. Street Player, Lagos Street Champion" value="Street Player">
          </div>
        </div>
        <div class="admin-modal-footer">
          <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.closeModal('modal-provision-player')">Cancel</button>
          <button type="submit" class="btn-admin btn-admin-primary">Provision Player &rarr;</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 1C: Reset Password -->
  <div class="admin-modal-backdrop" id="modal-reset-password">
    <div class="admin-modal-box" style="max-width: 440px;">
      <div class="admin-modal-header">
        <h3>🔑 Reset User Password</h3>
        <button type="button" class="btn-close-modal" onclick="adminApp.closeModal('modal-reset-password')">&times;</button>
      </div>
      <form id="form-reset-password" onsubmit="adminApp.handleResetPasswordSubmit(event)">
        <input type="hidden" id="reset-pass-user-id">
        <div class="admin-modal-body">
          <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:16px;">
            Set a new password for <strong id="reset-pass-username-label" style="color:var(--gold-400);">User</strong>:
          </p>
          <div class="form-group-admin">
            <label for="new-reset-password-input">New Password</label>
            <div class="password-input-wrapper">
              <input type="password" id="new-reset-password-input" class="form-control-admin" placeholder="Minimum 6 characters" required minlength="6">
              <div class="password-actions-inline">
                <button type="button" class="btn-inline-tool" onclick="adminApp.generateRandomPassword('new-reset-password-input')">🎲 Generate</button>
                <button type="button" class="btn-inline-tool" onclick="adminApp.togglePasswordVisibility('new-reset-password-input', this)">👁️</button>
              </div>
            </div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.closeModal('modal-reset-password')">Cancel</button>
          <button type="submit" class="btn-admin btn-admin-primary">Update Password</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 2: Edit Admin Permissions -->
  <div class="admin-modal-backdrop" id="modal-edit-admin-permissions">
    <div class="admin-modal-box" style="max-width: 600px;">
      <div class="admin-modal-header">
        <h3>🛡️ Modify Staff Permissions & Designation</h3>
        <button type="button" class="btn-close-modal" onclick="adminApp.closeModal('modal-edit-admin-permissions')">&times;</button>
      </div>
      <form id="form-edit-admin-permissions" onsubmit="adminApp.handleEditAdminSubmit(event)">
        <input type="hidden" id="edit-admin-id">
        <div class="admin-modal-body">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <label style="margin-bottom:0;">Staff Member: <strong id="edit-admin-username-label" style="color:#ffffff;"></strong></label>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group-admin">
              <label for="edit-admin-role">Administrative Role</label>
              <select id="edit-admin-role" class="form-control-admin" onchange="adminApp.onEditRoleChange(this.value)">
                <option value="admin">Operations Admin</option>
                <option value="super_admin">👑 Super Administrator</option>
              </select>
            </div>
            <div class="form-group-admin">
              <label for="edit-admin-title">Staff Title / Designation</label>
              <input type="text" id="edit-admin-title" class="form-control-admin" placeholder="e.g. Lead Arbiter">
            </div>
          </div>

          <div class="form-group-admin" id="edit-presets-section">
            <label style="margin-bottom:4px;">1-Click Role Presets</label>
            <div class="role-preset-grid">
              <button type="button" class="role-preset-card" onclick="adminApp.applyRolePreset('super_admin', 'edit')">
                <span>👑 Super Admin</span>
              </button>
              <button type="button" class="role-preset-card" onclick="adminApp.applyRolePreset('treasury', 'edit')">
                <span>🏦 Treasury & Cashier</span>
              </button>
              <button type="button" class="role-preset-card" onclick="adminApp.applyRolePreset('tournament', 'edit')">
                <span>🏆 Tournament Arbiter</span>
              </button>
              <button type="button" class="role-preset-card" onclick="adminApp.applyRolePreset('moderator', 'edit')">
                <span>🛡️ Community Moderator</span>
              </button>
              <button type="button" class="role-preset-card" onclick="adminApp.applyRolePreset('custom', 'edit')">
                <span>⚙️ Custom</span>
              </button>
            </div>
          </div>

          <div class="form-group-admin" id="edit-permissions-section">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <label style="margin-bottom:0;">Assigned Permissions</label>
              <button type="button" class="btn-admin btn-admin-secondary" style="padding:2px 8px; font-size:0.75rem;" onclick="adminApp.toggleAllPermissions('form-edit-admin-permissions')">Toggle All</button>
            </div>
            <div class="permission-grid" id="edit-admin-permissions-grid">
              <!-- Populated dynamically -->
            </div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.closeModal('modal-edit-admin-permissions')">Cancel</button>
          <button type="submit" class="btn-admin btn-admin-primary">Save Changes &rarr;</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 3: Edit Player Profile -->
  <div class="admin-modal-backdrop" id="modal-edit-player">
    <div class="admin-modal-box">
      <div class="admin-modal-header">
        <h3>✏️ Manage Player Account</h3>
        <button type="button" class="btn-close-modal" onclick="adminApp.closeModal('modal-edit-player')">&times;</button>
      </div>
      <form id="form-edit-player" onsubmit="adminApp.handleEditPlayerSubmit(event)">
        <input type="hidden" id="edit-player-id">
        <div class="admin-modal-body">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid var(--admin-border-subtle);">
            <div class="admin-avatar-mini" id="edit-player-avatar">P</div>
            <div>
              <h4 id="edit-player-username" style="font-size:1.05rem; color:#ffffff;">Player</h4>
              <p id="edit-player-email" style="font-size:0.8rem; color:var(--text-muted);"></p>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group-admin">
              <label for="edit-player-balance">Cash Balance (₦)</label>
              <input type="number" id="edit-player-balance" class="form-control-admin" step="0.01" min="0" required>
            </div>
            <div class="form-group-admin">
              <label for="edit-player-coins">Coins (🪙)</label>
              <input type="number" id="edit-player-coins" class="form-control-admin" step="1" min="0" required>
            </div>
            <div class="form-group-admin">
              <label for="edit-player-rating">Rating (Elo)</label>
              <input type="number" id="edit-player-rating" class="form-control-admin" step="1" min="100" required>
            </div>
            <div class="form-group-admin">
              <label for="edit-player-package">VIP Tier Package</label>
              <select id="edit-player-package" class="form-control-admin">
                <option value="free">Free Player</option>
                <option value="silver">Silver Tier</option>
                <option value="gold">Gold Tier</option>
                <option value="vip_oba">👑 VIP Oba</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:8px;">
            <div class="form-group-admin">
              <label for="edit-player-verified">Email Verification Status</label>
              <select id="edit-player-verified" class="form-control-admin">
                <option value="1">✓ Verified Player</option>
                <option value="0">✕ Unverified</option>
              </select>
            </div>
            <div class="form-group-admin">
              <label for="edit-player-banned">Account Access</label>
              <select id="edit-player-banned" class="form-control-admin" onchange="adminApp.onBanStatusChange(this.value)">
                <option value="0">🟢 Active (Permitted)</option>
                <option value="1">🔴 Banned (Restricted)</option>
              </select>
            </div>
          </div>

          <div class="form-group-admin" id="edit-player-ban-reason-group" style="display:none;">
            <label for="edit-player-ban-reason">Reason for Ban</label>
            <input type="text" id="edit-player-ban-reason" class="form-control-admin" placeholder="e.g. Fair play violation / multi-accounting">
          </div>
        </div>
        <div class="admin-modal-footer" style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn-admin btn-admin-secondary" style="font-size:0.78rem; padding:6px 10px;" onclick="adminApp.quickPromoteFromEditModal()">
              ⭐ Promote to Staff
            </button>
            <button type="button" class="btn-admin btn-admin-secondary" style="font-size:0.78rem; padding:6px 10px;" onclick="adminApp.quickResetPasswordFromEditModal()">
              🔑 Reset Pass
            </button>
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.closeModal('modal-edit-player')">Cancel</button>
            <button type="submit" class="btn-admin btn-admin-primary">Save Profile &rarr;</button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 4: Manual Balance Adjustment -->
  <div class="admin-modal-backdrop" id="modal-manual-balance">
    <div class="admin-modal-box">
      <div class="admin-modal-header">
        <h3>💰 Manual Player Balance Adjustment</h3>
        <button type="button" class="btn-close-modal" onclick="adminApp.closeModal('modal-manual-balance')">&times;</button>
      </div>
      <form id="form-manual-balance" onsubmit="adminApp.handleManualBalanceSubmit(event)">
        <div class="admin-modal-body">
          <div class="form-group-admin">
            <label for="manual-player-select">Target Player</label>
            <select id="manual-player-select" class="form-control-admin" required>
              <option value="">Select player from directory...</option>
            </select>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group-admin">
              <label for="manual-naira-amount">Naira Adjustment (₦) (+ or -)</label>
              <input type="number" id="manual-naira-amount" class="form-control-admin" step="100" placeholder="e.g. 5000 or -1000">
            </div>
            <div class="form-group-admin">
              <label for="manual-coins-amount">Coins Adjustment (🪙)</label>
              <input type="number" id="manual-coins-amount" class="form-control-admin" step="50" placeholder="e.g. 250 or -50">
            </div>
          </div>
          <div class="form-group-admin">
            <label for="manual-adj-reason">Mandatory Audit Note / Reason</label>
            <input type="text" id="manual-adj-reason" class="form-control-admin" placeholder="e.g. Promotional tournament bonus / payment resolution" required>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.closeModal('modal-manual-balance')">Cancel</button>
          <button type="submit" class="btn-admin btn-admin-primary">Post Adjustment &rarr;</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 5: Reject Bank Withdrawal -->
  <div class="admin-modal-backdrop" id="modal-reject-withdrawal">
    <div class="admin-modal-box">
      <div class="admin-modal-header">
        <h3>✕ Reject Withdrawal & Issue Refund</h3>
        <button type="button" class="btn-close-modal" onclick="adminApp.closeModal('modal-reject-withdrawal')">&times;</button>
      </div>
      <form id="form-reject-withdrawal" onsubmit="adminApp.handleRejectWithdrawalSubmit(event)">
        <input type="hidden" id="reject-tx-id">
        <div class="admin-modal-body">
          <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:14px;">
            Rejecting this payout will cancel the request and <strong>automatically refund the full cash amount</strong> back into the player's wallet balance.
          </p>
          <div class="form-group-admin">
            <label for="reject-reason">Reason for Rejection</label>
            <input type="text" id="reject-reason" class="form-control-admin" placeholder="e.g. Invalid bank account name / Incorrect NUBAN" required>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.closeModal('modal-reject-withdrawal')">Cancel</button>
          <button type="submit" class="btn-admin btn-admin-danger">Confirm Rejection & Refund</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 6: Host Official Tournament -->
  <div class="admin-modal-backdrop" id="modal-create-tournament">
    <div class="admin-modal-box">
      <div class="admin-modal-header">
        <h3>🏆 Host Official Championship Cup</h3>
        <button type="button" class="btn-close-modal" onclick="adminApp.closeModal('modal-create-tournament')">&times;</button>
      </div>
      <form id="form-create-tournament" onsubmit="adminApp.handleCreateTournamentSubmit(event)">
        <div class="admin-modal-body">
          <div class="form-group-admin">
            <label for="tourn-name">Championship Title</label>
            <input type="text" id="tourn-name" class="form-control-admin" placeholder="e.g. Lagos Island Grandmaster Invitational" required>
          </div>
          <div class="form-group-admin">
            <label for="tourn-tagline">Tagline / Motto</label>
            <input type="text" id="tourn-tagline" class="form-control-admin" placeholder="Official Knockout Bracket">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group-admin">
              <label for="tourn-prize-naira">Cash Prize Pool (₦)</label>
              <input type="number" id="tourn-prize-naira" class="form-control-admin" placeholder="e.g. 50000" min="0" step="1000" required>
            </div>
            <div class="form-group-admin">
              <label for="tourn-entry-naira">Cash Entry Fee (₦)</label>
              <input type="number" id="tourn-entry-naira" class="form-control-admin" placeholder="e.g. 1000" min="0" step="100" required>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group-admin">
              <label for="tourn-entry-coins">Coins Entry Fee (🪙)</label>
              <input type="number" id="tourn-entry-coins" class="form-control-admin" placeholder="0" min="0" value="0">
            </div>
            <div class="form-group-admin">
              <label for="tourn-bracket-size">Knockout Bracket Size</label>
              <select id="tourn-bracket-size" class="form-control-admin">
                <option value="8">8 Players (Quarterfinals Knockout)</option>
              </select>
            </div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button type="button" class="btn-admin btn-admin-secondary" onclick="adminApp.closeModal('modal-create-tournament')">Cancel</button>
          <button type="submit" class="btn-admin btn-admin-primary">Launch Tournament & Open Registration</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div class="admin-toast-container" id="admin-toast-container"></div>

  <script src="js/admin.js"></script>
</body>
</html>
