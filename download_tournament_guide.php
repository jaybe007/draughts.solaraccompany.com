<?php
/**
 * Serves the Official Nigerian Draughts Tournament Hosting Guide PDF
 * Supports direct PDF download or high-res printable view.
 */

$pdfPath = __DIR__ . '/docs/Nigerian_Draughts_Tournament_Hosting_Guide.pdf';

if (isset($_GET['pdf']) || isset($_GET['download']) || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/pdf') !== false)) {
    if (file_exists($pdfPath)) {
        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="Nigerian_Draughts_Tournament_Hosting_Guide.pdf"');
        header('Content-Length: ' . filesize($pdfPath));
        header('Cache-Control: public, max-age=86400');
        readfile($pdfPath);
        exit;
    }
}

// Otherwise serve rich printable web view with 1-click Download PDF
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tournament Hosting Guide - Official Nigerian Draughts Federation</title>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="stylesheet" href="home.css">
  <style>
    body {
      background: #0b0f19;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 30px 20px;
    }
    .guide-card {
      max-width: 820px;
      margin: 0 auto;
      background: #111827;
      border: 1px solid rgba(245, 166, 35, 0.3);
      border-radius: 14px;
      box-shadow: 0 15px 40px rgba(0,0,0,0.6);
      overflow: hidden;
    }
    .guide-header {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      padding: 24px 30px;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .guide-body {
      padding: 30px;
      line-height: 1.6;
    }
    .guide-section {
      margin-bottom: 24px;
    }
    .guide-sec-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #fbbf24;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      border-bottom: 1px solid rgba(251, 191, 36, 0.2);
      padding-bottom: 6px;
    }
    .guide-alert {
      background: rgba(234, 179, 8, 0.15);
      border: 1px solid rgba(234, 179, 8, 0.4);
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 20px;
      color: #fef08a;
      font-size: 0.95rem;
    }
    @media print {
      body { background: #fff; color: #000; padding: 0; }
      .guide-card { border: none; box-shadow: none; max-width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="guide-card">
    <div class="guide-header">
      <div>
        <h1 style="margin: 0 0 4px 0; font-size: 1.45rem; font-weight: 800;">🏆 NAIJA DRAUGHTS FEDERATION (NDF)</h1>
        <p style="margin: 0; font-size: 0.88rem; opacity: 0.9;">Official Tournament Hosting & Championship Guide (PDF Version 1.4)</p>
      </div>
      <div class="no-print" style="display: flex; gap: 10px;">
        <a href="download_tournament_guide.php?download=1" class="btn btn-primary" style="background: #fbbf24; color: #000; font-weight: 800; text-decoration: none; padding: 8px 16px; border-radius: 6px;">
          📥 Download PDF File
        </a>
        <button onclick="window.print()" class="btn btn-secondary" style="background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 8px 14px; border-radius: 6px; cursor: pointer;">
          🖨️ Print
        </button>
      </div>
    </div>
    <div class="guide-body">
      <div class="guide-alert">
        <strong>⚠️ Minimum 20 Coins Rule:</strong> Every host requires a minimum balance of <strong>20 coins</strong> to create and publish an official championship.
      </div>

      <div class="guide-section">
        <div class="guide-sec-title"><span>1.</span> Host Requirements & Coins Policies</div>
        <p>• <strong>Creation Fee:</strong> 20 platform coins are deducted upon launching registration to cover bracket orchestration and match server allocation.</p>
        <p>• <strong>Host Sponsorship:</strong> If you select <em>Host</em> under "Who is paying entry coins", you sponsor the entire participant pot upfront (e.g., 8 players × 100 coins = 800 coins + 20 fee = 820 coins total). Contenders can join for free.</p>
      </div>

      <div class="guide-section">
        <div class="guide-sec-title"><span>2.</span> Tournament Types & Formats</div>
        <p>• <strong>Knockout (Single Elimination):</strong> Standard brackets where losing contenders are eliminated and winners progress from Round 1 through the Grand Finals.</p>
        <p>• <strong>League (Round-Robin):</strong> Points-based championship fixture.</p>
        <p>• <strong>Best of 5 / Best of 3:</strong> Match-series between top masters.</p>
        <p>• <strong>Supported Bracket Capacities:</strong> Exactly 4, 8, 16, 32, or 64 players.</p>
      </div>

      <div class="guide-section">
        <div class="guide-sec-title"><span>3.</span> Official Rule Types Supported</div>
        <p>• <strong>Nigeria:</strong> Free capture choice, flying kings with multi-jump directional stops, 10x10 board.</p>
        <p>• <strong>Ghana (Damii):</strong> Immediate crown freeze on king row, 16-move 3v1 endgame enforcement.</p>
        <p>• <strong>International (FMJD):</strong> Strict majority capture rule across open diagonals.</p>
      </div>

      <div class="guide-section">
        <div class="guide-sec-title"><span>4.</span> Player Join Modes</div>
        <p>• <strong>Join tournament button:</strong> Open registration for all authenticated contenders.</p>
        <p>• <strong>Request participation button:</strong> Contenders submit an entry request; the host approves or rejects.</p>
        <p>• <strong>Invited only:</strong> Private tournament accessible via invitation code only.</p>
      </div>

      <div class="guide-section">
        <div class="guide-sec-title"><span>5.</span> Scheduling & Deadlines in GMT</div>
        <p>• All dates and deadlines operate strictly in <strong>GMT / UTC</strong>.</p>
        <p>• <strong>Deadline Date for joining:</strong> Once the deadline passes, no new registrations are accepted.</p>
        <p>• <strong>Automated Launch:</strong> When full or when the scheduled start time arrives, rooms are generated automatically.</p>
      </div>

      <div class="guide-section">
        <div class="guide-sec-title"><span>6.</span> Automated Prize Pool Distribution</div>
        <p>• <strong>Champion (1st Place):</strong> 70% share of total prize pool credited instantly upon match victory.</p>
        <p>• <strong>Runner-Up (2nd Place):</strong> 20% share of total prize pool.</p>
        <p>• <strong>Platform Escrow Fee:</strong> 10% retained for escrow and tournament infrastructure.</p>
      </div>

      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <a href="dashboard.php" class="btn btn-primary" style="display: inline-block; padding: 10px 24px; text-decoration: none; font-weight: 700; border-radius: 8px;">
          &larr; Return to Player Dashboard
        </a>
      </div>
    </div>
  </div>
</body>
</html>
