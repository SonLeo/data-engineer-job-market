/**
 * api.js — Centralized API Layer and Formatting Helpers
 * Vietnam Data Engineer Job Market
 */

const API_BASE = '/api';

/**
 * Global API client with error handling
 */
async function apiRequest(endpoint, params = {}) {
  try {
    const url = new URL(window.location.origin + API_BASE + endpoint);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ── API Methods ──

async function fetchDashboard(params = {}) {
  const queryParams = typeof params === 'string' ? { trend_range: params } : params;
  const res = await apiRequest('/dashboard', queryParams);
  return res.data || res;
}

async function fetchJobs(params = {}) {
  return await apiRequest('/jobs', params);
}

async function fetchJobDetail(jobId) {
  const res = await apiRequest(`/jobs/${encodeURIComponent(jobId)}`);
  return res.data || res;
}

async function fetchSalaryAnalytics() {
  const res = await apiRequest('/analytics/salary');
  return res.data || res;
}

async function fetchSkillsAnalytics() {
  const res = await apiRequest('/analytics/skills');
  return res.data || res;
}

async function fetchLocationAnalytics() {
  const res = await apiRequest('/analytics/locations');
  return res.data || res;
}

// ── Formatting Utilities ──

/**
 * Format number to Vietnamese Dong currency format (e.g. 28,000,000 ₫)
 */
function formatCurrency(val) {
  if (val === null || val === undefined || isNaN(val) || val <= 0) {
    return 'Thoả thuận';
  }
  return new Intl.NumberFormat('vi-VN').format(Math.round(val)) + ' ₫';
}

/**
 * Compact currency formatting (e.g. 28M ₫)
 */
function formatCurrencyCompact(val) {
  if (val === null || val === undefined || isNaN(val) || val <= 0) {
    return 'N/A';
  }
  if (val >= 1e6) {
    const m = (val / 1e6).toFixed(val % 1e6 === 0 ? 0 : 1);
    return `${m}M ₫`;
  }
  return new Intl.NumberFormat('vi-VN').format(Math.round(val)) + ' ₫';
}

/**
 * Format salary range (e.g. 25M - 40M ₫ or 30M ₫)
 */
function formatSalaryRange(min, max) {
  if (!min && !max) return 'Thoả thuận';
  if (min && max) {
    return `${(min / 1e6).toFixed(0)} - ${(max / 1e6).toFixed(0)} Triệu ₫`;
  }
  if (min) return `Từ ${(min / 1e6).toFixed(0)} Triệu ₫`;
  return `Lên đến ${(max / 1e6).toFixed(0)} Triệu ₫`;
}

/**
 * Format percentage (e.g. 72.4%)
 */
function formatPercent(val) {
  if (val === null || val === undefined || isNaN(val)) return '0%';
  return `${Number(val).toFixed(1)}%`;
}

/**
 * Format standard number with commas (e.g. 1,245)
 */
function formatNumber(val) {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return new Intl.NumberFormat('en-US').format(val);
}

/**
 * Format experience range string
 */
function formatExperience(min, max) {
  if (min === null && max === null) return 'Không yêu cầu';
  if (min === 0 && (!max || max <= 1)) return 'Fresher / Intern';
  if (min !== null && max !== null) {
    if (min === max) return `${min} năm kinh nghiệm`;
    return `${min} - ${max} năm kinh nghiệm`;
  }
  if (min !== null) return `Tối thiểu ${min} năm`;
  return `Tối đa ${max} năm`;
}

/**
 * Mobile Navigation Toggle Helper with Body Scroll Lock
 */
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.classList.add('overflow-hidden');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  }

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Close sidebar on ESC key or route navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });
});
