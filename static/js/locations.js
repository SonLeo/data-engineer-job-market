/**
 * locations.js — Location Analytics Page Controller
 * Vietnam Data Engineer Job Market
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadLocationAnalytics();
});

async function loadLocationAnalytics() {
  const loadingEl = document.getElementById('locationsLoading');
  const contentEl = document.getElementById('locationsContent');
  const errorEl = document.getElementById('locationsError');

  try {
    const data = await fetchLocationAnalytics();

    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';

    renderLocationKPIs(data.locations);
    renderLocationJobChart(data.locations);
    renderLocationSalaryChart(data.locations);
    renderLocationTable(data.locations);

  } catch (err) {
    console.error('Error loading location analytics:', err);
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'flex';
  }
}

function renderLocationKPIs(locations) {
  if (!locations || locations.length === 0) return;
  const topLoc = locations[0] || { location: 'N/A', job_count: 0, percentage: 0 };
  const hcm = locations.find(l => l.location.toLowerCase().includes('ho chi minh')) || { job_count: 0, percentage: 0 };
  const hn = locations.find(l => l.location.toLowerCase().includes('hanoi')) || { job_count: 0, percentage: 0 };
  const totalLocations = locations.length;

  const topLocEl = document.getElementById('kpiTopLocation');
  const hcmShareEl = document.getElementById('kpiHcmShare');
  const hnShareEl = document.getElementById('kpiHnShare');
  const totalCitiesEl = document.getElementById('kpiTotalCities');

  if (topLocEl) topLocEl.textContent = `${topLoc.location} (${topLoc.percentage}%)`;
  if (hcmShareEl) hcmShareEl.textContent = `${hcm.job_count} việc làm (${hcm.percentage}%)`;
  if (hnShareEl) hnShareEl.textContent = `${hn.job_count} việc làm (${hn.percentage}%)`;
  if (totalCitiesEl) totalCitiesEl.textContent = formatNumber(totalLocations);
}

function renderLocationJobChart(locations) {
  if (!locations || locations.length === 0) return;
  const labels = locations.map(l => l.location);
  const data = locations.map(l => l.job_count);

  createBarChart('locJobCountChart', labels, data, {
    datasetLabel: 'Số tin tuyển dụng',
    backgroundColor: '#6c8ef5',
    tooltipCallback: (ctx) => ` ${ctx.raw} việc làm (${locations[ctx.dataIndex].percentage}%)`
  });
}

function renderLocationSalaryChart(locations) {
  if (!locations || locations.length === 0) return;
  const filteredLocs = locations.filter(l => l.average_salary > 0);
  const labels = filteredLocs.map(l => l.location);
  const data = filteredLocs.map(l => Math.round(l.average_salary / 1e6));

  createBarChart('locSalaryChart', labels, data, {
    datasetLabel: 'Lương trung bình (Triệu ₫)',
    backgroundColor: '#34d399',
    tooltipCallback: (ctx) => ` Lương trung bình: ${ctx.raw}M ₫/tháng`
  });
}

function renderLocationTable(locations) {
  const tbody = document.getElementById('locationTableBody');
  if (!tbody) return;

  if (!locations || locations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding: 2rem;">Chưa có dữ liệu địa điểm.</td></tr>';
    return;
  }

  tbody.innerHTML = locations.map((loc, index) => {
    const avgSal = loc.average_salary ? formatCurrency(loc.average_salary) : 'Thoả thuận';
    const medSal = loc.median_salary ? formatCurrency(loc.median_salary) : 'Thoả thuận';
    const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';

    return `
      <tr>
        <td>
          <span class="rank-badge ${rankClass}" style="margin-right: 8px;">#${index + 1}</span>
          <strong style="color: var(--color-text);">${escapeHtml(loc.location)}</strong>
        </td>
        <td><span class="badge badge-primary">${formatNumber(loc.job_count)} tin</span></td>
        <td>
          <div class="table-bar-container">
            <div class="table-bar-bg">
              <div class="table-bar-fill" style="width: ${Math.min(100, loc.percentage)}%;"></div>
            </div>
            <span class="table-bar-text">${loc.percentage}%</span>
          </div>
        </td>
        <td class="font-medium text-success">${avgSal}</td>
        <td class="font-medium">${medSal}</td>
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
