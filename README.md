# 🇳🇬 Naija Draughts — Online Multiplayer & Tactical Platform

A full-stack, feature-rich web platform for **Nigerian Draughts (10×10 Checkers)** featuring authentic Nigerian draughts rules, tactical puzzle training, AI bot opponents, real-time peer-to-peer matchmaking, coin wagering tournaments, and a comprehensive administrative suite.

---

## 🌟 Key Features

- **Authentic Nigerian Draughts Engine**:
  - 10×10 board format.
  - Flying Kings (multi-square diagonal traversal).
  - Compulsory captures and maximum capture priority (Nigerian draughts rules).
  - Backward captures for ordinary pawns and multi-jump sequences.
- **Game Modes**:
  - **AI Bot Opponents**: Play against AI with configurable difficulty tiers.
  - **Peer-to-Peer Matches**: Create and join custom rooms, play locally or online.
  - **Coin Wagering & Tournaments**: Automated brackets, payouts, and house rake.
  - **Tactical Puzzle Arena**: Curated and procedurally evaluated draughts puzzles with step-by-step walkthroughs.
- **Monetization & Payments**:
  - Paystack and Flutterwave integrations for wallet deposits and withdrawals.
  - Simulation mode available for local development and offline testing.
- **Security & Authentication**:
  - Session-based authentication with secure password hashing.
  - Email verification via transactional SMTP.
  - Role-based access control (Players & Admins).
- **Admin Dashboard**:
  - Manage users, monitor live games, view system transactions, review puzzle banks, and audit system health.

---

## 🛠️ Tech Stack

- **Backend**: PHP 7.4+ / PHP 8.1+ (Native, PDO MySQL)
- **Frontend**: HTML5, Vanilla JavaScript (ES6+ Modules), Vanilla CSS (Responsive & Mobile-optimized)
- **Database**: MySQL 5.7+ / MariaDB 10.3+
- **Server**: Apache (via XAMPP / cPanel) or Nginx (PHP-FPM)

---

## 🚀 Getting Started (Local Development with XAMPP)

### 1. Clone or Move to your `htdocs` directory
```bash
# If using git:
git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git c:/xampp/htdocs/nigerian-draughts
```

### 2. Configure Database & Environment
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and configure your database credentials:
   ```env
   APP_ENV=development
   APP_DEBUG=true
   APP_URL=http://localhost/nigerian-draughts

   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=naija_draughts
   DB_USER=root
   DB_PASS=
   ```
3. Start **Apache** and **MySQL** in your XAMPP Control Panel.
4. Run the database migration script via your browser or CLI:
   - In browser: `http://localhost/nigerian-draughts/setup_db.php`
   - Or import `database/schema.sql` via phpMyAdmin.

### 3. Play the Game
Visit `http://localhost/nigerian-draughts/` in your web browser.

---

## 📖 Deployment Documentation

For instructions on deploying to **cPanel / Shared Hosting** or **Ubuntu Linux VPS (Nginx + PHP-FPM)**, see the [DEPLOYMENT.md](DEPLOYMENT.md) handbook.

---

## 🔒 License

Proprietary / All rights reserved.
