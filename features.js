/**
 * CV Builder Pro - Advanced Features Module
 * ------------------------------------------
 *  1. AI Bullet-Point Enhancer (offline, rule-based)
 *  2. Multi-Language Toggle (ID / EN preview labels)
 *  3. Dynamic Section Reordering (drag & drop, SortableJS)
 *  4. Action Verbs Library (ATS-friendly verbs by industry)
 *
 * NOTE on "AI": A true WebLLM/Transformers.js model would require
 * downloading hundreds of MB (or GB) + WebGPU, making this static
 * site heavy and unreliable on low-end devices. Instead we use a fast,
 * fully-offline heuristic rewriter that upgrades phrasing to active,
 * professional, ATS-friendly bullet points WITHOUT inventing fake
 * numbers/metrics (fabricated data on a real CV is risky). The hook
 * point `aiEnhanceText()` is isolated so a real LLM can be plugged in
 * later if desired.
 */

// ============================================================
// 1. AI BULLET-POINT ENHANCER  (offline heuristic)
// ============================================================

// Weak openers -> strong action verbs (ID)
var AI_VERB_MAP_ID = {
  'saya bertugas': 'Bertanggung jawab atas',
  'bertugas': 'Bertanggung jawab atas',
  'saya membantu': 'Mendukung',
  'membantu': 'Mendukung',
  'saya melakukan': 'Melaksanakan',
  'melakukan': 'Melaksanakan',
  'saya mengerjakan': 'Mengelola',
  'mengerjakan': 'Mengelola',
  'saya membuat': 'Mengembangkan',
  'membuat': 'Mengembangkan',
  'saya bekerja': 'Berkontribusi dalam',
  'bekerja pada': 'Berkontribusi dalam',
  'saya mengatur': 'Mengoordinasikan',
  'mengatur': 'Mengoordinasikan',
  'saya mengurus': 'Mengelola',
  'mengurus': 'Mengelola',
  'saya bertanggung jawab': 'Bertanggung jawab atas',
  'ikut serta': 'Berpartisipasi aktif dalam',
  'terlibat dalam': 'Berperan aktif dalam',
  'saya menangani': 'Menangani',
  'menangani': 'Menangani'
};

var AI_VERB_MAP_EN = {
  'i was responsible for': 'Spearheaded',
  'responsible for': 'Managed',
  'i helped': 'Supported',
  'helped': 'Supported',
  'i did': 'Executed',
  'i worked on': 'Contributed to',
  'worked on': 'Contributed to',
  'i made': 'Developed',
  'made': 'Developed',
  'i managed': 'Directed',
  'managed': 'Directed',
  'i handled': 'Handled',
  'handled': 'Oversaw',
  'in charge of': 'Led'
};

// Capitalize first letter
function capFirst(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Enhance a single line into a professional, active bullet point.
 * Heuristic only — does NOT fabricate numbers.
 */
function aiEnhanceLine(line, lang) {
  var text = line.trim();
  if (!text) return text;

  var lower = text.toLowerCase();
  var map = lang === 'en' ? AI_VERB_MAP_EN : AI_VERB_MAP_ID;
  var replaced = false;

  // Replace weak opener with a strong action verb (longest match first)
  var keys = Object.keys(map).sort(function(a,b){ return b.length - a.length; });
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (lower.indexOf(k) === 0) {
      text = map[k] + text.slice(k.length);
      replaced = true;
      break;
    }
  }

  // Trim trailing period for consistent bullet style
  text = text.replace(/\.+\s*$/, '');
  // Collapse double spaces
  text = text.replace(/\s{2,}/g, ' ').trim();
  // Ensure starts with capital
  text = capFirst(text);

  return text;
}

/**
 * Public hook: enhance a whole textarea value (multi-line).
 * Swap this body with a WebLLM call later if a real model is wanted.
 */
function aiEnhanceText(raw, lang) {
  lang = lang || (typeof state !== 'undefined' ? state.lang : 'id');
  var lines = raw.split('\n');
  return lines.map(function(l){ return l.trim() ? aiEnhanceLine(l, lang) : l; }).join('\n');
}

// Enhance the description of one experience entry by id
function aiEnhanceExp(id) {
  var e = state.data.experiences.find(function(x){ return x.id == id; });
  if (!e || !e.description || !e.description.trim()) {
    toast('Isi deskripsi terlebih dahulu sebelum menggunakan AI Enhancer 🪄');
    return;
  }
  e.description = aiEnhanceText(e.description, state.lang);
  autoSave();
  render();
  toast('✨ Deskripsi ditingkatkan dengan kata kerja aksi profesional');
}

// ============================================================
// 2. MULTI-LANGUAGE TOGGLE
// ============================================================
function setLang(lang) {
  state.lang = lang;
  autoSave();
  render();
}

// ============================================================
// 3. SECTION REORDERING (SortableJS)
// ============================================================
var _sortableInstance = null;

function initSectionSortable() {
  var el = document.getElementById('sectionSortList');
  if (!el || typeof Sortable === 'undefined') return;
  if (_sortableInstance) { try { _sortableInstance.destroy(); } catch(e){} }
  _sortableInstance = Sortable.create(el, {
    animation: 150,
    handle: '.drag-handle',
    ghostClass: 'sort-ghost',
    onEnd: function() {
      var ids = [];
      el.querySelectorAll('[data-skey]').forEach(function(node){ ids.push(node.getAttribute('data-skey')); });
      state.sectionOrder = ids;
      autoSave();
      renderPreview(); // update preview order without rebuilding the list (keeps drag smooth)
    }
  });
}

function resetSectionOrder() {
  state.sectionOrder = DEFAULT_SECTION_ORDER.slice();
  autoSave();
  render();
}

// ============================================================
// 4. ACTION VERBS LIBRARY
// ============================================================
var ACTION_VERBS = {
  'Keuangan & Audit': ['Menganalisis','Mengaudit','Mengevaluasi','Merekonsiliasi','Memvalidasi','Mengurangi risiko','Mengoptimalkan','Menyusun anggaran','Memproyeksikan','Mengidentifikasi'],
  'Kepemimpinan & Manajemen': ['Memimpin','Mengoordinasikan','Mengarahkan','Mendelegasikan','Mengawasi','Membina','Memfasilitasi','Mengelola','Merencanakan','Memprioritaskan'],
  'Teknologi & IT': ['Mengembangkan','Merancang','Mengimplementasikan','Mengintegrasikan','Mengotomatisasi','Men-debug','Men-deploy','Memigrasikan','Mengoptimalkan','Memrogram'],
  'Penjualan & Pemasaran': ['Meningkatkan','Mengakuisisi','Mempromosikan','Menegosiasikan','Memperluas','Menargetkan','Mengonversi','Membangun','Mempertahankan','Menjangkau'],
  'Operasional & Proses': ['Menyederhanakan','Meningkatkan efisiensi','Menstandardisasi','Memantau','Mengevaluasi','Menerapkan','Mengurangi','Mempercepat','Mengelola','Mengaudit'],
  'Komunikasi & Kolaborasi': ['Mempresentasikan','Bernegosiasi','Berkoordinasi','Memengaruhi','Menyusun','Mendokumentasikan','Memediasi','Menjembatani','Melatih','Mensosialisasikan']
};

var _verbsOpenCat = null; // which accordion category is open

function toggleVerbCat(cat) {
  _verbsOpenCat = (_verbsOpenCat === cat) ? null : cat;
  // Re-render only the verbs drawer to preserve textarea focus elsewhere
  var drawer = document.getElementById('verbsDrawer');
  if (drawer) drawer.innerHTML = renderVerbsDrawerInner();
}

// Insert a verb into the currently-focused (or last-focused) experience textarea
var _lastFocusedExpId = null;
function rememberExpFocus(id) { _lastFocusedExpId = id; }

function insertVerb(verb) {
  // Find target experience: last focused, else first, else create one
  var list = state.data.experiences;
  if (!list.length) { addExp(); list = state.data.experiences; }
  var target = _lastFocusedExpId ? list.find(function(x){return x.id == _lastFocusedExpId;}) : null;
  if (!target) target = list[list.length - 1];

  var cur = target.description || '';
  // Add on a new line if there's existing content
  if (cur.trim()) {
    cur = cur.replace(/\s*$/, '') + '\n' + verb + ' ';
  } else {
    cur = verb + ' ';
  }
  target.description = cur;
  autoSave();
  render();
  // Re-focus the textarea and place cursor at end
  setTimeout(function() {
    var ta = document.querySelector('[data-exp-desc="'+target.id+'"]');
    if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
  }, 50);
  toast('Kata kerja "'+verb+'" ditambahkan');
}

// ============================================================
// SHARED: lightweight toast notification
// ============================================================
var _toastTimer = null;
function toast(msg) {
  var el = document.getElementById('toastBox');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toastBox';
    el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;padding:10px 18px;border-radius:10px;font-size:13px;font-family:Inter,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.25);z-index:9999;opacity:0;transition:opacity 0.3s,bottom 0.3s';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  el.style.bottom = '32px';
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function() {
    el.style.opacity = '0';
    el.style.bottom = '24px';
  }, 2600);
}

// ============================================================
// UI RENDERERS (called from app.js form/header)
// ============================================================

// Language toggle pill for the header
function renderLangToggle() {
  var id = state.lang === 'id';
  return '<div style="display:inline-flex;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:11px;font-weight:600">' +
    '<button onclick="setLang(\'id\')" style="padding:6px 12px;border:none;cursor:pointer;background:'+(id?'#2563eb':'#fff')+';color:'+(id?'#fff':'#64748b')+'">ID</button>' +
    '<button onclick="setLang(\'en\')" style="padding:6px 12px;border:none;cursor:pointer;background:'+(!id?'#2563eb':'#fff')+';color:'+(!id?'#fff':'#64748b')+'">EN</button>' +
    '</div>';
}

// Verbs drawer inner content (so we can re-render just this part)
function renderVerbsDrawerInner() {
  var html = '';
  Object.keys(ACTION_VERBS).forEach(function(cat) {
    var open = _verbsOpenCat === cat;
    html += '<div style="border:1px solid #e2e8f0;border-radius:8px;margin-bottom:6px;overflow:hidden">' +
      '<button onclick="toggleVerbCat(\''+esc(cat)+'\')" style="width:100%;text-align:left;padding:8px 12px;background:'+(open?'#eff6ff':'#fff')+';border:none;cursor:pointer;font-size:12px;font-weight:600;color:'+(open?'#1d4ed8':'#475569')+';display:flex;justify-content:space-between;align-items:center;font-family:inherit">' +
        '<span>'+esc(cat)+'</span><span>'+(open?'▾':'▸')+'</span>' +
      '</button>';
    if (open) {
      html += '<div style="padding:10px 12px;display:flex;flex-wrap:wrap;gap:6px;background:#f8fafc">';
      ACTION_VERBS[cat].forEach(function(v) {
        html += '<button onclick="insertVerb(\''+esc(v).replace(/'/g,"\\'")+'\')" style="padding:4px 10px;background:#fff;border:1px solid #cbd5e1;border-radius:14px;font-size:11px;color:#334155;cursor:pointer;transition:all 0.15s;font-family:inherit" onmouseover="this.style.background=\'#2563eb\';this.style.color=\'#fff\';this.style.borderColor=\'#2563eb\'" onmouseout="this.style.background=\'#fff\';this.style.color=\'#334155\';this.style.borderColor=\'#cbd5e1\'">+ '+esc(v)+'</button>';
      });
      html += '</div>';
    }
    html += '</div>';
  });
  return html;
}

// Full verbs drawer block (used inside the Experience form)
function renderVerbsDrawer() {
  return '<div style="margin-top:14px;padding:12px;background:#fafbfc;border:1px solid #e2e8f0;border-radius:12px">' +
    '<div style="font-size:12px;font-weight:700;color:#334155;margin-bottom:4px">📚 Kamus Kata Kerja Aksi (ATS-Friendly)</div>' +
    '<div style="font-size:11px;color:#94a3b8;margin-bottom:10px">Klik kata untuk memasukkannya ke deskripsi pengalaman yang sedang/terakhir Anda isi.</div>' +
    '<div id="verbsDrawer">' + renderVerbsDrawerInner() + '</div>' +
  '</div>';
}

// Section reorder list (drag & drop) — used in the Template/Design tab
function renderSectionReorder() {
  var order = getSectionOrder();
  var html = '<div style="margin-bottom:8px;font-size:12px;font-weight:600;color:#475569">Urutan Section di CV</div>' +
    '<div style="font-size:11px;color:#94a3b8;margin-bottom:10px">Seret (drag) untuk mengubah urutan. Preview di kanan ikut berubah otomatis.</div>' +
    '<div id="sectionSortList">';
  order.forEach(function(key) {
    var label = SECTION_UI_LABELS[key] || key;
    html += '<div data-skey="'+key+'" style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:6px;box-shadow:0 1px 3px rgba(0,0,0,0.04)">' +
      '<span class="drag-handle" style="cursor:grab;color:#94a3b8;font-size:16px;line-height:1">⠿</span>' +
      '<span style="font-size:13px;color:#1e293b;font-weight:500">'+label+'</span>' +
    '</div>';
  });
  html += '</div>' +
    '<button onclick="resetSectionOrder()" style="margin-top:4px;padding:6px 12px;border-radius:8px;background:#f1f5f9;border:1px solid #e2e8f0;font-size:11px;color:#64748b;cursor:pointer;font-family:inherit">↺ Kembalikan urutan default</button>';
  return html;
}
