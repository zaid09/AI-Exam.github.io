// ===== ADMIN PANEL - FIREBASE DATABASE VIEWER =====
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { firebaseConfig } from './firebase-config.js';

let allResults = [];

// Initialize Firebase
let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (e) {
  document.getElementById('loadingMsg').textContent = '⚠️ Firebase not configured. Please update src/firebase-config.js';
}

// Load results from Firebase
window.loadResults = function() {
  if (!db) {
    document.getElementById('loadingMsg').textContent = '⚠️ Firebase not configured. Please update src/firebase-config.js';
    return;
  }
  const resultsRef = ref(db, 'exam_results');
  onValue(resultsRef, (snapshot) => {
    allResults = [];
    const data = snapshot.val();
    if (data) {
      Object.keys(data).forEach(key => {
        allResults.push({ id: key, ...data[key] });
      });
      // Sort by timestamp descending
      allResults.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    renderTable(allResults);
    updateStats(allResults);
  }, (error) => {
    document.getElementById('loadingMsg').textContent = '❌ Error loading data: ' + error.message;
  });
}

function updateStats(results) {
  document.getElementById('totalStudents').textContent = results.length;
  const passed = results.filter(r => r.score >= 50).length;
  const failed = results.filter(r => r.score < 50).length;
  const avg = results.length > 0 ? Math.round(results.reduce((s, r) => s + (r.score || 0), 0) / results.length) : 0;
  document.getElementById('passCount').textContent = passed;
  document.getElementById('failCount').textContent = failed;
  document.getElementById('avgScore').textContent = avg;
}

function renderTable(results) {
  const container = document.getElementById('tableContainer');
  if (results.length === 0) {
    container.innerHTML = '<div class="no-data">📭 No exam results yet.<br>نتائج الاختبارات ستظهر هنا بعد تقديم الطلبة للامتحان</div>';
    return;
  }
  let html = '<table><thead><tr><th>#</th><th>Name / الاسم</th><th>Department / القسم</th><th>Stage / المرحلة</th><th>Score / الدرجة</th><th>Correct</th><th>Wrong</th><th>Attempt</th><th>Date / التاريخ</th></tr></thead><tbody>';
  results.forEach((r, i) => {
    const scoreClass = r.score >= 90 ? 'score-excellent' : r.score >= 75 ? 'score-good' : r.score >= 50 ? 'score-pass' : 'score-fail';
    const date = r.timestamp ? new Date(r.timestamp).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '—';
    html += '<tr>';
    html += '<td>' + (i + 1) + '</td>';
    html += '<td>' + escapeHtml(r.name || '') + '</td>';
    html += '<td>' + escapeHtml(r.dept || '') + '</td>';
    html += '<td>' + escapeHtml(r.stage || '') + '</td>';
    html += '<td><span class="score-badge ' + scoreClass + '">' + (r.score || 0) + '/100</span></td>';
    html += '<td>' + (r.correct || 0) + '</td>';
    html += '<td>' + (r.wrong || 0) + '</td>';
    html += '<td>' + (r.attempt || '—') + '</td>';
    html += '<td>' + date + '</td>';
    html += '</tr>';
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

// Filter
function applyFilters() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const dept = document.getElementById('deptFilter').value;
  const stage = document.getElementById('stageFilter').value;
  let filtered = allResults.filter(r => {
    const matchSearch = !search || (r.name || '').toLowerCase().includes(search) || (r.dept || '').toLowerCase().includes(search);
    const matchDept = !dept || r.dept === dept;
    const matchStage = !stage || r.stage === stage;
    return matchSearch && matchDept && matchStage;
  });
  renderTable(filtered);
  updateStats(filtered);
}

document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('deptFilter').addEventListener('change', applyFilters);
document.getElementById('stageFilter').addEventListener('change', applyFilters);

// Export CSV
window.exportCSV = function() {
  if (allResults.length === 0) { alert('No data to export'); return; }
  const headers = ['Name', 'Department', 'Stage', 'Score', 'Correct', 'Wrong', 'Skipped', 'Attempt', 'Date'];
  const rows = allResults.map(r => [
    r.name || '', r.dept || '', r.stage || '', r.score || 0,
    r.correct || 0, r.wrong || 0, r.skipped || 0, r.attempt || '',
    r.timestamp ? new Date(r.timestamp).toLocaleString() : ''
  ]);
  // Add BOM for Arabic support
  let csv = '\uFEFF' + headers.join(',') + '\n' + rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'exam_results_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Init
loadResults();
