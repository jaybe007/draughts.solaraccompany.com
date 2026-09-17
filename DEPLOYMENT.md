# Naija Draughts — Production Deployment & Cloud Operations Handbook

This document provides a comprehensive, production-grade guide for deploying, configuring, securing, and scaling **Naija Draughts** on commercial cloud environments.

---

## Table of Contents
1. [Pre-Flight System Requirements](#1-pre-flight-system-requirements)
2. [Option A: cPanel / Shared Hosting Deployment](#2-option-a-cpanel--shared-hosting-deployment)
3. [Option B: Linux VPS Deployment (Ubuntu 22.04 / 24.04 LTS)](#3-option-b-linux-vps-deployment-ubuntu-2204--2404-lts)
4. [Paystack & Flutterwave Live Integration](#4-paystack--flutterwave-live-integration)
5. [Production SMTP Email Deliverability Setup](#5-production-smtp-email-deliverability-setup)
6. [Automated Cron Maintenance Jobs](#6-automated-cron-maintenance-jobs)
7. [Security Hardening Checklist](#7-security-hardening-checklist)
8. [Post-Deployment Verification & Health Check](#8-post-deployment-verification--health-check)

---

## 1. Pre-Flight System Requirements

| Component | Minimum Requirement | Recommended Specification |
| :--- | :--- | :--- |
| **PHP Version** | PHP 7.4 | **PHP 8.1 or PHP 8.2** |
| **PHP Extensions** | `pdo`, `pdo_mysql`, `curl`, `json`, `mbstring`, `openssl` | `opcache`, `zlib`, `fileinfo` |
| **Database** | MySQL 5.7+ or MariaDB 10.3+ | **MySQL 8.0+** (`utf8mb4_unicode_ci`) |
| **Web Server** | Apache 2.4+ (with `mod_rewrite`, `mod_headers`) | **Nginx 1.22+** with PHP-FPM |
| **SSL / HTTPS** | TLS 1.2+ Certificate | **Let's Encrypt Free SSL (Auto-renewing)** |
| **Disk Space** | 100 MB | 1 GB+ (for player avatars & logs) |

---

## 2. Option A: cPanel / Shared Hosting Deployment

*(Applicable to Namecheap, Hostinger, Whogohost, Bluehost, cPanel VPS, etc.)*

### Step 2.1: Create MySQL Database & User
1. Log in to your **cPanel** dashboard.
2. Under the **Databases** section, click **MySQL Database Wizard**.
3. **Database Name**: e.g., `username_draughts` &rarr; click *Next Step*.
4. **Database User & Password**: Create a user (e.g., `username_naija`) and generate a strong password (at least 16 characters) &rarr; click *Create User*.
5. **Privileges**: Check **ALL PRIVILEGES** &rarr; click *Make Changes*.
6. Save your **Database Name**, **Username**, and **Password**.

### Step 2.2: Import Production Database Schema
1. Return to cPanel and open **phpMyAdmin**.
2. Click your newly created database in the left sidebar.
3. Click the **Import** tab at the top.
4. Click **Choose File** and select `database/production_schema.sql` from your computer.
5. Click **Import** (or **Go**). All 10 tables, indexes, and initial champion seed data will be created automatically.

### Step 2.3: Upload Project Files
1. Open cPanel **File Manager** and navigate to your web root (usually `public_html/` or a subdomain directory like `public_html/arena/`).
2. Upload the project zip archive and click **Extract**.
3. Ensure the project files (e.g. `index.php`, `game.php`, `dashboard.php`, `config/`, `api/`) are directly inside your destination directory.

### Step 2.4: Create `.env` Environment File
1. In cPanel File Manager, make sure **Show Hidden Files (dotfiles)** is enabled in Settings (top right).
2. Copy `.env.example` and rename it to `.env`.
3. Open `.env` in the cPanel Code Editor and configure your credentials:
   ```ini
   APP_ENV=production
   APP_URL=https://yourdomain.com

   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=username_draughts
   DB_USER=username_naija
   DB_PASS=YourStrongPasswordHere

   # Set to false for real live money wagers
   PAYMENT_DEV_MODE=false
   PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

   # SMTP settings for 6-digit email verification
   SMTP_ENABLED=true
   SMTP_HOST=mail.yourdomain.com
   SMTP_PORT=587
   SMTP_USER=no-reply@yourdomain.com
   SMTP_PASS=YourWebmailPassword
   SMTP_SECURE=tls
   MAIL_FROM=no-reply@yourdomain.com
   MAIL_FROM_NAME="Naija Draughts Arena"
   MAIL_DEV_MODE=false

   SESSION_SECURE_COOKIE=true
   MAINTENANCE_KEY=CreateASecretKeyForHealthChecks
   ```
4. Save changes. Note: The included `.htaccess` file automatically blocks any browser attempts to download your `.env` file.

### Step 2.5: Configure cPanel Midnight Cron Job
1. In cPanel, search for **Cron Jobs**.
2. Set frequency to **Once Per Day (Midnight)** (`0 0 * * *`).
3. Enter the command (adjust path to match your server user):
   ```bash
   /usr/local/bin/php /home/username/public_html/scripts/cron_daily_reset.php > /dev/null 2>&1
   ```
4. Click **Add New Cron Job**.

---

## 3. Option B: Linux VPS Deployment (Ubuntu 22.04 / 24.04 LTS)

*(Applicable to DigitalOcean Droplets, AWS EC2, Linode, Vultr, Hetzner, etc.)*

### Step 3.1: Initial Server Setup & Firewall
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Enable UFW Firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### Step 3.2: Install LEMP Stack (Nginx, PHP 8.2, MySQL 8)
```bash
# Install Nginx and MySQL Server
sudo apt install -y nginx mysql-server certbot python3-certbot-nginx git unzip

# Add Ondřej Surý PPA for PHP 8.2
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update

# Install PHP 8.2 and required extensions
sudo apt install -y php8.2-fpm php8.2-mysql php8.2-curl php8.2-mbstring \
                    php8.2-xml php8.2-zip php8.2-opcache
```

### Step 3.3: Setup MySQL Database
```bash
sudo mysql
```
Inside the MySQL prompt:
```sql
CREATE DATABASE naija_draughts CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'naija_user'@'localhost' IDENTIFIED BY 'SuperStrongPassword123!';
GRANT ALL PRIVILEGES ON naija_draughts.* TO 'naija_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Import schema:
```bash
sudo mysql -u naija_user -p naija_draughts < /path/to/database/production_schema.sql
```

### Step 3.4: Deploy Codebase to `/var/www/naijadraughts`
```bash
# Create directory
sudo mkdir -p /var/www/naijadraughts

# Copy or clone files
sudo cp -r /your/source/folder/* /var/www/naijadraughts/

# Set ownership to web server user
sudo chown -R www-data:www-data /var/www/naijadraughts
sudo chmod -R 755 /var/www/naijadraughts
sudo chmod -R 775 /var/www/naijadraughts/uploads
```

### Step 3.5: Configure Nginx Virtual Host
1. Copy the provided Nginx configuration template:
   ```bash
   sudo cp /var/www/naijadraughts/nginx.conf.example /etc/nginx/sites-available/naijadraughts.conf
   ```
2. Edit `/etc/nginx/sites-available/naijadraughts.conf` and update your domain name (`yourdomain.com`).
3. Enable site and test configuration:
   ```bash
   sudo ln -s /etc/nginx/sites-available/naijadraughts.conf /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Step 3.6: Obtain Free Let's Encrypt SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
*Certbot will automatically install SSL certificates and configure auto-renewal via systemd timers.*

### Step 3.7: Setup Linux Crontab
```bash
sudo crontab -u www-data -e
```
Add the midnight maintenance task:
```cron
0 0 * * * /usr/bin/php /var/www/naijadraughts/scripts/cron_daily_reset.php >> /var/log/naija_cron.log 2>&1
```

---

## 4. Paystack & Flutterwave Live Integration

### Paystack Setup
1. Log in to your [Paystack Dashboard](https://dashboard.paystack.com/).
2. Toggle the switch at the top from **Test** to **Live**.
3. Navigate to **Settings &rarr; API Keys & Webhooks**:
   - Copy **Live Public Key** (`pk_live_...`) into `.env` &rarr; `PAYSTACK_PUBLIC_KEY`.
   - Copy **Live Secret Key** (`sk_live_...`) into `.env` &rarr; `PAYSTACK_SECRET_KEY`.
   - **Live Webhook URL**: Enter `https://yourdomain.com/api/webhook_paystack.php`.
   - Click **Save Changes**.
4. Test with a live ₦500 deposit using your Nigerian ATM debit card or bank transfer.

### Flutterwave Setup
1. Log in to your [Flutterwave Dashboard](https://dashboard.flutterwave.com/).
2. Switch to **Live Mode**.
3. Navigate to **Settings &rarr; Developers &rarr; API Keys**:
   - Copy **Live Public Key** and **Live Secret Key** into `.env`.
   - In **Webhooks**, register: `https://yourdomain.com/api/webhook_flutterwave.php`.
   - Set a **Secret Hash** and paste it into `.env` under `FLUTTERWAVE_SECRET_HASH`.

---

## 5. Production SMTP Email Deliverability Setup

Email verification is required for all new player registrations to ensure clean accounts and prevent bot fraud.

### Recommended Option: Google Workspace / Gmail App Password
1. In your Google Account, enable **2-Step Verification**.
2. Go to **Security &rarr; 2-Step Verification &rarr; App Passwords**.
3. Create an App Password named `NaijaDraughts`.
4. In `.env`:
   ```ini
   SMTP_ENABLED=true
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx-xxxx-xxxx-xxxx
   SMTP_SECURE=tls
   MAIL_FROM=your-email@gmail.com
   MAIL_FROM_NAME="Naija Draughts Arena"
   MAIL_DEV_MODE=false
   ```

### Recommended DNS Deliverability Records (SPF, DKIM, DMARC)
Add these TXT records in your Domain DNS Manager (Cloudflare, cPanel, Namecheap) to ensure 99.9% inbox placement without landing in spam:
- **SPF**: `v=spf1 include:_spf.google.com ~all`
- **DMARC**: `v=DMARC1; p=none; sp=none; rua=mailto:dmarc-reports@yourdomain.com`

---

## 6. Automated Cron Maintenance Jobs

The midnight maintenance script (`scripts/cron_daily_reset.php`) performs 3 essential cleanup jobs:
1. **Daily Game Quota Refresh**: Resets daily match limits according to player tiers (Free: 10, Silver: 25, Gold: 50, VIP Oba: 999).
2. **Subscription Downgrade**: Downgrades expired VIP subscriptions back to Free.
3. **Escrow Safety Cleanup**: Scans for waiting rooms older than 24 hours that were never joined, cancels them, and refunds 100% of the host's locked escrow stakes back to their wallet.

---

## 7. Security Hardening Checklist

- [x] **File Protection**: `.env`, `.git`, `*.sql`, and log files are blocked by both `.htaccess` and `nginx.conf.example`.
- [x] **SQL Injection Prevention**: All queries use PDO prepared statements with parameter binding.
- [x] **XSS & CSRF Mitigation**: HTML escaping applied on all user-rendered titles, chats, and names.
- [x] **Secure Sessions**: Cookies configured with `HttpOnly`, `SameSite=Lax`, and `Secure` flags on HTTPS.
- [x] **Replay Attack Webhook Protection**: `api/webhook_paystack.php` and `api/webhook_flutterwave.php` verify cryptographic HMAC signatures and check reference uniqueness before crediting balances.
- [x] **Rate Limiting**: Email verification OTP resends enforce a strict 60-second cooldown timer.

---

## 8. Post-Deployment Verification & Health Check

After uploading your files and configuring `.env`, run the health diagnostics tool:

### Via Command Line:
```bash
php health_check.php
```

### Via Browser:
Visit:
```
https://yourdomain.com/health_check.php?key=YourSecretMaintenanceTokenHere123!
```

A healthy system will return `[✓ PASS]` across all checks:
```
========================================================
  NAIJA DRAUGHTS - SYSTEM HEALTH & READINESS AUDIT
========================================================

[✓ PASS] PHP Version                  Current: 8.2.x
[✓ PASS] Required PHP Extensions      All loaded: pdo, pdo_mysql, curl, json, mbstring, openssl
[✓ PASS] Database Connection          Connected to MySQL database 'naija_draughts' with 16 table(s).
[✓ PASS] Storage Write Permissions    uploads: OK | mail_logs: OK | avatars: OK
[✓ PASS] Environment File (.env)      File present. APP_ENV: production
[✓ PASS] Payment Gateway Status       Live Paystack Key Configured
[✓ PASS] Mailer Configuration         SMTP Enabled

========================================================
🎉 ALL CRITICAL CHECKS PASSED: PLATFORM READY!
========================================================
```

Your Naija Draughts gaming arena is now **100% live, secure, monetized, and ready for Nigerian and global champions!**
