/**
 * job-detail.js — Job Detail Page Controller
 * Vietnam Data Engineer Job Market
 */

document.addEventListener('DOMContentLoaded', async () => {
  const jobId = getJobIdFromUrl();
  if (!jobId) {
    showError('Không tìm thấy mã công việc.');
    return;
  }
  await loadJobDetail(jobId);
});

function getJobIdFromUrl() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  // /jobs/<job_id>
  return parts[parts.length - 1] || null;
}

async function loadJobDetail(jobId) {
  const loadingEl = document.getElementById('jobLoading');
  const contentEl = document.getElementById('jobContent');
  const errorEl = document.getElementById('jobError');

  try {
    const job = await fetchJobDetail(jobId);

    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';

    renderJobDetail(job);

  } catch (err) {
    console.error('Error fetching job detail:', err);
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) {
      errorEl.style.display = 'flex';
      const msg = errorEl.querySelector('.state-desc');
      if (msg) msg.textContent = 'Công việc không tồn tại hoặc đã hết hạn tuyển dụng.';
    }
  }
}

function renderJobDetail(job) {
  // Title & Company
  document.getElementById('jobTitle').textContent = job.title || 'N/A';
  document.getElementById('jobCompany').textContent = job.company || 'N/A';
  document.title = `${job.title} - ${job.company} | Vietnam DE Job Market`;

  // Badges
  const badgesContainer = document.getElementById('jobBadges');
  if (badgesContainer) {
    badgesContainer.innerHTML = `
      <span class="badge badge-muted">📍 ${escapeHtml(job.location || 'Việt Nam')}</span>
      <span class="badge badge-info">💼 ${escapeHtml(job.employment_type || 'Full-time')}</span>
      ${job.remote ? '<span class="badge badge-success">🌐 Remote Available</span>' : '<span class="badge badge-muted">🏢 On-site / Hybrid</span>'}
      <span class="badge badge-primary">⏱ ${formatExperience(job.experience_min, job.experience_max)}</span>
    `;
  }

  // Salary
  const salaryValEl = document.getElementById('jobSalaryValue');
  const salaryRangeEl = document.getElementById('jobSalaryRange');
  const hasSalary = job.salary_min || job.salary_max;

  if (salaryValEl) {
    salaryValEl.textContent = formatSalaryRange(job.salary_min, job.salary_max);
  }
  if (salaryRangeEl) {
    if (hasSalary) {
      salaryRangeEl.textContent = `Lương ước tính: ${formatCurrency(job.salary_mid)}`;
    } else {
      salaryRangeEl.textContent = 'Mức lương thương lượng theo năng lực';
    }
  }

  // Metadata Grid
  document.getElementById('metaLocation').textContent = job.location || 'N/A';
  document.getElementById('metaExperience').textContent = formatExperience(job.experience_min, job.experience_max);
  document.getElementById('metaEmploymentType').textContent = job.employment_type || 'Full-time';
  document.getElementById('metaRemote').textContent = job.remote ? 'Có' : 'Không';
  document.getElementById('metaSource').textContent = job.source || 'Direct';
  document.getElementById('metaPostedDate').textContent = job.posted_date || 'Gần đây';

  // Description
  const descEl = document.getElementById('jobDescription');
  if (descEl) {
    descEl.textContent = job.description || 'Không có mô tả chi tiết cho vị trí này.';
  }

  // Skills
  const skillsContainer = document.getElementById('jobSkillsList');
  if (skillsContainer) {
    if (job.skills && job.skills.length > 0) {
      skillsContainer.innerHTML = job.skills.map(s => 
        `<span class="skill-tag" style="font-size: 0.85rem; padding: 6px 14px;">${escapeHtml(s)}</span>`
      ).join('');
    } else {
      skillsContainer.innerHTML = '<span class="text-muted text-sm">Không có kỹ năng cụ thể được liệt kê.</span>';
    }
  }

  // External Apply Button
  const applyBtn = document.getElementById('applyBtn');
  if (applyBtn) {
    if (job.url && (job.url.startsWith('http://') || job.url.startsWith('https://'))) {
      applyBtn.href = job.url;
      applyBtn.target = '_blank';
      applyBtn.removeAttribute('disabled');
    } else {
      applyBtn.removeAttribute('href');
      applyBtn.setAttribute('disabled', 'true');
      applyBtn.title = 'Liên kết nguồn không khả dụng';
    }
  }
}

function showError(msg) {
  const loadingEl = document.getElementById('jobLoading');
  const errorEl = document.getElementById('jobError');
  if (loadingEl) loadingEl.style.display = 'none';
  if (errorEl) {
    errorEl.style.display = 'flex';
    const desc = errorEl.querySelector('.state-desc');
    if (desc) desc.textContent = msg;
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
