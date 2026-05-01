/* =====================================================
   SHARED LAYOUT TEMPLATE - included by all pages
   ===================================================== */

// This file provides the shared HTML structure used by all pages
// It's sourced by each page's inline script

function getLayoutHTML({ activePage, pageTitle, breadcrumb, content }) {
  return `
  <div class="sidebar-overlay"></div>
  <div class="app-layout">
    <!-- SIDEBAR -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">⚗️</div>
        <div class="logo-text">Lab<span>EMS</span></div>
      </div>
      <nav class="sidebar-nav" id="sidebarNav"></nav>
      <div class="sidebar-footer">
        <button class="collapse-btn" id="collapseBtn">
          <span class="collapse-icon">◀</span>
          <span class="nav-label">Collapse</span>
        </button>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="main-content" id="mainContent">
      <!-- NAVBAR -->
      <header class="navbar">
        <button class="icon-btn" id="mobileMenuBtn" title="Menu">☰</button>
        <div class="page-title-area">
          <div class="page-breadcrumb" id="pageBreadcrumb">${breadcrumb || 'LabEMS'}</div>
          <div class="page-heading" id="pageHeading">${pageTitle}</div>
        </div>
        <div class="navbar-search">
          <span class="search-icon">🔍</span>
          <input type="text" id="globalSearch" placeholder="Search equipment, people..." autocomplete="off">
        </div>
        <div class="navbar-actions">
          <button class="icon-btn" id="themeToggle" title="Toggle Theme">☀️</button>
          <div style="position:relative">
            <div class="avatar" id="avatarBtn" title="Profile">AD</div>
            <div class="profile-dropdown" id="profileDropdown">
              <div class="dropdown-item">👤 Admin Profile</div>
              <div class="dropdown-item">⚙️ Settings</div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item">🚪 Sign Out</div>
            </div>
          </div>
        </div>
      </header>

      <!-- PAGE CONTENT -->
      <main class="page-content">
        ${content}
      </main>
    </div>
  </div>

  <!-- TOAST CONTAINER -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- CONFIRM DIALOG -->
  <div class="confirm-overlay" id="confirmOverlay">
    <div class="confirm-box">
      <div class="confirm-icon">⚠️</div>
      <div class="confirm-title" id="confirmTitle">Are you sure?</div>
      <div class="confirm-msg" id="confirmMsg">This action cannot be undone.</div>
      <div class="confirm-actions">
        <button class="btn btn-secondary" onclick="Confirm.cancel()">Cancel</button>
        <button class="btn btn-danger" id="confirmBtn" onclick="Confirm.confirm()">Delete</button>
      </div>
    </div>
  </div>
  `;
}
