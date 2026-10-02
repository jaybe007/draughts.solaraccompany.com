/**
 * Nigerian Draughts - Champion Dashboard Client Logic
 * Handles interactive tabs, picture upload, live lobby filters, 1-click random matchmaking,
 * direct messaging, game invitations, wallet transactions & package upgrades.
 */

let currentLobbyFilter = 'all_games';
let currentTournamentFilter = 'all';
let activeConversationPeer = null;
let pollInterval = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupDropdowns();
  setupAvatarUpload();
  loadLobbyGames(currentLobbyFilter);
  loadUnreadCounters();
  loadWalletSummary();
  loadTournamentsList();
  checkPaymentReturnCallback();

  // Check URL parameters or hash for deep linking (e.g. ?tab=tournaments&filter=new)
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || urlParams.get('view');
  const initialFilter = urlParams.get('filter');
  if (initialTab && ['lobby', 'messages', 'invitations', 'followings', 'wallet', 'tournaments'].includes(initialTab)) {
    activateMainTab(initialTab);
    if (initialTab === 'tournaments' && initialFilter) {
      switchTournamentFilter(initialFilter);
    }
  } else if (window.location.hash) {
    const hashTab = window.location.hash.replace('#', '').replace('panel-', '');
    if (['lobby', 'messages', 'invitations', 'followings', 'wallet', 'tournaments'].includes(hashTab)) {
      activateMainTab(hashTab);
    }
  }

  // Periodic updates every 6 seconds for live state
  pollInterval = setInterval(() => {
    loadUnreadCounters();
    if (document.getElementById('panel-lobby')?.classList.contains('active')) {
      loadLobbyGames(currentLobbyFilter, true);
    }
  }, 6000);
});

// ================= MOBILE NAVIGATION TOGGLE & DROPDOWN BEHAVIOR ================= //
function toggleMobileNav() {
  const nav = document.getElementById('dash-main-nav');
  const btn = document.getElementById('btn-mobile-nav');
  if (!nav) return;
  const isOpen = nav.classList.toggle('mobile-open');
  if (btn) btn.classList.toggle('active', isOpen);
}

function closeAllDropdowns() {
  document.querySelectorAll('.nav-dropdown-item').forEach(item => item.classList.remove('open'));
  const nav = document.getElementById('dash-main-nav');
  const toggleBtn = document.getElementById('btn-mobile-nav');
  if (nav && nav.classList.contains('mobile-open')) {
    nav.classList.remove('mobile-open');
    toggleBtn?.classList.remove('active');
  }
}

function setupDropdowns() {
  // Toggle dropdown on header button click
  document.querySelectorAll('.dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.nav-dropdown-item');
      const wasOpen = parent ? parent.classList.contains('open') : false;
      
      // Close all other dropdowns
      document.querySelectorAll('.nav-dropdown-item').forEach(item => item.classList.remove('open'));
      
      if (!wasOpen && parent) {
        parent.classList.add('open');
      }
    });
  });

  // Close dropdowns immediately when any dropdown link or item is clicked
  document.querySelectorAll('.dropdown-menu .dropdown-link, .dropdown-menu button, .dropdown-menu a').forEach(link => {
    link.addEventListener('click', () => {
      closeAllDropdowns();
    });
  });

  // Close dropdowns & mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown-item')) {
      document.querySelectorAll('.nav-dropdown-item').forEach(item => item.classList.remove('open'));
    }
    const nav = document.getElementById('dash-main-nav');
    const toggleBtn = document.getElementById('btn-mobile-nav');
    if (nav && nav.classList.contains('mobile-open')) {
      if (!nav.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
        nav.classList.remove('mobile-open');
        toggleBtn?.classList.remove('active');
      }
    }
  });

  // Auto-close mobile nav when any navigation action button/link is clicked
  document.querySelectorAll('.dash-nav-links .dropdown-link, .dash-nav-links .dash-nav-btn:not(.dropdown-toggle), .dash-nav-links .nav-wallet-pill').forEach(el => {
    el.addEventListener('click', () => {
      closeAllDropdowns();
    });
  });
}

// Navigation direct action helper for tournaments menu
function navToTournament(action) {
  closeAllDropdowns();
  activateMainTab('tournaments');

  if (action === 'create') {
    openHostTournamentModal();
  } else if (action === 'guide') {
    openTournamentGuideModal();
  } else {
    // action is 'all', 'new', 'started', 'over', 'most_viewed'
    switchTournamentFilter(action);
  }

  // Smooth scroll to tournament layout
  setTimeout(() => {
    const target = document.getElementById('panel-tournaments');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

// ================= TAB MANAGEMENT ================= //
function activateMainTab(tabName) {
  // Update Tab Buttons
  document.querySelectorAll('.dash-tab-btn').forEach(btn => {
    const isActive = btn.dataset.tab === tabName;
    btn.classList.toggle('active', isActive);
  });

  // Update Panels
  document.querySelectorAll('.dash-tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${tabName}`);
  });

  // Load contextual data
  if (tabName === 'lobby') {
    loadLobbyGames(currentLobbyFilter);
  } else if (tabName === 'messages') {
    loadMessagesInbox();
  } else if (tabName === 'invitations') {
    loadInvitations();
  } else if (tabName === 'followings') {
    loadFollowings();
  } else if (tabName === 'wallet') {
    loadWalletSummary();
  } else if (tabName === 'tournaments') {
    loadTournamentsList(currentTournamentFilter);
  }

  // Smoothly scroll active tab button into view on mobile
  const activeBtn = document.querySelector(`.dash-tab-btn[data-tab="${tabName}"]`);
  if (activeBtn) {
    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }
}

// ================= AVATAR PICTURE UPLOAD ================= //
function setupAvatarUpload() {
  const fileInput = document.getElementById('avatar-file-input');
  const triggerBtn = document.getElementById('btn-trigger-upload');
  const container = document.getElementById('avatar-container');
  const statusDiv = document.getElementById('upload-status');

  if (!fileInput) return;

  const openPicker = () => fileInput.click();
  if (triggerBtn) triggerBtn.addEventListener('click', openPicker);
  if (container) container.addEventListener('click', openPicker);

  fileInput.addEventListener('change', async () => {
    if (!fileInput.files || fileInput.files.length === 0) return;

    const file = fileInput.files[0];
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file exceeds 5MB limit. Please choose a smaller picture.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('action', 'upload_avatar');

    statusDiv.textContent = 'Uploading picture...';
    statusDiv.className = 'upload-status-text uploading';

    try {
      const res = await fetch('api/profile.php?action=upload_avatar', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success && data.avatar_url) {
        statusDiv.textContent = 'Picture updated!';
        statusDiv.className = 'upload-status-text success';

        // Update avatar image in DOM
        let img = document.getElementById('user-avatar-img');
        const placeholder = document.getElementById('avatar-placeholder-crown');
        if (placeholder) {
          placeholder.remove();
        }
        if (!img) {
          img = document.createElement('img');
          img.id = 'user-avatar-img';
          img.className = 'avatar-img';
          img.alt = 'Champion Avatar';
          container.insertBefore(img, container.firstChild);
        }
        // Append cache buster
        img.src = data.avatar_url + '?t=' + Date.now();

        showToast('Champion profile picture updated successfully!', 'success');
        setTimeout(() => { statusDiv.textContent = ''; }, 3000);
      } else {
        statusDiv.textContent = data.message || 'Upload failed.';
        statusDiv.className = 'upload-status-text error';
        showToast(data.message || 'Upload failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      statusDiv.textContent = 'Network upload error.';
      statusDiv.className = 'upload-status-text error';
      showToast('Error uploading picture. Please check network.', 'error');
    }
  });
}

// Copy Player ID Helper
function copyPlayerId(idText) {
  navigator.clipboard.writeText(idText).then(() => {
    showToast(`Player ID ${idText} copied to clipboard!`, 'success');
  }).catch(() => {
    showToast(`Player ID: ${idText}`, 'info');
  });
}

// ================= GAME CENTER LOBBY ================= //
function switchGameLobbyFilter(filterKey) {
  currentLobbyFilter = filterKey;
  activateMainTab('lobby');

  document.querySelectorAll('#panel-lobby .filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.filter === filterKey);
  });

  loadLobbyGames(filterKey);
}

function reloadLobbyGames() {
  loadLobbyGames(currentLobbyFilter);
  showToast('Lobby games refreshed', 'info');
}

async function loadLobbyGames(filterKey, silent = false) {
  const tbody = document.getElementById('lobby-table-body');
  if (!tbody) return;

  if (!silent) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center">Loading ${filterKey.replace('_', ' ')}...</td></tr>`;
  }

  try {
    const res = await fetch(`api/rooms.php?action=list_games&filter=${encodeURIComponent(filterKey)}`);
    const data = await res.json();

    if (!data.success || !data.games || data.games.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center empty-lobby-msg">
            <p>No games currently found in this category.</p>
            <button type="button" class="btn btn-primary btn-small" onclick="triggerRandomOpponentMatch()" style="margin-top: 8px;">
              ⚡ Start Random Match Now
            </button>
            <button type="button" class="btn btn-secondary btn-small" onclick="openCreateGameModal()" style="margin-top: 8px;">
              ➕ Create Room
            </button>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = data.games.map(game => {
      const typeLabel = formatGameType(game.game_type);
      const timeLabel = formatTimeControl(game.time_control);
      const wagerLabel = game.wager_coins > 0 ? `${game.wager_coins} 🪙` : 'Free';
      const statusBadge = formatStatusBadge(game.status);
      const actionBtn = formatGameAction(game);

      return `
        <tr>
          <td><strong class="code-tag">${escapeHtml(game.room_code)}</strong></td>
          <td>${typeLabel}</td>
          <td><strong>${escapeHtml(game.host_name || 'Champion 1')}</strong></td>
          <td>${escapeHtml(game.guest_name || '⏳ Waiting...')}</td>
          <td>${timeLabel}</td>
          <td><span class="wager-tag">${wagerLabel}</span></td>
          <td>${statusBadge}</td>
          <td>${actionBtn}</td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    console.error(err);
    if (!silent) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center error-text">Failed to load games. Check server connection.</td></tr>`;
    }
  }
}

function formatGameType(type) {
  switch (type) {
    case 'p2p': return '<span class="badge-type p2p">⚔️ P2P Wager</span>';
    case 'tournament': return '<span class="badge-type tourn">🏆 Tournament</span>';
    case 'daily_challenge': return '<span class="badge-type daily">🎯 Daily Game</span>';
    default: return '<span class="badge-type std">Friendly</span>';
  }
}

function formatTimeControl(tc) {
  switch (tc) {
    case 'blitz_3': return '3 Min Blitz';
    case 'classical_10': return '10 Min Classic';
    default: return '5 Min Rapid';
  }
}

function formatStatusBadge(status) {
  switch (status) {
    case 'waiting': return '<span class="status-badge waiting">⏳ Awaiting</span>';
    case 'active': return '<span class="status-badge active">🔴 Live</span>';
    case 'finished': return '<span class="status-badge finished">🏁 Finished</span>';
    default: return `<span class="status-badge">${status}</span>`;
  }
}

function formatGameAction(game) {
  if (game.status === 'waiting') {
    return `<a href="game.php?room_code=${encodeURIComponent(game.room_code)}&role=p2" class="btn btn-primary btn-mini">Join Match &rarr;</a>`;
  } else if (game.status === 'active') {
    return `<a href="game.php?room_code=${encodeURIComponent(game.room_code)}&mode=spectator" class="btn btn-secondary btn-mini">Watch Live 👁️</a>`;
  } else {
    return `<a href="game.php?room_code=${encodeURIComponent(game.room_code)}&mode=replay" class="btn btn-secondary btn-mini">Replay 🔁</a>`;
  }
}

// ================= RANDOM OPPONENT AUTO MATCHMAKING ================= //
async function triggerRandomOpponentMatch() {
  showToast('⚡ Searching for available Nigerian Draughts champion...', 'info');

  try {
    const res = await fetch('api/rooms.php?action=random_match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time_control: 'rapid_5' })
    });
    const data = await res.json();

    if (data.success && data.room_code) {
      if (data.matched) {
        showToast('🎯 Match found! Launching board...', 'success');
      } else {
        showToast('Room created! Entering arena to await opponent...', 'info');
      }
      setTimeout(() => {
        const assignedRole = data.player_role || (data.matched ? 'p2' : 'p1');
        window.location.href = `game.php?room_code=${encodeURIComponent(data.room_code)}&role=${encodeURIComponent(assignedRole)}`;
      }, 700);
    } else {
      showToast(data.message || 'Matchmaking error. Please try again.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error while pairing match.', 'error');
  }
}

// ================= CREATE GAME MODAL ================= //
function openCreateGameModal() {
  const savedTheme = localStorage.getItem('draughts_board_theme');
  const sel = document.getElementById('create-board-type');
  if (savedTheme && sel) sel.value = savedTheme;
  openModal('modal-create-game');
}

function selectCreateGameType(type) {
  const hiddenInput = document.getElementById('create-game-type');
  if (hiddenInput) hiddenInput.value = type;

  const btn1p = document.getElementById('btn-type-1p');
  const btn2p = document.getElementById('btn-type-2p');
  if (btn1p && btn2p) {
    btn1p.classList.toggle('active', type === '1p');
    btn2p.classList.toggle('active', type === '2p');
  }

  const diffWrap = document.getElementById('create-ai-difficulty-wrap');
  if (diffWrap) {
    diffWrap.style.display = type === '1p' ? 'block' : 'none';
  }
}

function handleCoinsDropdownChange(val) {
  const customWrap = document.getElementById('create-custom-coins-wrap');
  if (customWrap) {
    if (val === 'custom') {
      customWrap.style.display = 'block';
      const input = document.getElementById('create-custom-coins-val');
      if (input) input.focus();
    } else {
      customWrap.style.display = 'none';
    }
  }
}

async function handleCreateGameSubmit(e) {
  e.preventDefault();

  const gameType = (document.getElementById('create-game-type') ? document.getElementById('create-game-type').value : '1p');
  const ruleType = document.getElementById('create-rule-type') ? document.getElementById('create-rule-type').value : 'nigeria';
  
  // Coins calculation
  const coinsSelect = document.getElementById('create-coins-required');
  let wagerCoins = 0;
  if (coinsSelect) {
    if (coinsSelect.value === 'custom') {
      const customVal = parseInt(document.getElementById('create-custom-coins-val').value, 10);
      if (isNaN(customVal) || customVal < 1) {
        showToast('Please specify a valid custom coin amount (minimum 1 coin).', 'error');
        return;
      }
      wagerCoins = customVal;
    } else if (coinsSelect.value !== 'free') {
      wagerCoins = parseInt(coinsSelect.value, 10) || 0;
    }
  }

  const playerTime = document.getElementById('create-player-time') ? document.getElementById('create-player-time').value : '5';
  const p1Short = document.getElementById('create-p1-short') ? (parseInt(document.getElementById('create-p1-short').value, 10) || 0) : 0;
  const modifications = document.getElementById('create-modifications') ? document.getElementById('create-modifications').value : 'none';
  const boardType = document.getElementById('create-board-type') ? document.getElementById('create-board-type').value : 'default';
  try { localStorage.setItem('draughts_board_theme', boardType); } catch (e) {}

  // 7 ON/OFF Toggles
  const settings = {
    undo_allowed: document.getElementById('toggle-undo-allowed') ? document.getElementById('toggle-undo-allowed').checked : true,
    private_game: document.getElementById('toggle-private-game') ? document.getElementById('toggle-private-game').checked : false,
    to_win: document.getElementById('toggle-to-win') ? document.getElementById('toggle-to-win').checked : true,
    disable_chat: document.getElementById('toggle-disable-chat') ? document.getElementById('toggle-disable-chat').checked : false,
    sound_on: document.getElementById('toggle-sound-on') ? document.getElementById('toggle-sound-on').checked : true,
    highlight_moves: document.getElementById('toggle-highlight-moves') ? document.getElementById('toggle-highlight-moves').checked : true,
    analysis_mode: document.getElementById('toggle-analysis-mode') ? document.getElementById('toggle-analysis-mode').checked : false
  };

  if (gameType === '1p') {
    const aiDifficulty = document.getElementById('create-ai-difficulty') ? document.getElementById('create-ai-difficulty').value : 'expert';
    // 1 Player - Launch directly in game.php with complete configuration parameters
    const params = new URLSearchParams({
      mode: 'pve',
      diff: aiDifficulty,
      rules: ruleType,
      time: playerTime,
      short: p1Short,
      mod: modifications,
      theme: boardType,
      coins: wagerCoins,
      undo: settings.undo_allowed ? '1' : '0',
      towin: settings.to_win ? '1' : '0',
      chat: settings.disable_chat ? '0' : '1',
      sound: settings.sound_on ? '1' : '0',
      highlight: settings.highlight_moves ? '1' : '0',
      analysis: settings.analysis_mode ? '1' : '0'
    });

    closeModal('modal-create-game');
    showToast('Launching 1-Player Draughts match...', 'success');
    setTimeout(() => {
      window.location.href = `game.php?${params.toString()}`;
    }, 400);
    return;
  }

  // 2 Player - Online Room Creation via backend API
  let timeIncrement = 0;
  if (modifications === 'inc_1s') timeIncrement = 1;
  else if (modifications === 'inc_3s') timeIncrement = 3;
  else if (modifications === 'inc_5s') timeIncrement = 5;

  try {
    const res = await fetch('api/rooms.php?action=create_room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        game_type: wagerCoins > 0 ? 'p2p' : 'standard',
        rule_type: ruleType,
        rule_mode: (ruleType === 'international') ? 'tournament' : ((ruleType === 'ghana') ? 'ghana' : 'nigerian'),
        player_time: playerTime,
        time_increment: timeIncrement,
        p1_short: p1Short,
        modifications: modifications,
        board_type: boardType,
        wager_coins: wagerCoins,
        is_private: settings.private_game ? 1 : 0,
        settings: settings
      })
    });
    const data = await res.json();

    if (data.success && data.room_code) {
      closeModal('modal-create-game');
      showToast(`Match room ${data.room_code} created! Launching arena...`, 'success');
      setTimeout(() => {
        window.location.href = `game.php?room=${encodeURIComponent(data.room_code)}&role=p1&rules=${encodeURIComponent(ruleType)}&mod=${encodeURIComponent(modifications)}&time=${encodeURIComponent(playerTime)}&short=${encodeURIComponent(p1Short)}&theme=${encodeURIComponent(boardType)}`;
      }, 500);
    } else {
      showToast(data.message || 'Failed to create game room.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error creating game room.', 'error');
  }
}

// ================= MESSAGES INBOX ================= //
async function loadMessagesInbox() {
  const threadsList = document.getElementById('msg-threads-list');
  if (!threadsList) return;

  threadsList.innerHTML = '<div class="empty-state">Loading messages...</div>';

  try {
    const res = await fetch('api/messages.php?action=get_inbox');
    const data = await res.json();

    if (!data.success || !data.inbox || data.inbox.length === 0) {
      threadsList.innerHTML = '<div class="empty-state">No messages yet. Send a direct challenge or chat with a player!</div>';
      return;
    }

    threadsList.innerHTML = data.inbox.map(item => {
      const peerId = item.peer_id;
      const peerName = escapeHtml(item.peer_name || 'Champion');
      const snippet = escapeHtml(item.last_message || '');
      const unreadCount = item.unread_count || 0;

      return `
        <div class="msg-thread-item ${activeConversationPeer == peerId ? 'active' : ''}" onclick="openConversation(${peerId}, '${peerName}')">
          <div class="thread-avatar">👑</div>
          <div class="thread-info">
            <div class="thread-title">
              <strong>${peerName}</strong>
              <small class="thread-time">${item.last_timestamp || ''}</small>
            </div>
            <div class="thread-snippet">${snippet}</div>
          </div>
          ${unreadCount > 0 ? `<span class="thread-unread-tag">${unreadCount}</span>` : ''}
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error(err);
    threadsList.innerHTML = '<div class="empty-state error-text">Failed to load inbox.</div>';
  }
}

async function openConversation(peerId, peerName) {
  activeConversationPeer = peerId;
  const header = document.getElementById('active-peer-name');
  if (header) header.textContent = `Chat with ${peerName}`;

  // Highlight thread
  document.querySelectorAll('.msg-thread-item').forEach(el => el.classList.remove('active'));

  const bubblesBox = document.getElementById('msg-bubbles-box');
  bubblesBox.innerHTML = '<div class="empty-state">Loading conversation...</div>';

  try {
    const res = await fetch(`api/messages.php?action=get_messages&peer_id=${peerId}`);
    const data = await res.json();

    if (!data.success || !data.messages || data.messages.length === 0) {
      bubblesBox.innerHTML = `<div class="msg-welcome-note">Start the conversation with ${escapeHtml(peerName)}! Type below.</div>`;
      return;
    }

    const currentUserId = parseInt(document.body.dataset.userId, 10);
    bubblesBox.innerHTML = data.messages.map(m => {
      const isMine = (m.sender_id == currentUserId);
      return `
        <div class="msg-bubble-wrap ${isMine ? 'mine' : 'theirs'}">
          <div class="msg-bubble">
            <div class="bubble-text">${escapeHtml(m.message)}</div>
            <div class="bubble-time">${m.created_at || ''}</div>
          </div>
        </div>
      `;
    }).join('');

    bubblesBox.scrollTop = bubblesBox.scrollHeight;
    loadUnreadCounters();

  } catch (err) {
    console.error(err);
    bubblesBox.innerHTML = '<div class="empty-state error-text">Failed to load messages.</div>';
  }
}

async function handleSendMessage(e) {
  e.preventDefault();
  const input = document.getElementById('msg-text-input');
  const text = input.value.trim();
  if (!text || !activeConversationPeer) return;

  input.value = '';

  try {
    const res = await fetch('api/messages.php?action=send_message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient_id: activeConversationPeer,
        message: text
      })
    });
    const data = await res.json();

    if (data.success) {
      // Reload current conversation
      openConversation(activeConversationPeer, document.getElementById('active-peer-name').textContent.replace('Chat with ', ''));
      loadMessagesInbox();
    } else {
      showToast(data.message || 'Failed to send message.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error sending message.', 'error');
  }
}

function openNewMessageModal() {
  openModal('modal-new-message');
}

async function handleStartNewConversation(e) {
  e.preventDefault();
  const peerIdentifier = document.getElementById('new-msg-peer').value.trim();
  const text = document.getElementById('new-msg-text').value.trim();

  if (!peerIdentifier || !text) return;

  try {
    const res = await fetch('api/messages.php?action=send_message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient_identifier: peerIdentifier,
        message: text
      })
    });
    const data = await res.json();

    if (data.success) {
      closeModal('modal-new-message');
      showToast('Message sent successfully!', 'success');
      activateMainTab('messages');
      loadMessagesInbox();
    } else {
      showToast(data.message || 'Player not found or error sending.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error.', 'error');
  }
}

// ================= INVITATIONS & CHALLENGES ================= //
async function loadInvitations() {
  const recvList = document.getElementById('received-invitations-list');
  const sentList = document.getElementById('sent-invitations-list');

  try {
    const res = await fetch('api/invitations.php?action=get_invitations');
    const data = await res.json();

    if (data.success) {
      // Received
      if (!data.received || data.received.length === 0) {
        recvList.innerHTML = '<div class="empty-state">No pending challenges received.</div>';
        document.getElementById('pending-invites-count').textContent = '0 Pending';
      } else {
        document.getElementById('pending-invites-count').textContent = `${data.received.length} Pending`;
        recvList.innerHTML = data.received.map(inv => `
          <div class="inv-item">
            <div class="inv-info">
              <strong>${escapeHtml(inv.sender_name)}</strong> (Rating: ${inv.sender_rating || 1200})
              <div class="inv-sub">Wager: ${inv.wager_coins > 0 ? `${inv.wager_coins} Coins 🪙` : 'Friendly'} • ${formatTimeControl(inv.time_control)}</div>
            </div>
            <div class="inv-actions">
              <button type="button" class="btn btn-primary btn-mini" onclick="respondInvitation(${inv.id}, 'accepted')">Accept & Play</button>
              <button type="button" class="btn btn-secondary btn-mini" onclick="respondInvitation(${inv.id}, 'declined')">Decline</button>
            </div>
          </div>
        `).join('');
      }

      // Sent
      if (!data.sent || data.sent.length === 0) {
        sentList.innerHTML = '<div class="empty-state">No active outgoing challenges.</div>';
      } else {
        sentList.innerHTML = data.sent.map(inv => `
          <div class="inv-item">
            <div class="inv-info">
              To: <strong>${escapeHtml(inv.recipient_name || inv.receiver_name || 'Player')}</strong>
              <div class="inv-sub">Status: <em>${inv.status}</em> • Wager: ${inv.wager_coins} 🪙</div>
            </div>
            ${inv.status === 'pending' ? `<button type="button" class="btn btn-secondary btn-mini" onclick="cancelInvitation(${inv.id})">Cancel</button>` : ''}
          </div>
        `).join('');
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function respondInvitation(inviteId, status) {
  try {
    const res = await fetch('api/invitations.php?action=respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitation_id: inviteId, status })
    });
    const data = await res.json();

    if (data.success) {
      if (status === 'accepted' && data.room_code) {
        showToast('Challenge accepted! Entering battle arena...', 'success');
        setTimeout(() => {
          window.location.href = `game.php?room_code=${encodeURIComponent(data.room_code)}&role=p2`;
        }, 600);
      } else {
        showToast('Invitation declined.', 'info');
        loadInvitations();
        loadUnreadCounters();
      }
    } else {
      showToast(data.message || 'Action failed.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error.', 'error');
  }
}

async function cancelInvitation(inviteId) {
  if (!confirm('Are you sure you want to cancel this challenge?')) return;
  try {
    const res = await fetch('api/invitations.php?action=cancel_invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitation_id: inviteId })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Challenge cancelled successfully.', 'info');
      loadInvitations();
      loadWalletData();
    } else {
      showToast(data.message || 'Failed to cancel challenge.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error.', 'error');
  }
}

function openSendChallengeModal() {
  openModal('modal-send-challenge');
}

async function handleSendChallengeSubmit(e) {
  e.preventDefault();
  const target = document.getElementById('challenge-player-id').value.trim();
  const timeControl = document.getElementById('challenge-time-control').value;
  const wager = parseInt(document.getElementById('challenge-wager').value, 10);

  try {
    const res = await fetch('api/invitations.php?action=send_invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient_identifier: target,
        time_control: timeControl,
        wager_coins: wager
      })
    });
    const data = await res.json();

    if (data.success) {
      closeModal('modal-send-challenge');
      showToast('Challenge sent to player successfully!', 'success');
      loadInvitations();
    } else {
      showToast(data.message || 'Could not send challenge.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error.', 'error');
  }
}

// ================= SOCIAL & FOLLOWINGS ================= //
async function loadFollowings() {
  const container = document.getElementById('followings-list');
  if (!container) return;

  container.innerHTML = '<div class="empty-state">Loading followings...</div>';

  try {
    const res = await fetch('api/follows.php?action=get_following');
    const data = await res.json();

    if (!data.success || !data.following || data.following.length === 0) {
      container.innerHTML = '<div class="empty-state">You are not following any players yet.</div>';
      document.getElementById('followings-count').textContent = '0 Following';
      return;
    }

    document.getElementById('followings-count').textContent = `${data.following.length} Following`;
    container.innerHTML = data.following.map(p => `
      <div class="following-card">
        <div class="f-avatar">👑</div>
        <div class="f-info">
          <strong>${escapeHtml(p.username)}</strong>
          <div class="f-meta">${p.rating || 1200} Elo • ${escapeHtml(p.title || 'Street Champion')}</div>
        </div>
        <div class="f-actions">
          <button type="button" class="btn btn-primary btn-mini" onclick="directChallengePlayer('${escapeHtml(p.username)}')">Challenge</button>
          <button type="button" class="btn btn-secondary btn-mini" onclick="directMessagePlayer(${p.id}, '${escapeHtml(p.username)}')">Message</button>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="empty-state error-text">Failed to load followings.</div>';
  }
}

function directChallengePlayer(username) {
  openSendChallengeModal();
  const input = document.getElementById('challenge-player-id');
  if (input) input.value = username;
}

function directMessagePlayer(id, username) {
  activateMainTab('messages');
  openConversation(id, username);
}

// ================= WALLET & MONETIZATION ================= //
function openWalletModal() {
  activateMainTab('wallet');
}


// Note: openDepositModal and openDepositModalWithCurrency are defined in the Multi-Currency Deposit Section below

let currentCoinRates = {
  buy_rate_per_100: 1500,
  buy_rate_per_coin: 15.0,
  sell_rate_per_100: 1350,
  sell_rate_per_coin: 13.5,
  match_commission_percent: 0
};

async function loadCoinRates() {
  try {
    const res = await fetch('api/wallet.php?action=get_coin_rates');
    const data = await res.json();
    if (data.success && data.rates) {
      currentCoinRates = data.rates;
      const dBuy = document.getElementById('dsp-buy-rate');
      const dSell = document.getElementById('dsp-sell-rate');
      if (dBuy) dBuy.textContent = `₦${parseFloat(currentCoinRates.buy_rate_per_100).toLocaleString()} / 100 🪙`;
      if (dSell) dSell.textContent = `₦${parseFloat(currentCoinRates.sell_rate_per_100).toLocaleString()} / 100 🪙`;
      calculateBuyNairaCost();
      calculateSellNairaPayout();
    }
  } catch (e) {
    console.error('Failed to load coin rates:', e);
  }
}

function openCoinBuyModal() {
  loadCoinRates();
  calculateBuyNairaCost();
  calculateSellNairaPayout();
  openModal('modal-buy-coins');
}

function openPackageModal() {
  activateMainTab('wallet');
  document.querySelector('.packages-section')?.scrollIntoView({ behavior: 'smooth' });
}

async function loadWalletSummary() {
  try {
    const res = await fetch('api/wallet.php?action=get_wallet');
    const data = await res.json();

    if (data.success) {
      const w = data.wallet || data;
      const nairaStr = '₦' + parseFloat(w.wallet_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const coinsStr = parseInt(w.coins || 0, 10).toLocaleString('en-US');

      // Update Nav
      const navW = document.getElementById('nav-wallet-val');
      if (navW) navW.textContent = nairaStr;
      const navC = document.getElementById('nav-coins-val');
      if (navC) navC.textContent = coinsStr + ' 🪙';

      // Update Hero
      const heroCoins = document.getElementById('hero-coins-val');
      if (heroCoins) heroCoins.textContent = coinsStr;
      const statWallet = document.getElementById('stat-wallet');
      if (statWallet) statWallet.textContent = nairaStr;

      // Update Wallet Tab
      const cardNaira = document.getElementById('wallet-card-naira');
      if (cardNaira) cardNaira.textContent = nairaStr;
      const cardCoins = document.getElementById('wallet-card-coins');
      if (cardCoins) cardCoins.textContent = coinsStr + ' 🪙';

      const availNaira = document.getElementById('buy-coins-wallet-avail');
      if (availNaira) availNaira.textContent = nairaStr;
      const availCoins = document.getElementById('buy-coins-avail-coins');
      if (availCoins) availCoins.textContent = coinsStr + ' 🪙';

      // Transactions
      const tbody = document.getElementById('trans-table-body');
      if (tbody && data.transactions) {
        if (data.transactions.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" class="text-center">No transactions recorded yet.</td></tr>';
        } else {
          tbody.innerHTML = data.transactions.map(t => {
            const hasAmt = parseFloat(t.amount || 0) !== 0;
            const hasCoins = parseInt(t.coins || 0, 10) !== 0;
            let displayVal = '₦' + parseFloat(t.amount || 0).toFixed(2);
            if (!hasAmt && hasCoins) {
              const c = parseInt(t.coins, 10);
              displayVal = (c > 0 ? '+' : '') + c.toLocaleString() + ' 🪙';
            } else if (hasAmt) {
              const a = parseFloat(t.amount);
              displayVal = (a > 0 ? '+' : '') + '₦' + a.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            return `
              <tr>
                <td>#${t.id}</td>
                <td><span class="badge-type ${t.type}">${t.type}</span></td>
                <td><strong style="color:${parseFloat(t.amount || 0) < 0 || parseInt(t.coins || 0) < 0 ? '#f43f5e' : '#34d399'};">${displayVal}</strong></td>
                <td>₦${parseFloat(t.balance_after || 0).toFixed(2)}</td>
                <td>${escapeHtml(t.description || '')}</td>
                <td>${t.created_at || ''}</td>
              </tr>
            `;
          }).join('');
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

let currentDepositCurrency = 'NGN';
let supportedCurrencies = {
  NGN: { symbol: '₦', rate: 1.0, min: 500, presets: [500, 1000, 2500, 5000, 10000] },
  USD: { symbol: '$', rate: 1500.0, min: 1, presets: [1, 5, 10, 25, 50] },
  GHS: { symbol: 'GH₵', rate: 100.0, min: 15, presets: [15, 50, 100, 250, 500] },
  EUR: { symbol: '€', rate: 1650.0, min: 1, presets: [1, 5, 10, 25, 50] },
  GBP: { symbol: '£', rate: 1950.0, min: 1, presets: [1, 5, 10, 20, 50] },
  KES: { symbol: 'KSh', rate: 12.0, min: 150, presets: [150, 500, 1000, 2500, 5000] }
};

function openDepositModal() {
  switchDepositCurrency(currentDepositCurrency || 'NGN');
  switchDepositTab('cash');
  openModal('modal-deposit');
}

function openDepositModalWithCurrency(currency = 'USD', tab = 'coins') {
  switchDepositCurrency(currency);
  switchDepositTab(tab);
  openModal('modal-deposit');
}

function switchDepositTab(tab) {
  const cashView = document.getElementById('deposit-view-cash');
  const coinsView = document.getElementById('deposit-view-coins');
  const tabCash = document.getElementById('tab-dep-cash');
  const tabCoins = document.getElementById('tab-dep-coins');

  if (tab === 'cash') {
    if (cashView) cashView.style.display = 'block';
    if (coinsView) coinsView.style.display = 'none';
    if (tabCash) { tabCash.style.background = '#10b981'; tabCash.style.color = '#fff'; }
    if (tabCoins) { tabCoins.style.background = 'transparent'; tabCoins.style.color = '#94a3b8'; }
  } else {
    if (cashView) cashView.style.display = 'none';
    if (coinsView) coinsView.style.display = 'block';
    if (tabCash) { tabCash.style.background = 'transparent'; tabCash.style.color = '#94a3b8'; }
    if (tabCoins) { tabCoins.style.background = '#f59e0b'; tabCoins.style.color = '#0f172a'; }
    loadCoinBundles(currentDepositCurrency);
  }
}

function switchDepositCurrency(curr) {
  currentDepositCurrency = curr || 'NGN';
  const cInfo = supportedCurrencies[currentDepositCurrency] || supportedCurrencies.NGN;

  // Update currency pills
  document.querySelectorAll('.btn-currency-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.currency === currentDepositCurrency);
  });

  // Render presets
  const presetsContainer = document.getElementById('deposit-presets-container');
  if (presetsContainer) {
    presetsContainer.innerHTML = cInfo.presets.map((amt, idx) => `
      <button type="button" class="topup-preset-btn ${idx === 1 ? 'active' : ''}" onclick="submitDeposit(${amt}, '${currentDepositCurrency}')">
        ${cInfo.symbol}${amt.toLocaleString()}
      </button>
    `).join('');
  }

  // Update Custom Input
  const customInput = document.getElementById('custom-deposit-amt');
  const customLabel = document.getElementById('label-custom-amt');
  if (customInput) {
    customInput.min = cInfo.min;
    customInput.placeholder = `Min ${cInfo.symbol}${cInfo.min}`;
  }
  if (customLabel) {
    customLabel.textContent = `Or Enter Custom Amount (${cInfo.symbol})`;
  }

  // FX Notice
  const fxNotice = document.getElementById('deposit-fx-notice');
  const fxText = document.getElementById('deposit-fx-text');
  if (fxNotice && fxText) {
    if (currentDepositCurrency === 'NGN') {
      fxNotice.style.display = 'none';
    } else {
      fxNotice.style.display = 'block';
      fxText.textContent = `1 ${currentDepositCurrency} = ₦${cInfo.rate.toLocaleString()}. Your payment will be billed in ${currentDepositCurrency} and converted to Naira/Coins instantly without bank blocks.`;
    }
  }

  // Reload Coin bundles
  loadCoinBundles(currentDepositCurrency);
}

async function loadCoinBundles(currency) {
  const container = document.getElementById('coin-bundles-container');
  if (!container) return;
  try {
    const res = await fetch(`api/wallet.php?action=get_coin_bundles&currency=${encodeURIComponent(currency)}`);
    const data = await res.json();
    if (data.success && data.bundles) {
      container.innerHTML = data.bundles.map(b => `
        <div class="coin-bundle-card" onclick="submitDeposit(${b.price}, '${b.currency}', ${b.total_coins}, '${b.id}')">
          <div class="coin-bundle-badge">${b.badge}</div>
          <div>
            <div style="font-size:1.15rem; font-weight:800; color:#f59e0b; margin-bottom:4px;">
              🪙 ${b.total_coins.toLocaleString()} Coins
            </div>
            <div style="font-size:0.75rem; color:#94a3b8; font-weight:600;">${b.title}</div>
          </div>
          <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:1.05rem; font-weight:800; color:#38bdf8;">${b.formatted_price}</span>
            <span style="background:rgba(16,185,129,0.2); color:#34d399; font-size:0.75rem; font-weight:700; padding:3px 8px; border-radius:6px;">Instant &rarr;</span>
          </div>
        </div>
      `).join('');
    }
  } catch (e) {
    console.error('Failed to load coin bundles:', e);
  }
}

async function checkPaymentReturnCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('payment_ref') || urlParams.get('tx_ref') || urlParams.get('reference') || urlParams.get('trxref');

  if (ref) {
    // Clean URL query params without reloading to prevent double trigger on manual refresh
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    showToast('Verifying payment confirmation, please wait...', 'info');

    try {
      const res = await fetch('api/wallet.php?action=deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: ref, amount: 0 })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Payment confirmed! Funds added to your wallet.', 'success');
        loadWalletSummary();
      } else {
        if (data.message && data.message.includes('already been processed')) {
          showToast('Payment successful! Your wallet is up to date.', 'success');
          loadWalletSummary();
        } else {
          showToast(data.message || 'Payment verification pending. Please check wallet shortly.', 'info');
          loadWalletSummary();
        }
      }
    } catch (e) {
      console.error('Error verifying returned payment:', e);
      loadWalletSummary();
    }
  }
}

let isDepositBusy = false;

async function submitDeposit(amount, currency = 'NGN', coinsToAdd = 0, bundleId = '') {
  if (isDepositBusy) return;
  isDepositBusy = true;
  showToast('Connecting to payment gateway...', 'info');

  try {
    const initRes = await fetch('api/wallet.php?action=init_deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency, coins: coinsToAdd, bundle_id: bundleId })
    });
    const initData = await initRes.json();

    if (!initData.success) {
      showToast(initData.message || 'Deposit initialization failed.', 'error');
      isDepositBusy = false;
      return;
    }

    if (initData.authorization_url) {
      window.location.href = initData.authorization_url;
      return;
    }

    // Dev mode / Instant simulation
    const res = await fetch('api/wallet.php?action=deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency,
        reference: initData.reference,
        channel: `${currency} Card/Flutterwave Simulator`,
        coins: coinsToAdd,
        bundle_id: bundleId
      })
    });
    const data = await res.json();

    if (data.success) {
      closeModal('modal-deposit');
      showToast(data.message || `Deposit successful!`, 'success');
      loadWalletSummary();
    } else {
      showToast(data.message || 'Deposit failed.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error on deposit.', 'error');
  } finally {
    isDepositBusy = false;
  }
}

function handleCustomDeposit(e) {
  e.preventDefault();
  const amt = parseFloat(document.getElementById('custom-deposit-amt').value);
  const cInfo = supportedCurrencies[currentDepositCurrency] || supportedCurrencies.NGN;
  if (amt >= cInfo.min) {
    submitDeposit(amt, currentDepositCurrency);
  } else {
    showToast(`Minimum deposit is ${cInfo.symbol}${cInfo.min}.`, 'error');
  }
}

function openWithdrawModal() {
  switchWithdrawChannel('nigerian_bank');
  openModal('modal-withdraw');
}

function switchWithdrawChannel(channel) {
  const channels = ['nigerian_bank', 'usdt_crypto', 'ghana_momo', 'kenya_mpesa', 'paypal'];
  channels.forEach(ch => {
    const el = document.getElementById(`channel-fields-${ch}`);
    if (el) el.style.display = (ch === channel) ? 'block' : 'none';
  });
  updateWithdrawEstimate();
}

function updateWithdrawEstimate() {
  const amt = parseFloat(document.getElementById('withdraw-amt')?.value) || 0;
  const channel = document.getElementById('withdraw-channel-type')?.value || 'nigerian_bank';
  const box = document.getElementById('withdraw-estimate-box');
  const val = document.getElementById('withdraw-estimate-val');

  if (!box || !val) return;

  if (amt < 1000 || channel === 'nigerian_bank') {
    box.style.display = 'none';
    return;
  }

  box.style.display = 'block';
  if (channel === 'usdt_crypto') {
    const usdt = (amt / 1500.0).toFixed(2);
    val.textContent = `~${usdt} USDT (at ₦1,500/$) • Instant TRC-20 Payout`;
  } else if (channel === 'ghana_momo') {
    const ghs = (amt / 100.0).toFixed(2);
    val.textContent = `~GH₵${ghs} (at ₦100/GH₵) • Direct to Mobile Money`;
  } else if (channel === 'kenya_mpesa') {
    const kes = (amt / 12.0).toFixed(2);
    val.textContent = `~KSh${kes} (at ₦12/KSh) • Direct to M-Pesa`;
  } else if (channel === 'paypal') {
    const usd = (amt / 1500.0).toFixed(2);
    val.textContent = `~$${usd} USD • Transfer to PayPal email`;
  }
}

async function handleWithdrawalSubmit(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('withdraw-amt').value);
  const channelType = document.getElementById('withdraw-channel-type').value;

  if (amount < 1000) {
    showToast('Minimum withdrawal is ₦1,000.', 'error');
    return;
  }

  const payload = { amount, channel_type: channelType };

  if (channelType === 'nigerian_bank') {
    const bankVal = document.getElementById('withdraw-bank').value;
    const accountNumber = document.getElementById('withdraw-account-num').value.trim();
    const accountName = document.getElementById('withdraw-account-name').value.trim();
    if (!bankVal) { showToast('Please select your destination bank.', 'error'); return; }
    if (accountNumber.length !== 10) { showToast('Account number must be 10 digits.', 'error'); return; }
    const [bankCode, bankName] = bankVal.split('|');
    payload.bank_code = bankCode;
    payload.bank_name = bankName;
    payload.account_number = accountNumber;
    payload.account_name = accountName;
  } else if (channelType === 'usdt_crypto') {
    const address = document.getElementById('withdraw-usdt-address').value.trim();
    const network = document.getElementById('withdraw-usdt-network').value;
    if (!address || address.length < 20) { showToast('Please enter a valid USDT address.', 'error'); return; }
    payload.wallet_address = address;
    payload.network = network;
  } else if (channelType === 'ghana_momo') {
    const num = document.getElementById('withdraw-momo-number').value.trim();
    const network = document.getElementById('withdraw-momo-network').value;
    if (!num || num.length < 9) { showToast('Please enter a valid Ghana MoMo number.', 'error'); return; }
    payload.momo_number = num;
    payload.momo_network = network;
  } else if (channelType === 'kenya_mpesa') {
    const num = document.getElementById('withdraw-mpesa-number').value.trim();
    if (!num || num.length < 9) { showToast('Please enter a valid M-Pesa number.', 'error'); return; }
    payload.mpesa_number = num;
  } else if (channelType === 'paypal') {
    const email = document.getElementById('withdraw-paypal-email').value.trim();
    if (!email || !email.includes('@')) { showToast('Please enter a valid PayPal email.', 'error'); return; }
    payload.paypal_email = email;
  }

  const btn = document.getElementById('btn-submit-withdraw');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Processing payout request...';
  }

  try {
    const res = await fetch('api/wallet.php?action=request_withdrawal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      closeModal('modal-withdraw');
      showToast(data.message || `Payout request submitted!`, 'success');
      loadWalletSummary();
      e.target.reset();
    } else {
      showToast(data.message || 'Withdrawal failed. Check balance.', 'error');
    }
  } catch (err) {
    showToast('Network error processing withdrawal.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Confirm Payout Request →';
    }
  }
}

function switchCoinExchangeTab(tab) {
  const buyTab = document.getElementById('exchange-tab-buy');
  const sellTab = document.getElementById('exchange-tab-sell');
  const btnBuy = document.getElementById('tab-btn-buy');
  const btnSell = document.getElementById('tab-btn-sell');

  if (tab === 'buy') {
    if (buyTab) buyTab.style.display = 'block';
    if (sellTab) sellTab.style.display = 'none';
    if (btnBuy) {
      btnBuy.style.background = '#f59e0b';
      btnBuy.style.color = '#0f172a';
    }
    if (btnSell) {
      btnSell.style.background = 'transparent';
      btnSell.style.color = '#94a3b8';
    }
    calculateBuyNairaCost();
  } else {
    if (buyTab) buyTab.style.display = 'none';
    if (sellTab) sellTab.style.display = 'block';
    if (btnSell) {
      btnSell.style.background = '#10b981';
      btnSell.style.color = '#ffffff';
    }
    if (btnBuy) {
      btnBuy.style.background = 'transparent';
      btnBuy.style.color = '#94a3b8';
    }
    calculateSellNairaPayout();
  }
}

function selectBuyCoinAmount(coins) {
  const inp = document.getElementById('inp-buy-coins');
  if (inp) {
    inp.value = coins;
    calculateBuyNairaCost();
  }
}

function calculateBuyNairaCost() {
  const inp = document.getElementById('inp-buy-coins');
  const dsp = document.getElementById('buy-naira-total');
  if (!inp || !dsp) return;
  const coins = parseInt(inp.value, 10) || 0;
  const unitRate = parseFloat(currentCoinRates.buy_rate_per_coin || 15.0);
  const cost = coins * unitRate;
  dsp.textContent = '₦' + cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function executeBuyCoins() {
  const inp = document.getElementById('inp-buy-coins');
  const coins = parseInt(inp?.value, 10) || 0;
  if (coins <= 0) {
    showToast('Please enter a valid amount of coins to purchase.', 'error');
    return;
  }

  const btn = document.getElementById('btn-submit-buy-coins');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Processing Purchase...';
  }

  try {
    const res = await fetch('api/wallet.php?action=buy_coins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coins_amount: coins })
    });
    const data = await res.json();

    if (data.success) {
      closeModal('modal-buy-coins');
      showToast(data.message || `Purchased ${coins} Coins successfully!`, 'success');
      loadWalletSummary();
    } else {
      showToast(data.message || 'Purchase failed. Please check your wallet balance.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error processing purchase.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '🪙 Purchase Coins with Naira →';
    }
  }
}

function selectSellCoinAmount(coins) {
  const inp = document.getElementById('inp-sell-coins');
  if (inp) {
    inp.value = coins;
    calculateSellNairaPayout();
  }
}

function selectSellCoinAll() {
  const availText = document.getElementById('buy-coins-avail-coins')?.textContent || '0';
  const cleanCoins = parseInt(availText.replace(/[^0-9]/g, ''), 10) || 0;
  const inp = document.getElementById('inp-sell-coins');
  if (inp) {
    inp.value = cleanCoins;
    calculateSellNairaPayout();
  }
}

function calculateSellNairaPayout() {
  const inp = document.getElementById('inp-sell-coins');
  const dsp = document.getElementById('sell-naira-total');
  if (!inp || !dsp) return;
  const coins = parseInt(inp.value, 10) || 0;
  const unitRate = parseFloat(currentCoinRates.sell_rate_per_coin || 13.5);
  const payout = coins * unitRate;
  dsp.textContent = '+₦' + payout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function executeSellCoins() {
  const inp = document.getElementById('inp-sell-coins');
  const coins = parseInt(inp?.value, 10) || 0;
  if (coins < 10) {
    showToast('Minimum coins to convert is 10 Coins.', 'error');
    return;
  }

  const btn = document.getElementById('btn-submit-sell-coins');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Processing Cashout...';
  }

  try {
    const res = await fetch('api/wallet.php?action=sell_coins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coins_amount: coins })
    });
    const data = await res.json();

    if (data.success) {
      closeModal('modal-buy-coins');
      showToast(data.message || `Converted ${coins} Coins to cash!`, 'success');
      loadWalletSummary();
    } else {
      showToast(data.message || 'Cashout failed.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error processing cashout.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '💵 Convert Coins to Naira Cash →';
    }
  }
}

async function exchangeCoins(naira, coins) {
  try {
    const res = await fetch('api/wallet.php?action=exchange_coins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coins_amount: coins })
    });
    const data = await res.json();

    if (data.success) {
      closeModal('modal-buy-coins');
      showToast(data.message || `Exchanged for ${coins} Coins!`, 'success');
      loadWalletSummary();
    } else {
      showToast(data.message || 'Insufficient wallet balance. Please fund your wallet first.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error.', 'error');
  }
}

async function upgradePackageTier(tier, price) {
  if (!confirm(`Upgrade to ${tier.toUpperCase()} package for ₦${price.toLocaleString()}/month?`)) return;

  try {
    const res = await fetch('api/wallet.php?action=upgrade_package', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ package: tier })
    });
    const data = await res.json();

    if (data.success) {
      showToast(`🎉 Congratulations! You are now on the ${tier.toUpperCase()} Package!`, 'success');
      setTimeout(() => window.location.reload(), 1200);
    } else {
      showToast(data.message || 'Could not upgrade. Please fund your wallet.', 'error');
      openDepositModal();
    }
  } catch (err) {
    console.error(err);
    showToast('Network error upgrading package.', 'error');
  }
}

// ================= TOURNAMENTS HUB ================= //
function openHostTournamentModal() {
  // Pre-populate default GMT dates if empty
  const now = new Date();
  
  // Start date: tomorrow at 12:00 UTC
  const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 12, 0));
  // End date: 3 days after tomorrow at 18:00 UTC
  const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 4, 18, 0));
  // Join deadline: 2 hours before start date
  const deadlineDate = new Date(startDate.getTime() - 2 * 3600 * 1000);

  const formatLocalIso = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  };

  const startInput = document.getElementById('tourn-start-date');
  const endInput = document.getElementById('tourn-end-date');
  const deadlineInput = document.getElementById('tourn-join-deadline');

  if (startInput && !startInput.value) startInput.value = formatLocalIso(startDate);
  if (endInput && !endInput.value) endInput.value = formatLocalIso(endDate);
  if (deadlineInput && !deadlineInput.value) deadlineInput.value = formatLocalIso(deadlineDate);

  updateTournamentCostSummary();
  openModal('modal-host-tournament');
}

function updateTournamentCostSummary() {
  const maxPlayers = parseInt(document.getElementById('tourn-max-players')?.value || 8, 10);
  const entryCoins = parseInt(document.getElementById('tourn-entry-coins')?.value || 100, 10);
  const payerType = document.getElementById('tourn-payer-type')?.value || 'player';

  const creationFee = 20;
  const isHostPaying = (payerType === 'host');
  const sponsorCoins = isHostPaying ? (entryCoins * maxPlayers) : 0;
  const totalHostDeduct = creationFee + sponsorCoins;
  const estPrizePot = entryCoins * maxPlayers;

  const sponsorText = document.getElementById('tourn-host-sponsor-text');
  const sponsorVal = document.getElementById('tourn-host-sponsor-val');
  if (sponsorText && sponsorVal) {
    if (isHostPaying) {
      sponsorText.style.display = 'inline';
      sponsorVal.textContent = sponsorCoins.toLocaleString() + ' Coins';
    } else {
      sponsorText.style.display = 'none';
    }
  }

  const potVal = document.getElementById('tourn-est-pot-val');
  if (potVal) {
    potVal.textContent = estPrizePot.toLocaleString() + ' Coins';
  }

  const totalDeductSpan = document.getElementById('tourn-total-deduct-span');
  if (totalDeductSpan) {
    totalDeductSpan.textContent = totalHostDeduct.toLocaleString() + ' Coins' + (isHostPaying ? ` (20 Fee + ${sponsorCoins.toLocaleString()} Entry)` : ' (Creation Fee)');
  }
}

function openTournamentGuideModal() {
  openModal('modal-tournament-guide');
}

function switchTournamentFilter(filterName) {
  currentTournamentFilter = filterName || 'all';

  // Ensure Tournaments tab panel is active if user triggered filter from outside or menu
  const tournPanel = document.getElementById('panel-tournaments');
  if (tournPanel && !tournPanel.classList.contains('active')) {
    activateMainTab('tournaments');
  }

  document.querySelectorAll('#tournament-filter-pills .filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.filter === currentTournamentFilter);
  });
  loadTournamentsList(currentTournamentFilter);
}

async function loadTournamentsList(filter = currentTournamentFilter) {
  const container = document.getElementById('tournaments-grid');
  if (!container) return;

  currentTournamentFilter = filter || 'all';

  // Highlight active pill
  document.querySelectorAll('#tournament-filter-pills .filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.filter === currentTournamentFilter);
  });

  container.innerHTML = '<div class="empty-state">Loading Nigerian Draughts championships...</div>';

  try {
    const res = await fetch(`api/tournaments.php?action=get_tournaments&filter=${encodeURIComponent(currentTournamentFilter)}`);
    const data = await res.json();

    // Update filter count badges
    if (data.counts) {
      const setBadge = (id, count) => {
        const el = document.getElementById(id);
        if (el) el.textContent = count !== undefined ? count : 0;
      };
      setBadge('count-tourn-all', data.counts.all);
      setBadge('count-tourn-new', data.counts.new);
      setBadge('count-tourn-started', data.counts.started);
      setBadge('count-tourn-over', data.counts.over);
      setBadge('count-tourn-viewed', data.counts.most_viewed);
    }

    if (!data.success || !data.tournaments || data.tournaments.length === 0) {
      let emptyMsg = 'No active championships scheduled right now.';
      if (currentTournamentFilter === 'new') emptyMsg = 'No new open championships waiting for contenders right now.';
      else if (currentTournamentFilter === 'started') emptyMsg = 'No active tournaments currently in progress.';
      else if (currentTournamentFilter === 'over') emptyMsg = 'No completed tournaments in the archive yet.';
      else if (currentTournamentFilter === 'most_viewed') emptyMsg = 'No tournament views recorded yet.';

      container.innerHTML = `
        <div class="empty-state">
          <p>${escapeHtml(emptyMsg)}</p>
          <div style="display:flex; justify-content:center; gap:10px; margin-top:14px; flex-wrap:wrap;">
            <button type="button" class="btn btn-primary btn-small" onclick="openHostTournamentModal()">
              🚀 Create Tournament
            </button>
            <button type="button" class="btn btn-secondary btn-small" onclick="openTournamentGuideModal()">
              📄 How to Guide (PDF)
            </button>
          </div>
        </div>
      `;
      return;
    }

    const currentUserId = data.current_user_id || null;

    container.innerHTML = data.tournaments.map(t => {
      const isRegistered = !!t.is_registered;
      const isLive = t.status === 'live';
      const isCompleted = t.status === 'completed';
      const isUpcoming = t.status === 'upcoming';

      let feeDisplay = 'Free';
      if (t.payer_type === 'host') {
        feeDisplay = '<span style="color:#4ade80; font-weight:700;">Host Sponsored (Free)</span>';
      } else if (t.entry_fee_naira > 0) {
        feeDisplay = '₦' + Number(t.entry_fee_naira).toLocaleString();
      } else if (t.entry_fee_coins > 0) {
        feeDisplay = Number(t.entry_fee_coins).toLocaleString() + ' 🪙';
      }

      let prizeDisplay = t.prize_pool_naira > 0 ? '₦' + Number(t.prize_pool_naira).toLocaleString() : (t.prize_pool || '5,000 🪙');

      let statusBadge = `<span class="t-badge">🏆 UPCOMING</span>`;
      if (isLive) {
        statusBadge = `<span class="t-badge" style="background:#ef4444; color:#fff; font-weight:800; padding:2px 8px; border-radius:4px;">🔴 LIVE (${escapeHtml(t.current_round || 'Round 1')})</span>`;
      } else if (isCompleted) {
        statusBadge = `<span class="t-badge" style="background:#22c55e; color:#000; font-weight:800; padding:2px 8px; border-radius:4px;">🏁 COMPLETED</span>`;
      }

      // Rule label
      const ruleName = (t.rule_type === 'ghana') ? '🇬🇭 Ghana' : ((t.rule_type === 'international') ? '🌍 International' : '🇳🇬 Nigeria');
      const typeName = (t.tournament_type === 'best_of_5') ? 'Best of 5' : ((t.tournament_type === 'best_of_3') ? 'Best of 3' : ((t.tournament_type === 'league') ? 'League' : 'Knockout'));

      // Check if user has an active ready match in this tournament
      let userActiveMatchRoom = null;
      if (isLive && t.brackets && currentUserId) {
        const checkMatch = (m) => {
          if (m && m.room_code && m.status === 'ready') {
            const p1 = m.p1 ? m.p1.id : null;
            const p2 = m.p2 ? m.p2.id : null;
            if (p1 === currentUserId || p2 === currentUserId) return m.room_code;
          }
          return null;
        };
        (t.brackets.round_of_64 || []).forEach(m => { const r = checkMatch(m); if (r) userActiveMatchRoom = r; });
        (t.brackets.round_of_32 || []).forEach(m => { const r = checkMatch(m); if (r) userActiveMatchRoom = r; });
        (t.brackets.round_of_16 || []).forEach(m => { const r = checkMatch(m); if (r) userActiveMatchRoom = r; });
        (t.brackets.quarter_finals || []).forEach(m => { const r = checkMatch(m); if (r) userActiveMatchRoom = r; });
        (t.brackets.semi_finals || []).forEach(m => { const r = checkMatch(m); if (r) userActiveMatchRoom = r; });
        const rFin = checkMatch(t.brackets.finals);
        if (rFin) userActiveMatchRoom = rFin;
      }

      // Join button label based on join_type
      let joinBtnText = 'Join Championship &rarr;';
      if (t.join_type === 'request') {
        joinBtnText = 'Request Participation &rarr;';
      } else if (t.join_type === 'invite_only') {
        joinBtnText = '🔒 Invited Only';
      }

      const formatDateGmt = (dStr) => {
        if (!dStr) return null;
        try {
          const d = new Date(dStr.replace(' ', 'T') + 'Z');
          if (isNaN(d.getTime())) return dStr;
          const pad = (n) => String(n).padStart(2, '0');
          return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} GMT`;
        } catch(e) { return dStr; }
      };

      const startGmt = formatDateGmt(t.start_date);
      const deadlineGmt = formatDateGmt(t.join_deadline);
      const viewsDisplay = Number(t.views_count || 0).toLocaleString();

      return `
        <div class="tournament-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
            <div style="display:flex; align-items:center; gap:6px;">
              ${statusBadge}
              <span class="tourn-badge-pill tourn-badge-rule">${ruleName}</span>
              <span class="tourn-badge-pill tourn-badge-type">${typeName}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:0.75rem; color:#94a3b8;">${escapeHtml(t.format || (t.max_participants + '-Player Knockout'))}</span>
              <span style="font-size:0.75rem; color:#f59e0b; background:rgba(245,158,11,0.12); padding:2px 6px; border-radius:4px;" title="Views">👁️ ${viewsDisplay}</span>
            </div>
          </div>
          <h3 class="t-title">${escapeHtml(t.name || t.title)}</h3>
          <div class="t-host" style="display:flex; justify-content:space-between; align-items:center; font-size:0.82rem; color:#94a3b8; margin-bottom:10px;">
            <span>Host: <strong style="color:#e2e8f0;">${escapeHtml(t.host_name || 'Naija Draughts Fed')}</strong></span>
            ${t.board_type && t.board_type !== 'default' ? `<span style="font-size:0.75rem; background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px;">🎨 ${escapeHtml(t.board_type)}</span>` : ''}
          </div>

          ${(startGmt || deadlineGmt) ? `
            <div style="background:rgba(0,0,0,0.25); border-radius:6px; padding:6px 10px; margin-bottom:10px; font-size:0.75rem; color:#94a3b8; display:flex; flex-direction:column; gap:2px;">
              ${startGmt ? `<div>📅 <strong>Starts:</strong> ${startGmt}</div>` : ''}
              ${deadlineGmt ? `<div>⏱️ <strong>Registration Deadline:</strong> ${deadlineGmt}</div>` : ''}
            </div>
          ` : ''}

          <div class="t-metrics-grid">
            <div class="tm-item">
              <span class="tm-val">${feeDisplay}</span>
              <span class="tm-lbl">Entry Fee</span>
            </div>
            <div class="tm-item">
              <span class="tm-val gold">${prizeDisplay}</span>
              <span class="tm-lbl">Prize Pool</span>
            </div>
            <div class="tm-item">
              <span class="tm-val">${t.registered_count || 0} / ${t.max_participants || 8}</span>
              <span class="tm-lbl">Enrolled</span>
            </div>
          </div>

          ${isCompleted && t.winner_name ? `
            <div style="background:rgba(234,179,8,0.15); border:1px solid rgba(234,179,8,0.3); border-radius:6px; padding:6px 10px; margin:10px 0; font-size:0.8rem; text-align:center;">
              👑 Champion: <strong>${escapeHtml(t.winner_name)}</strong>
              ${t.runner_up_name ? `<span style="color:#94a3b8;"> | 🥈 ${escapeHtml(t.runner_up_name)}</span>` : ''}
            </div>
          ` : ''}

          <div class="t-actions" style="display:flex; flex-direction:column; gap:6px; margin-top:10px;">
            ${userActiveMatchRoom ? `
              <a href="game.php?room=${userActiveMatchRoom}" class="btn btn-primary btn-block" style="background:#16a34a; font-weight:800;">
                ▶ Play Your Match (${userActiveMatchRoom}) &rarr;
              </a>
            ` : ''}
            ${isUpcoming ? (
              isRegistered 
                ? `<button type="button" class="btn btn-secondary btn-block disabled" disabled>✓ Registered (Seed #${t.user_seed || 1})</button>`
                : `<button type="button" class="btn btn-primary btn-block" onclick="joinTournament(${t.id})">${joinBtnText}</button>`
            ) : ''}
            <a href="game.php?view=tournaments" class="btn btn-secondary btn-block" style="text-align:center; font-size:0.82rem; text-decoration:none;">
              🏆 View Championship Bracket
            </a>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="empty-state error-text">Failed to load championships.</div>';
  }
}

async function joinTournament(tournId) {
  try {
    const res = await fetch('api/tournaments.php?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournament_id: tournId })
    });
    const data = await res.json();

    if (data.success) {
      showToast(data.message || 'Successfully registered for tournament!', 'success');
      loadTournamentsList();
      loadWalletSummary();
    } else {
      showToast(data.message || 'Could not join tournament.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error joining tournament.', 'error');
  }
}

async function handleHostTournamentSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('tourn-title')?.value.trim();
  if (!title) {
    showToast('Please enter a tournament name.', 'error');
    return;
  }

  const tournType = document.getElementById('tourn-type')?.value || 'knockout';
  const ruleType = document.getElementById('tourn-rule-type')?.value || 'nigeria';
  const joinType = document.getElementById('tourn-join-type')?.value || 'open';
  const maxPlayers = parseInt(document.getElementById('tourn-max-players')?.value || 8, 10);
  const entryCoins = parseInt(document.getElementById('tourn-entry-coins')?.value || 100, 10);
  const payerType = document.getElementById('tourn-payer-type')?.value || 'player';

  const startDate = document.getElementById('tourn-start-date')?.value || '';
  const endDate = document.getElementById('tourn-end-date')?.value || '';
  const joinDeadline = document.getElementById('tourn-join-deadline')?.value || '';

  const boardType = document.getElementById('tourn-board-type')?.value || 'default';
  const gameMod = document.getElementById('tourn-game-modification')?.value || 'none';

  const undoAllowed = document.getElementById('tourn-toggle-undo')?.checked ? 1 : 0;
  const isPrivate = document.getElementById('tourn-toggle-private')?.checked ? 1 : 0;
  const toWin = document.getElementById('tourn-toggle-towin')?.checked ? 1 : 0;
  const disableChat = document.getElementById('tourn-toggle-chat')?.checked ? 1 : 0;
  const soundOn = document.getElementById('tourn-toggle-sound')?.checked ? 1 : 0;
  const isScheduled = document.getElementById('tourn-toggle-scheduled')?.checked ? 1 : 0;

  // Validation: Check dates
  if (!startDate || !endDate || !joinDeadline) {
    showToast('Please specify Start Date, End Date, and Registration Deadline.', 'error');
    return;
  }

  const sTime = new Date(startDate).getTime();
  const eTime = new Date(endDate).getTime();
  const dTime = new Date(joinDeadline).getTime();

  if (eTime <= sTime) {
    showToast('End date must be after Start date.', 'error');
    return;
  }
  if (dTime > sTime) {
    showToast('Registration deadline must be on or before the tournament Start date.', 'error');
    return;
  }

  const submitBtn = document.getElementById('btn-submit-host-tourn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Tournament...';
  }

  try {
    const res = await fetch('api/tournaments.php?action=host_tournament', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        name: title,
        tournament_type: tournType,
        rule_type: ruleType,
        join_type: joinType,
        number_of_players: maxPlayers,
        max_participants: maxPlayers,
        entry_coins: entryCoins,
        entry_fee_coins: entryCoins,
        payer_type: payerType,
        start_date: startDate,
        end_date: endDate,
        join_deadline: joinDeadline,
        board_type: boardType,
        game_modification: gameMod,
        undo_allowed: undoAllowed,
        is_private: isPrivate,
        to_win: toWin,
        disable_chat: disableChat,
        sound_on: soundOn,
        is_scheduled: isScheduled
      })
    });
    const data = await res.json();

    if (data.success) {
      closeModal('modal-host-tournament');
      showToast(data.message || 'Tournament created successfully! Registration is now open.', 'success');
      loadTournamentsList();
      loadWalletSummary();
    } else {
      showToast(data.message || 'Failed to host tournament.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error hosting tournament.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '🚀 Launch Tournament &rarr;';
    }
  }
}

// ================= WHATSAPP MODAL ================= //
function openWhatsAppModal() {
  openModal('modal-whatsapp');
}

// ================= UNREAD COUNTERS ================= //
async function loadUnreadCounters() {
  try {
    // Unread messages
    const msgRes = await fetch('api/messages.php?action=get_unread_count');
    const msgData = await msgRes.json();
    if (msgData.success && msgData.unread_count > 0) {
      const badge = document.getElementById('nav-msg-counter');
      if (badge) {
        badge.textContent = msgData.unread_count;
        badge.style.display = 'inline-flex';
      }
      const tabBadge = document.getElementById('tab-msg-badge');
      if (tabBadge) {
        tabBadge.textContent = msgData.unread_count;
        tabBadge.style.display = 'inline-flex';
      }
    } else {
      const badge = document.getElementById('nav-msg-counter');
      if (badge) badge.style.display = 'none';
      const tabBadge = document.getElementById('tab-msg-badge');
      if (tabBadge) tabBadge.style.display = 'none';
    }

    // Pending challenges
    const invRes = await fetch('api/invitations.php?action=get_invitations');
    const invData = await invRes.json();
    if (invData.success && invData.received && invData.received.length > 0) {
      const invBadge = document.getElementById('nav-invites-counter');
      if (invBadge) {
        invBadge.textContent = invData.received.length;
        invBadge.style.display = 'inline-flex';
      }
      const dropBadge = document.getElementById('drop-invites-badge');
      if (dropBadge) {
        dropBadge.textContent = invData.received.length;
        dropBadge.style.display = 'inline-block';
      }
      const tabInvBadge = document.getElementById('tab-inv-badge');
      if (tabInvBadge) {
        tabInvBadge.textContent = invData.received.length;
        tabInvBadge.style.display = 'inline-flex';
      }
    } else {
      const invBadge = document.getElementById('nav-invites-counter');
      if (invBadge) invBadge.style.display = 'none';
      const dropBadge = document.getElementById('drop-invites-badge');
      if (dropBadge) dropBadge.style.display = 'none';
      const tabInvBadge = document.getElementById('tab-inv-badge');
      if (tabInvBadge) tabInvBadge.style.display = 'none';
    }
  } catch (err) {
    // Non-critical background poll
  }
}

// ================= LOGOUT ================= //
async function handleDashboardLogout() {
  try {
    await fetch('api/auth.php?action=logout', { method: 'POST' });
  } catch (err) {
    // ignore
  }
  window.location.href = 'index.php';
}

// ================= MODAL UTILITIES ================= //
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
}

// Close modals when clicking overlay background
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('home-modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// Toast notification helper
function showToast(message, type = 'info') {
  const container = document.getElementById('dash-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `dash-toast ${type}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
