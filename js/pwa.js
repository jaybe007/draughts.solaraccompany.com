/**
 * Naija Draughts - Progressive Web App (PWA) Client Controller
 * Manages service worker registration, installation prompts, and native mobile launch.
 */

(function () {
  'use strict';

  let deferredPrompt = null;
  const DISMISS_KEY = 'naija_draughts_pwa_dismissed';

  // 1. Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then((reg) => {
          // Listen for SW updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New version installed! Ready to refresh.');
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[PWA] ServiceWorker registration failed:', err);
        });
    });
  }

  // 2. Check if already running as installed Standalone PWA
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://');

  if (isStandalone) {
    document.body?.classList.add('is-standalone-pwa');
    // Already installed! Don't show install buttons/banners.
    return;
  }

  // 3. Detect iOS Safari
  const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIosSafari = isIos && isSafari;

  // 4. Capture 'beforeinstallprompt' (Android / Chrome / Edge / Desktop)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.deferredPwaPrompt = e;

    // Show header install button
    const navBtn = document.getElementById('btn-pwa-install');
    const navItem = document.getElementById('nav-item-pwa-install');
    if (navItem) navItem.style.display = 'inline-block';
    if (navBtn) navBtn.style.display = 'inline-flex';

    // Show mobile floating banner if not recently dismissed
    checkAndShowInstallBanner();
  });

  // 5. Track App Installation Success
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Naija Draughts successfully installed!');
    deferredPrompt = null;
    window.deferredPwaPrompt = null;
    hideAllInstallUI();
    if (typeof showToast === 'function') {
      showToast('🎉 Naija Draughts installed on your home screen!', 'success');
    }
  });

  // Global trigger function for navbar buttons or custom links
  window.triggerPwaInstall = async function () {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        console.log('[PWA] User accepted installation prompt');
        hideAllInstallUI();
      } else {
        console.log('[PWA] User dismissed installation prompt');
      }
      deferredPrompt = null;
      window.deferredPwaPrompt = null;
    } else if (isIosSafari) {
      showIosInstructions();
    } else {
      if (typeof showToast === 'function') {
        showToast('ℹ️ To install: Tap your browser menu (⋮) and select "Install app" or "Add to Home Screen".', 'info');
      }
    }
  };

  function checkAndShowInstallBanner() {
    const dismissedUntil = localStorage.getItem(DISMISS_KEY);
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
      return; // Still in snooze period
    }

    // Delay 3 seconds after page load for non-intrusive experience
    setTimeout(() => {
      renderInstallBanner();
    }, 3000);
  }

  function renderInstallBanner() {
    if (document.getElementById('pwa-floating-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-floating-banner';
    banner.className = 'pwa-banner-card';
    banner.innerHTML = `
      <div class="pwa-banner-content">
        <img src="icons/icon-192.png" alt="Naija Draughts Icon" class="pwa-banner-icon" />
        <div class="pwa-banner-text">
          <div class="pwa-banner-title">Install Naija Draughts</div>
          <div class="pwa-banner-desc">Full-screen gameplay, faster loads & zero lag on your phone!</div>
        </div>
      </div>
      <div class="pwa-banner-actions">
        <button type="button" class="pwa-btn-dismiss" id="pwa-btn-dismiss" aria-label="Dismiss">&times;</button>
        <button type="button" class="pwa-btn-install" id="pwa-btn-confirm-install">
          <span>📲</span> Install App
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    // Animate in
    requestAnimationFrame(() => {
      banner.classList.add('visible');
    });

    document.getElementById('pwa-btn-confirm-install')?.addEventListener('click', () => {
      window.triggerPwaInstall();
    });

    document.getElementById('pwa-btn-dismiss')?.addEventListener('click', () => {
      dismissInstallBanner();
    });
  }

  function dismissInstallBanner() {
    const banner = document.getElementById('pwa-floating-banner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 400);
    }
    // Snooze for 5 days
    localStorage.setItem(DISMISS_KEY, (Date.now() + (5 * 86400 * 1000)).toString());
  }

  function hideAllInstallUI() {
    const navItem = document.getElementById('nav-item-pwa-install');
    if (navItem) navItem.style.display = 'none';
    const banner = document.getElementById('pwa-floating-banner');
    if (banner) banner.remove();
  }

  function showIosInstructions() {
    if (document.getElementById('pwa-ios-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'pwa-ios-modal';
    modal.className = 'pwa-ios-overlay';
    modal.innerHTML = `
      <div class="pwa-ios-dialog">
        <div class="pwa-ios-header">
          <img src="icons/icon-192.png" alt="Naija Draughts" class="pwa-ios-icon" />
          <h4 style="margin:0; font-size:1.1rem; color:#f59e0b;">Install on iPhone / iPad</h4>
          <button type="button" class="pwa-ios-close" id="pwa-ios-close-btn">&times;</button>
        </div>
        <div class="pwa-ios-body">
          <p style="margin:0 0 14px; font-size:0.88rem; color:#cbd5e1;">
            To install Naija Draughts as a standalone app on your Apple home screen:
          </p>
          <div class="pwa-ios-step">
            <span class="pwa-step-num">1</span>
            <span>Tap the <strong>Share</strong> button <span style="font-size:1.2rem;">⎋</span> at the bottom of Safari.</span>
          </div>
          <div class="pwa-ios-step">
            <span class="pwa-step-num">2</span>
            <span>Scroll down and tap <strong>Add to Home Screen ➕</strong>.</span>
          </div>
          <div class="pwa-ios-step">
            <span class="pwa-step-num">3</span>
            <span>Tap <strong>Add</strong> in the top-right corner to launch in full screen!</span>
          </div>
        </div>
        <button type="button" class="pwa-ios-done-btn" id="pwa-ios-done-btn">Got It!</button>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    document.getElementById('pwa-ios-close-btn')?.addEventListener('click', close);
    document.getElementById('pwa-ios-done-btn')?.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }

  // Check iOS prompt if not dismissed
  if (isIosSafari && !isStandalone) {
    const dismissedUntil = localStorage.getItem(DISMISS_KEY);
    if (!dismissedUntil || Date.now() >= parseInt(dismissedUntil, 10)) {
      setTimeout(() => {
        const navItem = document.getElementById('nav-item-pwa-install');
        const navBtn = document.getElementById('btn-pwa-install');
        if (navItem) navItem.style.display = 'inline-block';
        if (navBtn) navBtn.style.display = 'inline-flex';
      }, 2000);
    }
  }

  // Inject sleek styles for PWA banner & iOS modal
  const style = document.createElement('style');
  style.textContent = `
    /* PWA Floating Bottom Banner */
    .pwa-banner-card {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(120%);
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.94));
      border: 1px solid rgba(245, 158, 11, 0.4);
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.2);
      border-radius: 16px;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      z-index: 999999;
      width: calc(100% - 32px);
      max-width: 480px;
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .pwa-banner-card.visible {
      transform: translateX(-50%) translateY(0);
    }
    .pwa-banner-content {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .pwa-banner-icon {
      width: 46px;
      height: 46px;
      border-radius: 10px;
      flex-shrink: 0;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .pwa-banner-title {
      font-size: 0.95rem;
      font-weight: 800;
      color: #f59e0b;
      line-height: 1.2;
    }
    .pwa-banner-desc {
      font-size: 0.76rem;
      color: #cbd5e1;
      margin-top: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pwa-banner-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .pwa-btn-install {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      font-weight: 800;
      font-size: 0.85rem;
      border: none;
      padding: 9px 16px;
      border-radius: 10px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .pwa-btn-install:hover {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      transform: translateY(-1px);
    }
    .pwa-btn-dismiss {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.3rem;
      cursor: pointer;
      padding: 4px;
      line-height: 1;
    }
    .pwa-btn-dismiss:hover {
      color: #ffffff;
    }

    /* iOS Safari Install Modal */
    .pwa-ios-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(8px);
    }
    .pwa-ios-dialog {
      background: #0f172a;
      border: 1px solid rgba(245, 158, 11, 0.4);
      border-radius: 18px;
      padding: 22px 24px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
    }
    .pwa-ios-header {
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      margin-bottom: 16px;
    }
    .pwa-ios-icon {
      width: 38px;
      height: 38px;
      border-radius: 8px;
    }
    .pwa-ios-close {
      position: absolute;
      right: 0;
      top: 0;
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.4rem;
      cursor: pointer;
    }
    .pwa-ios-step {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 0.85rem;
      color: #e2e8f0;
      margin-bottom: 12px;
      background: rgba(255,255,255,0.03);
      padding: 8px 12px;
      border-radius: 8px;
    }
    .pwa-step-num {
      background: #f59e0b;
      color: #0f172a;
      font-weight: 800;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      flex-shrink: 0;
    }
    .pwa-ios-done-btn {
      width: 100%;
      padding: 11px;
      border: none;
      border-radius: 10px;
      background: #f59e0b;
      color: #0f172a;
      font-weight: 800;
      font-size: 0.95rem;
      cursor: pointer;
      margin-top: 10px;
    }

    /* Standalone App Fullscreen Adjustments */
    body.is-standalone-pwa {
      user-select: none;
      -webkit-user-select: none;
    }
  `;
  document.head?.appendChild(style);

  // 9. Client Error Telemetry for Admin Diagnostic Engine
  let clientErrorsSent = 0;
  window.addEventListener('error', function (evt) {
    if (clientErrorsSent >= 3) return;
    clientErrorsSent++;
    try {
      fetch('api/log_client_error.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: evt.message || 'Script Error',
          source: evt.filename || window.location.href,
          lineno: evt.lineno || 0,
          colno: evt.colno || 0,
          stack: evt.error ? evt.error.stack : '',
          url: window.location.href
        })
      }).catch(function () {});
    } catch (e) {}
  });

  window.addEventListener('unhandledrejection', function (evt) {
    if (clientErrorsSent >= 3) return;
    clientErrorsSent++;
    try {
      var reason = evt.reason;
      var msg = reason ? (reason.message || String(reason)) : 'Unhandled Promise Rejection';
      var stack = reason && reason.stack ? reason.stack : '';
      fetch('api/log_client_error.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          source: window.location.href,
          lineno: 0,
          stack: stack,
          url: window.location.href
        })
      }).catch(function () {});
    } catch (e) {}
  });

})();

