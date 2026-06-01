/**
 * CV Builder Pro - Config-Driven Template Engine
 * ------------------------------------------------
 * Each template is a config object describing its layout & style.
 * A single generic renderer (renderCV) builds the HTML, applying:
 *   - User-selected accent color (state.accentColor)
 *   - User-selected density: font size + line height (state.density)
 * via CSS variables, so all templates respond uniformly.
 */

// ============================================================
// ACCENT COLOR PALETTE
// ============================================================
var COLOR_PALETTE = [
  { id: 'navy',     name: 'Biru Navy',     value: '#1e3a5f' },
  { id: 'emerald',  name: 'Hijau Emerald', value: '#059669' },
  { id: 'black',    name: 'Hitam Elegan',  value: '#1a1a1a' },
  { id: 'maroon',   name: 'Maroon',        value: '#7f1d1d' },
  { id: 'blue',     name: 'Biru Cerah',    value: '#2563eb' },
  { id: 'purple',   name: 'Ungu',          value: '#7c3aed' }
];

// ============================================================
// DENSITY PRESETS (Spacing & Font Size control)
// ============================================================
var DENSITY_PRESETS = {
  compact:  { label: 'Compact',  baseFont: 9.5,  lineHeight: 1.35, sectionGap: 10, entryGap: 6 },
  normal:   { label: 'Normal',   baseFont: 10.5, lineHeight: 1.5,  sectionGap: 16, entryGap: 10 },
  spacious: { label: 'Spacious', baseFont: 11.5, lineHeight: 1.7,  sectionGap: 22, entryGap: 14 }
};

// ============================================================
// MULTI-LANGUAGE LABELS (preview section titles only)
// ============================================================
var LABELS = {
  id: {
    summary: 'Ringkasan Profesional', experience: 'Pengalaman Kerja', education: 'Pendidikan',
    skills: 'Keahlian', certifications: 'Sertifikasi & Lisensi', projects: 'Proyek',
    organizations: 'Organisasi & Kegiatan', languages: 'Bahasa', featured: 'Proyek Unggulan',
    allProjects: 'Semua Proyek', present: 'Sekarang', viewCert: 'Lihat Sertifikat', contact: 'Kontak',
    awards: 'Penghargaan', hobbies: 'Hobi & Minat', references: 'Referensi'
  },
  en: {
    summary: 'Professional Summary', experience: 'Work Experience', education: 'Education',
    skills: 'Skills', certifications: 'Certifications & Licenses', projects: 'Projects',
    organizations: 'Organizations & Activities', languages: 'Languages', featured: 'Featured Projects',
    allProjects: 'All Projects', present: 'Present', viewCert: 'View Certificate', contact: 'Contact',
    awards: 'Awards', hobbies: 'Hobbies & Interests', references: 'References'
  }
};

// Lookup a preview label for the active language
function L(key) {
  var lang = (typeof state !== 'undefined' && state.lang) ? state.lang : 'id';
  var dict = LABELS[lang] || LABELS.id;
  return dict[key] || LABELS.id[key] || key;
}

// ============================================================
// SECTION ORDER (drag-and-drop reorderable)
// ============================================================
var DEFAULT_SECTION_ORDER = ['summary','experience','education','skills','certifications','projects','awards','organizations','hobbies','references','languages'];

// Friendly labels for the reorder UI (always Indonesian in the editor)
var SECTION_UI_LABELS = {
  summary: '📝 Ringkasan', experience: '💼 Pengalaman', education: '🎓 Pendidikan',
  skills: '⚡ Keahlian', certifications: '📜 Sertifikasi', projects: '🚀 Proyek',
  organizations: '🤝 Organisasi', languages: '🌍 Bahasa',
  awards: '🏆 Penghargaan', hobbies: '🎯 Hobi', references: '🔗 Referensi'
};

// Resolve current order, appending any missing keys for safety
function getSectionOrder() {
  var order = (typeof state !== 'undefined' && state.sectionOrder && state.sectionOrder.length) ? state.sectionOrder.slice() : DEFAULT_SECTION_ORDER.slice();
  DEFAULT_SECTION_ORDER.forEach(function(k){ if (order.indexOf(k) === -1) order.push(k); });
  return order;
}

// ============================================================
// TEMPLATE CONFIGS (12 total: 2 original favorites + 10 new)
// ============================================================
// Properties:
//   font:        body font-family
//   headingFont: name/heading font-family (optional, defaults to font)
//   accent:      default accent color (overridable by user)
//   layout:      'single' | 'split'
//   headerAlign: 'left' | 'center'
//   headerStyle: 'underline' | 'plain' | 'bar'
//   sectionStyle:'underline' | 'bar' | 'leftbar' | 'plain' | 'uppercase-thick'
//   uppercase:   section titles uppercase
//   skillStyle:  'tags' | 'inline' | 'columns'
//   sidebar:     for split layouts: { width, bg, text, on } 
//   contactPos:  'header' | 'footer'
//   nameUpper:   uppercase name
//   featured:    show featured-projects box at top
//   monoContact: render contact/skills in monospace
var TEMPLATES = {
  'ats-clean': {
    name: 'ATS Standard', cat: 'Corporate', icon: '📄',
    font: "Calibri, Arial, sans-serif", accent: '#1e3a5f',
    layout: 'single', headerAlign: 'left', headerStyle: 'plain',
    sectionStyle: 'underline', skillStyle: 'inline'
  },
  'academic-classic': {
    name: 'Academic Classic', cat: 'Corporate', icon: '🎓',
    font: "'EB Garamond', 'Times New Roman', serif", accent: '#1a1a1a',
    forceBlack: true, layout: 'single', headerAlign: 'center', headerStyle: 'underline',
    sectionStyle: 'underline', uppercase: true, skillStyle: 'inline', wideMargin: true
  },
  'banking-professional': {
    name: 'Banking Professional', cat: 'Corporate', icon: '🏦',
    font: "Calibri, Arial, sans-serif", headingFont: "Georgia, serif", accent: '#7f1d1d',
    layout: 'single', headerAlign: 'left', headerStyle: 'underline',
    sectionStyle: 'uppercase-thick', uppercase: true, skillStyle: 'inline'
  },
  'legal-minimalist': {
    name: 'Legal Minimalist', cat: 'Corporate', icon: '⚖️',
    font: "Arial, sans-serif", accent: '#1f2937',
    layout: 'single', headerAlign: 'left', headerStyle: 'underline',
    sectionStyle: 'underline', skillStyle: 'inline', contactPos: 'footer'
  },
  'tech-minimal': {
    name: 'Tech Minimal', cat: 'Modern', icon: '💻',
    font: "Inter, sans-serif", accent: '#2563eb',
    layout: 'single', headerAlign: 'left', headerStyle: 'plain',
    sectionStyle: 'leftbar', skillStyle: 'tags', monoContact: true
  },
  'nordic-slate': {
    name: 'Nordic Slate', cat: 'Modern', icon: '🌫️',
    font: "Inter, sans-serif", accent: '#475569', charcoal: true,
    layout: 'single', headerAlign: 'left', headerStyle: 'underline',
    sectionStyle: 'plain', uppercase: true, skillStyle: 'tags'
  },
  'left-border-accent': {
    name: 'Left-Border Accent', cat: 'Modern', icon: '▌',
    font: "Inter, sans-serif", accent: '#059669',
    layout: 'single', headerAlign: 'left', headerStyle: 'plain',
    sectionStyle: 'leftbar', skillStyle: 'tags'
  },
  'modern-clean': {
    name: 'Modern Minimalis', cat: 'Modern', icon: '✨',
    font: "Calibri, Arial, sans-serif", accent: '#2563eb',
    layout: 'single', headerAlign: 'center', headerStyle: 'underline',
    sectionStyle: 'bar', uppercase: true, skillStyle: 'tags', centerSkills: true
  },
  'sidebar-dark': {
    name: 'Sidebar Dark', cat: 'Split', icon: '◧',
    font: "Inter, sans-serif", accent: '#0f172a',
    layout: 'split', sidebar: { width: 32, bg: '#1e293b', text: '#e2e8f0', accentText: '#94a3b8' },
    sectionStyle: 'underline', skillStyle: 'tags'
  },
  'warm-ivory-split': {
    name: 'Warm Ivory Split', cat: 'Split', icon: '◨',
    font: "Inter, sans-serif", accent: '#92400e',
    layout: 'split', sidebar: { width: 33, bg: '#faf6ef', text: '#44403c', accentText: '#92400e' },
    sectionStyle: 'underline', skillStyle: 'tags'
  },
  'creative-bold': {
    name: 'Creative Bold', cat: 'Creative', icon: '🎨',
    font: "Inter, sans-serif", headingFont: "Montserrat, sans-serif", accent: '#7c3aed',
    layout: 'single', headerAlign: 'left', headerStyle: 'bar', nameUpper: true, bigName: true,
    sectionStyle: 'leftbar', uppercase: true, skillStyle: 'tags'
  },
  'portfolio-spotlight': {
    name: 'Portfolio Spotlight', cat: 'Creative', icon: '🌟',
    font: "Inter, sans-serif", headingFont: "Montserrat, sans-serif", accent: '#ea580c',
    layout: 'single', headerAlign: 'left', headerStyle: 'underline',
    sectionStyle: 'bar', uppercase: true, skillStyle: 'tags', featured: true
  }
};

var TEMPLATE_CATEGORIES = ['Corporate', 'Modern', 'Split', 'Creative'];

// ============================================================
// HELPER: resolve current style settings
// ============================================================
function getActiveAccent() {
  // User override wins; else template default
  if (state.accentColor) return state.accentColor;
  var t = TEMPLATES[state.template];
  return (t && t.accent) || '#1e3a5f';
}

function getDensity() {
  return DENSITY_PRESETS[state.density] || DENSITY_PRESETS.normal;
}

// Text colors adapt to template flavor
function bodyTextColor(cfg) {
  if (cfg.forceBlack) return '#000';
  if (cfg.charcoal) return '#334155';
  return '#1f2937';
}
function mutedColor(cfg) {
  if (cfg.forceBlack) return '#333';
  return '#6b7280';
}

// ============================================================
// SHARED CONTENT-PIECE BUILDERS
//   These read CSS variables so density/accent apply uniformly
// ============================================================
function tplBullets(desc) {
  if (!desc) return '';
  var lines = desc.split('\n').filter(function(l){return l.trim();});
  if (!lines.length) return '';
  return '<ul style="margin:4px 0 0 0;padding-left:16px">' +
    lines.map(function(l){return '<li style="font-size:var(--cv-fs-body);color:var(--cv-text);margin-bottom:2px;line-height:var(--cv-lh)">'+esc(l)+'</li>';}).join('') +
    '</ul>';
}

function tplDocs(docs) {
  if (!docs || !docs.length) return '';
  var v = docs.filter(function(d){return d.url && d.name;});
  if (!v.length) return '';
  return '<div style="margin-top:3px">' + v.map(function(d){
    return '<a href="'+esc(d.url)+'" target="_blank" rel="noopener" style="font-size:var(--cv-fs-small);color:var(--cv-accent);text-decoration:none;margin-right:10px">📎 '+esc(d.name)+'</a>';
  }).join('') + '</div>';
}

function tplCertDoc(c) {
  var url = c.docUrl || c.link || '';
  if (!url) return '';
  return ' <a href="'+esc(url)+'" target="_blank" rel="noopener" style="font-size:var(--cv-fs-small);color:var(--cv-accent);text-decoration:none">📎 '+L('viewCert')+'</a>';
}

// Section header — varies by sectionStyle
function tplSectionHead(title, cfg) {
  var t = cfg.uppercase ? title.toUpperCase() : title;
  var ls = cfg.uppercase ? ';letter-spacing:0.8px' : '';
  var hf = cfg.headingFont ? 'font-family:'+cfg.headingFont+';' : '';
  var base = 'font-size:var(--cv-fs-h2);font-weight:700;color:var(--cv-accent);margin:var(--cv-section-gap) 0 8px 0;'+hf+ls;

  if (cfg.sectionStyle === 'leftbar') {
    return '<h2 style="'+base+';border-left:4px solid var(--cv-accent);padding-left:10px">'+t+'</h2>';
  }
  if (cfg.sectionStyle === 'bar') {
    return '<h2 style="'+base+';background:var(--cv-accent-soft);padding:6px 12px;border-left:3px solid var(--cv-accent)">'+t+'</h2>';
  }
  if (cfg.sectionStyle === 'uppercase-thick') {
    return '<h2 style="'+base+';border-bottom:2.5px solid var(--cv-accent);padding-bottom:4px">'+t+'</h2>';
  }
  if (cfg.sectionStyle === 'plain') {
    return '<h2 style="'+base+'">'+t+'</h2>';
  }
  // default: underline
  return '<h2 style="'+base+';border-bottom:1.5px solid var(--cv-accent);padding-bottom:4px">'+t+'</h2>';
}

// Skills rendering — varies by skillStyle
function tplSkills(sk, cfg, opts) {
  opts = opts || {};
  if (!sk.length) return '';
  if (cfg.skillStyle === 'tags') {
    var justify = opts.center ? 'justify-content:center;' : '';
    var mono = cfg.monoContact ? "font-family:'JetBrains Mono',monospace;" : '';
    return '<div style="display:flex;flex-wrap:wrap;gap:6px;'+justify+'">' +
      sk.map(function(s){
        return '<span style="padding:3px 10px;background:var(--cv-accent-soft);color:var(--cv-accent);border-radius:4px;font-size:var(--cv-fs-small);'+mono+'">'+esc(s)+'</span>';
      }).join('') + '</div>';
  }
  if (cfg.skillStyle === 'columns') {
    return '<div style="font-size:var(--cv-fs-body);color:var(--cv-text);columns:2;column-gap:24px">' +
      sk.map(function(s){return '<div style="margin-bottom:3px">&bull; '+esc(s)+'</div>';}).join('') + '</div>';
  }
  // inline
  return '<div style="font-size:var(--cv-fs-body);color:var(--cv-text)">'+sk.map(esc).join(' &nbsp;&bull;&nbsp; ')+'</div>';
}

// Contact line builder
function tplContact(p, cfg, opts) {
  opts = opts || {};
  var items = [];
  if (p.email) items.push(esc(p.email));
  if (p.phone) items.push(esc(p.phone));
  if (p.location) items.push(esc(p.location));
  if (p.linkedin) items.push(esc(p.linkedin));
  if (p.website) items.push(esc(p.website));
  if (!items.length) return '';
  var mono = cfg.monoContact ? "font-family:'JetBrains Mono',monospace;" : '';
  var align = opts.center ? 'justify-content:center;' : '';
  var sep = '<span style="color:#cbd5e1;margin:0 6px">|</span>';
  return '<div style="font-size:var(--cv-fs-small);color:'+mutedColor(cfg)+';display:flex;flex-wrap:wrap;gap:2px;'+align+mono+'">'+items.join(sep)+'</div>';
}

// ============================================================
// SECTION CONTENT BUILDERS (shared across layouts)
// ============================================================
function tplExpEntries(ex) {
  var html = '';
  ex.forEach(function(e) {
    html += '<div style="margin-bottom:var(--cv-entry-gap)">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline">' +
        '<h3 style="font-size:var(--cv-fs-h3);font-weight:600;color:var(--cv-text);margin:0">'+esc(e.position)+'</h3>' +
        '<span style="font-size:var(--cv-fs-small);color:var(--cv-muted);white-space:nowrap">'+fmtDate(e.startDate)+' — '+(e.current?L('present'):fmtDate(e.endDate))+'</span>' +
      '</div>' +
      '<div style="font-size:var(--cv-fs-small);color:var(--cv-accent);font-weight:500">'+esc(e.company)+'</div>' +
      tplBullets(e.description) + tplDocs(e.docs) +
    '</div>';
  });
  return html;
}

function tplEduEntries(ed) {
  var html = '';
  ed.forEach(function(e) {
    html += '<div style="margin-bottom:var(--cv-entry-gap)">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline">' +
        '<h3 style="font-size:var(--cv-fs-h3);font-weight:600;color:var(--cv-text);margin:0">'+esc(e.degree)+'</h3>' +
        '<span style="font-size:var(--cv-fs-small);color:var(--cv-muted);white-space:nowrap">'+esc(e.startDate)+' — '+esc(e.endDate)+'</span>' +
      '</div>' +
      '<div style="font-size:var(--cv-fs-small);color:var(--cv-accent);font-weight:500">'+esc(e.institution)+'</div>' +
      (e.description?'<div style="font-size:var(--cv-fs-small);color:var(--cv-text);margin-top:2px">'+esc(e.description)+'</div>':'') +
      tplDocs(e.docs) +
    '</div>';
  });
  return html;
}

function tplCertEntries(ce) {
  var html = '';
  ce.forEach(function(c) {
    html += '<div style="margin-bottom:5px;font-size:var(--cv-fs-body)"><strong>'+esc(c.name)+'</strong>' +
      (c.issuer?' — '+esc(c.issuer):'') + (c.date?' ('+esc(c.date)+')':'') + tplCertDoc(c) + '</div>';
  });
  return html;
}

function tplProjEntries(pr) {
  var html = '';
  pr.forEach(function(proj) {
    html += '<div style="margin-bottom:var(--cv-entry-gap)">' +
      '<h3 style="font-size:var(--cv-fs-h3);font-weight:600;color:var(--cv-text);margin:0">'+esc(proj.name)+(proj.role?' — <span style="font-weight:400;font-style:italic;color:var(--cv-muted)">'+esc(proj.role)+'</span>':'')+'</h3>' +
      (proj.description?'<div style="font-size:var(--cv-fs-body);color:var(--cv-text);margin-top:2px">'+esc(proj.description)+'</div>':'') +
      (proj.link?'<a href="'+esc(proj.link)+'" target="_blank" rel="noopener" style="font-size:var(--cv-fs-small);color:var(--cv-accent);text-decoration:none">🔗 '+esc(proj.link)+'</a>':'') +
      tplDocs(proj.docs) +
    '</div>';
  });
  return html;
}

function tplOrgEntries(og) {
  var html = '';
  og.forEach(function(o) {
    html += '<div style="margin-bottom:var(--cv-entry-gap)">' +
      '<h3 style="font-size:var(--cv-fs-h3);font-weight:600;color:var(--cv-text);margin:0">'+esc(o.name)+(o.role?' — <span style="font-weight:400;font-style:italic;color:var(--cv-muted)">'+esc(o.role)+'</span>':'')+'</h3>' +
      (o.description?'<div style="font-size:var(--cv-fs-body);color:var(--cv-text);margin-top:2px">'+esc(o.description)+'</div>':'') +
      tplDocs(o.docs) +
    '</div>';
  });
  return html;
}

function tplLangEntries(la) {
  return la.map(function(l){
    return '<div style="font-size:var(--cv-fs-body);color:var(--cv-text);margin-bottom:2px">'+esc(l.name)+' — <span style="color:var(--cv-muted)">'+esc(l.level)+'</span></div>';
  }).join('');
}

function tplAwardEntries(aw) {
  return aw.map(function(a){
    return '<div style="margin-bottom:5px;font-size:var(--cv-fs-body)"><strong>'+esc(a.name)+'</strong>' +
      (a.issuer?' — '+esc(a.issuer):'') + (a.year?' ('+esc(a.year)+')':'') + '</div>';
  }).join('');
}

function tplHobbyEntries(hb) {
  return '<div style="font-size:var(--cv-fs-body);color:var(--cv-text)">' + hb.map(esc).join(' &nbsp;&bull;&nbsp; ') + '</div>';
}

function tplRefEntries(rf) {
  return rf.map(function(r){
    return '<div style="margin-bottom:var(--cv-entry-gap)">' +
      '<h3 style="font-size:var(--cv-fs-h3);font-weight:600;color:var(--cv-text);margin:0">'+esc(r.name)+'</h3>' +
      '<div style="font-size:var(--cv-fs-small);color:var(--cv-muted)">'+esc(r.position)+(r.company?', '+esc(r.company):'')+'</div>' +
      (r.contact?'<div style="font-size:var(--cv-fs-small);color:var(--cv-accent)">'+esc(r.contact)+'</div>':'') +
    '</div>';
  }).join('');
}

// Featured projects box (Portfolio Spotlight)
function tplFeaturedBox(pr) {
  if (!pr || !pr.length) return '';
  var top = pr.slice(0, 3);
  var html = '<div style="background:var(--cv-accent-soft);border:1px solid var(--cv-accent);border-radius:8px;padding:12px 16px;margin-bottom:var(--cv-section-gap)">' +
    '<div style="font-size:var(--cv-fs-h3);font-weight:700;color:var(--cv-accent);margin-bottom:6px">★ '+L('featured').toUpperCase()+'</div>';
  top.forEach(function(proj){
    html += '<div style="margin-bottom:4px;font-size:var(--cv-fs-body);color:var(--cv-text)"><strong>'+esc(proj.name)+'</strong>' +
      (proj.link?' — <a href="'+esc(proj.link)+'" target="_blank" rel="noopener" style="color:var(--cv-accent);text-decoration:none">'+esc(proj.link)+'</a>':'') + '</div>';
  });
  html += '</div>';
  return html;
}

// ============================================================
// MAIN RENDER ENGINE
// ============================================================
function renderCV() {
  var cfg = TEMPLATES[state.template] || TEMPLATES['ats-clean'];
  var accent = getActiveAccent();
  var dens = getDensity();

  // Build CSS-variable style scope so all child styles inherit
  // accent + density uniformly (enables instant recolor/resize)
  var vars =
    '--cv-accent:'+accent+';' +
    '--cv-accent-soft:'+hexToSoft(accent)+';' +
    '--cv-text:'+bodyTextColor(cfg)+';' +
    '--cv-muted:'+mutedColor(cfg)+';' +
    '--cv-fs-body:'+dens.baseFont+'pt;' +
    '--cv-fs-small:'+(dens.baseFont-1)+'pt;' +
    '--cv-fs-h3:'+(dens.baseFont+0.5)+'pt;' +
    '--cv-fs-h2:'+(dens.baseFont+1)+'pt;' +
    '--cv-lh:'+dens.lineHeight+';' +
    '--cv-section-gap:'+dens.sectionGap+'px;' +
    '--cv-entry-gap:'+dens.entryGap+'px;';

  // Cover Letter document mode — uses same accent/density vars
  if (typeof state.docMode !== 'undefined' && state.docMode === 'cover') {
    return renderCoverLetter(cfg, vars, dens);
  }

  if (cfg.layout === 'split') {
    return renderSplitLayout(cfg, vars, dens);
  }
  return renderSingleLayout(cfg, vars, dens);
}

// Lighten a hex accent to a soft background tint
function hexToSoft(hex) {
  var h = hex.replace('#','');
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  var r = parseInt(h.substring(0,2),16),
      g = parseInt(h.substring(2,4),16),
      b = parseInt(h.substring(4,6),16);
  // Mix ~12% accent with white
  r = Math.round(r*0.12 + 255*0.88);
  g = Math.round(g*0.12 + 255*0.88);
  b = Math.round(b*0.12 + 255*0.88);
  return 'rgb('+r+','+g+','+b+')';
}

// ============================================================
// SINGLE-COLUMN LAYOUT
// ============================================================
function renderSingleLayout(cfg, vars, dens) {
  var p=state.data.personalInfo, ex=state.data.experiences, ed=state.data.education,
      sk=state.data.skills, la=state.data.languages, ce=state.data.certifications,
      pr=state.data.projects, og=state.data.organizations;

  var pad = cfg.wideMargin ? '32mm 28mm' : '24mm 20mm';
  var html = '<div class="cv-render" style="'+vars+'font-family:'+cfg.font+';padding:'+pad+';line-height:var(--cv-lh)">';

  // ---- HEADER ----
  var alignCenter = cfg.headerAlign === 'center';
  var nameSize = cfg.bigName ? '30pt' : '24pt';
  var nameText = cfg.nameUpper ? (p.fullName||'NAMA LENGKAP').toUpperCase() : (p.fullName||'Nama Lengkap Anda');
  var hf = cfg.headingFont ? 'font-family:'+cfg.headingFont+';' : '';
  var headerBorder = cfg.headerStyle === 'underline' ? ';border-bottom:2px solid var(--cv-accent);padding-bottom:12px' :
                     cfg.headerStyle === 'bar' ? '' : '';

  html += '<div style="margin-bottom:var(--cv-section-gap);'+(alignCenter?'text-align:center;':'')+headerBorder+'">';
  // Optional profile photo (single-column): show as a circle aligned with name
  var photoSingle = '';
  if (state.data.photo && !alignCenter) {
    photoSingle = '<img src="'+state.data.photo+'" alt="" style="width:78px;height:78px;border-radius:50%;object-fit:cover;border:2px solid var(--cv-accent);float:right;margin-left:14px">';
  } else if (state.data.photo && alignCenter) {
    photoSingle = '<img src="'+state.data.photo+'" alt="" style="width:84px;height:84px;border-radius:50%;object-fit:cover;border:2px solid var(--cv-accent);display:block;margin:0 auto 8px">';
  }
  // QR code (single-column): float opposite the photo
  var qrSingle = '';
  if (state.showQR && typeof getQRUrl === 'function') {
    var qurl = getQRUrl(80);
    if (qurl) qrSingle = '<img src="'+qurl+'" alt="QR" style="width:64px;height:64px;float:right;margin-left:14px;border:1px solid #e5e7eb;border-radius:6px">';
  }
  if (alignCenter && photoSingle) html += photoSingle;
  if (!alignCenter) html += qrSingle + photoSingle;
  if (cfg.headerStyle === 'bar') {
    html += '<div style="background:var(--cv-accent);color:#fff;padding:14px 18px;border-radius:6px;margin-bottom:8px">';
    html += '<h1 style="font-size:'+nameSize+';font-weight:800;margin:0;color:#fff;'+hf+'">'+nameText+'</h1>';
    if (p.jobTitle) html += '<div style="font-size:var(--cv-fs-h2);color:rgba(255,255,255,0.9);margin-top:2px">'+esc(p.jobTitle)+'</div>';
    html += '</div>';
  } else {
    html += '<h1 style="font-size:'+nameSize+';font-weight:700;margin:0;color:'+bodyTextColor(cfg)+';'+hf+'">'+nameText+'</h1>';
    if (p.jobTitle) html += '<div style="font-size:var(--cv-fs-h2);color:var(--cv-accent);font-weight:600;margin-top:3px">'+esc(p.jobTitle)+'</div>';
  }
  // Contact in header unless footer-positioned
  if (cfg.contactPos !== 'footer') {
    html += '<div style="margin-top:6px">' + tplContact(p, cfg, {center:alignCenter}) + '</div>';
  }
  html += '<div style="clear:both"></div>';
  html += '</div>';

  // ---- FEATURED BOX (Portfolio Spotlight) ----
  if (cfg.featured) html += tplFeaturedBox(pr);

  // ---- SECTIONS (rendered in user-defined order) ----
  var order = getSectionOrder();
  order.forEach(function(key) {
    if (key === 'summary' && p.summary) {
      html += tplSectionHead(L('summary'), cfg);
      html += '<p style="font-size:var(--cv-fs-body);color:var(--cv-text);line-height:var(--cv-lh);margin:0'+(alignCenter?';text-align:center':'')+'">'+esc(p.summary)+'</p>';
    }
    else if (key === 'experience' && ex.length) {
      html += tplSectionHead(L('experience'), cfg); html += tplExpEntries(ex);
    }
    else if (key === 'education' && ed.length) {
      html += tplSectionHead(L('education'), cfg); html += tplEduEntries(ed);
    }
    else if (key === 'skills' && sk.length) {
      html += tplSectionHead(L('skills'), cfg); html += tplSkills(sk, cfg, {center: cfg.centerSkills});
    }
    else if (key === 'certifications' && ce.length) {
      html += tplSectionHead(L('certifications'), cfg); html += tplCertEntries(ce);
    }
    else if (key === 'projects' && pr.length) {
      html += tplSectionHead(cfg.featured ? L('allProjects') : L('projects'), cfg); html += tplProjEntries(pr);
    }
    else if (key === 'organizations' && og.length) {
      html += tplSectionHead(L('organizations'), cfg); html += tplOrgEntries(og);
    }
    else if (key === 'awards' && (state.data.awards && state.data.awards.length)) {
      html += tplSectionHead(L('awards'), cfg); html += tplAwardEntries(state.data.awards);
    }
    else if (key === 'hobbies' && (state.data.hobbies && state.data.hobbies.length)) {
      html += tplSectionHead(L('hobbies'), cfg); html += tplHobbyEntries(state.data.hobbies);
    }
    else if (key === 'references' && (state.data.references && state.data.references.length)) {
      html += tplSectionHead(L('references'), cfg); html += tplRefEntries(state.data.references);
    }
    else if (key === 'languages' && la.length) {
      html += tplSectionHead(L('languages'), cfg); html += tplLangEntries(la);
    }
  });

  // ---- FOOTER CONTACT (Legal Minimalist) ----
  if (cfg.contactPos === 'footer') {
    html += '<div style="margin-top:var(--cv-section-gap);padding-top:10px;border-top:1px solid #e5e7eb;text-align:center">' +
      tplContact(p, cfg, {center:true}) + '</div>';
  }

  html += '</div>';
  return html;
}

// ============================================================
// SPLIT-COLUMN LAYOUT (Sidebar Dark / Warm Ivory)
// ============================================================
function renderSplitLayout(cfg, vars, dens) {
  var p=state.data.personalInfo, ex=state.data.experiences, ed=state.data.education,
      sk=state.data.skills, la=state.data.languages, ce=state.data.certifications,
      pr=state.data.projects, og=state.data.organizations;

  var sb = cfg.sidebar;
  var darkSidebar = sb.text && sb.text !== '#44403c';
  var html = '<div class="cv-render" style="'+vars+'font-family:'+cfg.font+';display:flex;min-height:297mm;line-height:var(--cv-lh)">';

  // ===== SIDEBAR =====
  html += '<div style="width:'+sb.width+'%;background:'+sb.bg+';color:'+sb.text+';padding:24px 18px">';

  // Name block
  html += '<div style="margin-bottom:16px;padding-bottom:14px;border-bottom:2px solid '+(darkSidebar?'rgba(255,255,255,0.3)':'var(--cv-accent)')+'">';
  if (state.data.photo) {
    html += '<img src="'+state.data.photo+'" alt="" style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid '+(darkSidebar?'rgba(255,255,255,0.4)':'var(--cv-accent)')+';display:block;margin:0 auto 10px">';
  }
  html += '<h1 style="font-size:17pt;font-weight:700;margin:0;color:'+(darkSidebar?'#fff':bodyTextColor(cfg))+'">'+(p.fullName||'Nama Anda')+'</h1>';
  if (p.jobTitle) html += '<div style="font-size:10.5pt;color:'+(darkSidebar?'rgba(255,255,255,0.85)':'var(--cv-accent)')+';font-weight:500;margin-top:4px">'+esc(p.jobTitle)+'</div>';
  html += '</div>';

  var sideHead = function(title) {
    return '<div style="font-size:var(--cv-fs-small);font-weight:700;text-transform:uppercase;letter-spacing:1px;color:'+(darkSidebar?sb.accentText:'var(--cv-accent)')+';margin:16px 0 8px 0;padding-bottom:4px;border-bottom:1px solid '+(darkSidebar?'rgba(255,255,255,0.2)':'#d1d5db')+'">'+title+'</div>';
  };

  // Contact
  var ct = [];
  if (p.email) ct.push('✉ '+esc(p.email));
  if (p.phone) ct.push('☎ '+esc(p.phone));
  if (p.location) ct.push('⊙ '+esc(p.location));
  if (p.linkedin) ct.push('in '+esc(p.linkedin));
  if (p.website) ct.push('◎ '+esc(p.website));
  if (ct.length) {
    html += sideHead(L('contact'));
    html += '<div style="font-size:var(--cv-fs-small);line-height:1.8">' + ct.map(function(c){return '<div>'+c+'</div>';}).join('') + '</div>';
  }

  // Skills as tags
  if (sk.length) {
    html += sideHead(L('skills'));
    var tagBg = darkSidebar ? 'rgba(255,255,255,0.12)' : 'var(--cv-accent-soft)';
    var tagColor = darkSidebar ? '#fff' : 'var(--cv-accent)';
    html += '<div style="display:flex;flex-wrap:wrap;gap:4px">' +
      sk.map(function(s){return '<span style="padding:3px 8px;background:'+tagBg+';color:'+tagColor+';border-radius:4px;font-size:var(--cv-fs-small)">'+esc(s)+'</span>';}).join('') +
      '</div>';
  }

  // Languages
  if (la.length) {
    html += sideHead(L('languages'));
    la.forEach(function(l){
      html += '<div style="font-size:var(--cv-fs-small);margin-bottom:4px"><strong>'+esc(l.name)+'</strong> — '+esc(l.level)+'</div>';
    });
  }

  // Certifications (sidebar)
  if (ce.length) {
    html += sideHead(L('certifications'));
    ce.forEach(function(c){
      html += '<div style="font-size:var(--cv-fs-small);margin-bottom:6px"><strong>'+esc(c.name)+'</strong>' +
        (c.issuer?'<br><span style="opacity:0.8">'+esc(c.issuer)+(c.date?', '+esc(c.date):'')+'</span>':'') +
        ((c.docUrl||c.link)?'<br><a href="'+esc(c.docUrl||c.link)+'" target="_blank" rel="noopener" style="color:'+(darkSidebar?'#93c5fd':'var(--cv-accent)')+';text-decoration:none;font-size:var(--cv-fs-small)">📎 '+L('viewCert')+'</a>':'') +
        '</div>';
    });
  }

  // Awards (sidebar)
  if (state.data.awards && state.data.awards.length) {
    html += sideHead(L('awards'));
    state.data.awards.forEach(function(a){
      html += '<div style="font-size:var(--cv-fs-small);margin-bottom:5px"><strong>'+esc(a.name)+'</strong>'+(a.year?' ('+esc(a.year)+')':'')+(a.issuer?'<br><span style="opacity:0.8">'+esc(a.issuer)+'</span>':'')+'</div>';
    });
  }

  // Hobbies (sidebar)
  if (state.data.hobbies && state.data.hobbies.length) {
    html += sideHead(L('hobbies'));
    html += '<div style="font-size:var(--cv-fs-small);line-height:1.7">'+state.data.hobbies.map(esc).join(', ')+'</div>';
  }

  // QR code (sidebar)
  if (state.showQR && typeof getQRUrl === 'function') {
    var qurlS = getQRUrl(100);
    if (qurlS) {
      html += sideHead('Scan');
      html += '<img src="'+qurlS+'" alt="QR" style="width:80px;height:80px;border-radius:6px;background:#fff;padding:4px">';
    }
  }

  html += '</div>'; // end sidebar

  // ===== MAIN =====
  html += '<div style="width:'+(100-sb.width)+'%;padding:24px 22px;background:#fff">';

  var mainHead = function(title) {
    return '<h2 style="font-size:var(--cv-fs-h2);font-weight:700;color:var(--cv-accent);text-transform:uppercase;letter-spacing:0.5px;padding-bottom:4px;border-bottom:1.5px solid var(--cv-accent);margin:var(--cv-section-gap) 0 10px 0">'+title+'</h2>';
  };

  if (p.summary) {
    html += mainHead(L('summary'));
    html += '<p style="font-size:var(--cv-fs-body);color:var(--cv-text);line-height:var(--cv-lh);margin:0">'+esc(p.summary)+'</p>';
  }
  if (ex.length) { html += mainHead(L('experience')); html += tplExpEntries(ex); }
  if (ed.length) { html += mainHead(L('education')); html += tplEduEntries(ed); }
  if (pr.length) { html += mainHead(L('projects')); html += tplProjEntries(pr); }
  if (og.length) { html += mainHead(L('organizations')); html += tplOrgEntries(og); }
  if (state.data.references && state.data.references.length) { html += mainHead(L('references')); html += tplRefEntries(state.data.references); }

  html += '</div></div>';
  return html;
}

// ============================================================
// COVER LETTER RENDERER (formal business letter, A4)
// ============================================================
function renderCoverLetter(cfg, vars, dens) {
  var p = state.data.personalInfo;
  var c = state.coverLetter || {};
  var lang = (typeof state !== 'undefined' && state.lang) ? state.lang : 'id';

  // Today's date in chosen language
  function todayStr() {
    var d = new Date();
    if (lang === 'en') {
      var mEn = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      return mEn[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }
    var mId = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    return d.getDate() + ' ' + mId[d.getMonth()] + ' ' + d.getFullYear();
  }
  var dateStr = c.date && c.date.trim() ? c.date : todayStr();

  var T = lang === 'en'
    ? { regard:'Sincerely,', re:'Re: Application for', to:'To' }
    : { regard:'Hormat saya,', re:'Perihal: Lamaran untuk posisi', to:'Kepada Yth.' };

  var html = '<div class="cv-render" style="'+vars+'font-family:'+cfg.font+';padding:26mm 24mm;line-height:var(--cv-lh)">';

  // Letterhead (synced from CV personal info) — only show border if there's content
  var contact = [];
  if (p.email) contact.push(esc(p.email));
  if (p.phone) contact.push(esc(p.phone));
  if (p.location) contact.push(esc(p.location));
  if (p.linkedin) contact.push(esc(p.linkedin));
  var hasLetterhead = !!(p.fullName || p.jobTitle || contact.length);
  if (hasLetterhead) {
    html += '<div style="border-bottom:2px solid var(--cv-accent);padding-bottom:12px;margin-bottom:18px">';
    if (p.fullName) html += '<h1 style="font-size:20pt;font-weight:700;margin:0;color:'+bodyTextColor(cfg)+'">'+esc(p.fullName)+'</h1>';
    if (p.jobTitle) html += '<div style="font-size:var(--cv-fs-h2);color:var(--cv-accent);font-weight:600;margin-top:2px">'+esc(p.jobTitle)+'</div>';
    if (contact.length) html += '<div style="font-size:var(--cv-fs-small);color:var(--cv-muted);margin-top:6px">'+contact.join(' &nbsp;|&nbsp; ')+'</div>';
    html += '</div>';
  }

  // Date
  html += '<div style="font-size:var(--cv-fs-body);color:var(--cv-text);text-align:right;margin-bottom:16px">'+esc(dateStr)+'</div>';

  // Recipient block
  html += '<div style="font-size:var(--cv-fs-body);color:var(--cv-text);margin-bottom:16px">';
  html += '<div>'+T.to+'</div>';
  if (c.recipient) html += '<div><strong>'+esc(c.recipient)+'</strong></div>';
  if (c.company) html += '<div><strong>'+esc(c.company)+'</strong></div>';
  html += '</div>';

  // Subject line
  if (c.position) {
    html += '<div style="font-size:var(--cv-fs-body);color:var(--cv-text);font-weight:600;margin-bottom:16px;text-decoration:underline">'+T.re+' '+esc(c.position)+'</div>';
  }

  // Body — paragraphs split on blank lines
  var body = c.body || '';
  var bodyAlign = c.bodyAlign || 'justify';
  var paras = body.split(/\n\s*\n/);
  html += '<div style="font-size:var(--cv-fs-body);color:var(--cv-text);line-height:var(--cv-lh);text-align:'+bodyAlign+'">';
  paras.forEach(function(par){
    if (!par.trim()) return;
    html += '<p style="margin:0 0 12px 0">'+esc(par).replace(/\n/g,'<br>')+'</p>';
  });
  html += '</div>';

  // Signature block — right-aligned like the PDF sample
  var sigName  = (c.sigName  && c.sigName.trim())  ? c.sigName  : (p.fullName  || '');
  var sigEmail = (c.sigEmail && c.sigEmail.trim()) ? c.sigEmail : (p.email     || '');
  var sigPhone = (c.sigPhone && c.sigPhone.trim()) ? c.sigPhone : (p.phone     || '');

  html += '<div style="font-size:var(--cv-fs-body);color:var(--cv-text);margin-top:24px;text-align:right">' +
    '<div>'+T.regard+'</div>';

  // Signature image (if uploaded)
  if (c.signature) {
    html += '<div style="margin:8px 0"><img src="'+c.signature+'" alt="Tanda Tangan" style="height:64px;max-width:180px;object-fit:contain"></div>';
  } else {
    html += '<div style="height:48px"></div>';
  }

  if (sigName)  html += '<div style="font-weight:700">'+esc(sigName)+'</div>';
  if (sigEmail) html += '<div style="font-size:var(--cv-fs-small);color:var(--cv-muted)">'+esc(sigEmail)+'</div>';
  if (sigPhone) html += '<div style="font-size:var(--cv-fs-small);color:var(--cv-muted)">'+esc(sigPhone)+'</div>';
  html += '</div>';

  html += '</div>';
  return html;
}
