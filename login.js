/**
 * login.js — Labify Login Page Controller
 * Handles form submission, API call, error display, and post-login routing.
 * Depends on: auth.js (must be loaded first via <script> in login.html)
 */

/* ─── Constants ──────────────────────────────────────────────────── */
const API_ENDPOINT = "/api/login";

/* ─── DOM References (set after DOMContentLoaded) ───────────────── */
let form, emailInput, passwordInput, roleSelect,
    submitBtn, errorBox, btnText, spinner;

/* ─── Initialise ─────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  // If already authenticated, skip login screen entirely
  //redirectIfAuthenticated("index.html");

  // Cache DOM references
  form          = document.getElementById("login-form");
  emailInput    = document.getElementById("email");
  passwordInput = document.getElementById("password");
  roleSelect    = document.getElementById("role");
  submitBtn     = document.getElementById("submit-btn");
  errorBox      = document.getElementById("error-message");
  btnText       = document.getElementById("btn-text");
  spinner       = document.getElementById("btn-spinner");

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  initTheme(themeToggle);

  // Form submission
  form.addEventListener("submit", handleSubmit);

  // Live validation — clear errors when user starts correcting
  [emailInput, passwordInput, roleSelect].forEach(el => {
    el.addEventListener("input", () => clearFieldError(el));
  });
});

/* ─── Theme Management ───────────────────────────────────────────── */
function initTheme(toggleBtn) {
  const saved = localStorage.getItem("labify_theme") || "dark";
  applyTheme(saved, toggleBtn);

  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next    = current === "dark" ? "light" : "dark";
    applyTheme(next, toggleBtn);
    localStorage.setItem("labify_theme", next);
  });
}

function applyTheme(theme, toggleBtn) {
  document.documentElement.setAttribute("data-theme", theme);
  toggleBtn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
  toggleBtn.querySelector(".theme-icon").textContent = theme === "dark" ? "☀️" : "🌙";
}

/* ─── API Call ───────────────────────────────────────────────────── */
/**
 * Sends credentials to the backend.
 * Replace the URL and adjust the response shape to match your real API.
 * @returns {Promise<Response>}
 */
async function loginUser(email, password, role) {
  // DEV BYPASS — always succeed
  return {
    ok: true,
    json: async () => ({
      token: "dev-token"
    })
  };
}

/* ─── Form Submission Handler ────────────────────────────────────── */
async function handleSubmit(event) {
  event.preventDefault();
  // TEMP DEV BYPASS (put this RIGHT HERE)

  localStorage.setItem("authToken", "dev-token");
  localStorage.setItem("userRole", roleSelect.value);

  console.log("Bypass login → redirecting");

  window.location.href = "index.html";
  return;
  clearError();

  const email    = emailInput.value.trim();
  const password = passwordInput.value;
  const role     = roleSelect.value;

  // Client-side validation
  if (!validateForm(email, password, role)) return;

  setLoading(true);

  try {
    const response = await loginUser(email, password, role);

    if (response.ok) {
      const data = await response.json();

      // ── Adjust these keys to match your real API response ──
      const token = data.token || data.access_token || data.authToken;

      if (!token) {
        throw new Error("Server did not return an auth token.");
      }

      // Persist session data
      saveSession(token, role, email);

      // Brief success animation before redirect
      showSuccess();
      window.location.href = "index.html";

    } else {
      // HTTP error — parse message from body if available
      let message = "Invalid credentials. Please try again.";
      try {
        const errData = await response.json();
        if (errData.message || errData.error) {
          message = errData.message || errData.error;
        }
      } catch (_) { /* ignore JSON parse failure */ }

      showError(message);
    }

  } catch (err) {
    // Network-level failure or JSON parse error
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      showError("Cannot reach the server. Check your connection and try again.");
    } else {
      showError(err.message || "An unexpected error occurred.");
    }
  } finally {
    setLoading(false);
  }
}

/* ─── Client-Side Validation ─────────────────────────────────────── */
function validateForm(email, password, role) {
  let valid = true;

  if (!email || !isValidEmail(email)) {
    setFieldError(emailInput, "Please enter a valid email address.");
    valid = false;
  }

  if (!password || password.length < 6) {
    setFieldError(passwordInput, "Password must be at least 6 characters.");
    valid = false;
  }

  if (!role) {
    setFieldError(roleSelect, "Please select your role.");
    valid = false;
  }

  return valid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ─── UI Helpers ─────────────────────────────────────────────────── */
function setLoading(isLoading) {
  submitBtn.disabled      = isLoading;
  btnText.textContent     = isLoading ? "Signing in…" : "Sign In";
  spinner.style.display   = isLoading ? "inline-block" : "none";
}

function showSuccess() {
  submitBtn.classList.add("btn--success");
  btnText.textContent = "✓ Redirecting…";
}

function showError(message) {
  errorBox.textContent    = message;
  errorBox.style.display  = "flex";
  errorBox.setAttribute("role", "alert");
  // Shake animation
  errorBox.classList.remove("shake");
  void errorBox.offsetWidth; // reflow
  errorBox.classList.add("shake");
}

function clearError() {
  errorBox.textContent   = "";
  errorBox.style.display = "none";
  errorBox.removeAttribute("role");
}

function setFieldError(field, message) {
  field.classList.add("field--error");
  const hint = document.getElementById(`${field.id}-hint`);
  if (hint) {
    hint.textContent   = message;
    hint.style.display = "block";
  }
}

function clearFieldError(field) {
  field.classList.remove("field--error");
  const hint = document.getElementById(`${field.id}-hint`);
  if (hint) {
    hint.textContent   = "";
    hint.style.display = "none";
  }
}
