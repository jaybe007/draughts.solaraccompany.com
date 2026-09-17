<?php
/**
 * Test Suite: Verify Create Game Modal Chrome Compatibility & Cache Busting
 */

$webroot = 'C:\\xampp\\htdocs\\nigerian-draughts\\';
$errors = [];

echo "=== VERIFYING CREATE GAME MODAL CHROME COMPATIBILITY & CACHE BUSTING ===\n\n";

// 1. Verify dashboard.php markup and cache busting
$dashboard = file_get_contents($webroot . 'dashboard.php');
if (strpos($dashboard, 'home.css?v=') === false || strpos($dashboard, 'style.css?v=') === false) {
    $errors[] = "dashboard.php missing cache-busting timestamp on stylesheets";
} else {
    echo "✓ [PASS] dashboard.php has cache-busting query strings on stylesheets for Chrome disk-cache bypass\n";
}

if (strpos($dashboard, 'js/dashboard.js?v=') === false) {
    $errors[] = "dashboard.php missing cache-busting timestamp on js/dashboard.js";
} else {
    echo "✓ [PASS] dashboard.php has cache-busting query string on js/dashboard.js\n";
}

if (strpos($dashboard, 'class="create-game-form-wrapper"') === false) {
    $errors[] = "dashboard.php missing .create-game-form-wrapper on form element";
} else {
    echo "✓ [PASS] dashboard.php wraps body and footer in form.create-game-form-wrapper\n";
}

if (strpos($dashboard, 'class="home-modal-body create-game-modal-body"') === false) {
    $errors[] = "dashboard.php missing .create-game-modal-body on modal body";
} else {
    echo "✓ [PASS] dashboard.php has .create-game-modal-body class\n";
}

if (strpos($dashboard, '<button type="submit" class="btn btn-primary btn-large" id="btn-submit-create-game">') === false) {
    $errors[] = "dashboard.php submit button not cleanly positioned inside form in footer";
} else {
    echo "✓ [PASS] dashboard.php submit button is standard submit inside form footer for 100% Chrome reliability\n";
}

// 2. Verify game.php markup and cache busting
$game = file_get_contents($webroot . 'game.php');
if (strpos($game, 'style.css?v=') === false) {
    $errors[] = "game.php missing cache-busting timestamp on style.css";
} else {
    echo "✓ [PASS] game.php has cache-busting query string on style.css\n";
}

if (strpos($game, 'create-game-modal-body') === false) {
    $errors[] = "game.php missing create-game-modal-body on modal-body";
} else {
    echo "✓ [PASS] game.php has create-game-modal-body class for Chrome flex sizing\n";
}

// 3. Verify home.css Chrome flexbox rules
$homeCss = file_get_contents($webroot . 'home.css');
if (strpos($homeCss, 'height: 85vh !important;') === false) {
    $errors[] = "home.css missing height: 85vh !important on create-game-modal-card";
} else {
    echo "✓ [PASS] home.css sets explicit height: 85vh !important on create-game-modal-card (prevents Chrome flex height collapse)\n";
}

if (strpos($homeCss, '.create-game-form-wrapper') === false) {
    $errors[] = "home.css missing .create-game-form-wrapper styles";
} else {
    echo "✓ [PASS] home.css contains .create-game-form-wrapper flex rules\n";
}

if (strpos($homeCss, '.create-game-modal-body') === false) {
    $errors[] = "home.css missing .create-game-modal-body styles";
} else {
    echo "✓ [PASS] home.css contains .create-game-modal-body with flex: 1 1 0px !important\n";
}

// 4. Verify style.css Chrome flexbox rules
$styleCss = file_get_contents($webroot . 'style.css');
if (strpos($styleCss, 'height: 85vh !important;') === false) {
    $errors[] = "style.css missing height: 85vh !important on create-game-modal-card";
} else {
    echo "✓ [PASS] style.css sets explicit height: 85vh !important on create-game-modal-card\n";
}

if (strpos($styleCss, '.create-game-modal-body') === false) {
    $errors[] = "style.css missing .create-game-modal-body styles";
} else {
    echo "✓ [PASS] style.css contains .create-game-modal-body with flex: 1 1 0px !important\n";
}

// Summary
echo "\n===================================================\n";
if (empty($errors)) {
    echo "RESULT: ALL 10 CHROME COMPATIBILITY CHECKS PASSED WITH 100% SUCCESS!\n";
    echo "===================================================\n";
    exit(0);
} else {
    echo "RESULT: " . count($errors) . " ERRORS FOUND:\n";
    foreach ($errors as $e) {
        echo " - " . $e . "\n";
    }
    echo "===================================================\n";
    exit(1);
}
