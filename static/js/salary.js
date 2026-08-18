/**
 * salary.js — Salary Analytics Page Controller
 * Vietnam Data Engineer Job Market
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadSalaryAnalytics();
});

async function loadSalaryAnalytics() {
  const loadingEl = document.getElementById('salaryLoading');
  const contentEl = document.getElementById('salaryContent');
  const errorEl = document.getElementById('salaryError');

  try {
    const data = await fetchSalaryAnalytics();

    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';

    renderSalaryKPIs(data.overview);
    renderSalaryDistChart(data.distribution);
    renderSalaryByExperienceChart(data.by_experience);
    renderSalaryByLocationChart(data.by_location);
    renderSalaryBySkillChart(data.by_skill);

  } catch (err) {
    console.error('Error loading salary analytics:', err);
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'flex';
  }
}

function renderSalaryKPIs(overview) {
  if (!overview) return;
  const avgEl = document.getElementById('kpiSalaryAvg');
  const medEl = document.getElementById('kpiSalaryMed');
  const highEl = document.getElementById('kpiSalaryMax');
  const lowEl = document.getElementById('kpiSalaryMin');

  if (avgEl) avgEl.textContent = formatCurrencyCompact(overview.average);
  if (medEl) medEl.textContent = formatCurrencyCompact(overview.median);
  if (highEl) highEl.textContent = formatCurrencyCompact(overview.maximum);
  if (lowEl) lowEl.textContent = formatCurrencyCompact(overview.minimum);
}

function renderSalaryDistChart(dist) {
  if (!dist || dist.length === 0) return;
  const labels = dist.map(d => d.range);
  const data = dist.map(d => d.count);

  createBarChart('salaryDistChart', labels, data, {
    datasetLabel: 'Số lượng việc làm',
    backgroundColor: '#6c8ef5',
    tooltipCallback: (ctx) => ` ${ctx.raw} việc làm`
  });
}

function renderSalaryByExperienceChart(expData) {
  if (!expData || expData.length === 0) return;
  const labels = expData.map(e => e.experience);
  const data = expData.map(e => Math.round((e.average_salary || 0) / 1e6));

  createBarChart('salaryExpChart', labels, data, {
    datasetLabel: 'Lương trung bình (Triệu ₫)',
    backgroundColor: '#38bdf8',
    tooltipCallback: (ctx) => ` Trung bình: ${ctx.raw}M ₫/tháng`
  });
}

function renderSalaryByLocationChart(locData) {
  if (!locData || locData.length === 0) return;
  const labels = locData.map(l => l.location);
  const data = locData.map(l => Math.round((l.average_salary || 0) / 1e6));

  createBarChart('salaryLocChart', labels, data, {
    datasetLabel: 'Lương trung bình (Triệu ₫)',
    backgroundColor: '#34d399',
    tooltipCallback: (ctx) => ` Trung bình: ${ctx.raw}M ₫/tháng`
  });
}

function renderSalaryBySkillChart(skillData) {
  if (!skillData || skillData.length === 0) return;
  const topSkills = skillData.slice(0, 10);
  const labels = topSkills.map(s => s.skill);
  const data = topSkills.map(s => Math.round((s.average_salary || 0) / 1e6));

  createBarChart('salarySkillChart', labels, data, {
    datasetLabel: 'Lương trung bình (Triệu ₫)',
    horizontal: true,
    backgroundColor: '#a78bfa',
    tooltipCallback: (ctx) => ` Trung bình: ${ctx.raw}M ₫/tháng`
  });
}
