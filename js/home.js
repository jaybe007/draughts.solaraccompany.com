/**
 * Client JavaScript for AfroDraught-Style Home Page
 * Handles interactive hero authentication, live previews, and session state.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHomeAuth();
  initOnlineRooms();
  loadLeaderboardPreview();
  loadTournamentsPreview();
});

// ================= HERO AUTH CARD CONTROLLER ================= //

function initHomeAuth() {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const authAlert = document.getElementById('auth-alert');
  const formsBox = document.getElementById('auth-forms-box');
  const profileBox = document.getElementById('logged-in-profile-box');
  const btnLogout = document.getElementById('btn-home-logout');
  const btnSubmitLogin = document.getElementById('btn-submit-login');
  const btnSubmitRegister = document.getElementById('btn-submit-register');

  // Password visibility toggles
  document.querySelectorAll('.btn-toggle-pwd').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      btn.textContent = isPwd ? '🙈' : '👁️';
    });
  });

  // Smooth scroll & pulse to Auth Card
  document.querySelectorAll('a[href="#auth-card"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const card = document.getElementById('auth-card');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.remove('card-focus-highlight');
        void card.offsetWidth; // Trigger reflow for animation
        card.classList.add('card-focus-highlight');
        const firstInput = card.querySelector('.auth-form.active input');
        if (firstInput) setTimeout(() => firstInput.focus(), 450);
      }
    });
  });

  const formVerify = document.getElementById('form-verify');
  const verifyEmailDisplay = document.getElementById('verify-email-display');
  const verifyHiddenEmail = document.getElementById('verify-hidden-email');
  const homeVerifyCode = document.getElementById('home-verify-code');
  const btnSubmitHomeVerify = document.getElementById('btn-submit-home-verify');
  const btnHomeResendCode = document.getElementById('btn-home-resend-code');
  const homeResendTimer = document.getElementById('home-resend-timer');
  const btnBackToLogin = document.getElementById('btn-back-to-login');
  const devOtpHint = document.getElementById('dev-mode-otp-hint');
  const devOtpCode = document.getElementById('dev-otp-code');

  function showVerificationView(email, devOtp = null) {
    if (tabLogin) tabLogin.classList.remove('active');
    if (tabRegister) tabRegister.classList.remove('active');
    if (formLogin) formLogin.classList.remove('active');
    if (formRegister) formRegister.classList.remove('active');
    if (formVerify) {
      formVerify.classList.add('active');
      if (verifyEmailDisplay) verifyEmailDisplay.textContent = email;
      if (verifyHiddenEmail) verifyHiddenEmail.value = email;
      if (homeVerifyCode) {
        homeVerifyCode.value = '';
        setTimeout(() => homeVerifyCode.focus(), 150);
      }
      if (devOtp && devOtpHint && devOtpCode) {
        devOtpCode.textContent = devOtp;
        devOtpHint.style.display = 'block';
        devOtpHint.onclick = () => {
          homeVerifyCode.value = devOtp;
          homeVerifyCode.focus();
        };
      } else if (devOtpHint) {
        devOtpHint.style.display = 'none';
      }
    }
  }

  function switchToLoginView() {
    if (formVerify) formVerify.classList.remove('active');
    if (tabRegister) tabRegister.classList.remove('active');
    if (tabLogin) tabLogin.classList.add('active');
    if (formLogin) {
      formLogin.classList.add('active');
      const firstInput = formLogin.querySelector('input');
      if (firstInput) firstInput.focus();
    }
    hideAlert();
  }

  if (btnBackToLogin) {
    btnBackToLogin.addEventListener('click', () => switchToLoginView());
  }

  // Tab switching
  if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => {
      switchToLoginView();
    });

    tabRegister.addEventListener('click', () => {
      if (formVerify) formVerify.classList.remove('active');
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      formRegister.classList.add('active');
      formLogin.classList.remove('active');
      hideAlert();
      const firstInput = formRegister.querySelector('input');
      if (firstInput) firstInput.focus();
    });
  }

  // Handle Login Submit
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const loginId = document.getElementById('login-id').value.trim();
      const password = document.getElementById('login-password').value;

      if (!loginId || !password) {
        showAlert('Please enter both username/email and password.', true);
        return;
      }

      if (btnSubmitLogin) {
        btnSubmitLogin.disabled = true;
        btnSubmitLogin.textContent = 'Signing in...';
      }

      try {
        const res = await fetch('api/auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', login: loginId, password })
        });
        const data = await res.json();

        if (data.requires_verification) {
          showVerificationView(data.email || loginId, data.dev_otp);
          showAlert(data.message || 'Please verify your email address to enter the arena.', true);
        } else if (data.success && data.user) {
          showAlert(`Welcome back, Champion ${data.user.username}! Loading your Command Portal...`, false);
          renderLoggedInState(data.user);
          setTimeout(() => {
            window.location.href = 'dashboard.php';
          }, 600);
        } else {
          showAlert(data.message || 'Invalid login details.', true);
        }
      } catch (err) {
        showAlert('Network error communicating with server.', true);
      } finally {
        if (btnSubmitLogin) {
          btnSubmitLogin.disabled = false;
          btnSubmitLogin.innerHTML = 'Sign In & Enter Arena &rarr;';
        }
      }
    });
  }

  // Handle Register Submit
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('reg-username').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirmPassword = document.getElementById('reg-password-confirm')?.value;

      if (!username || username.length < 3) {
        showAlert('Username must be at least 3 characters.', true);
        return;
      }
      if (!email || !email.includes('@')) {
        showAlert('Please enter a valid email address.', true);
        return;
      }
      if (!password || password.length < 6) {
        showAlert('Password must be at least 6 characters.', true);
        return;
      }
      if (confirmPassword !== undefined && password !== confirmPassword) {
        showAlert('Passwords do not match! Please check again.', true);
        return;
      }

      if (btnSubmitRegister) {
        btnSubmitRegister.disabled = true;
        btnSubmitRegister.textContent = 'Creating profile...';
      }

      try {
        const res = await fetch('api/auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'register', username, email, password })
        });
        const data = await res.json();

        if (data.requires_verification) {
          showVerificationView(email, data.dev_otp);
          showAlert(data.message || 'Account created! Enter the 6-digit code sent to your email.', false);
        } else if (data.success && data.user) {
          showAlert(`Profile created! Welcome to Naija Draughts, ${data.user.username}! Opening dashboard...`, false);
          renderLoggedInState(data.user);
          setTimeout(() => {
            window.location.href = 'dashboard.php';
          }, 800);
        } else {
          showAlert(data.message || 'Registration failed.', true);
        }
      } catch (err) {
        showAlert('Network error communicating with server.', true);
      } finally {
        if (btnSubmitRegister) {
          btnSubmitRegister.disabled = false;
          btnSubmitRegister.innerHTML = 'Create Champion Profile &rarr;';
        }
      }
    });
  }

  // Handle Email Verification Submit on Home page
  if (formVerify) {
    formVerify.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = verifyHiddenEmail ? verifyHiddenEmail.value.trim() : '';
      const code = homeVerifyCode ? homeVerifyCode.value.trim() : '';

      if (!email) {
        showAlert('Email missing. Please sign in again.', true);
        return;
      }
      if (!code || code.length !== 6) {
        showAlert('Please enter the full 6-digit verification code.', true);
        return;
      }

      if (btnSubmitHomeVerify) {
        btnSubmitHomeVerify.disabled = true;
        btnSubmitHomeVerify.textContent = 'Verifying code...';
      }

      try {
        const res = await fetch('api/auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'verify_code', email, code })
        });
        const data = await res.json();

        if (data.success && data.user) {
          showAlert(data.message || `Email verified! Welcome, Champion ${data.user.username}!`, false);
          renderLoggedInState(data.user);
          setTimeout(() => {
            window.location.href = 'dashboard.php';
          }, 800);
        } else {
          showAlert(data.message || 'Invalid or expired code. Please try again.', true);
        }
      } catch (err) {
        showAlert('Network error communicating with server.', true);
      } finally {
        if (btnSubmitHomeVerify) {
          btnSubmitHomeVerify.disabled = false;
          btnSubmitHomeVerify.innerHTML = 'Verify Code & Enter Arena &rarr;';
        }
      }
    });
  }

  // Handle Resend Verification Code on Home page
  if (btnHomeResendCode) {
    btnHomeResendCode.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = verifyHiddenEmail ? verifyHiddenEmail.value.trim() : '';
      if (!email) return;

      btnHomeResendCode.disabled = true;
      btnHomeResendCode.style.opacity = '0.5';

      try {
        const res = await fetch('api/auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'resend_verification', email })
        });
        const data = await res.json();

        if (data.success) {
          showAlert('New 6-digit code sent! Check your inbox.', false);
          if (data.dev_otp && devOtpCode && devOtpHint) {
            devOtpCode.textContent = data.dev_otp;
            devOtpHint.style.display = 'block';
            devOtpHint.onclick = () => {
              homeVerifyCode.value = data.dev_otp;
              homeVerifyCode.focus();
            };
          }

          let countdown = 60;
          if (homeResendTimer) {
            homeResendTimer.style.display = 'inline';
            homeResendTimer.textContent = ` (${countdown}s)`;
            const timer = setInterval(() => {
              countdown--;
              if (countdown <= 0) {
                clearInterval(timer);
                homeResendTimer.style.display = 'none';
                btnHomeResendCode.disabled = false;
                btnHomeResendCode.style.opacity = '1';
              } else {
                homeResendTimer.textContent = ` (${countdown}s)`;
              }
            }, 1000);
          }
        } else {
          showAlert(data.message || 'Could not resend code.', true);
          btnHomeResendCode.disabled = false;
          btnHomeResendCode.style.opacity = '1';
        }
      } catch (err) {
        showAlert('Network error communicating with server.', true);
        btnHomeResendCode.disabled = false;
        btnHomeResendCode.style.opacity = '1';
      }
    });
  }

  // Handle Logout
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      try {
        await fetch('api/auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'logout' })
        });
      } catch (e) {}

      formsBox.style.display = 'block';
      profileBox.style.display = 'none';
      showAlert('You have logged out. Sign in anytime to track your rating!', false);
      const topPill = document.getElementById('top-user-pill');
      if (topPill) topPill.innerHTML = '<a href="#auth-card" class="btn btn-primary btn-small">Sign In / Register</a>';
    });
  }

  // Check initial session
  checkInitialSession();

  async function checkInitialSession() {
    try {
      const res = await fetch('api/auth.php?action=me');
      const data = await res.json();
      if (data.success && data.user) {
        renderLoggedInState(data.user);
      }
    } catch (e) {}
  }

  function renderLoggedInState(user) {
    if (!profileBox) return;
    formsBox.style.display = 'none';
    profileBox.style.display = 'flex';

    document.getElementById('logged-user-avatar').textContent = (user.username.charAt(0) || '👑').toUpperCase();
    document.getElementById('logged-user-name').textContent = user.username;
    document.getElementById('logged-user-title').textContent = `${user.rating} Elo • ${user.title || 'Street Champion'}`;
    document.getElementById('logged-stat-wins').textContent = user.wins || 0;
    document.getElementById('logged-stat-losses').textContent = user.losses || 0;
    document.getElementById('logged-stat-chopped').textContent = user.total_chopped || 0;

    const topPill = document.getElementById('top-user-pill');
    if (topPill) {
      topPill.innerHTML = `
        <a href="dashboard.php" class="user-pill" style="text-decoration:none;" title="Open Player Dashboard">
          <span class="user-pill-avatar">👑</span>
          <span class="user-pill-name">${escapeHTML(user.username)}</span>
          <span class="user-pill-rating">${user.rating} Elo</span>
        </a>
        <a href="dashboard.php" class="btn btn-primary btn-small">My Dashboard &rarr;</a>
      `;
    }
  }

  function showAlert(msg, isError = true) {
    if (!authAlert) return;
    authAlert.textContent = msg;
    authAlert.className = `auth-alert ${isError ? 'error' : 'success'}`;
    authAlert.style.display = 'block';
  }

  function hideAlert() {
    if (authAlert) authAlert.style.display = 'none';
  }
}

// ================= LIVE PREVIEWS ================= //

async function loadLeaderboardPreview() {
  const tbody = document.getElementById('preview-leaderboard-body');
  if (!tbody) return;

  try {
    const res = await fetch('api/leaderboard.php');
    const data = await res.json();

    if (data.success && data.leaderboard.length > 0) {
      tbody.innerHTML = data.leaderboard.slice(0, 5).map((u, idx) => {
        const medals = ['🥇', '🥈', '🥉'];
        const rankBadge = medals[idx] || `#${idx + 1}`;
        return `
          <tr>
            <td><strong>${rankBadge}</strong></td>
            <td><strong>${escapeHTML(u.username)}</strong></td>
            <td style="color:#38bdf8; font-weight:bold;">${u.rating}</td>
            <td>${u.wins}</td>
            <td style="color:#34d399; font-weight:bold;">${u.win_rate}%</td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center">No records found.</td></tr>';
    }
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Failed to load champions.</td></tr>';
  }
}

async function loadTournamentsPreview() {
  const container = document.getElementById('preview-tournaments-list');
  if (!container) return;

  try {
    const res = await fetch('api/tournaments.php');
    const data = await res.json();

    if (data.success && data.tournaments.length > 0) {
      container.innerHTML = data.tournaments.map(t => {
        return `
          <div class="tourn-preview-item">
            <div class="tourn-meta">
              <h4>🏆 ${escapeHTML(t.name)}</h4>
              <p>${escapeHTML(t.location)} • ${escapeHTML(t.format)}</p>
            </div>
            <span class="tourn-prize-badge">${escapeHTML(t.prize_pool)}</span>
          </div>
        `;
      }).join('');
    }
  } catch (e) {}
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// ================= ONLINE MULTIPLAYER ROOMS ================= //

function initOnlineRooms() {
  const modal = document.getElementById('online-room-modal');
  const btnOpen = document.getElementById('btn-open-online-modal');
  const btnClose = document.getElementById('btn-close-room-modal');
  const tabCreate = document.getElementById('tab-room-create');
  const tabJoin = document.getElementById('tab-room-join');
  const formCreate = document.getElementById('form-create-room');
  const formJoin = document.getElementById('form-join-room');
  const roomAlert = document.getElementById('room-alert');
  const btnSubmitCreate = document.getElementById('btn-submit-create-room');
  const btnSubmitJoin = document.getElementById('btn-submit-join-room');

  if (!modal) return;

  function showRoomAlert(msg, isError = true) {
    if (!roomAlert) return;
    roomAlert.textContent = msg;
    roomAlert.className = `auth-alert ${isError ? 'error' : 'success'}`;
    roomAlert.style.display = 'block';
  }

  function hideRoomAlert() {
    if (roomAlert) roomAlert.style.display = 'none';
  }

  // Open modal
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      modal.classList.add('active');
      hideRoomAlert();
    });
  }

  // Close modal
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Tab switching
  if (tabCreate && tabJoin) {
    tabCreate.addEventListener('click', () => {
      tabCreate.classList.add('active');
      tabJoin.classList.remove('active');
      formCreate.classList.add('active');
      formJoin.classList.remove('active');
      hideRoomAlert();
    });

    tabJoin.addEventListener('click', () => {
      tabJoin.classList.add('active');
      tabCreate.classList.remove('active');
      formJoin.classList.add('active');
      formCreate.classList.remove('active');
      hideRoomAlert();
      const codeInput = document.getElementById('join-room-code');
      if (codeInput) codeInput.focus();
    });
  }

  // Create Room
  if (formCreate) {
    formCreate.addEventListener('submit', async (e) => {
      e.preventDefault();
      const playerName = document.getElementById('room-player-name').value.trim();
      const timeControl = document.getElementById('room-time-control').value;

      if (btnSubmitCreate) {
        btnSubmitCreate.disabled = true;
        btnSubmitCreate.textContent = 'Creating room...';
      }

      try {
        const res = await fetch('api/rooms.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_room',
            player_name: playerName,
            time_control: timeControl
          })
        });
        const data = await res.json();

        if (data.success && data.room_code) {
          showRoomAlert(`Room ${data.room_code} created! Launching arena...`, false);
          setTimeout(() => {
            window.location.href = `game.php?room=${encodeURIComponent(data.room_code)}&role=p1`;
          }, 800);
        } else {
          showRoomAlert(data.message || 'Failed to create room.', true);
        }
      } catch (err) {
        showRoomAlert('Network error creating room.', true);
      } finally {
        if (btnSubmitCreate) {
          btnSubmitCreate.disabled = false;
          btnSubmitCreate.innerHTML = '⚡ Generate Room Code & Launch &rarr;';
        }
      }
    });
  }

  // Join Room
  if (formJoin) {
    formJoin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const playerName = document.getElementById('join-player-name').value.trim();
      let roomCode = document.getElementById('join-room-code').value.trim().toUpperCase();

      if (!roomCode) {
        showRoomAlert('Please enter the room code.', true);
        return;
      }

      if (!roomCode.startsWith('ND-') && roomCode.length === 4) {
        roomCode = 'ND-' + roomCode;
      }

      if (btnSubmitJoin) {
        btnSubmitJoin.disabled = true;
        btnSubmitJoin.textContent = 'Connecting...';
      }

      try {
        const res = await fetch('api/rooms.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'join_room',
            room_code: roomCode,
            player_name: playerName
          })
        });
        const data = await res.json();

        if (data.success && data.room_code) {
          showRoomAlert(`Joined room ${data.room_code}! Entering arena...`, false);
          setTimeout(() => {
            window.location.href = `game.php?room=${encodeURIComponent(data.room_code)}&role=p2`;
          }, 800);
        } else {
          showRoomAlert(data.message || 'Could not join room.', true);
        }
      } catch (err) {
        showRoomAlert('Network error connecting to room.', true);
      } finally {
        if (btnSubmitJoin) {
          btnSubmitJoin.disabled = false;
          btnSubmitJoin.innerHTML = '🚀 Enter Match Room &rarr;';
        }
      }
    });
  }
}
