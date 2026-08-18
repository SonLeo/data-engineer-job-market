/**
 * dashboard.js — Dashboard Page Controller
 * Vietnam Data Engineer Job Market
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadDashboard();
});

async function loadDashboard() {
  const loadingEl = document.getElementById('dashboardLoading');
  const contentEl = document.getElementById('dashboardContent');
  const errorEl = document.getElementById('dashboardError');

  try {
    // Fetch dashboard stats and additional analytics concurrently
    const [dashboardData, skillsData, salaryData, locationData, recentJobsData] = await Promise.all([
      fetchDashboard(),
      fetchSkillsAnalytics(),
      fetchSalaryAnalytics(),
      fetchLocationAnalytics(),
      fetchJobs({ page: 1, per_page: 5 })
    ]);

    // Hide loading
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';

    // ── 1. Populate KPI Cards ──
    renderKPIs(dashboardData);

    // ── 2. Render Charts ──
    renderJobTrendChart(dashboardData.job_trend);
    renderTopSkillsChart(skillsData.top_skills);
    renderLocationChart(locationData.locations);
    renderSalaryDistChart(salaryData.distribution);

    // ── 3. Render Latest Jobs ──
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
  if (!trendData || trendData.length === 0) return;
  const labels = trendData.map(item => {
    const parts = item.date_str.split('-');
    return `${parts[2]}/${parts[1]}`;
  });
  const data = trendData.map(item => item.count);

  createLineChart('jobTrendChart', labels, data, {
    datasetLabel: 'Số tin tuyển mới',
    borderColor: '#6c8ef5',
    backgroundColor: 'rgba(108, 142, 245, 0.12)'
  });
}

function renderTopSkillsChart(skills) {
  if (!skills || skills.length === 0) return;
  const top10 = skills.slice(0, 8);
  const labels = top10.map(s => s.skill);
  const data = top10.map(s => s.percentage);

  createBarChart('topSkillsChart', labels, data, {
    datasetLabel: 'Tỷ lệ yêu cầu (%)',
    horizontal: true,
    backgroundColor: '#38bdf8',
    tooltipCallback: (ctx) => ` ${ctx.raw}% tin tuyển dụng yêu cầu`
  });
}

function renderLocationChart(locations) {
  if (!locations || locations.length === 0) return;
  const topLocs = locations.slice(0, 5);
  const labels = topLocs.map(l => l.location);
  const data = topLocs.map(l => l.job_count);

  createDoughnutChart('locationChart', labels, data, {
    colors: ['#6c8ef5', '#38bdf8', '#34d399', '#fbbf24', '#a78bfa']
  });
}

function renderSalaryDistChart(dist) {
  if (!dist || dist.length === 0) return;
  const labels = dist.map(d => d.range);
  const data = dist.map(d => d.count);

  createBarChart('salaryDistChart', labels, data, {
    datasetLabel: 'Số lượng việc làm',
    backgroundColor: '#34d399',
    tooltipCallback: (ctx) => ` ${ctx.raw} việc làm`
  });
}

function renderLatestJobs(jobs) {
  const tbody = document.getElementById('latestJobsBody');
  if (!tbody) return;

  if (!jobs || jobs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding: 2rem;">Chưa có dữ liệu việc làm.</td></tr>';
    return;
  }

  tbody.innerHTML = jobs.map(job => {
    const salaryText = formatSalaryRange(job.salary_min, job.salary_max);
    const hasSalary = job.salary_min || job.salary_max;
    const skillsHtml = (job.skills || []).slice(0, 3).map(s => 
      `<span class="badge badge-primary" style="font-size: 0.7rem; margin-right: 4px;">${s}</span>`
    ).join('');

    return `
      <tr>
        <td class="job-title-cell">
          <a href="/jobs/${job.job_id}">${escapeHtml(job.title)}</a>
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
