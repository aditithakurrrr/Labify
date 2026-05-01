/**
 * auth.js — Labify Authentication Utilities
 * Handles token/role persistence, session checks, and logout.
 * Import this on every protected page.
 */

const AUTH_TOKEN_KEY  = "labify_auth_token";
const USER_ROLE_KEY   = "labify_user_role";
const USER_EMAIL_KEY  = "labify_user_email";

/**
 * Returns true if a valid auth token exists in localStorage.
 * Extend this to verify JWT expiry when your backend issues real tokens.
 */
function isAuthenticated() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token !== null && token !== "";
}

/**
 * Returns the stored role string ("Student" | "Faculty" | "Technician")
 * or null if no role is saved.
 */
function getUserRole() {
  return localStorage.getItem(USER_ROLE_KEY) || null;
}

/**
 * Returns the stored email address of the logged-in user, or null.
 */
function getUserEmail() {
  return localStorage.getItem(USER_EMAIL_KEY) || null;
}

/**
 * Stores authentication data after a successful login API response.
 * @param {string} token  — JWT or session token from the server
 * @param {string} role   — Role string chosen at login
 * @param {string} email  — Email address used at login
 */
function saveSession(token, role, email) {
  localStorage.setItem(AUTH_TOKEN_KEY,  token);
  localStorage.setItem(USER_ROLE_KEY,   role);
  localStorage.setItem(USER_EMAIL_KEY,  email);
}

/**
 * Clears all auth data from localStorage and redirects to the login page.
 */
function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
  window.location.href = "login.html";
}

/**
 * Route-guard helper for PROTECTED pages (e.g. index.html).
 * Call at the top of any page that requires authentication.
 * Redirects to login.html if the user is not authenticated.
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.replace("login.html");
  }
}

/**
 * Route-guard helper for the LOGIN PAGE.
 * If the user is already authenticated, skip the login screen.
 * @param {string} [redirect="index.html"] — Destination after auto-login
 */
function redirectIfAuthenticated(redirect = "index.html") {
  if (isAuthenticated()) {
    window.location.replace(redirect);
  }
}
