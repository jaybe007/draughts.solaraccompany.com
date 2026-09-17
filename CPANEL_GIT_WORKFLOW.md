# 🚀 cPanel & Git Workflow Guide: Managing Settings & Deployments Safely

This guide explains step-by-step how to work locally, commit changes to GitHub, and update your live app on **cPanel** without ever overwriting or breaking your live database credentials and passwords.

---

## 🔑 The Core Rule: Code vs. Configuration

| Item | Where it Lives | Tracked by Git? | Shared to GitHub? |
| :--- | :--- | :---: | :---: |
| **Source Code** (`*.php`, `*.js`, `*.css`, `*.html`) | Local & Server | ✅ **YES** | ✅ **YES** |
| **Local Config** (XAMPP `root`, blank password) | Read from local defaults | ✅ Defaults in `db.php` | ✅ Safe defaults only |
| **cPanel Passwords & DB User** | Inside **`.env`** on cPanel | ❌ **NO (Ignored)** | ❌ **NEVER** |

Because `.env` is listed in your `.gitignore`, **Git will NEVER commit, push, or overwrite `.env`**. Your live cPanel database credentials remain completely isolated and permanent on your server.

---

## ⚙️ Phase 1: One-Time cPanel Setup

Follow these steps once on your cPanel account:

### 1. Show Hidden Files in cPanel
Files starting with a dot (like `.env` and `.htaccess`) are hidden by default in cPanel:
1. Log into your **cPanel**.
2. Open **File Manager**.
3. Click the **Settings** button in the top-right corner.
4. Check **"Show Hidden Files (dotfiles)"** and click **Save**.

### 2. Create your server `.env` file
1. In File Manager, open your app folder (e.g., `public_html` or `public_html/nigerian-draughts`).
2. If `.env` does not exist:
   - Click **+ File** at the top left.
   - Name it `.env` (with the dot in front).
3. Right-click `.env` &rarr; click **Edit**.
4. Paste your cPanel production credentials:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# cPanel MySQL Database Settings
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cpaneluser_naija_draughts
DB_USER=cpaneluser_dbuser
DB_PASS=YourRealCpanelPassword123!

# Payment Gateways (Live or Test)
PAYSTACK_PUBLIC_KEY=pk_live_xxxx
PAYSTACK_SECRET_KEY=sk_live_xxxx
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxx
PAYMENT_DEV_MODE=false

# SMTP Mail Settings (for email verification & notifications)
SMTP_ENABLED=true
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=no-reply@yourdomain.com
SMTP_PASS=YourEmailPassword123!
SMTP_SECURE=tls
```
5. Click **Save Changes**.

> 💡 **Result**: Now, whenever PHP runs on cPanel, `config/env.php` automatically loads your database user and password from `.env`.

---

## 🔄 Phase 2: Everyday Workflow (Local to GitHub to cPanel)

### Step 1: Work & Test Locally (Your Computer)
- Your local machine uses local XAMPP settings automatically (or a local `.env`).
- Make changes to your PHP, JavaScript, CSS, or HTML files.
- Test your changes at `http://localhost/nigerian-draughts/`.

### Step 2: Commit & Push to GitHub
When you are ready to save or deploy your changes, open your terminal and run:

```bash
# Check what files changed
git status

# Stage your updated files
git add .

# Commit with a description of what you changed
git commit -m "Describe your changes here"

# Push to your GitHub repository
git push origin main
```

> 🛡️ **Safety Check**: Notice that `git status` will **NEVER** show `.env` or your cPanel passwords.

---

### Step 3: Update Code on cPanel

You can update cPanel using either **Git Version Control** or **Manual ZIP Upload**:

#### Option A: Using cPanel Git Version Control (Recommended & Fastest)
If you cloned the repo using cPanel's **Git™ Version Control**:
1. In cPanel, open **Git™ Version Control**.
2. Click **Manage** next to your repository.
3. Click the **Pull or Deploy** tab.
4. Click **Update from Remote**.
5. Git pulls the latest code from GitHub.
   - **Your `.env` file on cPanel is NOT touched** because Git doesn't track it.
   - Your database credentials and passwords stay 100% intact.

#### Option B: Updating via File Manager / FTP
If you upload files manually:
1. Upload your updated code files (e.g. `auth.php`, `js/app.js`, `style.css`).
2. **Never overwrite or delete `.env`**.
3. Your database and password configuration continue working without interruption.

---

## 🚨 Safety Checklist: How to Verify Before Committing

Whenever you are about to commit, run this quick check in your terminal:

```bash
# 1. Verify what files will be committed
git status
```

- If you see only code files (`.php`, `.js`, `.css`, `.html`, `.md`), you are **100% safe**.
- If you ever see `.env` listed under "Untracked files" or "Changes to be committed", **DO NOT COMMIT**. Ensure `.env` is listed inside `.gitignore`.

---

## 🛠️ Frequently Asked Questions (FAQ)

### Q1: What happens if I change `config/db.php`?
`config/db.php` is designed to be universal:
```php
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
define('DB_NAME', getenv('DB_NAME') ?: 'naija_draughts');
```
It looks for `.env` first (`getenv(...)`). If no `.env` exists (like default local XAMPP), it falls back to `root` and empty password. You never need to hardcode passwords in `config/db.php`.

### Q2: What if I need to run a new database migration on cPanel?
If you add a new table or column in `database/schema.sql`:
1. Push the updated SQL migration to GitHub.
2. Pull/upload the file to cPanel.
3. Open **phpMyAdmin** in cPanel, select your database, and run the new `ALTER TABLE` or `CREATE TABLE` query (or run the migration script if provided).

### Q3: How do I test that my cPanel database connection works?
Visit `https://yourdomain.com/health_check.php` in your browser. It runs an automated diagnostic on your database connection, permissions, and tables without exposing your passwords.
