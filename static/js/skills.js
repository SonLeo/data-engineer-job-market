/**
 * skills.js — Skills Analytics Page Controller
 * Vietnam Data Engineer Job Market
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadSkillsAnalytics();
});

async function loadSkillsAnalytics() {
  const loadingEl = document.getElementById('skillsLoading');
  const contentEl = document.getElementById('skillsContent');
  const errorEl = document.getElementById('skillsError');

  try {
    const data = await fetchSkillsAnalytics();

    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';

    renderTopSkillsKPIs(data.top_skills);
    renderTopSkillsChart(data.top_skills);
    renderSkillShareChart(data.top_skills);
    renderSkillCombinationsTable(data.skill_combinations);

  } catch (err) {
    console.error('Error loading skills analytics:', err);
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'flex';
  }
}

function renderTopSkillsKPIs(skills) {
  if (!skills || skills.length === 0) return;
  const top1 = skills[0] || { skill: 'N/A', percentage: 0 };
  const top2 = skills[1] || { skill: 'N/A', percentage: 0 };
  const top3 = skills[2] || { skill: 'N/A', percentage: 0 };

  const top1El = document.getElementById('kpiSkill1');
  const top2El = document.getElementById('kpiSkill2');
  const top3El = document.getElementById('kpiSkill3');
  const totalSkillsCountEl = document.getElementById('kpiTotalSkills');

  if (top1El) top1El.textContent = `${top1.skill} (${top1.percentage}%)`;
  if (top2El) top2El.textContent = `${top2.skill} (${top2.percentage}%)`;
  if (top3El) top3El.textContent = `${top3.skill} (${top3.percentage}%)`;
  if (totalSkillsCountEl) totalSkillsCountEl.textContent = formatNumber(skills.length);
}

function renderTopSkillsChart(skills) {
  if (!skills || skills.length === 0) return;
  const top12 = skills.slice(0, 12);
  const labels = top12.map(s => s.skill);
  const data = top12.map(s => s.count);

  createBarChart('topSkillsBarChart', labels, data, {
    datasetLabel: 'Số tin tuyển dụng',
    backgroundColor: '#6c8ef5',
    tooltipCallback: (ctx) => ` ${ctx.raw} tin tuyển dụng yêu cầu (${top12[ctx.dataIndex].percentage}%)`,
    dataLabelFormatter: (val) => val > 0 ? `${val}` : ''
  });
}

function renderSkillShareChart(skills) {
  if (!skills || skills.length === 0) return;
  const top6 = skills.slice(0, 6);
  const labels = top6.map(s => s.skill);
  const data = top6.map(s => s.percentage);

  createDoughnutChart('skillsShareChart', labels, data, {
    colors: ['#6c8ef5', '#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa'],
    dataLabelFormatter: (val) => `${val}%`
  });
}

function renderSkillCombinationsTable(combos) {
  const tbody = document.getElementById('skillCombinationsBody');
  if (!tbody) return;

  if (!combos || combos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding: 2rem;">Chưa có dữ liệu kết hợp kỹ năng.</td></tr>';
    return;
  }

  tbody.innerHTML = combos.map((c, index) => {
    const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
    return `
      <tr>
        <td>
          <span class="rank-badge ${rankClass}">#${index + 1}</span>
        </td>
        <td>
          <span class="badge badge-primary" style="margin-right: 6px;">${escapeHtml(c.skill1)}</span>
          <span class="text-muted">+</span>
          <span class="badge badge-accent" style="margin-left: 6px;">${escapeHtml(c.skill2)}</span>
        </td>
        <td class="font-medium">${formatNumber(c.count)} tin</td>
        <td>
          <div class="table-bar-container">
            <div class="table-bar-bg">
              <div class="table-bar-fill" style="width: ${Math.min(100, c.percentage * 2)}%;"></div>
            </div>
            <span class="table-bar-text">${c.percentage}%</span>
          </div>
        </td>
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
