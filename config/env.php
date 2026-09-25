<?php
/**
 * Naija Draughts - Lightweight Environment (.env) Loader
 * Loads key-value pairs from .env into putenv(), $_ENV, and $_SERVER.
 */

if (!function_exists('loadEnv')) {
    function loadEnv($envPath = null) {
        if ($envPath === null) {
            $envPath = dirname(__DIR__) . '/.env';
        }

        if (!file_exists($envPath) || !is_readable($envPath)) {
            return false;
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            return false;
        }

        foreach ($lines as $line) {
            $line = trim($line);

            // Skip comments and empty lines
            if (empty($line) || $line[0] === '#') {
                continue;
            }

            // Find first '=' delimiter
            $pos = strpos($line, '=');
            if ($pos === false) {
                continue;
            }

            $name  = trim(substr($line, 0, $pos));
            $value = trim(substr($line, $pos + 1));

            // Strip enclosing quotes if present
            $len = strlen($value);
            if ($len >= 2) {
                $first = $value[0];
                $last  = $value[$len - 1];
                if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                    $value = substr($value, 1, -1);
                }
            }

            // Expand inline comments (e.g. KEY=val # comment) only if unquoted
            if (strpos($value, '#') !== false) {
                // If not within quotes, strip comment
                $vParts = explode('#', $value, 2);
                $value = trim($vParts[0]);
            }

            // Populate environments if not already explicitly set in system
            if (getenv($name) === false) {
                putenv("{$name}={$value}");
            }
            if (!isset($_ENV[$name])) {
                $_ENV[$name] = $value;
            }
            if (!isset($_SERVER[$name])) {
                $_SERVER[$name] = $value;
            }
        }

        return true;
    }
}

// Automatically load project root .env upon inclusion
loadEnv();

if (!function_exists('getAppBaseUrl')) {
    function getAppBaseUrl() {
        if (!empty(getenv('APP_URL'))) {
            return rtrim(getenv('APP_URL'), '/') . '/';
        }
        if (!empty($_SERVER['HTTP_HOST'])) {
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
            $host = $_SERVER['HTTP_HOST'];
            $uri = $_SERVER['REQUEST_URI'] ?? '';
            // Strip any subdirectory or api path
            $path = preg_replace('#/(api|database|scripts)/.*$#i', '', $uri);
            $path = rtrim($path, '/') . '/';
            return $protocol . $host . $path;
        }
        return 'http://localhost/nigerian-draughts/';
    }
}
