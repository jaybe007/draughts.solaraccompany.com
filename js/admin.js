/**
 * Naija Draughts - Admin Command Center Controller
 * Powers real-time dashboard analytics, staff RBAC management,
 * player controls, cashier approvals, tournament operations, and audit logs.
 */

class AdminApp {
  constructor() {
    this.permissionsRegistry = [];
    this.currentAdmin = null;
    this.activeTab = 'panel-overview';
    this.searchTimer = null;
  }

  async init() {
    this.bindNav();
    await this.fetchPermissionsRegistry();
    this.loadOverview();
    this.setupSearchListeners();
  }

  bindNav() {
    document.querySelectorAll('.admin-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPanel = btn.dataset.panel;
        if (targetPanel) this.switchTab(targetPanel);
      });
    });
  }

  setupSearchListeners() {
    const searchInput = document.getElementById('player-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => this.loadPlayers(1), 300);
      });
    }

    const packageFilter = document.getElementById('player-package-filter');
    if (packageFilter) packageFilter.addEventListener('change', () => this.loadPlayers(1));

    const statusFilter = document.getElementById('player-status-filter');
    if (statusFilter) statusFilter.addEventListener('change', () => this.loadPlayers(1));
  }

  async fetchPermissionsRegistry() {
    try {
      const res = await fetch('api/admin.php?action=get_permissions_registry');
      const data = await res.json();
      if (data.success) {
        this.permissionsRegistry = data.permissions || [];
        this.currentAdmin = data.current_admin || null;
      }
    } catch (e) {
      console.error('Failed to load permissions registry', e);
    }
  }

  switchTab(panelId) {
    this.activeTab = panelId;
    document.querySelectorAll('.admin-nav-item').forEach(b => {
      b.classList.toggle('active', b.dataset.panel === panelId);
    });
    document.querySelectorAll('.admin-view-panel').forEach(p => {
      p.classList.toggle('active', p.id === panelId);
    });

    const titleMap = {
      'panel-overview': 'Command Center Overview',
      'panel-admins': 'Admin Staff & Role-Based Permissions (RBAC)',
      'panel-players': 'Player Directory & Profile Management',
      'panel-finance': 'Financial Cashier & Bank Payouts',
      'panel-tournaments': 'Tournaments & Knockout Championships',
      'panel-rooms': 'Live Arena & Match Room Monitor',
      'panel-settings': 'Global Platform Governance Settings',
      'panel-audit': 'Immutable Administrative Audit Trails'
    };
    const headingEl = document.getElementById('panel-heading-title');
    if (headingEl) headingEl.textContent = titleMap[panelId] || 'Command Center';

    // Route loaders
    if (panelId === 'panel-overview') this.loadOverview();
    else if (panelId === 'panel-admins') this.loadAdmins();
    else if (panelId === 'panel-players') this.loadPlayers(1);
    else if (panelId === 'panel-finance') this.loadWithdrawals();
    else if (panelId === 'panel-tournaments') this.loadTournaments();
    else if (panelId === 'panel-rooms') this.loadRooms();
    else if (panelId === 'panel-settings') this.loadSettings();
    else if (panelId === 'panel-audit') this.loadAuditLogs(1);
  }

  // ================= 1. OVERVIEW DASHBOARD ================= //
  async loadOverview() {
    try {
      const res = await fetch('api/admin.php?action=get_overview');
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const s = data.stats;
      this.setText('kpi-total-rake', '₦' + Number(s.total_rake_naira || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 }));
      this.setText('kpi-total-users', Number(s.total_users || 0).toLocaleString());
      this.setText('kpi-verified-users', Number(s.verified_users || 0).toLocaleString());
      this.setText('kpi-pending-withdrawals', Number(s.pending_withdrawals_count || 0).toLocaleString());
      this.setText('kpi-pending-amount', '₦' + Number(s.pending_withdrawals_amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 }) + ' in queue');
      this.setText('kpi-live-rooms', Number(s.live_rooms || 0).toLocaleString());
      this.setText('kpi-active-tournaments', Number(s.active_tournaments || 0).toLocaleString());

      // Update Badges
      const payoutBadge = document.getElementById('badge-pending-payouts');
      if (payoutBadge) {
        if (s.pending_withdrawals_count > 0) {
          payoutBadge.textContent = s.pending_withdrawals_count;
          payoutBadge.style.display = 'inline-block';
        } else {
          payoutBadge.style.display = 'none';
        }
      }

      const roomBadge = document.getElementById('badge-live-rooms');
      if (roomBadge) {
        if (s.live_rooms > 0) {
          roomBadge.textContent = s.live_rooms;
          roomBadge.style.display = 'inline-block';
        } else {
          roomBadge.style.display = 'none';
        }
      }

      // Render Recent Pending Withdrawals
      const pendingListEl = document.getElementById('overview-pending-withdrawals-list');
      if (pendingListEl) {
        const list = data.recent_pending_withdrawals || [];
        if (list.length === 0) {
          pendingListEl.innerHTML = '<p class="text-muted" style="font-size:0.85rem; padding:10px 0;">✓ No pending bank payout requests in queue.</p>';
        } else {
          pendingListEl.innerHTML = list.map(item => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
              <div>
                <strong style="color:#ffffff; font-size:0.9rem;">${this.escape(item.username)}</strong>
                <div style="font-size:0.75rem; color:#94a3b8;">${this.escape(item.description)}</div>
              </div>
              <div style="text-align:right;">
                <span style="color:#f43f5e; font-weight:800; font-size:0.92rem;">₦${Number(Math.abs(item.amount)).toLocaleString()}</span>
                <div style="margin-top:3px;">
                  <button type="button" class="btn-admin btn-admin-success" style="padding:2px 8px; font-size:0.75rem;" onclick="adminApp.approveWithdrawal(${item.id})">Approve</button>
                </div>
              </div>
            </div>
          `).join('');
        }
      }

      // Render Recent Audit Log
      const auditListEl = document.getElementById('overview-recent-audit-list');
      if (auditListEl) {
        const logs = data.recent_audit || [];
        if (logs.length === 0) {
          auditListEl.innerHTML = '<p class="text-muted" style="font-size:0.85rem;">No recent audit activity.</p>';
        } else {
          auditListEl.innerHTML = logs.map(l => `
            <div style="padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.82rem;">
              <div style="display:flex; justify-content:space-between;">
                <strong style="color:#f59e0b;">${this.escape(l.admin_username)}</strong>
                <span style="color:#64748b; font-size:0.75rem;">${l.created_at}</span>
              </div>
              <div style="color:#cbd5e1; margin-top:2px;">
                <code>${this.escape(l.action)}</code> on ${this.escape(l.target_type)} #${this.escape(l.target_id || '')}
              </div>
            </div>
          `).join('');
        }
      }

    } catch (e) {
      console.error(e);
      this.showToast('Failed to load overview metrics', 'error');
    }
  }

  // ================= 2. ADMINS & RBAC ================= //
  async loadAdmins() {
    const tbody = document.getElementById('admins-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading staff...</td></tr>';

    try {
      const res = await fetch('api/admin.php?action=list_admins');
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const countBadge = document.getElementById('badge-admin-count');
      if (countBadge) countBadge.textContent = data.admins.length;

      tbody.innerHTML = data.admins.map(adm => {
        const isSuper = adm.role === 'super_admin';
        const isBanned = !!adm.is_banned;
        const permsList = adm.permissions || [];
        const title = adm.title || (isSuper ? 'Chief Platform Overseer' : 'Operations Arbiter');
        
        let permsBadges = '';
        if (isSuper) {
          permsBadges = '<span class="badge-role super_admin">🌟 ALL ROOT PERMISSIONS</span>';
        } else if (permsList.length === 0) {
          permsBadges = '<span class="text-muted" style="font-size:0.75rem;">No permissions assigned</span>';
        } else {
          permsBadges = permsList.map(p => `<span style="display:inline-block; font-size:0.68rem; background:rgba(255,255,255,0.06); padding:1px 5px; border-radius:3px; margin:2px; color:#cbd5e1;">${this.escape(p)}</span>`).join('');
        }

        return `
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap:10px;">
                <div class="admin-avatar-mini" style="${isSuper ? 'background:linear-gradient(135deg,#f59e0b,#ca8a04);' : 'background:linear-gradient(135deg,#3b82f6,#1d4ed8);'}">
                  ${this.escape(adm.username.charAt(0).toUpperCase())}
                </div>
                <div>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <strong style="color:#ffffff;">${this.escape(adm.username)}</strong>
                    ${adm.is_self ? '<span style="font-size:0.7rem; color:#f59e0b; font-weight:800;">(You)</span>' : ''}
                  </div>
                  <div style="font-size:0.75rem; color:#64748b;">${this.escape(adm.email)}</div>
                  <span class="staff-title-badge">${this.escape(title)}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="badge-role ${adm.role}">
                ${isSuper ? '👑 Super Admin' : '🛡️ Admin'}
              </span>
            </td>
            <td style="max-width:300px;">${permsBadges}</td>
            <td>
              <span style="font-size:0.8rem; font-weight:700; color:${isBanned ? '#f43f5e' : '#22c55e'};">
                <span class="staff-status-dot ${isBanned ? 'banned' : 'active'}"></span>
                ${isBanned ? 'Suspended' : 'Active'}
              </span>
            </td>
            <td style="font-size:0.78rem; color:#94a3b8;">${adm.created_at ? adm.created_at.split(' ')[0] : '—'}</td>
            <td style="text-align:right; white-space:nowrap;">
              ${this.currentAdmin && this.currentAdmin.is_super_admin ? `
                <button type="button" class="btn-action-icon" title="Edit Permissions & Title" onclick="adminApp.openEditAdminModal(${adm.id}, '${this.escape(adm.username)}', '${adm.role}', '${this.escape(title)}', ${JSON.stringify(permsList).replace(/"/g, '&quot;')})">✏️</button>
                <button type="button" class="btn-action-icon" title="Reset Staff Password" onclick="adminApp.openResetPasswordModal(${adm.id}, '${this.escape(adm.username)}')">🔑</button>
                ${!adm.is_self && adm.username !== 'GrandmasterAyo' ? `
                  <button type="button" class="btn-action-icon" title="${isBanned ? 'Reactivate Staff' : 'Suspend Staff'}" style="${isBanned ? 'color:#22c55e;' : 'color:#f59e0b;'}" onclick="adminApp.toggleUserStatus(${adm.id}, '${this.escape(adm.username)}')">${isBanned ? '▶️' : '⏸️'}</button>
                  <button type="button" class="btn-action-icon" title="Revoke Staff Access" style="color:#f43f5e;" onclick="adminApp.deleteAdmin(${adm.id}, '${this.escape(adm.username)}')">🗑️</button>
                ` : ''}
              ` : '<span class="text-muted" style="font-size:0.75rem;">Protected</span>'}
            </td>
          </tr>
        `;
      }).join('');
    } catch (e) {
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#f43f5e;">${this.escape(e.message)}</td></tr>`;
    }
  }

  switchProvisionTab(mode) {
    const paneNew = document.getElementById('pane-new-staff');
    const panePromote = document.getElementById('pane-promote-player');
    const btnNew = document.getElementById('tab-btn-new-staff');
    const btnPromote = document.getElementById('tab-btn-promote-player');
    const modeInput = document.getElementById('provision-mode');
    const submitBtn = document.getElementById('btn-submit-provision');

    if (mode === 'new') {
      if (paneNew) paneNew.style.display = 'block';
      if (panePromote) panePromote.style.display = 'none';
      if (btnNew) btnNew.classList.add('active');
      if (btnPromote) btnPromote.classList.remove('active');
      if (modeInput) modeInput.value = 'new';
      if (submitBtn) submitBtn.innerHTML = 'Provision Staff &rarr;';
    } else {
      if (paneNew) paneNew.style.display = 'none';
      if (panePromote) panePromote.style.display = 'block';
      if (btnNew) btnNew.classList.remove('active');
      if (btnPromote) btnPromote.classList.add('active');
      if (modeInput) modeInput.value = 'promote';
      if (submitBtn) submitBtn.innerHTML = '⭐ Promote Player to Staff &rarr;';
      this.populatePromoteUserSelect();
    }
  }

  async populatePromoteUserSelect(preselectId = null) {
    const select = document.getElementById('promote-user-select');
    if (!select) return;
    select.innerHTML = '<option value="">Loading players directory...</option>';

    try {
      const res = await fetch('api/admin.php?action=list_users&limit=100');
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const nonAdminUsers = data.users.filter(u => u.role !== 'super_admin');
      select.innerHTML = '<option value="">Choose player from directory...</option>' + 
        nonAdminUsers.map(u => `
          <option value="${u.id}" ${preselectId && Number(preselectId) === Number(u.id) ? 'selected' : ''}>
            ${this.escape(u.username)} (${this.escape(u.email)}) - [${u.role.toUpperCase()}] Rating: ${u.rating}
          </option>
        `).join('');
    } catch (e) {
      select.innerHTML = `<option value="">Failed to load players: ${this.escape(e.message)}</option>`;
    }
  }

  openCreateAdminModal(tab = 'new', preselectUserId = null) {
    const grid = document.getElementById('create-admin-permissions-grid');
    if (grid) {
      grid.innerHTML = this.permissionsRegistry.map(p => `
        <label class="permission-card">
          <input type="checkbox" name="permissions[]" value="${this.escape(p.key)}" ${p.key === 'manage_admins' ? '' : 'checked'}>
          <div class="perm-meta">
            <span class="perm-category-tag">${this.escape(p.category)}</span>
            <h4>${this.escape(p.title)}</h4>
            <p>${this.escape(p.description)}</p>
          </div>
        </label>
      `).join('');
    }

    // Set a default generated password in new password input
    this.generateRandomPassword('new-admin-password', false);

    this.switchProvisionTab(tab);
    if (tab === 'promote' && preselectUserId) {
      this.populatePromoteUserSelect(preselectUserId);
    }

    this.openModal('modal-create-admin');
  }

  applyRolePreset(presetKey, target = 'create') {
    const gridSelector = (target === 'create') ? '#create-admin-permissions-grid' : '#edit-admin-permissions-grid';
    const roleSelector = (target === 'create') ? 'new-admin-role' : 'edit-admin-role';
    const titleSelector = (target === 'create') ? 'new-admin-title' : 'edit-admin-title';
    const roleSelect = document.getElementById(roleSelector);
    const titleInput = document.getElementById(titleSelector);

    // Highlight active preset card
    const containerSelector = (target === 'create') ? '#create-presets-section' : '#edit-presets-section';
    document.querySelectorAll(`${containerSelector} .role-preset-card`).forEach(c => c.classList.remove('active'));

    const checkboxes = document.querySelectorAll(`${gridSelector} input[type="checkbox"]`);

    if (presetKey === 'super_admin') {
      if (roleSelect) roleSelect.value = 'super_admin';
      if (titleInput && target === 'create') titleInput.value = 'Executive Super Admin';
      checkboxes.forEach(cb => cb.checked = true);
    } else if (presetKey === 'treasury') {
      if (roleSelect) roleSelect.value = 'admin';
      if (titleInput && target === 'create') titleInput.value = 'Chief Financial Auditor';
      checkboxes.forEach(cb => {
        cb.checked = ['manage_finance', 'view_audit_logs'].includes(cb.value);
      });
    } else if (presetKey === 'tournament') {
      if (roleSelect) roleSelect.value = 'admin';
      if (titleInput && target === 'create') titleInput.value = 'Lead Tournament Arbiter';
      checkboxes.forEach(cb => {
        cb.checked = ['manage_tournaments', 'manage_rooms', 'manage_users'].includes(cb.value);
      });
    } else if (presetKey === 'moderator') {
      if (roleSelect) roleSelect.value = 'admin';
      if (titleInput && target === 'create') titleInput.value = 'Community Operations Moderator';
      checkboxes.forEach(cb => {
        cb.checked = ['manage_users', 'manage_rooms'].includes(cb.value);
      });
    } else if (presetKey === 'custom') {
      if (roleSelect) roleSelect.value = 'admin';
    }

    if (target === 'create') this.onRoleChange(roleSelect ? roleSelect.value : 'admin');
    else this.onEditRoleChange(roleSelect ? roleSelect.value : 'admin');
  }

  generateRandomPassword(inputId, notify = true) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const input = document.getElementById(inputId);
    if (input) {
      input.value = pass;
      input.type = 'text'; // Reveal generated password
      if (notify) this.showToast(`Generated: ${pass}`, 'info');
    }
  }

  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (btn) btn.textContent = '🙈';
    } else {
      input.type = 'password';
      if (btn) btn.textContent = '👁️';
    }
  }

  async handleCreateAdminSubmit(e) {
    e.preventDefault();
    const mode = document.getElementById('provision-mode').value;
    const role = document.getElementById('new-admin-role').value;
    const title = document.getElementById('new-admin-title').value.trim();

    const checkedPerms = [];
    document.querySelectorAll('#create-admin-permissions-grid input[type="checkbox"]:checked').forEach(cb => {
      checkedPerms.push(cb.value);
    });

    try {
      if (mode === 'new') {
        const username = document.getElementById('new-admin-username').value.trim();
        const email = document.getElementById('new-admin-email').value.trim();
        const password = document.getElementById('new-admin-password').value;

        if (!username || !email || !password) {
          throw new Error('Please fill in username, email, and password.');
        }

        const res = await fetch('api/admin.php?action=create_admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, role, title, permissions: checkedPerms })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        this.showToast(data.message, 'success');
      } else {
        const userId = document.getElementById('promote-user-select').value;
        if (!userId) throw new Error('Please select a player to promote.');

        const res = await fetch('api/admin.php?action=promote_existing_user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, role, title, permissions: checkedPerms })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        this.showToast(data.message, 'success');
      }

      this.closeModal('modal-create-admin');
      e.target.reset();
      this.loadAdmins();
      this.loadOverview();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  openEditAdminModal(adminId, username, role, title, currentPerms) {
    document.getElementById('edit-admin-id').value = adminId;
    document.getElementById('edit-admin-username-label').textContent = username;
    document.getElementById('edit-admin-role').value = role;
    document.getElementById('edit-admin-title').value = title || '';

    const grid = document.getElementById('edit-admin-permissions-grid');
    if (grid) {
      grid.innerHTML = this.permissionsRegistry.map(p => {
        const isChecked = currentPerms.includes(p.key);
        return `
          <label class="permission-card">
            <input type="checkbox" name="permissions[]" value="${this.escape(p.key)}" ${isChecked ? 'checked' : ''}>
            <div class="perm-meta">
              <span class="perm-category-tag">${this.escape(p.category)}</span>
              <h4>${this.escape(p.title)}</h4>
              <p>${this.escape(p.description)}</p>
            </div>
          </label>
        `;
      }).join('');
    }

    this.onEditRoleChange(role);
    this.openModal('modal-edit-admin-permissions');
  }

  onEditRoleChange(role) {
    const sec = document.getElementById('edit-permissions-section');
    if (sec) sec.style.display = (role === 'super_admin') ? 'none' : 'block';
  }

  async handleEditAdminSubmit(e) {
    e.preventDefault();
    const adminId = document.getElementById('edit-admin-id').value;
    const role = document.getElementById('edit-admin-role').value;
    const title = document.getElementById('edit-admin-title').value.trim();

    const checkedPerms = [];
    document.querySelectorAll('#edit-admin-permissions-grid input[type="checkbox"]:checked').forEach(cb => {
      checkedPerms.push(cb.value);
    });

    try {
      const res = await fetch('api/admin.php?action=update_admin_permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: adminId, role, title, permissions: checkedPerms })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.closeModal('modal-edit-admin-permissions');
      this.loadAdmins();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  // Provision New Player
  openProvisionPlayerModal() {
    const form = document.getElementById('form-provision-player');
    if (form) form.reset();
    document.getElementById('prov-player-balance').value = '0';
    document.getElementById('prov-player-coins').value = '500';
    document.getElementById('prov-player-rating').value = '1200';
    this.generateRandomPassword('prov-player-password', false);
    this.openModal('modal-provision-player');
  }

  async handleProvisionPlayerSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('prov-player-username').value.trim();
    const email = document.getElementById('prov-player-email').value.trim();
    const password = document.getElementById('prov-player-password').value;
    const wallet_balance = parseFloat(document.getElementById('prov-player-balance').value) || 0;
    const coins = parseInt(document.getElementById('prov-player-coins').value) || 0;
    const rating = parseInt(document.getElementById('prov-player-rating').value) || 1200;
    const packageType = document.getElementById('prov-player-package').value;
    const title = document.getElementById('prov-player-title').value.trim();

    try {
      const res = await fetch('api/admin.php?action=provision_player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username, email, password, wallet_balance, coins, rating, package: packageType, title
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.closeModal('modal-provision-player');
      this.loadPlayers(1);
      this.loadOverview();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  // Reset Password
  openResetPasswordModal(userId, username) {
    document.getElementById('reset-pass-user-id').value = userId;
    document.getElementById('reset-pass-username-label').textContent = username;
    this.generateRandomPassword('new-reset-password-input', false);
    this.openModal('modal-reset-password');
  }

  async handleResetPasswordSubmit(e) {
    e.preventDefault();
    const userId = document.getElementById('reset-pass-user-id').value;
    const newPass = document.getElementById('new-reset-password-input').value;

    try {
      const res = await fetch('api/admin.php?action=reset_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, new_password: newPass })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.closeModal('modal-reset-password');
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  async toggleUserStatus(userId, username) {
    if (!confirm(`Are you sure you want to toggle account status for '${username}'?`)) return;

    try {
      const res = await fetch('api/admin.php?action=toggle_user_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.loadAdmins();
      if (this.activeTab === 'panel-players') this.loadPlayers(1);
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  async clearStaleRooms() {
    if (!confirm('Clear all finished match rooms older than 24 hours?')) return;

    try {
      const res = await fetch('api/admin.php?action=clear_stale_rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.loadRooms();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  quickPromoteFromEditModal() {
    const userId = document.getElementById('edit-player-id').value;
    this.closeModal('modal-edit-player');
    this.openCreateAdminModal('promote', userId);
  }

  quickResetPasswordFromEditModal() {
    const userId = document.getElementById('edit-player-id').value;
    const username = document.getElementById('edit-player-username').textContent;
    this.closeModal('modal-edit-player');
    this.openResetPasswordModal(userId, username);
  }

  async deleteAdmin(adminId, username) {
    if (!confirm(`Are you sure you want to revoke staff privileges from '${username}'? They will be demoted back to regular player.`)) {
      return;
    }

    try {
      const res = await fetch('api/admin.php?action=delete_admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: adminId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.loadAdmins();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  // ================= 3. PLAYER DIRECTORY ================= //
  async loadPlayers(page = 1) {
    const tbody = document.getElementById('players-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Loading player directory...</td></tr>';

    const q = encodeURIComponent(document.getElementById('player-search-input')?.value || '');
    const pkg = encodeURIComponent(document.getElementById('player-package-filter')?.value || 'all');
    const status = encodeURIComponent(document.getElementById('player-status-filter')?.value || 'all');

    try {
      const res = await fetch(`api/admin.php?action=list_users&page=${page}&q=${q}&package=${pkg}&status=${status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      if (data.users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#94a3b8;">No players found matching your criteria.</td></tr>';
        return;
      }

      tbody.innerHTML = data.users.map(u => {
        const isBanned = !!u.is_banned;
        const isVerified = !!u.is_verified;

        return `
          <tr>
            <td>
              <div>
                <strong style="color:#ffffff;">${this.escape(u.username)}</strong>
                <div style="font-size:0.75rem; color:#64748b;">${this.escape(u.email)}</div>
              </div>
            </td>
            <td><strong>${u.rating || 1200}</strong></td>
            <td style="color:#22c55e; font-weight:700;">₦${Number(u.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
            <td style="color:#fde047; font-weight:700;">${Number(u.coins || 0).toLocaleString()} 🪙</td>
            <td>
              <span class="badge-status-chip ${u.package === 'vip_oba' ? 'warning' : 'success'}">
                ${this.escape(u.package.toUpperCase())}
              </span>
            </td>
            <td>
              <span class="badge-role ${u.role}">${u.role}</span>
            </td>
            <td>
              ${isBanned 
                ? '<span class="badge-status-chip danger">🔴 Banned</span>' 
                : (isVerified ? '<span class="badge-status-chip success">✓ Verified</span>' : '<span class="badge-status-chip warning">Unverified</span>')
              }
            </td>
            <td style="text-align:right; white-space:nowrap;">
              <button type="button" class="btn-action-icon" title="Promote to Admin Staff" style="color:var(--gold-400); margin-right:4px;" onclick="adminApp.openCreateAdminModal('promote', ${u.id})">⭐ Promote</button>
              <button type="button" class="btn-action-icon" title="Reset Password" style="margin-right:4px;" onclick="adminApp.openResetPasswordModal(${u.id}, '${this.escape(u.username)}')">🔑</button>
              <button type="button" class="btn-action-icon" title="Edit Player Profile" onclick="adminApp.openEditPlayerModal(${u.id})">✏️</button>
              <button type="button" class="btn-action-icon" title="Permanently Delete Player" style="color:#ef4444; margin-left:4px;" onclick="adminApp.confirmDeletePlayer(${u.id}, '${this.escape(u.username)}', '${this.escape(u.email)}')">🗑️</button>
            </td>
          </tr>
        `;
      }).join('');

      // Pagination
      const pInfo = document.getElementById('players-pagination-info');
      if (pInfo) {
        pInfo.textContent = `Page ${data.pagination.page} of ${data.pagination.total_pages} (${data.pagination.total} players)`;
      }

      const pControls = document.getElementById('players-pagination-controls');
      if (pControls) {
        let btns = '';
        if (page > 1) {
          btns += `<button class="btn-admin btn-admin-secondary" style="padding:2px 8px;" onclick="adminApp.loadPlayers(${page - 1})">&larr; Prev</button>`;
        }
        if (page < data.pagination.total_pages) {
          btns += `<button class="btn-admin btn-admin-secondary" style="padding:2px 8px;" onclick="adminApp.loadPlayers(${page + 1})">Next &rarr;</button>`;
        }
        pControls.innerHTML = btns;
      }

    } catch (e) {
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#f43f5e;">${this.escape(e.message)}</td></tr>`;
    }
  }

  async openEditPlayerModal(userId) {
    try {
      const res = await fetch(`api/admin.php?action=get_user_details&user_id=${userId}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const u = data.user;
      document.getElementById('edit-player-id').value = u.id;
      document.getElementById('edit-player-username').textContent = u.username;
      document.getElementById('edit-player-email').textContent = u.email;
      document.getElementById('edit-player-avatar').textContent = u.username.charAt(0).toUpperCase();

      document.getElementById('edit-player-balance').value = parseFloat(u.wallet_balance).toFixed(2);
      document.getElementById('edit-player-coins').value = u.coins;
      document.getElementById('edit-player-rating').value = u.rating;
      document.getElementById('edit-player-package').value = u.package;
      document.getElementById('edit-player-verified').value = u.is_verified ? '1' : '0';
      document.getElementById('edit-player-banned').value = u.is_banned ? '1' : '0';
      document.getElementById('edit-player-ban-reason').value = u.ban_reason || '';
      
      this.onBanStatusChange(u.is_banned ? '1' : '0');
      this.openModal('modal-edit-player');
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  onBanStatusChange(val) {
    const group = document.getElementById('edit-player-ban-reason-group');
    if (group) group.style.display = (val === '1') ? 'block' : 'none';
  }

  async handleEditPlayerSubmit(e) {
    e.preventDefault();
    const uid = parseInt(document.getElementById('edit-player-id').value, 10);
    const balance = parseFloat(document.getElementById('edit-player-balance').value);
    const coins = parseInt(document.getElementById('edit-player-coins').value, 10);
    const rating = parseInt(document.getElementById('edit-player-rating').value, 10);
    const pkg = document.getElementById('edit-player-package').value;
    const isVerified = document.getElementById('edit-player-verified').value === '1';
    const isBanned = document.getElementById('edit-player-banned').value === '1';
    const banReason = document.getElementById('edit-player-ban-reason').value.trim();

    try {
      const res = await fetch('api/admin.php?action=update_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: uid,
          wallet_balance: balance,
          coins,
          rating,
          package: pkg,
          is_verified: isVerified,
          is_banned: isBanned,
          ban_reason: banReason
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.closeModal('modal-edit-player');
      this.loadPlayers(1);
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  async confirmDeletePlayer(userId, username, email) {
    const confirmation = prompt(`⚠️ PERMANENT DELETION WARNING:\n\nAre you sure you want to permanently delete player "${username}" (${email}) and ALL their matches, wallet transactions, and records?\n\nType DELETE to confirm:`);
    if (confirmation !== 'DELETE') {
      if (confirmation !== null) this.showToast('Deletion cancelled.', 'info');
      return;
    }

    try {
      const res = await fetch('api/admin.php?action=delete_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.loadPlayers(1);
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  // ================= 4. FINANCIAL CASHIER ================= //
  async loadWithdrawals() {
    const tbody = document.getElementById('withdrawals-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Loading cashier requests...</td></tr>';

    const statusFilter = document.getElementById('withdrawal-status-filter')?.value || 'pending';

    try {
      const res = await fetch(`api/admin.php?action=list_withdrawals&status=${statusFilter}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      if (data.withdrawals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#94a3b8;">No withdrawal records found.</td></tr>';
        return;
      }

      tbody.innerHTML = data.withdrawals.map(w => {
        const amt = Math.abs(parseFloat(w.amount));
        const isPending = w.status === 'pending';

        return `
          <tr>
            <td>#${w.id}</td>
            <td>
              <strong style="color:#ffffff;">${this.escape(w.username)}</strong>
              <div style="font-size:0.75rem; color:#64748b;">${this.escape(w.email)}</div>
            </td>
            <td>
              <div style="font-size:0.85rem; color:#cbd5e1;">${this.escape(w.description)}</div>
              <div style="font-size:0.72rem; color:#f59e0b;">Ref: ${this.escape(w.reference || 'N/A')}</div>
            </td>
            <td style="color:#f43f5e; font-weight:800; font-size:1rem;">₦${amt.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
            <td style="color:#22c55e;">₦${Number(w.current_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
            <td style="font-size:0.78rem; color:#94a3b8;">${w.created_at}</td>
            <td>
              <span class="badge-status-chip ${w.status === 'completed' ? 'success' : (w.status === 'pending' ? 'warning' : 'danger')}">
                ${w.status.toUpperCase()}
              </span>
            </td>
            <td style="text-align:right;">
              ${isPending ? `
                <button type="button" class="btn-admin btn-admin-success" style="padding:4px 8px; font-size:0.75rem;" onclick="adminApp.approveWithdrawal(${w.id}, ${amt})">✓ Approve</button>
                <button type="button" class="btn-admin btn-admin-danger" style="padding:4px 8px; font-size:0.75rem;" onclick="adminApp.openRejectWithdrawalModal(${w.id})">✕ Reject</button>
              ` : '<span class="text-muted" style="font-size:0.75rem;">Settled</span>'}
            </td>
          </tr>
        `;
      }).join('');

    } catch (e) {
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#f43f5e;">${this.escape(e.message)}</td></tr>`;
    }
  }

  async approveWithdrawal(txId, amount) {
    if (!confirm(`Confirm bank transfer payout of ₦${amount ? amount.toLocaleString() : ''} for request #${txId}?`)) {
      return;
    }

    try {
      const res = await fetch('api/admin.php?action=approve_withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: txId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.loadWithdrawals();
      this.loadOverview();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  openRejectWithdrawalModal(txId) {
    document.getElementById('reject-tx-id').value = txId;
    this.openModal('modal-reject-withdrawal');
  }

  async handleRejectWithdrawalSubmit(e) {
    e.preventDefault();
    const txId = parseInt(document.getElementById('reject-tx-id').value, 10);
    const reason = document.getElementById('reject-reason').value.trim();

    try {
      const res = await fetch('api/admin.php?action=reject_withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: txId, reason })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.closeModal('modal-reject-withdrawal');
      document.getElementById('reject-reason').value = '';
      this.loadWithdrawals();
      this.loadOverview();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  async openManualBalanceModal() {
    const sel = document.getElementById('manual-player-select');
    if (sel) {
      sel.innerHTML = '<option value="">Loading players...</option>';
      try {
        const res = await fetch('api/admin.php?action=list_users&limit=100');
        const data = await res.json();
        if (data.success) {
          sel.innerHTML = '<option value="">Select target player...</option>' + 
            data.users.map(u => `<option value="${u.id}">${this.escape(u.username)} (${this.escape(u.email)}) - Bal: ₦${Number(u.wallet_balance).toLocaleString()}</option>`).join('');
        }
      } catch (e) {
        console.error(e);
      }
    }
    this.openModal('modal-manual-balance');
  }

  async handleManualBalanceSubmit(e) {
    e.preventDefault();
    const uid = parseInt(document.getElementById('manual-player-select').value, 10);
    const naira = parseFloat(document.getElementById('manual-naira-amount').value || 0);
    const coins = parseInt(document.getElementById('manual-coins-amount').value || 0, 10);
    const reason = document.getElementById('manual-adj-reason').value.trim();

    try {
      const res = await fetch('api/admin.php?action=adjust_wallet_balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uid, amount_naira: naira, coins, reason })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.closeModal('modal-manual-balance');
      e.target.reset();
      this.loadOverview();
      if (this.activeTab === 'panel-players') this.loadPlayers(1);
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  // ================= 5. TOURNAMENTS & BRACKETS ================= //
  async loadTournaments() {
    const tbody = document.getElementById('tournaments-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Loading tournaments...</td></tr>';

    try {
      const res = await fetch('api/admin.php?action=list_tournaments');
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      if (data.tournaments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#94a3b8;">No tournaments registered.</td></tr>';
        return;
      }

      tbody.innerHTML = data.tournaments.map(t => {
        const isLive = t.status === 'live';
        const isUpcoming = t.status === 'upcoming';
        const isCompleted = t.status === 'completed';

        return `
          <tr>
            <td>#${t.id}</td>
            <td>
              <strong style="color:#ffffff;">${this.escape(t.name)}</strong>
              <div style="font-size:0.75rem; color:#64748b;">${this.escape(t.tagline || 'Official Cup')}</div>
            </td>
            <td style="color:#f59e0b; font-weight:700;">₦${Number(t.prize_pool_naira || 0).toLocaleString()}</td>
            <td style="color:#22c55e;">₦${Number(t.entry_fee_naira || 0).toLocaleString()}</td>
            <td>${t.participant_count || 0} / ${t.max_participants || 8}</td>
            <td><span class="badge-status-chip warning">${this.escape(t.current_round || 'R1')}</span></td>
            <td>
              <span class="badge-status-chip ${isCompleted ? 'success' : (isLive ? 'danger' : 'warning')}">
                ${t.status.toUpperCase()}
              </span>
            </td>
            <td style="text-align:right;">
              ${!isCompleted && t.status !== 'cancelled' ? `
                <button type="button" class="btn-admin btn-admin-danger" style="padding:2px 8px; font-size:0.72rem;" onclick="adminApp.cancelTournament(${t.id}, '${this.escape(t.name)}')">Cancel & Refund</button>
              ` : '<span class="text-muted" style="font-size:0.75rem;">Ended</span>'}
            </td>
          </tr>
        `;
      }).join('');

    } catch (e) {
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#f43f5e;">${this.escape(e.message)}</td></tr>`;
    }
  }

  async cancelTournament(tournId, tournName) {
    const reason = prompt(`Reason for cancelling '${tournName}' and refunding all enrolled participants:`, 'Cancelled by administrator');
    if (reason === null) return;

    try {
      const res = await fetch('api/admin.php?action=cancel_tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournament_id: tournId, reason })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.loadTournaments();
      this.loadOverview();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  openCreateTournamentModal() {
    this.openModal('modal-create-tournament');
  }

  async handleCreateTournamentSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('tourn-name').value.trim();
    const tagline = document.getElementById('tourn-tagline').value.trim();
    const prizeNaira = parseFloat(document.getElementById('tourn-prize-naira').value || 0);
    const entryNaira = parseFloat(document.getElementById('tourn-entry-naira').value || 0);
    const entryCoins = parseInt(document.getElementById('tourn-entry-coins').value || 0, 10);
    const size = parseInt(document.getElementById('tourn-bracket-size').value, 10);

    try {
      const res = await fetch('api/tournaments.php?action=host_tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: name,
          tagline,
          prize_pool_naira: prizeNaira,
          entry_fee_naira: entryNaira,
          entry_fee_coins: entryCoins,
          max_participants: size
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.closeModal('modal-create-tournament');
      e.target.reset();
      this.loadTournaments();
      this.loadOverview();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  // ================= 6. LIVE ROOMS MONITOR ================= //
  async loadRooms() {
    const tbody = document.getElementById('rooms-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Loading active rooms...</td></tr>';

    try {
      const res = await fetch('api/admin.php?action=list_rooms');
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      if (data.rooms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#94a3b8;">No active game rooms found.</td></tr>';
        return;
      }

      tbody.innerHTML = data.rooms.map(r => {
        const isActive = r.status === 'active';
        const isFinished = r.status === 'finished';

        return `
          <tr>
            <td><strong style="color:#f59e0b;">${this.escape(r.room_code)}</strong></td>
            <td>${this.escape(r.host_name || 'Host')}</td>
            <td>${this.escape(r.guest_name || 'Waiting...')}</td>
            <td style="color:#22c55e; font-weight:700;">₦${Number(r.wager_naira || 0).toLocaleString()}</td>
            <td><span class="badge-role player">${this.escape(r.game_type)}</span></td>
            <td>
              <span class="badge-status-chip ${isActive ? 'danger' : (isFinished ? 'success' : 'warning')}">
                ${r.status.toUpperCase()}
              </span>
            </td>
            <td style="font-size:0.75rem; color:#94a3b8;">${r.created_at}</td>
            <td style="text-align:right;">
              <a href="game.php?room=${this.escape(r.room_code)}" target="_blank" class="btn-action-icon" title="Spectate Room">👁️</a>
              ${!isFinished ? `
                <button type="button" class="btn-action-icon" style="color:#f43f5e;" title="Terminate Room" onclick="adminApp.terminateRoom('${this.escape(r.room_code)}')">🛑</button>
              ` : ''}
            </td>
          </tr>
        `;
      }).join('');

    } catch (e) {
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#f43f5e;">${this.escape(e.message)}</td></tr>`;
    }
  }

  async terminateRoom(roomCode) {
    const reason = prompt(`Reason for terminating match room '${roomCode}':`, 'Terminated by administrator');
    if (reason === null) return;

    try {
      const res = await fetch('api/admin.php?action=terminate_room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_code: roomCode, reason })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.loadRooms();
      this.loadOverview();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  // ================= 7. SYSTEM SETTINGS ================= //
  async loadSettings() {
    try {
      const res = await fetch('api/admin.php?action=get_settings');
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const map = {};
      (data.settings || []).forEach(s => {
        map[s.setting_key] = s.setting_value;
      });

      this.setValue('set-match-rake', map.platform_match_rake || '8');
      this.setValue('set-vip-rake', map.platform_vip_rake || '4');
      this.setValue('set-tourn-commission', map.platform_tourn_commission || '10');
      this.setValue('set-min-withdrawal', map.min_withdrawal_naira || '1000');
      this.setValue('set-min-deposit', map.min_deposit_naira || '500');
      this.setValue('set-maintenance', map.maintenance_mode || '0');
      this.setValue('set-maintenance-msg', map.maintenance_message || '');
      this.setValue('set-announcement', map.global_announcement || '');

    } catch (e) {
      console.error(e);
      this.showToast('Failed to load system settings', 'error');
    }
  }

  saveSettings() {
    const form = document.getElementById('form-system-settings');
    if (form) form.requestSubmit();
  }

  async handleSettingsSubmit(e) {
    e.preventDefault();
    const payload = {
      platform_match_rake: document.getElementById('set-match-rake').value,
      platform_vip_rake: document.getElementById('set-vip-rake').value,
      platform_tourn_commission: document.getElementById('set-tourn-commission').value,
      min_withdrawal_naira: document.getElementById('set-min-withdrawal').value,
      min_deposit_naira: document.getElementById('set-min-deposit').value,
      maintenance_mode: document.getElementById('set-maintenance').value,
      maintenance_message: document.getElementById('set-maintenance-msg').value,
      global_announcement: document.getElementById('set-announcement').value
    };

    try {
      const res = await fetch('api/admin.php?action=update_settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      this.showToast(data.message, 'success');
      this.loadOverview();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  // ================= 8. AUDIT LOGS ================= //
  async loadAuditLogs(page = 1) {
    const tbody = document.getElementById('audit-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading audit trails...</td></tr>';

    const actFilter = encodeURIComponent(document.getElementById('audit-action-filter')?.value || '');

    try {
      const res = await fetch(`api/admin.php?action=get_audit_logs&page=${page}&action_filter=${actFilter}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      if (data.logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No audit records found.</td></tr>';
        return;
      }

      tbody.innerHTML = data.logs.map(l => `
        <tr>
          <td style="font-size:0.75rem; color:#94a3b8;">${l.created_at}</td>
          <td><strong style="color:#f59e0b;">${this.escape(l.admin_username)}</strong></td>
          <td><code style="background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px; font-size:0.78rem;">${this.escape(l.action)}</code></td>
          <td>${this.escape(l.target_type)} #${this.escape(l.target_id || '—')}</td>
          <td style="max-width:320px; font-size:0.78rem; color:#cbd5e1; word-break:break-all;">${this.escape(l.details || '—')}</td>
          <td style="font-size:0.72rem; color:#64748b;">${this.escape(l.ip_address || '127.0.0.1')}</td>
        </tr>
      `).join('');

      // Pagination
      const pInfo = document.getElementById('audit-pagination-info');
      if (pInfo) {
        pInfo.textContent = `Page ${data.pagination.page} of ${data.pagination.total_pages} (${data.pagination.total} events)`;
      }

      const pControls = document.getElementById('audit-pagination-controls');
      if (pControls) {
        let btns = '';
        if (page > 1) {
          btns += `<button class="btn-admin btn-admin-secondary" style="padding:2px 8px;" onclick="adminApp.loadAuditLogs(${page - 1})">&larr; Prev</button>`;
        }
        if (page < data.pagination.total_pages) {
          btns += `<button class="btn-admin btn-admin-secondary" style="padding:2px 8px;" onclick="adminApp.loadAuditLogs(${page + 1})">Next &rarr;</button>`;
        }
        pControls.innerHTML = btns;
      }

    } catch (e) {
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#f43f5e;">${this.escape(e.message)}</td></tr>`;
    }
  }

  // ================= UTILITIES & MODAL HELPERS ================= //
  openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.add('open');
  }

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('open');
  }

  onRoleChange(role) {
    const sec = document.getElementById('create-permissions-section');
    if (sec) {
      sec.style.display = (role === 'super_admin') ? 'none' : 'block';
    }
  }

  toggleAllPermissions(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const cbs = form.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(cbs).every(c => c.checked);
    cbs.forEach(c => c.checked = !allChecked);
  }

  showToast(msg, type = 'info') {
    const container = document.getElementById('admin-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    else if (type === 'error') icon = '✕';

    toast.innerHTML = `<span>${icon}</span> <span>${this.escape(msg)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  }

  setText(id, txt) {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  }

  setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  escape(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Instantiate and attach globally
const adminApp = new AdminApp();
document.addEventListener('DOMContentLoaded', () => adminApp.init());
