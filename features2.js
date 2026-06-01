/**
 * CV Builder Pro - Feature Module 2
 * ----------------------------------
 *  - Job Description Matcher (keyword overlap vs CV)
 *  - QR Code URL helper (uses external image API, no library)
 */

// ============================================================
// JOB DESCRIPTION MATCHER
// ============================================================

// Common stopwords (ID + EN) to ignore when extracting keywords
var JD_STOPWORDS = {
  'dan':1,'atau':1,'yang':1,'untuk':1,'dengan':1,'pada':1,'di':1,'ke':1,'dari':1,'dalam':1,
  'akan':1,'telah':1,'adalah':1,'ini':1,'itu':1,'kami':1,'anda':1,'serta':1,'agar':1,'oleh':1,
  'sebagai':1,'memiliki':1,'mampu':1,'dapat':1,'minimal':1,'tahun':1,'kerja':1,'bidang':1,
  'the':1,'and':1,'or':1,'for':1,'with':1,'to':1,'of':1,'in':1,'on':1,'a':1,'an':1,'is':1,'are':1,
  'be':1,'will':1,'have':1,'has':1,'you':1,'we':1,'our':1,'your':1,'as':1,'at':1,'by':1,'this':1,
  'that':1,'from':1,'able':1,'years':1,'experience':1,'work':1,'job':1,'role':1,'team':1,'must':1
};

// Tokenize text into normalized words (length>=3, no stopwords)
function jdTokens(text) {
  var words = (text || '').toLowerCase()
    .replace(/[^a-z0-9\u00c0-\u024f\s]/g, ' ')
    .split(/\s+/)
    .filter(function(w){ return w.length >= 3 && !JD_STOPWORDS[w]; });
  return words;
}

// Build a frequency map of keywords from the job description
function jdKeywordList(text) {
  var tokens = jdTokens(text);
  var freq = {};
  tokens.forEach(function(w){ freq[w] = (freq[w] || 0) + 1; });
  // Sort by frequency, keep meaningful ones
  var arr = Object.keys(freq).map(function(k){ return { word:k, n:freq[k] }; });
  arr.sort(function(a,b){ return b.n - a.n; });
  return arr.slice(0, 30); // top 30 keywords
}

// Collect all CV text into one searchable blob
function cvTextBlob() {
  var d = state.data, parts = [];
  var p = d.personalInfo;
  parts.push(p.jobTitle, p.summary);
  d.experiences.forEach(function(e){ parts.push(e.position, e.company, e.description); });
  d.education.forEach(function(e){ parts.push(e.degree, e.institution, e.description); });
  parts.push(d.skills.join(' '));
  d.certifications.forEach(function(c){ parts.push(c.name, c.issuer); });
  d.projects.forEach(function(e){ parts.push(e.name, e.description, e.role); });
  d.organizations.forEach(function(o){ parts.push(o.name, o.role, o.description); });
  (d.awards||[]).forEach(function(a){ parts.push(a.name, a.issuer); });
  return (parts.join(' ') || '').toLowerCase();
}

function runJobMatch() {
  var input = document.getElementById('jdInput');
  var jd = input ? input.value.trim() : '';
  var resultEl = document.getElementById('jobMatchResult');
  if (!resultEl) return;
  if (!jd) { resultEl.innerHTML = '<div style="padding:12px;background:#fef3c7;border:1px solid #fde68a;border-radius:8px;font-size:12px;color:#92400e">Silakan paste deskripsi lowongan terlebih dahulu.</div>'; return; }

  var keywords = jdKeywordList(jd);
  if (!keywords.length) { resultEl.innerHTML = '<div style="padding:12px;font-size:12px;color:#64748b">Tidak ada kata kunci yang bisa dianalisis.</div>'; return; }

  var blob = cvTextBlob();
  var matched = [], missing = [];
  keywords.forEach(function(k){
    if (blob.indexOf(k.word) !== -1) matched.push(k.word);
    else missing.push(k.word);
  });

  var score = Math.round((matched.length / keywords.length) * 100);
  var color = score >= 70 ? '#22c55e' : score >= 45 ? '#f59e0b' : '#ef4444';
  var label = score >= 70 ? 'Kecocokan Tinggi' : score >= 45 ? 'Kecocokan Sedang' : 'Kecocokan Rendah';

  var html = '';
  // Score bar
  html += '<div style="padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:12px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
      '<span style="font-size:13px;font-weight:600;color:#1e293b">Skor Kecocokan ATS</span>' +
      '<span style="font-size:18px;font-weight:700;color:'+color+'">'+score+'%</span>' +
    '</div>' +
    '<div style="height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden"><div style="height:100%;width:'+score+'%;background:'+color+';transition:width 0.4s"></div></div>' +
    '<div style="font-size:11px;color:#64748b;margin-top:6px">'+label+' — '+matched.length+' dari '+keywords.length+' kata kunci ditemukan di CV Anda.</div>' +
  '</div>';

  // Matched keywords
  if (matched.length) {
    html += '<div style="font-size:12px;font-weight:600;color:#16a34a;margin-bottom:6px">✅ Kata Kunci yang Sudah Ada ('+matched.length+')</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px">' +
      matched.map(function(w){ return '<span style="padding:3px 9px;background:#dcfce7;color:#166534;border-radius:12px;font-size:11px">'+esc(w)+'</span>'; }).join('') +
      '</div>';
  }

  // Missing keywords
  if (missing.length) {
    html += '<div style="font-size:12px;font-weight:600;color:#dc2626;margin-bottom:6px">⚠️ Kata Kunci yang Belum Ada ('+missing.length+')</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px">' +
      missing.map(function(w){ return '<span style="padding:3px 9px;background:#fee2e2;color:#b91c1c;border-radius:12px;font-size:11px">'+esc(w)+'</span>'; }).join('') +
      '</div>' +
      '<div style="font-size:11px;color:#94a3b8">💡 Jika relevan dan jujur, masukkan kata kunci di atas ke Skill/Ringkasan/Pengalaman Anda untuk meningkatkan skor.</div>';
  }

  resultEl.innerHTML = html;
}

// ============================================================
// QR CODE
// ============================================================
// Returns a QR image URL pointing to the user's LinkedIn or website.
// Uses a public QR image endpoint (no JS library / bundle needed).
function getQRUrl(size) {
  size = size || 90;
  var p = state.data.personalInfo;
  var target = '';
  if (p.linkedin) target = p.linkedin.indexOf('http') === 0 ? p.linkedin : 'https://' + p.linkedin;
  else if (p.website) target = p.website.indexOf('http') === 0 ? p.website : 'https://' + p.website;
  if (!target) return '';
  return 'https://api.qrserver.com/v1/create-qr-code/?size='+size+'x'+size+'&data=' + encodeURIComponent(target);
}
