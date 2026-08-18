/**
 * jobs.js — Job Search Page Controller
 * Vietnam Data Engineer Job Market
 */

let currentPage = 1;
const perPage = 10;

document.addEventListener('DOMContentLoaded', () => {
  setupFilters();
  loadJobs(1);
});

function setupFilters() {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const locationSelect = document.getElementById('locationFilter');
  const expSelect = document.getElementById('expFilter');
  const remoteSelect = document.getElementById('remoteFilter');
  const resetBtn = document.getElementById('resetBtn');

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loadJobs(1);
    });
  }

  // Debounced input search
  let debounceTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => loadJobs(1), 350);
    });
  }

  [locationSelect, expSelect, remoteSelect].forEach(el => {
    if (el) el.addEventListener('change', () => loadJobs(1));
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (locationSelect) locationSelect.value = '';
      if (expSelect) expSelect.value = '';
      if (remoteSelect) remoteSelect.value = '';
      loadJobs(1);
    });
  }
}

function getFilterParams(page = 1) {
  const keyword = document.getElementById('searchInput')?.value.trim() || '';
  const location = document.getElementById('locationFilter')?.value || '';
  const experience = document.getElementById('expFilter')?.value || '';
  const remote = document.getElementById('remoteFilter')?.value || '';

  return {
    keyword,
    location,
    experience,
    remote,
    page,
    per_page: perPage
  };
}

async function loadJobs(page = 1) {
  const loadingEl = document.getElementById('jobsLoading');
  const listEl = document.getElementById('jobsList');
  const emptyEl = document.getElementById('jobsEmpty');
  const errorEl = document.getElementById('jobsError');
  const resultsCountEl = document.getElementById('resultsCount');
  const paginationEl = document.getElementById('jobsPagination');

  if (loadingEl) loadingEl.style.display = 'flex';
  if (listEl) listEl.style.display = 'none';
  if (emptyEl) emptyEl.style.display = 'none';
  if (errorEl) errorEl.style.display = 'none';

  try {
    const params = getFilterParams(page);
    const response = await fetchJobs(params);

    if (loadingEl) loadingEl.style.display = 'none';

    const jobs = response.data || [];
    const pagination = response.pagination || { total: 0, page: 1, total_pages: 1 };

    currentPage = pagination.page;

    // Update result count
    if (resultsCountEl) {
      resultsCountEl.innerHTML = `Tìm thấy <strong>${formatNumber(pagination.total)}</strong> việc làm phù hợp`;
    }

    if (jobs.length === 0) {
      if (emptyEl) emptyEl.style.display = 'flex';
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    if (listEl) {
      listEl.style.display = 'flex';
      renderJobList(jobs, listEl);
    }

    if (paginationEl) {
      renderPagination(pagination, paginationEl);
    }

  } catch (err) {
    console.error('Error fetching jobs:', err);
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'flex';
  }
}

function renderJobList(jobs, container) {
  container.innerHTML = jobs.map(job => {
    const salaryText = formatSalaryRange(job.salary_min, job.salary_max);
    const hasSalary = job.salary_min || job.salary_max;
    const expText = formatExperience(job.experience_min, job.experience_max);

    const skillsHtml = (job.skills || []).map(s => 
      `<span class="skill-tag">${escapeHtml(s)}</span>`
    ).join('');

    return `
      <div class="job-card">
        <div class="job-card-header">
          <div>
            <h2 class="job-card-title">
              <a href="/jobs/${job.job_id}" style="color: inherit; text-decoration: none;">${escapeHtml(job.title)}</a>
            </h2>
            <div class="job-card-company">${escapeHtml(job.company)}</div>
          </div>
          <div class="job-card-salary ${!hasSalary ? 'no-data' : ''}">${salaryText}</div>
        </div>

        <div class="job-card-meta">
          <span class="job-meta-item"><i class="badge badge-muted">${escapeHtml(job.location)}</i></span>
          <span class="job-meta-item"><i class="badge badge-info">${expText}</i></span>
          ${job.remote ? '<span class="job-meta-item"><i class="badge badge-success">Remote Available</i></span>' : ''}
          <span class="job-meta-item"><i class="badge badge-muted">${escapeHtml(job.employment_type || 'Full-time')}</i></span>
        </div>

        <div class="job-card-skills">
          ${skillsHtml}
        </div>

        <div class="job-card-footer">
          <span class="job-card-date">Đăng ngày: ${job.posted_date || 'Gần đây'} · Nguồn: ${escapeHtml(job.source || 'Direct')}</span>
          <a href="/jobs/${job.job_id}" class="btn btn-sm btn-outline">Xem chi tiết →</a>
        </div>
      </div>
    `;
  }).join('');
}

function renderPagination(pagination, container) {
  const { page, total_pages } = pagination;
  if (total_pages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  // Prev button
  html += `<button class="pagination-btn" ${page <= 1 ? 'disabled' : ''} onclick="loadJobs(${page - 1})">‹ Trước</button>`;

  // Page numbers
  const maxButtons = 5;
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  let endPage = Math.min(total_pages, startPage + maxButtons - 1);
  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  if (startPage > 1) {
    html += `<button class="pagination-btn" onclick="loadJobs(1)">1</button>`;
    if (startPage > 2) html += `<span class="pagination-info">...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="pagination-btn ${i === page ? 'active' : ''}" onclick="loadJobs(${i})">${i}</button>`;
  }

  if (endPage < total_pages) {
    if (endPage < total_pages - 1) html += `<span class="pagination-info">...</span>`;
    html += `<button class="pagination-btn" onclick="loadJobs(${total_pages})">${total_pages}</button>`;
  }

  // Next button
  html += `<button class="pagination-btn" ${page >= total_pages ? 'disabled' : ''} onclick="loadJobs(${page + 1})">Sau ›</button>`;

  container.innerHTML = html;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
