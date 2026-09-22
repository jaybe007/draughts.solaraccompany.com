/**
 * Live Street Corner Chat & Nigerian Banter Soundboard
 */

import { sound } from './audio.js';

export class StreetChatController {
  constructor(options = {}) {
    this.app = options.app;
    this.isOpen = false;
    this.lastMsgId = 0;
    this.pollInterval = null;

    this.initDOM();
  }

  initDOM() {
    this.drawer = document.getElementById('chat-drawer');
    this.btnToggle = document.getElementById('nav-chat');
    this.btnClose = document.getElementById('btn-close-chat');
    this.msgList = document.getElementById('chat-messages-container');
    this.form = document.getElementById('chat-form');
    this.inputMsg = document.getElementById('chat-input-text');
    this.shoutBtns = document.querySelectorAll('.chat-shout-btn');
    this.unreadBadge = document.getElementById('chat-unread-badge');

    if (this.btnToggle) {
      this.btnToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleChat();
      });
    }

    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.closeChat());
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    this.shoutBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const shoutText = btn.dataset.shout;
        this.sendMessage(shoutText, true);
        sound.playCapture();
      });
    });

    // Start background polling
    this.fetchMessages();
    this.pollInterval = setInterval(() => {
      this.fetchMessages();
    }, 4000);
  }

  toggle() {
    this.toggleChat();
  }

  open() {
    this.isOpen = true;
    if (this.drawer) {
      this.drawer.classList.add('active');
      if (this.unreadBadge) this.unreadBadge.style.display = 'none';
      this.scrollToBottom();
    }
  }

  close() {
    this.closeChat();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.drawer.classList.add('active');
      if (this.unreadBadge) this.unreadBadge.style.display = 'none';
      this.scrollToBottom();
    } else {
      this.drawer.classList.remove('active');
    }
  }

  closeChat() {
    this.isOpen = false;
    if (this.drawer) this.drawer.classList.remove('active');
  }

  async fetchMessages() {
    try {
      const res = await fetch('api/chat.php?action=list');
      const data = await res.json();
      if (data.success && data.messages) {
        this.renderMessages(data.messages);
      }
    } catch (e) {}
  }

  renderMessages(messages) {
    if (!this.msgList) return;

    let hasNew = false;
    messages.forEach(m => {
      if (m.id > this.lastMsgId) {
        this.lastMsgId = m.id;
        hasNew = true;
      }
    });

    if (!hasNew && this.renderedCount === messages.length) return;
    this.renderedCount = messages.length;

    this.msgList.innerHTML = messages.map(m => {
      const isShout = m.is_shout == 1;
      const isMe = this.app.currentUser && this.app.currentUser.username === m.username;
      return `
        <div class="chat-bubble ${isMe ? 'me' : ''} ${isShout ? 'shout' : ''}">
          <div class="chat-sender">${this.escapeHTML(m.username)}</div>
          <div class="chat-content">${this.escapeHTML(m.message)}</div>
        </div>
      `;
    }).join('');

    if (this.isOpen) {
      this.scrollToBottom();
    } else if (hasNew && this.unreadBadge) {
      this.unreadBadge.style.display = 'inline-block';
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const text = this.inputMsg.value.trim();
    if (!text) return;
    this.inputMsg.value = '';
    await this.sendMessage(text, false);
  }

  async sendMessage(message, isShout = false) {
    try {
      const res = await fetch('api/chat.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          message,
          is_shout: isShout ? 1 : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        this.fetchMessages();
      }
    } catch (e) {}
  }

  scrollToBottom() {
    if (this.msgList) {
      this.msgList.scrollTop = this.msgList.scrollHeight;
    }
  }

  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}
