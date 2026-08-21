/**
 * dashboard.js — Dashboard Page Controller
 * Vietnam Data Engineer Job Market
 */

let cachedSkills = [];
let currentTrendRange = '1m';
let currentSkillsLimit = 8;

document.addEventListener('DOMContentLoaded', async () => {
  setupFilterListeners();
  await loadDashboard();
});

function setupFilterListeners() {
  // Trend Range Filter Buttons
  const trendFilterBtns = document.querySelectorAll('.trend-filter-btn');
  trendFilterBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const range = btn.getAttribute('data-range');
      if (range === currentTrendRange) return;

      trendFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTrendRange = range;

      try {
        const dashboardData = await fetchDashboard({ trend_range: currentTrendRange });
        renderJobTrendChart(dashboardData.job_trend);
      } catch (err) {
        console.error('Error fetching trend data:', err);
      }
    });
  });

  // Top Skills Limit Filter Buttons
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const limit = btn.getAttribute('data-limit');
      currentSkillsLimit = limit === 'all' ? 20 : parseInt(limit, 10);

      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      renderTopSkillsChart(cachedSkills, currentSkillsLimit);
    });
  });
}

async function loadDashboard() {
  const loadingEl = document.getElementById('dashboardLoading');
  const contentEl = document.getElementById('dashboardContent');
  const errorEl = document.getElementById('dashboardError');

  try {
    // Fetch dashboard stats and additional analytics concurrently
    const [dashboardData, skillsData, salaryData, locationData, recentJobsData] = await Promise.all([
      fetchDashboard({ trend_range: currentTrendRange }),
      fetchSkillsAnalytics(),
      fetchSalaryAnalytics(),
      fetchLocationAnalytics(),
      fetchJobs({ page: 1, per_page: 6 })
    ]);

    // Hide loading
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';

    // ── 1. Populate KPI Cards ──
    renderKPIs(dashboardData);

    // ── 2. Render Charts ──
    cachedSkills = skillsData.top_skills || [];
    renderJobTrendChart(dashboardData.job_trend);
    renderTopSkillsChart(cachedSkills, currentSkillsLimit);
    renderLocationChart(locationData.locations);
    renderSalaryDistChart(salaryData.distribution);

    // ── 3. Render Latest Jobs (Table + Mobile Slider) ──
    renderLatestJobs(recentJobsData.data);

  } catch (err) {
    console.error('Error loading dashboard:', err);
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) {
      errorEl.style.display = 'flex';
      const msg = errorEl.querySelector('.state-desc');
      if (msg) msg.textContent = 'Không thể tải dữ liệu Dashboard. Vui lòng thử lại sau.';
    }
  }
}

function renderKPIs(data) {
  const totalJobsEl = document.getElementById('kpiTotalJobs');
  const totalCompaniesEl = document.getElementById('kpiTotalCompanies');
  const medianSalaryEl = document.getElementById('kpiMedianSalary');
  const averageSalaryEl = document.getElementById('kpiAverageSalary');
  const highestSalaryEl = document.getElementById('kpiHighestSalary');
  const remoteJobsEl = document.getElementById('kpiRemoteJobs');
  const newJobsEl = document.getElementById('kpiNewJobs');

  if (totalJobsEl) totalJobsEl.textContent = formatNumber(data.total_jobs);
  if (totalCompaniesEl) totalCompaniesEl.textContent = formatNumber(data.total_companies);
  if (medianSalaryEl) medianSalaryEl.textContent = formatCurrencyCompact(data.median_salary);
  if (averageSalaryEl) averageSalaryEl.textContent = formatCurrencyCompact(data.average_salary);
  if (highestSalaryEl) highestSalaryEl.textContent = formatCurrencyCompact(data.highest_salary);
  if (remoteJobsEl) remoteJobsEl.textContent = formatNumber(data.remote_jobs);
  if (newJobsEl) newJobsEl.textContent = formatNumber(data.new_jobs);
}

function renderJobTrendChart(trendData) {
  if (!trendData || trendData.length === 0) {
    createLineChart('jobTrendChart', ['Không có dữ liệu'], [0], {
      datasetLabel: 'Số tin tuyển mới'
    });
    return;
  }

  const labels = trendData.map(item => {
    const parts = item.date_str.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    } else if (parts.length === 2) {
      return `T${parts[1]}/${parts[0].slice(2)}`;
    }
    return item.date_str;
  });
  const data = trendData.map(item => item.count);

  createLineChart('jobTrendChart', labels, data, {
    datasetLabel: 'Số tin tuyển mới',
    borderColor: '#6c8ef5',
    backgroundColor: 'rgba(108, 142, 245, 0.15)',
    dataLabelFormatter: (val) => val > 0 ? `${val}` : ''
  });
}

function renderTopSkillsChart(skills, limit = 8) {
  if (!skills || skills.length === 0) return;
  const filtered = skills.slice(0, limit);
  const labels = filtered.map(s => s.skill);
  const data = filtered.map(s => s.percentage);

  createBarChart('topSkillsChart', labels, data, {
    datasetLabel: 'Tỷ lệ yêu cầu (%)',
    horizontal: true,
    backgroundColor: '#38bdf8',
    tooltipCallback: (ctx) => ` ${ctx.raw}% tin tuyển dụng yêu cầu (${filtered[ctx.dataIndex]?.count || 0} tin)`,
    dataLabelFormatter: (val) => `${val}%`
  });
}

function renderLocationChart(locations) {
  if (!locations || locations.length === 0) return;
  const topLocs = locations.slice(0, 5);
  const labels = topLocs.map(l => l.location);
  const data = topLocs.map(l => l.job_count);

  createDoughnutChart('locationChart', labels, data, {
    colors: ['#6c8ef5', '#38bdf8', '#34d399', '#fbbf24', '#a78bfa'],
    dataLabelFormatter: (val, ctx) => {
      const total = data.reduce((a, b) => a + b, 0);
      return `${Math.round((val / total) * 100)}%`;
    }
  });
}

function renderSalaryDistChart(dist) {
  if (!dist || dist.length === 0) return;
  const labels = dist.map(d => d.range);
  const data = dist.map(d => d.count);

  createBarChart('salaryDistChart', labels, data, {
    datasetLabel: 'Số lượng việc làm',
    backgroundColor: '#34d399',
    tooltipCallback: (ctx) => ` ${ctx.raw} việc làm`,
    dataLabelFormatter: (val) => val > 0 ? `${val}` : ''
  });
}

function renderLatestJobs(jobs) {
  const tbody = document.getElementById('latestJobsBody');
  const mobileContainer = document.getElementById('latestJobsMobileSlider');

  if (!jobs || jobs.length === 0) {
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding: 2rem;">Chưa có dữ liệu việc làm.</td></tr>';
    }
    if (mobileContainer) {
      mobileContainer.innerHTML = '<div class="text-center text-muted p-4">Chưa có dữ liệu việc làm.</div>';
    }
    return;
  }

  // 1. Render Desktop Table
  if (tbody) {
    tbody.innerHTML = jobs.map(job => {
      const salaryText = formatSalaryRange(job.salary_min, job.salary_max);
      const hasSalary = job.salary_min || job.salary_max;
      const skillsHtml = (job.skills || []).slice(0, 3).map(s => 
        `<span class="badge badge-primary" style="font-size: 0.7rem; margin-right: 4px;">${escapeHtml(s)}</span>`
      ).join('');

      return `
        <tr>
          <td class="job-title-cell">
            <a href="/jobs/${job.job_id}" class="hover:text-blue-400 font-medium">${escapeHtml(job.title)}</a>
            ${job.remote ? '<span class="badge badge-success" style="font-size: 0.65rem; margin-left: 6px;">Remote</span>' : ''}
          </td>
          <td class="company-cell">${escapeHtml(job.company)}</td>
          <td><span class="badge badge-muted">${escapeHtml(job.location)}</span></td>
          <td class="salary-cell ${!hasSalary ? 'no-salary' : ''}">${salaryText}</td>
          <td>${skillsHtml}</td>
        </tr>
      `;
    }).join('');
  }

  // 2. Render Mobile Swipeable Cards Slider
  if (mobileContainer) {
    mobileContainer.innerHTML = jobs.map(job => {
      const salaryText = formatSalaryRange(job.salary_min, job.salary_max);
      const hasSalary = job.salary_min || job.salary_max;
      const skillsHtml = (job.skills || []).slice(0, 3).map(s => 
        `<span class="badge badge-primary text-xs">${escapeHtml(s)}</span>`
      ).join('');

      return `
        <div class="mobile-slide-card">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <a href="/jobs/${job.job_id}" class="font-bold text-sm text-slate-100 line-clamp-1 hover:text-blue-400">
                ${escapeHtml(job.title)}
              </a>
              <div class="text-xs text-slate-400 truncate mt-0.5">${escapeHtml(job.company)}</div>
            </div>
            ${job.remote ? '<span class="badge badge-success text-[10px] px-1.5 py-0.5">Remote</span>' : ''}
          </div>

          <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-700/50">
            <span class="badge badge-muted text-xs truncate max-w-[120px]">📍 ${escapeHtml(job.location)}</span>
            <span class="${hasSalary ? 'text-emerald-400 font-semibold' : 'text-slate-500'} text-xs">
              ${salaryText}
            </span>
          </div>

          <div class="flex flex-wrap gap-1.5 pt-1">
            ${skillsHtml}
          </div>

          <a href="/jobs/${job.job_id}" class="btn btn-outline btn-sm text-xs justify-center w-full mt-1">
            Xem chi tiết →
          </a>
        </div>
      `;
    }).join('');
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
