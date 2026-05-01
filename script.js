/* =====================================================
   LAB EQUIPMENT MANAGEMENT SYSTEM - MAIN SCRIPT
   ===================================================== */

'use strict';

// ─── THEME MANAGER ────────────────────────────────────
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('labems_theme') || 'dark';
    this.apply(saved);
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    localStorage.setItem('labems_theme', next);
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
};

// ─── SIDEBAR MANAGER ──────────────────────────────────
const SidebarManager = {
  init() {
    const collapsed = localStorage.getItem('labems_sidebar') === 'collapsed';
    if (collapsed) this.setCollapsed(true, false);
    this.setActiveLink();
  },
  toggle() {
    const sidebar = document.querySelector('.sidebar');
    const isCollapsed = sidebar.classList.contains('collapsed');
    this.setCollapsed(!isCollapsed, true);
  },
  setCollapsed(collapsed, save = true) {
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('.main-content');
    if (!sidebar) return;
    sidebar.classList.toggle('collapsed', collapsed);
    main?.classList.toggle('expanded', collapsed);
    if (save) localStorage.setItem('labems_sidebar', collapsed ? 'collapsed' : 'expanded');
  },
  setActiveLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.classList.toggle('active', item.dataset.page === current);
    });
  },
  toggleMobile() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    sidebar?.classList.toggle('mobile-open');
    overlay?.classList.toggle('active');
  }
};

// ─── TOAST MANAGER ────────────────────────────────────
const Toast = {
  show(message, type = 'success', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-message">${message}</span>
      <span class="toast-close" onclick="Toast.remove(this.parentElement)">✕</span>
    `;
    container.appendChild(toast);
    setTimeout(() => this.remove(toast), duration);
  },
  remove(el) {
    if (!el || el.classList.contains('removing')) return;
    el.classList.add('removing');
    setTimeout(() => el.remove(), 300);
  }
};

// ─── CONFIRM DIALOG ───────────────────────────────────
const Confirm = {
  resolve: null,
  show(title, message, confirmText = 'Delete') {
    return new Promise(resolve => {
      this.resolve = resolve;
      document.getElementById('confirmTitle').textContent = title;
      document.getElementById('confirmMsg').textContent = message;
      document.getElementById('confirmBtn').textContent = confirmText;
      document.getElementById('confirmOverlay').classList.add('active');
    });
  },
  confirm() {
    document.getElementById('confirmOverlay').classList.remove('active');
    this.resolve?.(true);
  },
  cancel() {
    document.getElementById('confirmOverlay').classList.remove('active');
    this.resolve?.(false);
  }
};

// ─── DATA STORE ───────────────────────────────────────
const DB = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(`labems_${key}`)) || []; }
    catch { return []; }
  },
  set(key, data) {
    localStorage.setItem(`labems_${key}`, JSON.stringify(data));
  },
  getItem(key) {
    try { return JSON.parse(localStorage.getItem(`labems_${key}`)); }
    catch { return null; }
  },
  setItem(key, val) {
    localStorage.setItem(`labems_${key}`, JSON.stringify(val));
  },
  nextId(key) {
    const data = this.get(key);
    return data.length > 0 ? Math.max(...data.map(d => d.id || 0)) + 1 : 1;
  }
};

// ─── SEED DATA ────────────────────────────────────────
const Seeder = {
  run() {
    if (localStorage.getItem('labems_seeded')) return;

    DB.set('labs', [
      { id:1, name:'Physics Lab A', code:'PHY-A', building:'Block A', capacity:30, status:'active', equipment_count:45 },
      { id:2, name:'Chemistry Lab B', code:'CHE-B', building:'Block B', capacity:25, status:'active', equipment_count:62 },
      { id:3, name:'Biology Lab C', code:'BIO-C', building:'Block C', capacity:20, status:'active', equipment_count:38 },
      { id:4, name:'Electronics Lab D', code:'ELE-D', building:'Block D', capacity:35, status:'maintenance', equipment_count:54 },
      { id:5, name:'Computer Lab E', code:'COM-E', building:'Block E', capacity:40, status:'active', equipment_count:80 },
    ]);

    DB.set('vendors', [
      { id:1, name:'TechSupply Co.', contact:'John Smith', email:'john@techsupply.com', phone:'+91 9876543210', category:'Electronics', status:'active', items_supplied:120 },
      { id:2, name:'SciLab Instruments', contact:'Priya Rao', email:'priya@scilab.com', phone:'+91 8765432109', category:'Lab Instruments', status:'active', items_supplied:85 },
      { id:3, name:'Bio Research Pvt.', contact:'Ahmed Khan', email:'ahmed@bioresearch.com', phone:'+91 7654321098', category:'Biology', status:'active', items_supplied:65 },
      { id:4, name:'ChemEquip Ltd.', contact:'Sarah Lee', email:'sarah@chemequip.com', phone:'+91 6543210987', category:'Chemistry', status:'inactive', items_supplied:42 },
    ]);

    DB.set('students', [
      { id:1, name:'Arjun Kumar', roll:'2023CS001', department:'Computer Science', year:'3rd', email:'arjun@college.edu', phone:'+91 9001234567', status:'active' },
      { id:2, name:'Meera Nair', roll:'2023EC002', department:'Electronics', year:'2nd', email:'meera@college.edu', phone:'+91 9002345678', status:'active' },
      { id:3, name:'Rohan Patel', roll:'2023ME003', department:'Mechanical', year:'4th', email:'rohan@college.edu', phone:'+91 9003456789', status:'active' },
      { id:4, name:'Ananya Singh', roll:'2023BT004', department:'Biotechnology', year:'1st', email:'ananya@college.edu', phone:'+91 9004567890', status:'active' },
      { id:5, name:'Vikram Reddy', roll:'2022PH005', department:'Physics', year:'4th', email:'vikram@college.edu', phone:'+91 9005678901', status:'inactive' },
    ]);

    DB.set('faculty', [
      { id:1, name:'Dr. Ramesh Iyer', employee_id:'FAC001', department:'Physics', designation:'Professor', email:'r.iyer@college.edu', phone:'+91 9100001111', status:'active' },
      { id:2, name:'Prof. Lakshmi Devi', employee_id:'FAC002', department:'Chemistry', designation:'Assoc. Professor', email:'l.devi@college.edu', phone:'+91 9100002222', status:'active' },
      { id:3, name:'Dr. Karthik Menon', employee_id:'FAC003', department:'Electronics', designation:'Asst. Professor', email:'k.menon@college.edu', phone:'+91 9100003333', status:'active' },
      { id:4, name:'Prof. Sujata Bose', employee_id:'FAC004', department:'Biology', designation:'Professor', email:'s.bose@college.edu', phone:'+91 9100004444', status:'active' },
    ]);

    DB.set('technicians', [
      { id:1, name:'Suresh Babu', employee_id:'TEC001', specialization:'Electronics', lab:'Electronics Lab D', email:'suresh@college.edu', phone:'+91 9200001111', status:'active', tasks_completed:48 },
      { id:2, name:'Girish Kumar', employee_id:'TEC002', specialization:'Chemistry', lab:'Chemistry Lab B', email:'girish@college.edu', phone:'+91 9200002222', status:'active', tasks_completed:32 },
      { id:3, name:'Preethi Sharma', employee_id:'TEC003', specialization:'General', lab:'Physics Lab A', email:'preethi@college.edu', phone:'+91 9200003333', status:'active', tasks_completed:21 },
    ]);

    DB.set('equipment', [
      { id:1, name:'Oscilloscope', code:'EQ001', category:'Electronics', lab_id:4, quantity:10, available:7, vendor_id:1, status:'available', condition:'good', purchase_date:'2022-05-15', value:25000 },
      { id:2, name:'Microscope', code:'EQ002', category:'Biology', lab_id:3, quantity:15, available:12, vendor_id:3, status:'available', condition:'excellent', purchase_date:'2021-08-10', value:18000 },
      { id:3, name:'Centrifuge Machine', code:'EQ003', category:'Biology', lab_id:3, quantity:5, available:3, vendor_id:3, status:'available', condition:'good', purchase_date:'2022-01-20', value:45000 },
      { id:4, name:'Spectrometer', code:'EQ004', category:'Physics', lab_id:1, quantity:8, available:8, vendor_id:2, status:'available', condition:'excellent', purchase_date:'2023-02-14', value:32000 },
      { id:5, name:'Digital Multimeter', code:'EQ005', category:'Electronics', lab_id:4, quantity:20, available:15, vendor_id:1, status:'available', condition:'good', purchase_date:'2021-11-05', value:3500 },
      { id:6, name:'Bunsen Burner', code:'EQ006', category:'Chemistry', lab_id:2, quantity:25, available:22, vendor_id:4, status:'available', condition:'fair', purchase_date:'2020-06-30', value:1200 },
      { id:7, name:'pH Meter', code:'EQ007', category:'Chemistry', lab_id:2, quantity:12, available:9, vendor_id:4, status:'available', condition:'good', purchase_date:'2022-09-18', value:8500 },
      { id:8, name:'Function Generator', code:'EQ008', category:'Electronics', lab_id:4, quantity:6, available:4, vendor_id:1, status:'available', condition:'good', purchase_date:'2023-04-22', value:15000 },
    ]);

    DB.set('issues', [
      { id:1, equipment_id:1, equipment_name:'Oscilloscope', borrower_name:'Arjun Kumar', borrower_type:'student', borrower_id:1, lab_id:4, issued_date:'2024-06-01', due_date:'2024-06-08', returned_date:null, status:'issued', quantity:1, issued_by:'Dr. Karthik Menon' },
      { id:2, equipment_id:2, equipment_name:'Microscope', borrower_name:'Meera Nair', borrower_type:'student', borrower_id:2, lab_id:3, issued_date:'2024-05-28', due_date:'2024-06-04', returned_date:'2024-06-03', status:'returned', quantity:2, issued_by:'Prof. Sujata Bose' },
      { id:3, equipment_id:5, equipment_name:'Digital Multimeter', borrower_name:'Dr. Karthik Menon', borrower_type:'faculty', borrower_id:3, lab_id:4, issued_date:'2024-06-02', due_date:'2024-06-09', returned_date:null, status:'issued', quantity:3, issued_by:'Admin' },
    ]);

    DB.set('maintenance', [
      { id:1, equipment_id:1, equipment_name:'Oscilloscope', technician_id:1, technician_name:'Suresh Babu', type:'Repair', description:'Display calibration issue', start_date:'2024-06-01', end_date:'2024-06-05', cost:2500, status:'in-progress', priority:'high' },
      { id:2, equipment_id:6, equipment_name:'Bunsen Burner', technician_id:2, technician_name:'Girish Kumar', type:'Cleaning', description:'Routine cleaning and maintenance', start_date:'2024-05-25', end_date:'2024-05-26', cost:500, status:'completed', priority:'low' },
      { id:3, equipment_id:3, equipment_name:'Centrifuge Machine', technician_id:1, technician_name:'Suresh Babu', type:'Inspection', description:'Annual safety inspection', start_date:'2024-06-03', end_date:'2024-06-04', cost:1200, status:'pending', priority:'medium' },
    ]);

    localStorage.setItem('labems_seeded', '1');
  }
};

// ─── UTILS ────────────────────────────────────────────
const Utils = {
  formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  },
  formatCurrency(n) {
    return '₹' + Number(n).toLocaleString('en-IN');
  },
  getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  },
  statusBadge(status) {
    const map = {
      'available': 'badge-available',
      'issued': 'badge-issued',
      'maintenance': 'badge-maintenance',
      'returned': 'badge-returned',
      'active': 'badge-active',
      'inactive': 'badge-inactive',
      'pending': 'badge-pending',
      'in-progress': 'badge-maintenance',
      'completed': 'badge-available'
    };
    return `<span class="badge ${map[status] || 'badge-inactive'}">${status}</span>`;
  },
  debounce(fn, delay) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  },
  generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }
};

// ─── SIDEBAR HTML TEMPLATE ────────────────────────────
function getSidebarHTML(activePage = '') {
  const pages = [
    { page: 'index.html', icon: '📊', label: 'Dashboard' },
    { page: 'equipment.html', icon: '🔬', label: 'Equipment', section: 'Resources' },
    { page: 'labs.html', icon: '🏛️', label: 'Laboratories' },
    { page: 'vendors.html', icon: '🏢', label: 'Vendors' },
    { page: 'issue.html', icon: '📤', label: 'Issue & Return', badge: '' },
    { page: 'maintenance.html', icon: '🔧', label: 'Maintenance' },
    { page: 'students.html', icon: '🎓', label: 'Students', section: 'People' },
    { page: 'faculty.html', icon: '👨‍🏫', label: 'Faculty' },
    { page: 'technicians.html', icon: '👨‍🔧', label: 'Technicians' },
  ];

  let currentSection = '';
  let html = '';

  for (const p of pages) {
    if (p.section && p.section !== currentSection) {
      currentSection = p.section;
      html += `<div class="nav-section-label">${p.section}</div>`;
    } else if (!p.section && currentSection) {
      currentSection = '';
    }

    const isActive = activePage === p.page;
    const badge = p.badge !== undefined ? `<span class="nav-badge" id="issueBadge">0</span>` : '';
    html += `
      <a href="${p.page}" class="nav-item${isActive ? ' active' : ''}" data-page="${p.page}">
        <span class="nav-icon">${p.icon}</span>
        <span class="nav-label">${p.label}</span>
        ${badge}
      </a>`;
  }
  return html;
}

function renderSidebar(activePage) {
  const sidebar = document.getElementById('sidebarNav');
  if (sidebar) sidebar.innerHTML = getSidebarHTML(activePage);

  // Update issue badge
  const issues = DB.get('issues').filter(i => i.status === 'issued');
  const badge = document.getElementById('issueBadge');
  if (badge) {
    badge.textContent = issues.length;
    badge.style.display = issues.length ? 'inline-flex' : 'none';
  }
}

// ─── SHARED LAYOUT INIT ───────────────────────────────
function initLayout(activePage, pageTitle, breadcrumb = 'LabEMS') {
  // Heading
  const h = document.getElementById('pageHeading');
  if (h) h.textContent = pageTitle;
  const b = document.getElementById('pageBreadcrumb');
  if (b) b.textContent = breadcrumb;

  renderSidebar(activePage);
  ThemeManager.init();
  SidebarManager.init();

  // Collapse btn
  document.getElementById('collapseBtn')?.addEventListener('click', () => SidebarManager.toggle());
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => SidebarManager.toggleMobile());
  document.getElementById('themeToggle')?.addEventListener('click', () => ThemeManager.toggle());

  // Avatar dropdown
  document.getElementById('avatarBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('profileDropdown')?.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    document.getElementById('profileDropdown')?.classList.remove('open');
  });

  // Sidebar overlay (mobile)
  document.querySelector('.sidebar-overlay')?.addEventListener('click', () => SidebarManager.toggleMobile());
}

// ─── CHART RENDERER ───────────────────────────────────
const Charts = {
  drawBar(canvasId, labels, data, colors) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, W, H);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#8892b0' : '#4a5568';

    const padding = { top: 20, right: 20, bottom: 50, left: 50 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;
    const max = Math.max(...data, 1);
    const barW = (chartW / labels.length) * 0.55;
    const gap = (chartW / labels.length) * 0.45;

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + chartH - (chartH * i / 4);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(W - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = '11px DM Sans, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(max * i / 4), padding.left - 6, y + 4);
    }

    // Bars
    labels.forEach((label, i) => {
      const x = padding.left + i * (chartW / labels.length) + gap / 2;
      const barH = (data[i] / max) * chartH;
      const y = padding.top + chartH - barH;
      const color = colors[i % colors.length];

      // Shadow
      ctx.shadowColor = color + '40';
      ctx.shadowBlur = 10;

      const grad = ctx.createLinearGradient(x, y, x, padding.top + chartH);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + '40');
      ctx.fillStyle = grad;
      ctx.beginPath();
      const r = 5;
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, padding.top + chartH);
      ctx.lineTo(x, padding.top + chartH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.fill();

      ctx.shadowBlur = 0;

      // Value on top
      ctx.fillStyle = textColor;
      ctx.font = 'bold 11px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data[i], x + barW / 2, y - 5);

      // Label
      ctx.fillStyle = textColor;
      ctx.font = '10px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      const words = label.split(' ');
      words.forEach((word, wi) => {
        ctx.fillText(word, x + barW / 2, padding.top + chartH + 16 + wi * 14);
      });
    });
  },

  drawLine(canvasId, labels, datasets) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, W, H);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#8892b0' : '#4a5568';

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;
    const allVals = datasets.flatMap(d => d.data);
    const max = Math.max(...allVals, 1);

    // Grid
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + chartH - (chartH * i / 4);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(W - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = textColor;
      ctx.font = '11px DM Sans, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(max * i / 4), padding.left - 6, y + 4);
    }

    // Labels
    labels.forEach((label, i) => {
      const x = padding.left + (i / (labels.length - 1)) * chartW;
      ctx.fillStyle = textColor;
      ctx.font = '10px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, H - 5);
    });

    // Lines
    datasets.forEach(ds => {
      const points = ds.data.map((val, i) => ({
        x: padding.left + (i / (labels.length - 1)) * chartW,
        y: padding.top + chartH - (val / max) * chartH
      }));

      // Fill
      ctx.beginPath();
      ctx.moveTo(points[0].x, padding.top + chartH);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      fillGrad.addColorStop(0, ds.color + '30');
      fillGrad.addColorStop(1, ds.color + '00');
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i-1].x + points[i].x) / 2;
        const yc = (points[i-1].y + points[i].y) / 2;
        ctx.quadraticCurveTo(points[i-1].x, points[i-1].y, xc, yc);
      }
      ctx.lineTo(points[points.length-1].x, points[points.length-1].y);
      ctx.strokeStyle = ds.color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = ds.color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dots
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = ds.color;
        ctx.fill();
        ctx.strokeStyle = isDark ? '#0f1629' : '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });
  }
};

// ─── MODAL HELPERS ────────────────────────────────────
function openModal(id) {
  document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// ─── GLOBAL SEARCH ────────────────────────────────────
function initGlobalSearch() {
  const input = document.getElementById('globalSearch');
  if (!input) return;
  input.addEventListener('input', Utils.debounce((e) => {
    const q = e.target.value.trim().toLowerCase();
    if (q.length < 2) return;
    // Simple feedback - in a real app this would search across all data
    if (q.length >= 3) Toast.show(`Searching for "${q}"...`, 'info', 1500);
  }, 400));
}

// ─── INIT ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Seeder.run();
  initGlobalSearch();
});
