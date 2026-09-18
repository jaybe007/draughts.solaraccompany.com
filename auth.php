<?php
/**
 * Authentication API Endpoint (Root Entrypoint)
 * Forwarding directly to api/auth.php to ensure 100% unified auth, RBAC, and profile data.
 */

require_once __DIR__ . '/api/auth.php';
