/**
 * CV Builder Pro - ATS-Friendly Resume Builder
 * Pure Vanilla JS, no framework dependencies
 * Designed for GitHub Pages static hosting
 */

// ============================================================
// STATE MANAGEMENT + LOCAL STORAGE PERSISTENCE
// ============================================================
var STORAGE_KEY = 'cvbuilder_data_v1';

var state = {
  section: 'personal',
  template: 'ats-clean',
  accentColor: '',   // '' = use template default; set via color palette
  density: 'normal', // compact | normal | spacious
  lang: 'id',        // preview label language: 'id' | 'en'
  docMode: 'cv',     // 'cv' | 'cover' (active document)
  theme: 'light',    // 'light' | 'dark' (editor chrome theme)
  showQR: false,     // show QR code (to LinkedIn/website) on CV
  fontOverride: '',  // '' = use template default font; else overrides all layouts
  sectionOrder: ['summary','experience','education','skills','certifications','projects','awards','organizations','hobbies','references','languages'],
  coverLetter: { company:'', recipient:'', position:'', date:'', body:'', bodyAlign:'justify', sigName:'', sigEmail:'', sigPhone:'', signature:'' },
  data: {
    personalInfo: {fullName:'',jobTitle:'',email:'',phone:'',location:'',linkedin:'',website:'',summary:''},
    photo: '',          // base64 data URL of profile photo
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
    organizations: [],
    awards: [],         // {name, issuer, year}
    hobbies: [],         // array of strings
    references: []       // {name, position, company, contact}
  }
};

// Load saved data from localStorage on startup
function loadSavedData() {
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      var parsed = JSON.parse(saved);
      if (parsed && parsed.data && parsed.data.personalInfo) {
        state.data = parsed.data;
        if (parsed.template) state.template = parsed.template;
        if (parsed.accentColor !== undefined) state.accentColor = parsed.accentColor;
        if (parsed.density) state.density = parsed.density;
        if (parsed.lang) state.lang = parsed.lang;
        if (parsed.sectionOrder && parsed.sectionOrder.length) state.sectionOrder = parsed.sectionOrder;
        if (parsed.docMode) state.docMode = parsed.docMode;
        if (parsed.theme) state.theme = parsed.theme;
        if (parsed.showQR !== undefined) state.showQR = parsed.showQR;
        if (parsed.fontOverride !== undefined) state.fontOverride = parsed.fontOverride;
        if (parsed.coverLetter) {
          state.coverLetter = parsed.coverLetter;
          // backward compat: ensure new fields exist
          if (!state.coverLetter.bodyAlign) state.coverLetter.bodyAlign = 'justify';
          if (!state.coverLetter.sigName) state.coverLetter.sigName = '';
          if (!state.coverLetter.sigEmail) state.coverLetter.sigEmail = '';
          if (!state.coverLetter.sigPhone) state.coverLetter.sigPhone = '';
          if (!state.coverLetter.signature) state.coverLetter.signature = '';
        }
        // Ensure all arrays exist (backward compatibility)
        if (!state.data.experiences) state.data.experiences = [];
        if (!state.data.education) state.data.education = [];
        if (!state.data.skills) state.data.skills = [];
        if (!state.data.languages) state.data.languages = [];
        if (!state.data.certifications) state.data.certifications = [];
        if (!state.data.projects) state.data.projects = [];
        if (!state.data.organizations) state.data.organizations = [];
        if (!state.data.awards) state.data.awards = [];
        if (!state.data.hobbies) state.data.hobbies = [];
        if (!state.data.references) state.data.references = [];
        if (state.data.photo === undefined) state.data.photo = '';
        // Ensure new sections appear in order list
        ['awards','hobbies','references'].forEach(function(k){
          if (state.sectionOrder.indexOf(k) === -1) state.sectionOrder.push(k);
        });
        return true;
      }
    }
  } catch(e) { /* ignore parse errors */ }
  return false;
}

// Save current data to localStorage
function saveToStorage() {
  try {
    var toSave = { data: state.data, template: state.template, accentColor: state.accentColor, density: state.density, lang: state.lang, sectionOrder: state.sectionOrder, docMode: state.docMode, theme: state.theme, showQR: state.showQR, fontOverride: state.fontOverride, coverLetter: state.coverLetter, savedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch(e) { /* storage full or unavailable */ }
}

// Manual save with visual feedback
function saveData() {
  saveToStorage();
  // Show save confirmation
  var btn = document.getElementById('saveBtn');
  if (btn) {
    btn.innerHTML = '✅ Tersimpan!';
    btn.style.background = '#dcfce7';
    btn.style.color = '#166534';
    btn.style.borderColor = '#86efac';
    setTimeout(function() {
      btn.innerHTML = '💾 Save';
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  }
}

// Auto-save debounce (saves 1 second after last change)
var autoSaveTimer = null;
function autoSave() {
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(function() {
    saveToStorage();
    updateSaveIndicator();
  }, 1000);
}

// Update the small "last saved" indicator
function updateSaveIndicator() {
  var el = document.getElementById('saveIndicator');
  if (el) {
    var now = new Date();
    el.textContent = 'Auto-saved ' + now.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
    el.style.opacity = '1';
    setTimeout(function() { if (el) el.style.opacity = '0.6'; }, 2000);
  }
}

// ============================================================
// FONT OPTIONS (for font picker in Template tab)
// ============================================================
var FONT_OPTIONS = [
  { id: '',                  label: 'Default Template',    stack: '' },
  { id: 'Calibri',           label: 'Calibri',             stack: "Calibri, 'Gill Sans', Arial, sans-serif" },
  { id: 'Arial',             label: 'Arial',               stack: "Arial, Helvetica, sans-serif" },
  { id: 'Times New Roman',   label: 'Times New Roman',     stack: "'Times New Roman', Times, serif" },
  { id: 'Georgia',           label: 'Georgia',             stack: "Georgia, 'Times New Roman', serif" },
  { id: 'Garamond',          label: 'Garamond',            stack: "Garamond, 'EB Garamond', 'Times New Roman', serif" },
  { id: 'EB Garamond',       label: 'EB Garamond',         stack: "'EB Garamond', Garamond, serif" },
  { id: 'Inter',             label: 'Inter',               stack: "Inter, 'Segoe UI', Arial, sans-serif" },
  { id: 'Lato',              label: 'Lato',                stack: "Lato, 'Helvetica Neue', Arial, sans-serif" },
  { id: 'Roboto',            label: 'Roboto',              stack: "Roboto, 'Helvetica Neue', Arial, sans-serif" },
  { id: 'Open Sans',         label: 'Open Sans',           stack: "'Open Sans', 'Helvetica Neue', Arial, sans-serif" },
  { id: 'Merriweather',      label: 'Merriweather',        stack: "Merriweather, Georgia, serif" },
  { id: 'Playfair Display',  label: 'Playfair Display',    stack: "'Playfair Display', Georgia, serif" },
  { id: 'Source Serif 4',    label: 'Source Serif',        stack: "'Source Serif 4', Georgia, serif" },
  { id: 'Nunito',            label: 'Nunito',              stack: "Nunito, 'Helvetica Neue', Arial, sans-serif" },
  { id: 'Raleway',           label: 'Raleway',             stack: "Raleway, 'Helvetica Neue', Arial, sans-serif" },
  { id: 'Montserrat',        label: 'Montserrat',          stack: "Montserrat, 'Helvetica Neue', Arial, sans-serif" }
];

// ============================================================
// SAMPLE DATA (Akuntan / Auditor Senior)
// ============================================================
var sampleData = {
  personalInfo: {
    fullName: 'Erlangga Gilang Amartha',
    jobTitle: 'Senior Auditor & Financial Analyst',
    email: 'erlangga.gilang@email.com',
    phone: '+62 821-9876-5432',
    location: 'Jakarta, Indonesia',
    linkedin: 'linkedin.com/in/erlanggagilang',
    website: '',
    summary: 'Senior Auditor berpengalaman 7+ tahun di bidang audit keuangan, kepatuhan regulasi, dan analisis risiko. Terampil dalam menyusun laporan audit komprehensif, mengidentifikasi inefisiensi operasional, dan memberikan rekomendasi strategis yang menghasilkan penghematan biaya hingga 25%. Bersertifikasi CPA dan CIA dengan rekam jejak memimpin tim audit lintas departemen.'
  },
  experiences: [
    {id:1, company:'Deloitte Indonesia', position:'Senior Auditor', startDate:'2021-03', endDate:'', current:true, description:'Memimpin tim audit 8 orang untuk klien korporasi dengan aset >Rp 5 triliun.\nMelakukan audit laporan keuangan sesuai standar PSAK dan ISA.\nMengidentifikasi temuan material senilai Rp 2.3 miliar yang berdampak pada opini audit.\nMenyusun management letter dan rekomendasi perbaikan internal control.'},
    {id:2, company:'PwC Indonesia', position:'Auditor', startDate:'2018-01', endDate:'2021-02', current:false, description:'Melaksanakan prosedur audit substantif dan compliance testing.\nMereview working paper dan dokumentasi audit sesuai metodologi firm.\nBerkoordinasi dengan klien untuk pengumpulan bukti audit dan konfirmasi pihak ketiga.\nMentor 3 junior auditor dalam pelaksanaan fieldwork.'},
    {id:3, company:'PT Bank Mandiri Tbk', position:'Internal Audit Staff', startDate:'2016-07', endDate:'2017-12', current:false, description:'Melakukan audit operasional cabang dan unit bisnis.\nMenyusun laporan temuan audit dan monitoring tindak lanjut.\nMelakukan review kepatuhan terhadap SOP dan regulasi OJK.'}
  ],
  education: [
    {id:1, institution:'Universitas Indonesia', degree:'S2 Magister Akuntansi', startDate:'2019', endDate:'2021', description:'Konsentrasi Audit & Assurance. IPK 3.82/4.00.'},
    {id:2, institution:'Universitas Gadjah Mada', degree:'S1 Akuntansi', startDate:'2012', endDate:'2016', description:'Cum Laude. IPK 3.71/4.00. Ketua Himpunan Mahasiswa Akuntansi.'}
  ],
  skills: ['Financial Audit','Internal Control','Risk Assessment','PSAK/IFRS','Tax Compliance','SAP ERP','Data Analytics','MS Excel Advanced','Power BI','Team Leadership','Report Writing','Regulatory Compliance'],
  languages: [
    {name:'Indonesia', level:'Penutur Asli'},
    {name:'English', level:'Fasih'},
    {name:'Mandarin', level:'Menengah'}
  ],
  certifications: [
    {name:'Certified Public Accountant (CPA)', issuer:'IAPI', date:'2022', link:''},
    {name:'Certified Internal Auditor (CIA)', issuer:'IIA Global', date:'2021', link:''},
    {name:'Chartered Accountant (CA)', issuer:'IAI', date:'2020', link:''},
    {name:'SAP FICO Certified', issuer:'SAP', date:'2019', link:''}
  ],
  projects: [
    {id:1, name:'Implementasi Sistem Audit Berbasis Data Analytics', description:'Memimpin proyek transformasi digital proses audit menggunakan tools data analytics (ACL, IDEA) yang meningkatkan efisiensi audit sebesar 35%.', role:'Project Lead', link:''},
    {id:2, name:'SOX Compliance Assessment', description:'Melakukan penilaian kepatuhan Sarbanes-Oxley untuk anak perusahaan multinasional, mencakup 45 proses bisnis kritikal.', role:'Lead Auditor', link:''}
  ],
  organizations: [
    {id:1, name:'Ikatan Akuntan Indonesia (IAI)', role:'Anggota Komite Muda', description:'Berkontribusi dalam penyusunan panduan praktik audit untuk UMKM.'},
    {id:2, name:'Indonesia Internal Audit Association', role:'Volunteer Trainer', description:'Memberikan pelatihan audit berbasis risiko untuk 50+ peserta dari berbagai industri.'}
  ],
  awards: [
    {id:1, name:'Best Auditor of the Year', issuer:'Deloitte Indonesia', year:'2023'},
    {id:2, name:'Employee Excellence Award', issuer:'PwC Indonesia', year:'2020'}
  ],
  hobbies: ['Membaca buku finansial', 'Lari maraton', 'Catur', 'Fotografi'],
  references: [
    {id:1, name:'Budi Santoso, CPA', position:'Audit Partner', company:'Deloitte Indonesia', contact:'budi.santoso@deloitte.com'},
    {id:2, name:'Linda Wijaya', position:'Finance Director', company:'PT Maju Bersama', contact:'+62 811-2233-4455'}
  ]
};

// Sample cover letter (Senior Auditor)
var sampleCoverLetter = {
  company: 'PT Bank Negara Indonesia (Persero) Tbk',
  recipient: 'Ibu Sarah Wijayanti, HR Manager',
  position: 'Senior Internal Auditor',
  date: '',
  body: 'Dengan hormat,\n\nMelalui surat ini, saya bermaksud mengajukan lamaran untuk posisi Senior Internal Auditor yang sedang dibuka di perusahaan Bapak/Ibu. Dengan pengalaman lebih dari 7 tahun di bidang audit keuangan dan kepatuhan regulasi di firma audit terkemuka seperti Deloitte dan PwC, saya yakin dapat memberikan kontribusi signifikan bagi tim audit internal Anda.\n\nSepanjang karier saya, saya telah memimpin tim audit untuk klien korporasi besar, mengidentifikasi temuan material yang berdampak pada keputusan strategis, serta mengimplementasikan sistem audit berbasis data analytics yang meningkatkan efisiensi hingga 35%. Sertifikasi CPA dan CIA yang saya miliki, dikombinasikan dengan pemahaman mendalam tentang standar PSAK dan regulasi OJK, membuat saya siap menghadapi tantangan di posisi ini.\n\nSaya sangat tertarik untuk bergabung dan berkontribusi pada penguatan tata kelola dan manajemen risiko di perusahaan Anda. Saya berharap mendapat kesempatan untuk menjelaskan lebih lanjut kualifikasi saya dalam sesi wawancara.\n\nAtas perhatian dan pertimbangan Bapak/Ibu, saya ucapkan terima kasih.'
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function gid() { return Date.now() + Math.random(); }
function esc(s) { if (!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtDate(d) {
  if (!d) return '';
  var p = d.split('-');
  var ms = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return p[1] ? ms[parseInt(p[1])-1] + ' ' + p[0] : p[0];
}

// ============================================================
// ACTIONS
// ============================================================
function setSection(s) { state.section = s; closeMoreTabs(); render(); }
function toggleMoreTabs() {
  var m = document.getElementById('moreTabsMenu');
  if (m) m.style.display = m.style.display === 'none' ? 'block' : 'none';
}
function closeMoreTabs() {
  var m = document.getElementById('moreTabsMenu');
  if (m) m.style.display = 'none';
}
// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  var btn = document.getElementById('moreTabsBtn');
  var menu = document.getElementById('moreTabsMenu');
  if (menu && btn && !btn.contains(e.target) && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }
});
function setTemplate(t) {
  state.template = t;
  state.accentColor = ''; // reset to new template's default accent
  autoSave();
  render();
}
function setAccent(color) { state.accentColor = color; autoSave(); render(); }
function setDensity(d) { state.density = d; autoSave(); render(); }
function setFont(f) { state.fontOverride = f; autoSave(); render(); }
function scrollTabs(amount) {
  var el = document.getElementById('tabsScroll');
  if (el) el.scrollBy({ left: amount, behavior: 'smooth' });
}
function loadSample() {
  if (state.docMode === 'cover') {
    state.coverLetter = JSON.parse(JSON.stringify(sampleCoverLetter));
    // also ensure personal info exists for the letterhead
    if (!state.data.personalInfo.fullName) state.data.personalInfo = JSON.parse(JSON.stringify(sampleData.personalInfo));
  } else {
    state.data = JSON.parse(JSON.stringify(sampleData));
  }
  autoSave(); render();
}
function resetData() {
  if (confirm('Yakin ingin menghapus semua data? Tindakan ini tidak bisa dibatalkan.')) {
    state.data = {personalInfo:{fullName:'',jobTitle:'',email:'',phone:'',location:'',linkedin:'',website:'',summary:''},photo:'',experiences:[],education:[],skills:[],languages:[],certifications:[],projects:[],organizations:[],awards:[],hobbies:[],references:[]};
    state.coverLetter = { company:'', recipient:'', position:'', date:'', body:'', bodyAlign:'justify', sigName:'', sigEmail:'', sigPhone:'', signature:'' };
    saveToStorage();
    render();
  }
}

// Personal
function updateP(field, val) { state.data.personalInfo[field] = val; renderPreview(); }

// Experience
function addExp() { state.data.experiences.push({id:gid(),company:'',position:'',startDate:'',endDate:'',current:false,description:'',docs:[]}); autoSave(); render(); }
function updExp(id,f,v) { var e=state.data.experiences.find(function(x){return x.id==id;}); if(e){e[f]=v; renderPreview();} }
function rmExp(id) { state.data.experiences=state.data.experiences.filter(function(x){return x.id!=id;}); autoSave(); render(); }
function addExpDoc(id) { var e=state.data.experiences.find(function(x){return x.id==id;}); if(e){if(!e.docs)e.docs=[];e.docs.push({name:'',url:''});render();} }
function updExpDoc(id,i,f,v) { var e=state.data.experiences.find(function(x){return x.id==id;}); if(e&&e.docs&&e.docs[i]){e.docs[i][f]=v;renderPreview();} }
function rmExpDoc(id,i) { var e=state.data.experiences.find(function(x){return x.id==id;}); if(e&&e.docs){e.docs.splice(i,1);autoSave();render();} }

// Education
function addEdu() { state.data.education.push({id:gid(),institution:'',degree:'',startDate:'',endDate:'',description:'',docs:[]}); autoSave(); render(); }
function updEdu(id,f,v) { var e=state.data.education.find(function(x){return x.id==id;}); if(e){e[f]=v; renderPreview();} }
function rmEdu(id) { state.data.education=state.data.education.filter(function(x){return x.id!=id;}); autoSave(); render(); }
function addEduDoc(id) { var e=state.data.education.find(function(x){return x.id==id;}); if(e){if(!e.docs)e.docs=[];e.docs.push({name:'',url:''});render();} }
function updEduDoc(id,i,f,v) { var e=state.data.education.find(function(x){return x.id==id;}); if(e&&e.docs&&e.docs[i]){e.docs[i][f]=v;renderPreview();} }
function rmEduDoc(id,i) { var e=state.data.education.find(function(x){return x.id==id;}); if(e&&e.docs){e.docs.splice(i,1);autoSave();render();} }

// Skills
function addSkill() { var inp=document.getElementById('skillInp'); var v=inp?inp.value.trim():''; if(v&&state.data.skills.indexOf(v)===-1){state.data.skills.push(v);autoSave();render();} }
function rmSkill(i) { state.data.skills.splice(i,1); autoSave(); render(); }
function skillKey(e) { if(e.key==='Enter'){e.preventDefault();addSkill();} }

// Languages
function addLang() { state.data.languages.push({name:'',level:'Menengah'}); autoSave(); render(); }
function updLang(i,f,v) { state.data.languages[i][f]=v; renderPreview(); }
function rmLang(i) { state.data.languages.splice(i,1); autoSave(); render(); }

// Certifications
function addCert() { state.data.certifications.push({name:'',issuer:'',date:'',link:'',docUrl:''}); autoSave(); render(); }
function updCert(i,f,v) { state.data.certifications[i][f]=v; renderPreview(); }
function rmCert(i) { state.data.certifications.splice(i,1); autoSave(); render(); }

// Projects
function addProj() { state.data.projects.push({id:gid(),name:'',description:'',role:'',link:'',docs:[]}); autoSave(); render(); }
function updProj(id,f,v) { var e=state.data.projects.find(function(x){return x.id==id;}); if(e){e[f]=v; renderPreview();} }
function rmProj(id) { state.data.projects=state.data.projects.filter(function(x){return x.id!=id;}); autoSave(); render(); }
function addProjDoc(id) { var e=state.data.projects.find(function(x){return x.id==id;}); if(e){if(!e.docs)e.docs=[];e.docs.push({name:'',url:''});render();} }
function updProjDoc(id,i,f,v) { var e=state.data.projects.find(function(x){return x.id==id;}); if(e&&e.docs&&e.docs[i]){e.docs[i][f]=v;renderPreview();} }
function rmProjDoc(id,i) { var e=state.data.projects.find(function(x){return x.id==id;}); if(e&&e.docs){e.docs.splice(i,1);autoSave();render();} }

// Organizations
function addOrg() { state.data.organizations.push({id:gid(),name:'',role:'',description:'',docs:[]}); autoSave(); render(); }
function updOrg(id,f,v) { var e=state.data.organizations.find(function(x){return x.id==id;}); if(e){e[f]=v; renderPreview();} }
function rmOrg(id) { state.data.organizations=state.data.organizations.filter(function(x){return x.id!=id;}); autoSave(); render(); }
function addOrgDoc(id) { var e=state.data.organizations.find(function(x){return x.id==id;}); if(e){if(!e.docs)e.docs=[];e.docs.push({name:'',url:''});render();} }
function updOrgDoc(id,i,f,v) { var e=state.data.organizations.find(function(x){return x.id==id;}); if(e&&e.docs&&e.docs[i]){e.docs[i][f]=v;renderPreview();} }
function rmOrgDoc(id,i) { var e=state.data.organizations.find(function(x){return x.id==id;}); if(e&&e.docs){e.docs.splice(i,1);autoSave();render();} }

// Awards
function addAward() { state.data.awards.push({id:gid(),name:'',issuer:'',year:''}); autoSave(); render(); }
function updAward(id,f,v) { var e=state.data.awards.find(function(x){return x.id==id;}); if(e){e[f]=v; renderPreview();} }
function rmAward(id) { state.data.awards=state.data.awards.filter(function(x){return x.id!=id;}); autoSave(); render(); }

// Hobbies (array of strings)
function addHobby() { var inp=document.getElementById('hobbyInp'); var v=inp?inp.value.trim():''; if(v&&state.data.hobbies.indexOf(v)===-1){state.data.hobbies.push(v);autoSave();render();} }
function rmHobby(i) { state.data.hobbies.splice(i,1); autoSave(); render(); }
function hobbyKey(e) { if(e.key==='Enter'){e.preventDefault();addHobby();} }

// References
function addRef() { state.data.references.push({id:gid(),name:'',position:'',company:'',contact:''}); autoSave(); render(); }
function updRef(id,f,v) { var e=state.data.references.find(function(x){return x.id==id;}); if(e){e[f]=v; renderPreview();} }
function rmRef(id) { state.data.references=state.data.references.filter(function(x){return x.id!=id;}); autoSave(); render(); }

// Profile Photo
function updatePhoto(input) {
  var file = input.files[0];
  if (!file) return;
  if (!file.type.match(/^image\//)) { alert('File harus berupa gambar (JPG/PNG).'); return; }
  if (file.size > 3 * 1024 * 1024) { alert('Ukuran foto maksimal 3MB.'); return; }
  var reader = new FileReader();
  reader.onload = function(e) { state.data.photo = e.target.result; autoSave(); render(); };
  reader.readAsDataURL(file);
}
function removePhoto() { state.data.photo = ''; autoSave(); render(); }

// Cover letter
function updCover(f,v) { state.coverLetter[f]=v; renderPreview(); }

// Signature image upload for cover letter
function uploadSignature(input) {
  var file = input.files[0];
  if (!file) return;
  if (!file.type.match(/^image\//)) { alert('File harus berupa gambar (JPG/PNG).'); return; }
  if (file.size > 2 * 1024 * 1024) { alert('Ukuran tanda tangan maksimal 2MB.'); return; }
  var reader = new FileReader();
  reader.onload = function(e) { state.coverLetter.signature = e.target.result; autoSave(); render(); };
  reader.readAsDataURL(file);
}
function removeSignature() { state.coverLetter.signature = ''; autoSave(); render(); }

// Document mode toggle (CV <-> Cover Letter)
function switchDocument(mode) {
  state.docMode = mode;
  // When switching to cover, jump to its form; when back to CV, restore a CV tab
  if (mode === 'cover') { state.section = 'cover'; }
  else if (state.section === 'cover') { state.section = 'personal'; }
  autoSave();
  render();
}

// Theme toggle (editor chrome dark mode)
function toggleTheme() {
  state.theme = (state.theme === 'dark') ? 'light' : 'dark';
  applyTheme();
  autoSave();
}
function applyTheme() {
  if (state.theme === 'dark') document.body.classList.add('dark-mode');
  else document.body.classList.remove('dark-mode');
}

// QR code toggle
function toggleQR() { state.showQR = !state.showQR; autoSave(); render(); }

// PDF Export — works for both CV and Cover Letter (exports #cvOutput)
function exportPDF() {
  var el = document.getElementById('cvOutput');
  if (!el) return;
  var name = state.data.personalInfo.fullName || 'document';
  var prefix = state.docMode === 'cover' ? 'CoverLetter_' : 'CV_';
  html2pdf().set({
    margin: 0,
    filename: prefix + name + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  }).from(el).save();
}

// ============================================================
// FORM RENDERERS
// ============================================================
function renderForm() {
  var s = state.section;
  // Cover Letter mode shows only the cover form
  if (state.docMode === 'cover') return formCover();
  if (s === 'personal') return formPersonal();
  if (s === 'experience') return formExperience();
  if (s === 'education') return formEducation();
  if (s === 'skills') return formSkills();
  if (s === 'languages') return formLanguages();
  if (s === 'certifications') return formCertifications();
  if (s === 'projects') return formProjects();
  if (s === 'organizations') return formOrganizations();
  if (s === 'awards') return formAwards();
  if (s === 'hobbies') return formHobbies();
  if (s === 'references') return formReferences();
  if (s === 'jobmatch') return formJobMatch();
  if (s === 'import') return formImport();
  if (s === 'review') return formReview();
  if (s === 'template') return formTemplate();
  return '';
}

function inp(label, type, val, handler, ph, cls) {
  cls = cls || '';
  return '<div class="'+cls+'"><label class="field-label">'+label+'</label><input class="field-input" type="'+type+'" value="'+esc(val)+'" oninput="'+handler+'" placeholder="'+ph+'"></div>';
}
function txta(label, val, handler, ph, rows, cls) {
  cls = cls || '';
  return '<div class="'+cls+'"><label class="field-label">'+label+'</label><textarea class="field-input" rows="'+(rows||3)+'" oninput="'+handler+'" placeholder="'+ph+'">'+esc(val)+'</textarea></div>';
}

function formPersonal() {
  var p = state.data.personalInfo;
  var photo = state.data.photo;
  var photoBlock = '<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px">' +
    (photo
      ? '<img src="'+photo+'" alt="Foto" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid #e2e8f0">'
      : '<div style="width:64px;height:64px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;font-size:24px;color:#94a3b8">👤</div>') +
    '<div style="flex:1">' +
      '<div style="font-size:12px;font-weight:600;color:#1e293b;margin-bottom:2px">📸 Foto Profil</div>' +
      '<div style="font-size:11px;color:#94a3b8;margin-bottom:8px">Tampil di template 2-kolom (Sidebar/Ivory). Maks 3MB.</div>' +
      '<div style="display:flex;gap:6px">' +
        '<label style="padding:6px 12px;background:#2563eb;color:#fff;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">📁 '+(photo?'Ganti':'Upload')+' Foto<input type="file" accept="image/*" onchange="updatePhoto(this)" style="display:none"></label>' +
        (photo?'<button onclick="removePhoto()" style="padding:6px 12px;background:#fee2e2;color:#b91c1c;border:none;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">Hapus</button>':'') +
      '</div>' +
    '</div>' +
  '</div>';

  return '<div class="section-title">👤 Data Pribadi</div>' +
    photoBlock +
    '<div class="form-grid">' +
    inp('Nama Lengkap','text',p.fullName,"updateP('fullName',this.value)",'Nama lengkap sesuai KTP','col-full') +
    inp('Jabatan / Posisi Target','text',p.jobTitle,"updateP('jobTitle',this.value)",'Contoh: Senior Auditor','col-full') +
    inp('Email','email',p.email,"updateP('email',this.value)",'email@contoh.com','') +
    inp('Telepon','tel',p.phone,"updateP('phone',this.value)",'+62 xxx-xxxx-xxxx','') +
    inp('Lokasi','text',p.location,"updateP('location',this.value)",'Kota, Indonesia','') +
    inp('LinkedIn','text',p.linkedin,"updateP('linkedin',this.value)",'linkedin.com/in/username','') +
    inp('Website / Portfolio','text',p.website,"updateP('website',this.value)",'www.website.com (opsional)','col-full') +
    txta('Ringkasan Profesional',p.summary,"updateP('summary',this.value)",'Tuliskan 2-4 kalimat yang merangkum pengalaman, keahlian utama, dan value proposition Anda...',4,'col-full') +
    '</div>' +
    '<label style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:12px;color:#475569;cursor:pointer"><input type="checkbox" '+(state.showQR?'checked':'')+' onchange="toggleQR()"> 📱 Tampilkan QR Code (ke LinkedIn/Website) di CV</label>' +
    atsTip('Ringkasan Profil', 'Gunakan kata kunci dari lowongan yang dituju. Sebutkan tahun pengalaman, keahlian utama, dan pencapaian terukur. Hindari kata subjektif seperti "pekerja keras" — ganti dengan bukti konkret.');
}

function formExperience() {
  var html = '<div class="section-title">💼 Pengalaman Kerja</div>';
  state.data.experiences.forEach(function(exp) {
    html += '<div class="entry-card"><button class="btn-remove" onclick="rmExp('+exp.id+')">&times;</button>' +
      '<div class="form-grid">' +
      inp('Perusahaan','text',exp.company,"updExp("+exp.id+",'company',this.value)",'Nama perusahaan','') +
      inp('Posisi / Jabatan','text',exp.position,"updExp("+exp.id+",'position',this.value)",'Jabatan Anda','') +
      inp('Tanggal Mulai','month',exp.startDate,"updExp("+exp.id+",'startDate',this.value)",'','') +
      '<div><label class="field-label">Tanggal Selesai</label><input class="field-input" type="month" value="'+esc(exp.endDate)+'" oninput="updExp('+exp.id+',\'endDate\',this.value)"'+(exp.current?' disabled':'')+'>'+
      '<label style="display:flex;align-items:center;gap:5px;margin-top:6px;font-size:11px;color:#64748b;cursor:pointer"><input type="checkbox" '+(exp.current?'checked':'')+' onchange="updExp('+exp.id+',\'current\',this.checked);render()"> Masih bekerja di sini</label></div>' +
      // Description with AI Enhancer button
      '<div class="col-full">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">' +
          '<label class="field-label" style="margin:0">Deskripsi Tugas & Pencapaian</label>' +
          '<button onclick="aiEnhanceExp('+exp.id+')" title="Tingkatkan dengan AI (kata kerja aksi profesional)" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;border:1px solid #c4b5fd;background:linear-gradient(135deg,#ede9fe,#f5f3ff);color:#6d28d9;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">🪄 AI Enhance</button>' +
        '</div>' +
        '<textarea class="field-input" data-exp-desc="'+exp.id+'" rows="4" oninput="updExp('+exp.id+',\'description\',this.value)" onfocus="rememberExpFocus('+exp.id+')" placeholder="Pisahkan setiap poin dengan Enter. Tips: klik 🪄 AI Enhance untuk mengubah jadi kalimat profesional.">'+esc(exp.description)+'</textarea>' +
      '</div>' +
      '</div>' +
      renderDocs(exp.docs || [], 'Exp', exp.id) +
      '</div>';
  });
  html += '<button class="btn-add" onclick="addExp()">+ Tambah Pengalaman Kerja</button>';
  html += renderVerbsDrawer();
  html += atsTip('Pengalaman Kerja', 'Mulai setiap bullet point dengan kata kerja aktif (Memimpin, Menganalisis, Mengembangkan). Sertakan angka dan metrik: "Meningkatkan efisiensi 30%" lebih kuat dari "Meningkatkan efisiensi".');
  return html;
}

function formEducation() {
  var html = '<div class="section-title">🎓 Pendidikan</div>';
  state.data.education.forEach(function(edu) {
    html += '<div class="entry-card"><button class="btn-remove" onclick="rmEdu('+edu.id+')">&times;</button>' +
      '<div class="form-grid">' +
      inp('Institusi','text',edu.institution,"updEdu("+edu.id+",'institution',this.value)",'Nama universitas/sekolah','col-full') +
      inp('Gelar & Jurusan','text',edu.degree,"updEdu("+edu.id+",'degree',this.value)",'S1 Akuntansi','col-full') +
      inp('Tahun Mulai','text',edu.startDate,"updEdu("+edu.id+",'startDate',this.value)",'2019','') +
      inp('Tahun Selesai','text',edu.endDate,"updEdu("+edu.id+",'endDate',this.value)",'2023','') +
      txta('Keterangan Tambahan',edu.description,"updEdu("+edu.id+",'description',this.value)",'IPK, prestasi akademik, organisasi kampus...',2,'col-full') +
      '</div>' +
      renderDocs(edu.docs || [], 'Edu', edu.id) +
      '</div>';
  });
  html += '<button class="btn-add" onclick="addEdu()">+ Tambah Pendidikan</button>';
  return html;
}

function formSkills() {
  var html = '<div class="section-title">⚡ Keahlian Teknis & Soft Skills</div>' +
    '<div style="display:flex;gap:8px;margin-bottom:12px"><input class="field-input" id="skillInp" placeholder="Ketik skill lalu tekan Enter..." onkeydown="skillKey(event)" style="flex:1"><button class="btn btn-accent" onclick="addSkill()">Tambah</button></div>' +
    '<div class="skills-wrap">';
  state.data.skills.forEach(function(sk, i) {
    html += '<span class="skill-tag">' + esc(sk) + '<button onclick="rmSkill('+i+')">&times;</button></span>';
  });
  html += '</div>';
  html += atsTip('Keahlian', 'Masukkan kata kunci teknis yang relevan dengan posisi target. Sistem ATS mencocokkan skill Anda dengan persyaratan lowongan. Gunakan istilah standar industri (misal: "Microsoft Excel" bukan "Excel").');
  return html;
}

function formLanguages() {
  var html = '<div class="section-title">🌍 Kemampuan Bahasa</div>';
  state.data.languages.forEach(function(lang, i) {
    html += '<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px">' +
      '<input class="field-input" value="'+esc(lang.name)+'" oninput="updLang('+i+',\'name\',this.value)" placeholder="Nama bahasa" style="flex:1">' +
      '<select class="field-input" style="width:150px" onchange="updLang('+i+',\'level\',this.value)">' +
      '<option'+(lang.level==='Penutur Asli'?' selected':'')+'>Penutur Asli</option>' +
      '<option'+(lang.level==='Fasih'?' selected':'')+'>Fasih</option>' +
      '<option'+(lang.level==='Menengah'?' selected':'')+'>Menengah</option>' +
      '<option'+(lang.level==='Dasar'?' selected':'')+'>Dasar</option></select>' +
      '<button class="btn-remove" style="position:static" onclick="rmLang('+i+')">&times;</button></div>';
  });
  html += '<button class="btn-add" onclick="addLang()">+ Tambah Bahasa</button>';
  return html;
}

function formCertifications() {
  var html = '<div class="section-title">📜 Sertifikasi & Lisensi</div>';
  state.data.certifications.forEach(function(c, i) {
    html += '<div class="entry-card"><button class="btn-remove" onclick="rmCert('+i+')">&times;</button>' +
      '<div class="form-grid">' +
      inp('Nama Sertifikasi','text',c.name,"updCert("+i+",'name',this.value)",'Contoh: CPA, PMP, AWS Certified','col-full') +
      inp('Lembaga Penerbit','text',c.issuer,"updCert("+i+",'issuer',this.value)",'Nama lembaga','') +
      inp('Tanggal Terbit','text',c.date,"updCert("+i+",'date',this.value)",'2023','') +
      inp('Link Kredensial','text',c.link,"updCert("+i+",'link',this.value)",'https://credential.net/...','col-full') +
      inp('📎 Link Dokumen/Sertifikat (GDrive)','text',c.docUrl||'',"updCert("+i+",'docUrl',this.value)",'https://drive.google.com/...','col-full') +
      '</div></div>';
  });
  html += '<button class="btn-add" onclick="addCert()">+ Tambah Sertifikasi</button>';
  html += atsTip('Sertifikasi', 'Sertifikasi profesional sangat meningkatkan skor ATS. Cantumkan singkatan resmi (CPA, CIA, PMP) karena recruiter sering mencari dengan keyword tersebut.');
  return html;
}

function formProjects() {
  var html = '<div class="section-title">🚀 Proyek / Portofolio</div>';
  state.data.projects.forEach(function(proj) {
    html += '<div class="entry-card"><button class="btn-remove" onclick="rmProj('+proj.id+')">&times;</button>' +
      '<div class="form-grid">' +
      inp('Nama Proyek','text',proj.name,"updProj("+proj.id+",'name',this.value)",'Nama proyek','col-full') +
      inp('Peran Anda','text',proj.role,"updProj("+proj.id+",'role',this.value)",'Project Lead, Developer, dll','') +
      inp('Link Proyek (opsional)','text',proj.link,"updProj("+proj.id+",'link',this.value)",'https://...','') +
      txta('Deskripsi Proyek',proj.description,"updProj("+proj.id+",'description',this.value)",'Jelaskan proyek, teknologi yang digunakan, dan dampaknya...',3,'col-full') +
      '</div>' +
      renderDocs(proj.docs || [], 'Proj', proj.id) +
      '</div>';
  });
  html += '<button class="btn-add" onclick="addProj()">+ Tambah Proyek</button>';
  return html;
}

function formOrganizations() {
  var html = '<div class="section-title">🤝 Organisasi & Kegiatan Sukarelawan</div>';
  state.data.organizations.forEach(function(org) {
    html += '<div class="entry-card"><button class="btn-remove" onclick="rmOrg('+org.id+')">&times;</button>' +
      '<div class="form-grid">' +
      inp('Nama Organisasi','text',org.name,"updOrg("+org.id+",'name',this.value)",'Nama organisasi','col-full') +
      inp('Peran / Jabatan','text',org.role,"updOrg("+org.id+",'role',this.value)",'Ketua, Anggota, Volunteer','col-full') +
      txta('Deskripsi Kegiatan',org.description,"updOrg("+org.id+",'description',this.value)",'Jelaskan kontribusi dan pencapaian Anda...',2,'col-full') +
      '</div>' +
      renderDocs(org.docs || [], 'Org', org.id) +
      '</div>';
  });
  html += '<button class="btn-add" onclick="addOrg()">+ Tambah Organisasi</button>';
  return html;
}

function formAwards() {
  var html = '<div class="section-title">🏆 Penghargaan</div>';
  state.data.awards.forEach(function(a) {
    html += '<div class="entry-card"><button class="btn-remove" onclick="rmAward('+a.id+')">&times;</button>' +
      '<div class="form-grid">' +
      inp('Nama Penghargaan','text',a.name,"updAward("+a.id+",'name',this.value)",'Contoh: Best Employee of the Year','col-full') +
      inp('Pemberi','text',a.issuer,"updAward("+a.id+",'issuer',this.value)",'Nama lembaga/perusahaan','') +
      inp('Tahun','text',a.year,"updAward("+a.id+",'year',this.value)",'2023','') +
      '</div></div>';
  });
  html += '<button class="btn-add" onclick="addAward()">+ Tambah Penghargaan</button>';
  html += atsTip('Penghargaan', 'Penghargaan menunjukkan prestasi terukur. Sebutkan nama resmi penghargaan dan pemberinya agar kredibel di mata recruiter.');
  return html;
}

function formHobbies() {
  var html = '<div class="section-title">🎯 Hobi & Minat</div>' +
    '<div style="display:flex;gap:8px;margin-bottom:12px"><input class="field-input" id="hobbyInp" placeholder="Ketik hobi lalu tekan Enter..." onkeydown="hobbyKey(event)" style="flex:1"><button class="btn btn-accent" onclick="addHobby()">Tambah</button></div>' +
    '<div class="skills-wrap">';
  state.data.hobbies.forEach(function(h, i) {
    html += '<span class="skill-tag">' + esc(h) + '<button onclick="rmHobby('+i+')">&times;</button></span>';
  });
  html += '</div>';
  html += atsTip('Hobi & Minat', 'Cantumkan hobi yang relevan atau menunjukkan soft skill (misal: lari maraton = disiplin, catur = analitis). Opsional, gunakan jika masih ada ruang di CV.');
  return html;
}

function formReferences() {
  var html = '<div class="section-title">🔗 Referensi</div>';
  state.data.references.forEach(function(r) {
    html += '<div class="entry-card"><button class="btn-remove" onclick="rmRef('+r.id+')">&times;</button>' +
      '<div class="form-grid">' +
      inp('Nama','text',r.name,"updRef("+r.id+",'name',this.value)",'Nama lengkap referensi','col-full') +
      inp('Jabatan','text',r.position,"updRef("+r.id+",'position',this.value)",'Jabatan referensi','') +
      inp('Perusahaan','text',r.company,"updRef("+r.id+",'company',this.value)",'Nama perusahaan','') +
      inp('Kontak','text',r.contact,"updRef("+r.id+",'contact',this.value)",'Email / nomor telepon','col-full') +
      '</div></div>';
  });
  html += '<button class="btn-add" onclick="addRef()">+ Tambah Referensi</button>';
  html += atsTip('Referensi', 'Pastikan Anda sudah meminta izin kepada orang yang dijadikan referensi. Boleh juga ditulis "Tersedia atas permintaan" untuk menghemat ruang.');
  return html;
}

function formCover() {
  var c = state.coverLetter;
  var p = state.data.personalInfo;

  // Sync info banner
  var syncInfo = '<div style="padding:10px 12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;margin-bottom:14px;font-size:11px;color:#1e40af">' +
    '<strong>🔄 Data otomatis dari CV:</strong> ' +
    (p.fullName?esc(p.fullName):'<i>(Nama belum diisi)</i>') +
    (p.email?' • '+esc(p.email):'') + (p.phone?' • '+esc(p.phone):'') +
    '<br><span style="color:#64748b">Nama, email & telepon di bagian penutup bisa diedit manual di bawah.</span>' +
  '</div>';

  // Text alignment buttons
  var alignBtns = '<div style="margin-bottom:5px"><label class="field-label">Rata Teks Isi Surat</label>' +
    '<div style="display:flex;gap:4px">' +
    ['left','center','right','justify'].map(function(a){
      var icons = {left:'⬅ Kiri', center:'↔ Tengah', right:'➡ Kanan', justify:'☰ Justify'};
      var on = (c.bodyAlign||'justify') === a;
      return '<button onclick="updCover(\'bodyAlign\',\''+a+'\')" style="flex:1;padding:6px 4px;border-radius:8px;font-size:11px;font-weight:'+(on?'700':'400')+';border:'+(on?'2px solid #2563eb':'1px solid #e2e8f0')+';background:'+(on?'#eff6ff':'#fff')+';color:'+(on?'#1d4ed8':'#64748b')+';cursor:pointer;font-family:inherit">'+icons[a]+'</button>';
    }).join('') +
    '</div></div>';

  // Signature section
  var sigBlock = '<div style="margin-top:16px;padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px">' +
    '<div style="font-size:12px;font-weight:700;color:#1e293b;margin-bottom:10px">✍️ Bagian Penutup & Tanda Tangan</div>' +
    '<div class="form-grid">' +
    inp('Nama (penutup)','text',c.sigName||p.fullName||'',"updCover('sigName',this.value)",'Nama di bawah tanda tangan','col-full') +
    inp('Email (penutup)','text',c.sigEmail||p.email||'',"updCover('sigEmail',this.value)",'Email di bawah tanda tangan','') +
    inp('No. HP (penutup)','text',c.sigPhone||p.phone||'',"updCover('sigPhone',this.value)",'Nomor HP di bawah tanda tangan','') +
    '</div>' +
    '<div style="margin-top:10px"><label class="field-label">Upload Tanda Tangan (gambar JPG/PNG, maks 2MB)</label>' +
    '<div style="display:flex;align-items:center;gap:10px;margin-top:6px">' +
    (c.signature
      ? '<img src="'+c.signature+'" alt="TTD" style="height:56px;max-width:160px;object-fit:contain;border:1px solid #e2e8f0;border-radius:8px;background:#fff;padding:4px">'
      : '<div style="width:120px;height:52px;border:2px dashed #e2e8f0;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#94a3b8">Belum ada</div>') +
    '<div style="display:flex;flex-direction:column;gap:6px">' +
    '<label style="padding:6px 12px;background:#2563eb;color:#fff;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">📁 '+(c.signature?'Ganti':'Upload')+'<input type="file" accept="image/*" onchange="uploadSignature(this)" style="display:none"></label>' +
    (c.signature?'<button onclick="removeSignature()" style="padding:6px 12px;background:#fee2e2;color:#b91c1c;border:none;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">Hapus</button>':'') +
    '</div></div></div>' +
  '</div>';

  return '<div class="section-title">✉️ Surat Lamaran Kerja</div>' +
    syncInfo +
    '<div class="form-grid">' +
    inp('Perusahaan Tujuan','text',c.company,"updCover('company',this.value)",'Contoh: PT Bank Negara Indonesia','col-full') +
    inp('Nama Penerima / HRD','text',c.recipient,"updCover('recipient',this.value)",'Contoh: Ibu Sarah, HR Manager','col-full') +
    inp('Posisi yang Dilamar','text',c.position,"updCover('position',this.value)",'Contoh: Senior Internal Auditor','') +
    inp('Tanggal Surat','text',c.date,"updCover('date',this.value)",'Kosongkan = tanggal hari ini','') +
    '</div>' +
    alignBtns +
    txta('Isi Surat Lamaran',c.body,"updCover('body',this.value)",'Tuliskan isi surat lamaran Anda. Pisahkan paragraf dengan Enter dua kali...',12,'col-full') +
    sigBlock +
    atsTip('Surat Lamaran', 'Buat singkat (maksimal 1 halaman, 3-4 paragraf). Sebutkan posisi yang dilamar, kualifikasi utama yang relevan, dan alasan tertarik pada perusahaan. Klik "📋 Contoh Data" untuk draf otomatis.');
}

function formJobMatch() {
  var html = '<div class="section-title">🎯 Job Description Matcher</div>' +
    '<p style="font-size:12px;color:#64748b;margin-bottom:14px;line-height:1.6">Paste deskripsi lowongan kerja di bawah, lalu sistem akan membandingkan kata kunci penting dengan isi CV Anda untuk memperkirakan kecocokan ATS.</p>' +
    '<textarea class="field-input" id="jdInput" rows="8" placeholder="Paste seluruh teks lowongan kerja (job description) di sini..."></textarea>' +
    '<button class="btn btn-accent" style="width:100%;margin-top:10px" onclick="runJobMatch()">🔍 Analisis Kecocokan</button>' +
    '<div id="jobMatchResult" style="margin-top:14px"></div>' +
    atsTip('Job Matcher', 'Masukkan kata kunci yang muncul di hasil "belum ada" ke dalam Skill, Ringkasan, atau Pengalaman Anda (jika memang relevan & jujur) untuk meningkatkan kecocokan dengan filter ATS.');
  return html;
}

// --- Document/Certificate Link Helper ---
function renderDocs(docs, type, parentId) {
  var html = '<div style="margin-top:10px;padding-top:10px;border-top:1px dashed #e2e8f0">';
  if (docs && docs.length) {
    docs.forEach(function(doc, i) {
      html += '<div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">' +
        '<span style="font-size:14px">📎</span>' +
        '<input class="field-input" value="'+esc(doc.name)+'" oninput="upd'+type+'Doc('+parentId+','+i+',\'name\',this.value)" placeholder="Nama dokumen" style="flex:1;padding:6px 10px;font-size:12px">' +
        '<input class="field-input" value="'+esc(doc.url)+'" oninput="upd'+type+'Doc('+parentId+','+i+',\'url\',this.value)" placeholder="Link Google Drive / URL" style="flex:1.5;padding:6px 10px;font-size:12px">' +
        '<button class="btn-remove" style="position:static;font-size:16px" onclick="rm'+type+'Doc('+parentId+','+i+')">&times;</button>' +
      '</div>';
    });
  }
  html += '<button onclick="add'+type+'Doc('+parentId+')" style="display:flex;align-items:center;gap:6px;padding:6px 12px;border:1px dashed #cbd5e1;border-radius:8px;background:transparent;color:#3b82f6;font-size:12px;cursor:pointer;font-family:inherit;width:100%;justify-content:center;transition:all 0.2s" onmouseover="this.style.borderColor=\'#3b82f6\';this.style.background=\'#f8fafc\'" onmouseout="this.style.borderColor=\'#cbd5e1\';this.style.background=\'transparent\'">⊕ ADD DOCUMENT / CERTIFICATE</button>';
  html += '</div>';
  return html;
}

// --- Review Section ---
function formReview() {
  var d = state.data;
  var score = 0;
  var maxScore = 100;
  var tips = [];

  // Scoring logic
  if (d.personalInfo.fullName) score += 8; else tips.push({section:'Pribadi', tip:'Tambahkan nama lengkap Anda'});
  if (d.personalInfo.jobTitle) score += 7; else tips.push({section:'Pribadi', tip:'Tambahkan jabatan/posisi target'});
  if (d.personalInfo.email) score += 5; else tips.push({section:'Pribadi', tip:'Tambahkan alamat email'});
  if (d.personalInfo.phone) score += 5; else tips.push({section:'Pribadi', tip:'Tambahkan nomor telepon'});
  if (d.personalInfo.location) score += 3;
  if (d.personalInfo.linkedin) score += 5; else tips.push({section:'Pribadi', tip:'Tambahkan profil LinkedIn untuk meningkatkan kredibilitas'});
  if (d.personalInfo.summary && d.personalInfo.summary.length > 50) score += 12; else if (d.personalInfo.summary) score += 6; else tips.push({section:'Pribadi', tip:'Tulis ringkasan profesional minimal 2-3 kalimat'});

  if (d.experiences.length >= 2) score += 15; else if (d.experiences.length === 1) { score += 8; tips.push({section:'Pengalaman', tip:'Tambahkan minimal 2 pengalaman kerja'}); } else tips.push({section:'Pengalaman', tip:'Tambahkan pengalaman kerja — ini bagian terpenting CV'});

  var hasDescriptions = d.experiences.filter(function(e){return e.description && e.description.length > 30;}).length;
  if (hasDescriptions >= 2) score += 10; else tips.push({section:'Pengalaman', tip:'Tambahkan deskripsi tugas & pencapaian dengan bullet points'});

  if (d.education.length >= 1) score += 10; else tips.push({section:'Pendidikan', tip:'Tambahkan riwayat pendidikan'});

  if (d.skills.length >= 6) score += 10; else if (d.skills.length >= 3) { score += 5; tips.push({section:'Keahlian', tip:'Tambahkan lebih banyak skill (minimal 6) untuk meningkatkan skor ATS'}); } else tips.push({section:'Keahlian', tip:'Tambahkan keahlian teknis — sangat penting untuk ATS'});

  if (d.certifications.length >= 1) score += 5; else tips.push({section:'Sertifikasi', tip:'Tambahkan sertifikasi profesional jika ada'});
  if (d.languages.length >= 1) score += 3;
  if (d.projects.length >= 1) score += 2;

  // Cap at 100
  if (score > maxScore) score = maxScore;

  // Determine color
  var color = '#ef4444'; // red
  var label = 'Perlu Perbaikan';
  if (score >= 70) { color = '#22c55e'; label = 'Bagus!'; }
  else if (score >= 50) { color = '#f59e0b'; label = 'Cukup'; }

  // Build HTML
  var html = '<div class="section-title">✅ Review Resume</div>';

  // Score circle
  html += '<div style="text-align:center;padding:20px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);border-radius:16px;margin-bottom:16px">';
  html += '<div style="position:relative;width:100px;height:100px;margin:0 auto 12px">';
  html += '<svg width="100" height="100" style="transform:rotate(-90deg)"><circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" stroke-width="8"/><circle cx="50" cy="50" r="42" fill="none" stroke="'+color+'" stroke-width="8" stroke-dasharray="'+Math.round(264*score/100)+' 264" stroke-linecap="round"/></svg>';
  html += '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:22px;font-weight:700;color:'+color+'">'+score+'%</div>';
  html += '</div>';
  html += '<div style="font-size:14px;font-weight:600;color:#1e293b">'+esc(d.personalInfo.fullName || 'Anda')+', skor resume Anda: <span style="color:'+color+'">'+score+'%</span></div>';
  html += '<div style="font-size:12px;color:#64748b;margin-top:4px">'+label+(score<70?' — Lihat saran perbaikan di bawah':'')+'</div>';
  html += '</div>';

  // Improvement tips
  if (tips.length > 0) {
    html += '<div style="margin-bottom:16px"><div style="font-size:13px;font-weight:600;color:#1e293b;margin-bottom:10px">🔧 Saran Perbaikan:</div>';
    tips.forEach(function(t) {
      html += '<div style="display:flex;gap:8px;align-items:flex-start;padding:8px 12px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:6px;font-size:12px">' +
        '<span style="color:#f59e0b;font-size:14px;flex-shrink:0">⚠️</span>' +
        '<div><span style="font-weight:600;color:#64748b">['+t.section+']</span> '+t.tip+'</div></div>';
    });
    html += '</div>';
  }

  // Section completeness
  html += '<div style="font-size:13px;font-weight:600;color:#1e293b;margin-bottom:10px">📊 Kelengkapan Section:</div>';
  var sections = [
    {name:'Data Pribadi', done: !!(d.personalInfo.fullName && d.personalInfo.email && d.personalInfo.summary)},
    {name:'Pengalaman Kerja', done: d.experiences.length >= 1},
    {name:'Pendidikan', done: d.education.length >= 1},
    {name:'Keahlian', done: d.skills.length >= 3},
    {name:'Bahasa', done: d.languages.length >= 1},
    {name:'Sertifikasi', done: d.certifications.length >= 1},
    {name:'Proyek', done: d.projects.length >= 1},
    {name:'Organisasi', done: d.organizations.length >= 1}
  ];
  sections.forEach(function(sec) {
    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:4px;font-size:12px">' +
      '<span>'+sec.name+'</span>' +
      '<span style="color:'+(sec.done?'#22c55e':'#94a3b8')+';font-weight:600">'+(sec.done?'✅ Lengkap':'○ Belum')+'</span></div>';
  });

  // Document count
  var totalDocs = 0;
  d.experiences.forEach(function(e){if(e.docs)totalDocs+=e.docs.filter(function(x){return x.url;}).length;});
  d.education.forEach(function(e){if(e.docs)totalDocs+=e.docs.filter(function(x){return x.url;}).length;});
  d.certifications.forEach(function(c){if(c.docUrl)totalDocs++;});
  d.projects.forEach(function(e){if(e.docs)totalDocs+=e.docs.filter(function(x){return x.url;}).length;});

  html += '<div style="margin-top:14px;padding:12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;font-size:12px;color:#1e40af">' +
    '<strong>📎 Dokumen Terlampir:</strong> '+totalDocs+' file' +
    (totalDocs === 0 ? '<br><span style="color:#64748b">Tambahkan link sertifikat/dokumen di setiap section untuk memperkuat CV Anda.</span>' : '') +
    '</div>';

  html += '<div style="margin-top:16px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" style="flex:1" onclick="exportPDF()">📥 Download PDF</button>' +
    '<button class="btn btn-ghost" style="flex:1" onclick="saveData()">💾 Save Data</button>' +
    '</div>';

  return html;
}

function formImport() {
  return '<div class="section-title">📂 Import / Upload CV</div>' +
    '<p style="font-size:12px;color:#64748b;margin-bottom:16px;line-height:1.6">Upload CV yang sudah ada untuk diedit di sini. Anda bisa import dari file JSON (data CV Builder) atau file PDF/TXT untuk ekstraksi teks otomatis.</p>' +

    // JSON Import
    '<div class="entry-card" style="margin-bottom:14px">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><span style="font-size:18px">📋</span><div><div style="font-size:13px;font-weight:600;color:#1e293b">Import Data JSON</div><div style="font-size:11px;color:#64748b">File .json dari CV Builder (backup/export sebelumnya)</div></div></div>' +
      '<label style="display:block;padding:14px;border:2px dashed #e2e8f0;border-radius:12px;text-align:center;cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor=\'#3b82f6\';this.style.background=\'#f8fafc\'" onmouseout="this.style.borderColor=\'#e2e8f0\';this.style.background=\'transparent\'">' +
        '<input type="file" accept=".json" onchange="importJSON(this)" style="display:none">' +
        '<div style="font-size:12px;color:#64748b">📁 Klik untuk pilih file .json</div>' +
      '</label>' +
    '</div>' +

    // PDF/TXT Import
    '<div class="entry-card" style="margin-bottom:14px">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><span style="font-size:18px">📄</span><div><div style="font-size:13px;font-weight:600;color:#1e293b">Import dari PDF / TXT</div><div style="font-size:11px;color:#64748b">Ekstrak teks dari CV yang sudah ada (format .pdf atau .txt)</div></div></div>' +
      '<label style="display:block;padding:14px;border:2px dashed #e2e8f0;border-radius:12px;text-align:center;cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor=\'#3b82f6\';this.style.background=\'#f8fafc\'" onmouseout="this.style.borderColor=\'#e2e8f0\';this.style.background=\'transparent\'">' +
        '<input type="file" accept=".pdf,.txt" onchange="importFile(this)" style="display:none">' +
        '<div style="font-size:12px;color:#64748b">📁 Klik untuk pilih file .pdf atau .txt</div>' +
      '</label>' +
      '<div id="importPreview" style="margin-top:10px"></div>' +
    '</div>' +

    // Paste Text
    '<div class="entry-card" style="margin-bottom:14px">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><span style="font-size:18px">📝</span><div><div style="font-size:13px;font-weight:600;color:#1e293b">Paste Teks CV</div><div style="font-size:11px;color:#64748b">Copy-paste isi CV Anda langsung di sini</div></div></div>' +
      '<textarea class="field-input" id="pasteArea" rows="6" placeholder="Paste seluruh teks CV Anda di sini...\n\nContoh:\nNama: Ahmad Rizki\nEmail: ahmad@email.com\nPengalaman: ..."></textarea>' +
      '<button class="btn btn-accent" style="margin-top:8px;width:100%" onclick="parsePastedCV()">🔍 Parsing & Isi Form Otomatis</button>' +
    '</div>' +

    // Export JSON
    '<div class="entry-card">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><span style="font-size:18px">💾</span><div><div style="font-size:13px;font-weight:600;color:#1e293b">Export / Backup Data</div><div style="font-size:11px;color:#64748b">Simpan data CV Anda sebagai file JSON untuk backup</div></div></div>' +
      '<button class="btn btn-ghost" style="width:100%" onclick="exportJSON()">💾 Download Backup (JSON)</button>' +
    '</div>' +

    atsTip('Import CV', 'Setelah import, periksa kembali setiap section untuk memastikan data terisi dengan benar. Parsing otomatis mungkin tidak sempurna — edit manual tetap diperlukan untuk hasil terbaik.');
}

// --- Import/Export Functions ---
function importJSON(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = JSON.parse(e.target.result);
      // Validate structure
      if (data.personalInfo && data.personalInfo.fullName !== undefined) {
        state.data = data;
        // Ensure all arrays exist
        if (!state.data.experiences) state.data.experiences = [];
        if (!state.data.education) state.data.education = [];
        if (!state.data.skills) state.data.skills = [];
        if (!state.data.languages) state.data.languages = [];
        if (!state.data.certifications) state.data.certifications = [];
        if (!state.data.projects) state.data.projects = [];
        if (!state.data.organizations) state.data.organizations = [];
        render();
        alert('✅ Data CV berhasil di-import! Silakan cek setiap tab.');
      } else {
        alert('❌ Format file JSON tidak valid. Pastikan file berasal dari CV Builder.');
      }
    } catch(err) {
      alert('❌ Gagal membaca file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function importFile(input) {
  var file = input.files[0];
  if (!file) return;

  if (file.name.endsWith('.txt')) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var text = e.target.result;
      document.getElementById('pasteArea').value = text;
      var preview = document.getElementById('importPreview');
      if (preview) preview.innerHTML = '<div style="padding:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:11px;color:#166534">✅ Teks berhasil dimuat (' + text.length + ' karakter). Klik "Parsing & Isi Form Otomatis" di bawah untuk memproses.</div>';
    };
    reader.readAsText(file);
  } else if (file.name.endsWith('.pdf')) {
    var preview = document.getElementById('importPreview');
    if (preview) preview.innerHTML = '<div style="padding:10px;background:#fef3c7;border:1px solid #fde68a;border-radius:8px;font-size:11px;color:#92400e">⚠️ Untuk file PDF: Buka PDF di browser/reader, select all text (Ctrl+A), copy (Ctrl+C), lalu paste di kotak "Paste Teks CV" di bawah. Parsing PDF langsung membutuhkan library tambahan.</div>';
  }
}

function exportJSON() {
  var dataStr = JSON.stringify(state.data, null, 2);
  var blob = new Blob([dataStr], {type: 'application/json'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'CV_Backup_' + (state.data.personalInfo.fullName || 'data') + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function parsePastedCV() {
  var text = document.getElementById('pasteArea');
  if (!text || !text.value.trim()) {
    alert('Silakan paste teks CV terlebih dahulu.');
    return;
  }
  var raw = text.value.trim();
  var lines = raw.split('\n').map(function(l){return l.trim();}).filter(function(l){return l;});

  // Simple heuristic parser
  var p = state.data.personalInfo;

  // Try to find email
  var emailMatch = raw.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) p.email = emailMatch[0];

  // Try to find phone
  var phoneMatch = raw.match(/(\+?\d[\d\s\-().]{8,})/);
  if (phoneMatch) p.phone = phoneMatch[1].trim();

  // Try to find LinkedIn
  var linkedinMatch = raw.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) p.linkedin = linkedinMatch[0];

  // First line is often the name
  if (lines.length > 0 && !lines[0].match(/@|http|linkedin|telp|phone/i)) {
    p.fullName = lines[0];
  }

  // Look for summary-like paragraph (longest line that's not a header)
  var longestLine = '';
  lines.forEach(function(l) {
    if (l.length > longestLine.length && l.length > 80 && !l.match(/^(pengalaman|pendidikan|keahlian|skill|education|experience)/i)) {
      longestLine = l;
    }
  });
  if (longestLine) p.summary = longestLine;

  // Extract skills from common patterns
  var skillSection = raw.match(/(?:keahlian|skills?|kompetensi|technical skills?)[\s:]*\n?([\s\S]*?)(?:\n\n|\n[A-Z])/i);
  if (skillSection) {
    var skillText = skillSection[1];
    var skills = skillText.split(/[,;•·|\n]/).map(function(s){return s.replace(/^[\s\-\*]+/,'').trim();}).filter(function(s){return s && s.length < 40;});
    if (skills.length > 0) state.data.skills = skills;
  }

  state.data.personalInfo = p;
  render();
  alert('✅ Parsing selesai! Data dasar telah diisi.\n\nSilakan periksa dan lengkapi setiap tab secara manual untuk hasil terbaik.');
}

function formTemplate() {
  // Descriptions per template id
  var descs = {
    'ats-clean': 'Minimalis, rata kiri, paling aman untuk ATS',
    'academic-classic': 'Serif formal, hitam-putih, untuk beasiswa/dosen',
    'banking-professional': 'Georgia + Calibri, judul tebal korporat',
    'legal-minimalist': 'Arial, kontak di footer, fokus konten',
    'tech-minimal': 'Font mono untuk kontak & skill, kesan IT',
    'nordic-slate': 'Skandinavia, teks charcoal nyaman dibaca',
    'left-border-accent': 'Bar vertikal aksen di tiap judul',
    'modern-clean': 'Centered, judul dengan bar background',
    'sidebar-dark': 'Sidebar gelap + konten putih (2 kolom)',
    'warm-ivory-split': 'Sidebar cream elegan (2 kolom)',
    'creative-bold': 'Nama besar Montserrat, aksen berani',
    'portfolio-spotlight': 'Box proyek unggulan di bagian atas'
  };

  var html = '<div class="section-title">🎨 Desain & Kustomisasi</div>';

  // ---- COLOR PALETTE ----
  html += '<div style="margin-bottom:8px;font-size:12px;font-weight:600;color:#475569">Warna Aksen</div>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px">';
  var activeAccent = getActiveAccent();
  COLOR_PALETTE.forEach(function(c) {
    var sel = (activeAccent.toLowerCase() === c.value.toLowerCase());
    html += '<button onclick="setAccent(\''+c.value+'\')" title="'+c.name+'" style="width:30px;height:30px;border-radius:50%;background:'+c.value+';cursor:pointer;border:'+(sel?'3px solid #0f172a':'2px solid #fff')+';box-shadow:0 0 0 1px #e2e8f0,0 1px 3px rgba(0,0,0,0.2);transition:all 0.2s"></button>';
  });
  html += '<button onclick="setAccent(\'\')" title="Reset ke default template" style="padding:0 10px;height:30px;border-radius:15px;background:#f1f5f9;border:1px solid #e2e8f0;font-size:11px;color:#64748b;cursor:pointer">↺ Default</button>';
  html += '</div>';

  // ---- DENSITY CONTROL ----
  html += '<div style="margin-bottom:8px;font-size:12px;font-weight:600;color:#475569">Kepadatan (Spasi & Ukuran Font)</div>';
  html += '<div style="display:flex;gap:6px;margin-bottom:8px">';
  ['compact','normal','spacious'].forEach(function(d) {
    var on = state.density === d;
    html += '<button onclick="setDensity(\''+d+'\')" style="flex:1;padding:8px;border-radius:8px;font-size:12px;font-weight:'+(on?'600':'400')+';border:'+(on?'2px solid #2563eb':'1px solid #e2e8f0')+';background:'+(on?'#eff6ff':'#fff')+';color:'+(on?'#1d4ed8':'#64748b')+';cursor:pointer;font-family:inherit">'+DENSITY_PRESETS[d].label+'</button>';
  });
  html += '</div>';
  html += '<div style="font-size:11px;color:#94a3b8;margin-bottom:18px">💡 Gunakan <b>Compact</b> agar CV pas dalam 1 halaman A4 penuh.</div>';

  // ---- FONT PICKER ----
  html += '<div style="margin-bottom:8px;font-size:12px;font-weight:600;color:#475569">Font Dokumen</div>';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:18px">';
  FONT_OPTIONS.forEach(function(f) {
    var on = state.fontOverride === f.id;
    var previewStack = f.stack || "Calibri, Arial, sans-serif";
    html += '<button onclick="setFont(\''+f.id.replace(/'/g,"\\'")+'\')" style="padding:8px 10px;border-radius:8px;text-align:left;font-size:13px;font-weight:'+(on?'700':'400')+';border:'+(on?'2px solid #2563eb':'1px solid #e2e8f0')+';background:'+(on?'#eff6ff':'#fff')+';color:'+(on?'#1d4ed8':'#1e293b')+';cursor:pointer;font-family:'+previewStack+';transition:all 0.2s">' +
      (on?'✓ ':'')+f.label+'</button>';
  });
  html += '</div>';

  // ---- SECTION REORDER (drag & drop) ----
  html += renderSectionReorder();
  html += '<div style="height:18px"></div>';

  // ---- TEMPLATE GRID (grouped by category) ----
  html += '<div style="margin-bottom:8px;font-size:12px;font-weight:600;color:#475569">Pilih Template</div>';
  TEMPLATE_CATEGORIES.forEach(function(cat) {
    html += '<div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;margin:12px 0 8px">'+cat+'</div>';
    html += '<div class="template-grid">';
    Object.keys(TEMPLATES).forEach(function(id) {
      var t = TEMPLATES[id];
      if (t.cat !== cat) return;
      var on = state.template === id;
      var cardStyle = on
        ? 'background:'+t.accent+';border:2px solid '+t.accent+';box-shadow:0 4px 12px rgba(0,0,0,0.2)'
        : 'background:#fff;border:2px solid #e2e8f0';
      var nameColor = on ? '#fff' : '#1e293b';
      var descColor = on ? 'rgba(255,255,255,0.85)' : '#64748b';
      var swatchBorder = on ? '2px solid rgba(255,255,255,0.7)' : '1px solid #fff';
      html += '<div class="tpl-card'+(on?' active':'')+'" onclick="setTemplate(\''+id+'\')" style="'+cardStyle+'">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">' +
          '<div style="display:flex;align-items:center;gap:8px"><div style="width:18px;height:18px;border-radius:5px;background:'+t.accent+';border:'+swatchBorder+'"></div><span style="font-size:15px">'+t.icon+'</span></div>' +
          (on?'<span style="color:#fff;font-size:13px;font-weight:700">✓</span>':'') +
        '</div>' +
        '<div class="tpl-name" style="color:'+nameColor+'">'+t.name+'</div><div class="tpl-desc" style="color:'+descColor+'">'+(descs[id]||'')+'</div></div>';
    });
    html += '</div>';
  });

  html += atsTip('Template', 'Kategori <b>Corporate</b> & <b>Modern</b> aman untuk ATS. Kategori <b>Creative</b> sebaiknya hanya untuk lamaran via email langsung ke recruiter, bukan portal ATS. Atur warna & kepadatan agar CV tampil pas dalam 1 halaman.');
  return html;
}

function atsTip(context, tip) {
  return '<div class="ats-tip"><div class="ats-tip-title">💡 Tips ATS — '+context+'</div>'+tip+'</div>';
}


// ============================================================
// CV PREVIEW RENDERERS
// ============================================================
// NOTE: renderCV() and all template rendering now live in templates.js
// (config-driven engine). The functions below are legacy helpers kept
// only for backward compatibility with any saved references.

function renderCertDocLink(cert) {
  var url = cert.docUrl || cert.link || '';
  if (!url) return '';
  return ' <a href="'+esc(url)+'" target="_blank" rel="noopener" style="font-size:9pt;color:#2563eb;text-decoration:none">📎 Lihat Sertifikat</a>';
}

function tplSelectorBtns() {
  var html = '';
  // Template quick-buttons — active button gets full accent bg + white text
  Object.keys(TEMPLATES).forEach(function(id) {
    var t = TEMPLATES[id];
    var isActive = state.template === id;
    var activeColor = getActiveAccent();
    var style = isActive
      ? 'background:'+activeColor+';color:#fff;border:2px solid '+activeColor+';font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.18)'
      : 'background:#fff;color:#64748b;border:1px solid #e2e8f0;font-weight:400';
    html += '<button onclick="setTemplate(\''+id+'\')" title="'+t.name+' ('+t.cat+')" style="padding:5px 10px;border-radius:8px;font-size:11px;cursor:pointer;transition:all 0.2s;font-family:inherit;white-space:nowrap;'+style+'">'+t.icon+' '+t.name+(isActive?' ✓':'')+'</button>';
  });
  return html;
}

// Quick color + density swatches for the preview dashboard
function tplQuickControls() {
  var html = '<span style="font-size:11px;font-weight:600;color:#64748b;margin-left:8px;margin-right:2px">Warna:</span>';
  var activeAccent = getActiveAccent();
  COLOR_PALETTE.forEach(function(c) {
    var sel = (activeAccent.toLowerCase() === c.value.toLowerCase());
    html += '<button onclick="setAccent(\''+c.value+'\')" title="'+c.name+'" style="width:22px;height:22px;border-radius:50%;background:'+c.value+';cursor:pointer;border:'+(sel?'2px solid #0f172a':'1px solid #fff')+';box-shadow:0 0 0 1px #e2e8f0;margin:0 1px"></button>';
  });
  html += '<span style="font-size:11px;font-weight:600;color:#64748b;margin-left:10px;margin-right:4px">Spasi:</span>';
  ['compact','normal','spacious'].forEach(function(d) {
    var on = state.density === d;
    var labelShort = d === 'compact' ? 'S' : d === 'normal' ? 'M' : 'L';
    html += '<button onclick="setDensity(\''+d+'\')" title="'+DENSITY_PRESETS[d].label+'" style="width:24px;height:24px;border-radius:6px;font-size:11px;font-weight:600;border:'+(on?'2px solid #2563eb':'1px solid #e2e8f0')+';background:'+(on?'#eff6ff':'#fff')+';color:'+(on?'#1d4ed8':'#64748b')+';cursor:pointer;margin:0 1px">'+labelShort+'</button>';
  });
  return html;
}

// ============================================================
// MAIN RENDER FUNCTION
// ============================================================
function renderPreview() {
  var el = document.getElementById('cvOutput');
  if (el) el.innerHTML = renderCV();
  if (typeof updatePageBreaks === 'function') {
    if (window.requestAnimationFrame) requestAnimationFrame(updatePageBreaks);
    else setTimeout(updatePageBreaks, 30);
  }
  autoSave(); // Auto-save after every data change
}

// Save tab scroll position before re-render, restore after
var _tabScrollPos = 0;

function render() {
  // Save current scroll position before rebuilding DOM
  var oldScroll = document.getElementById('tabsScroll');
  if (oldScroll) _tabScrollPos = oldScroll.scrollLeft;

  var tabs = [
    {id:'personal',       icon:'👤', label:'Pribadi'},
    {id:'experience',     icon:'💼', label:'Pengalaman'},
    {id:'education',      icon:'🎓', label:'Pendidikan'},
    {id:'skills',         icon:'⚡', label:'Keahlian'},
    {id:'languages',      icon:'🌍', label:'Bahasa'},
    {id:'certifications', icon:'📜', label:'Sertifikasi'},
    {id:'projects',       icon:'🚀', label:'Proyek'},
    {id:'organizations',  icon:'🤝', label:'Organisasi'},
    {id:'awards',         icon:'🏆', label:'Penghargaan'},
    {id:'hobbies',        icon:'🎯', label:'Hobi'},
    {id:'references',     icon:'🔗', label:'Referensi'},
    {id:'template',       icon:'🎨', label:'Desain'}
  ];

  // Secondary tabs shown in "⋯ Lainnya" dropdown
  var secondaryTabs = [
    {id:'jobmatch', icon:'🎯', label:'Job Match'},
    {id:'import',   icon:'📂', label:'Import CV'},
    {id:'review',   icon:'✅', label:'Review'}
  ];
  var secondaryActive = secondaryTabs.some(function(t){ return t.id === state.section; });

  var tabsHtml;
  if (state.docMode === 'cover') {
    tabsHtml = '<button class="tab-btn active" style="cursor:default">✉️ Surat Lamaran</button>' +
      '<button class="tab-btn" onclick="switchDocument(\'cv\')">↩ Kembali ke CV</button>';
  } else {
    tabsHtml = tabs.map(function(t) {
      return '<button class="tab-btn'+(state.section===t.id?' active':'')+'" onclick="setSection(\''+t.id+'\')">'+t.icon+' '+t.label+'</button>';
    }).join('');
    // "⋯ Lainnya" dropdown button
    tabsHtml += '<div style="position:relative;display:inline-block">' +
      '<button class="tab-btn'+(secondaryActive?' active':'')+'" onclick="toggleMoreTabs()" id="moreTabsBtn">⋯ Lainnya</button>' +
      '<div id="moreTabsMenu" style="display:none;position:absolute;top:100%;left:0;background:#fff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.1);z-index:200;min-width:140px;padding:4px">' +
        secondaryTabs.map(function(t){
          return '<button class="tab-btn'+(state.section===t.id?' active':'')+'" onclick="setSection(\''+t.id+'\');closeMoreTabs()" style="display:block;width:100%;text-align:left;border-radius:8px">'+t.icon+' '+t.label+'</button>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  document.getElementById('app').innerHTML =
    // HEADER
    '<header class="header no-print">' +
      '<div class="header-inner">' +
        '<div class="logo">' +
          '<div class="logo-icon">CV</div>' +
          '<span class="logo-text">CV Builder Pro</span>' +
          '<span class="logo-sub">ATS-Friendly Resume Builder</span>' +
        '</div>' +
        '<div class="header-actions">' +
          renderLangToggle() +
          '<button class="btn btn-ghost" onclick="toggleTheme()" title="Mode Gelap/Terang">'+(state.theme==='dark'?'☀️':'🌙')+'</button>' +
          '<button class="btn btn-ghost" onclick="loadSample()">📋 Contoh Data</button>' +
          '<button class="btn btn-ghost" onclick="resetData()">🗑️ Reset</button>' +
          '<button class="btn btn-ghost" id="saveBtn" onclick="saveData()">💾 Save</button>' +
          // Document switcher (CV / Cover Letter) — centered between Save and Download
          '<div class="doc-switch" style="display:inline-flex;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:10px;padding:3px;gap:2px">' +
            '<button onclick="switchDocument(\'cv\')" style="padding:6px 12px;border:none;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;'+(state.docMode==='cv'?'background:#1e3a5f;color:#fff;box-shadow:0 1px 4px rgba(0,0,0,0.2)':'background:transparent;color:#64748b')+'">📄 CV</button>' +
            '<button onclick="switchDocument(\'cover\')" style="padding:6px 12px;border:none;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;'+(state.docMode==='cover'?'background:#1e3a5f;color:#fff;box-shadow:0 1px 4px rgba(0,0,0,0.2)':'background:transparent;color:#64748b')+'">✉️ Cover Letter</button>' +
          '</div>' +
          '<span id="saveIndicator" style="font-size:10px;color:#94a3b8;transition:opacity 0.3s;opacity:0.6"></span>' +
          '<button class="btn btn-primary" onclick="exportPDF()">📥 Download PDF</button>' +
        '</div>' +
      '</div>' +
    '</header>' +
    // MAIN LAYOUT
    '<div class="main-layout">' +
      // LEFT PANEL
      '<div class="panel-left no-print">' +
        '<div class="tabs-wrapper">' +
          '<button class="tab-scroll-btn left" onclick="scrollTabs(-150)" aria-label="Scroll kiri">&#8249;</button>' +
          '<div class="tabs-container" id="tabsScroll">' + tabsHtml + '</div>' +
          '<button class="tab-scroll-btn right" onclick="scrollTabs(150)" aria-label="Scroll kanan">&#8250;</button>' +
        '</div>' +
        '<div class="form-scroll">' + renderForm() + '</div>' +
      '</div>' +
      // RIGHT PANEL
      '<div class="panel-right">' +
        '<div style="width:100%;max-width:210mm;margin:0 auto">' +
          // Template Selector Dashboard
          '<div class="tpl-selector no-print" style="margin-bottom:12px;padding:12px 16px;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">' +
            '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:8px">' +
              '<span style="font-size:11px;font-weight:600;color:#64748b;margin-right:2px">🎨 Template:</span>' +
              tplSelectorBtns() +
            '</div>' +
            '<div style="display:flex;align-items:center;flex-wrap:wrap;padding-top:8px;border-top:1px solid #f1f5f9">' +
              tplQuickControls() +
            '</div>' +
          '</div>' +
          // CV Paper with page-break overlay (overlay is sibling so it's excluded from PDF)
          '<div class="cv-paper-wrapper" style="position:relative;width:210mm;max-width:100%;margin:0 auto">' +
            '<div class="cv-paper" id="cvOutput">' + renderCV() + '</div>' +
            '<div id="pageBreakOverlay" class="no-print" style="position:absolute;top:0;left:0;right:0;pointer-events:none;z-index:5"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  // Draw page-break indicators + restore tab scroll position after DOM is painted
  if (window.requestAnimationFrame) {
    requestAnimationFrame(function(){
      updatePageBreaks();
      if (state.section === 'template' && typeof initSectionSortable === 'function') initSectionSortable();
      // Restore tab scroll position so active tab stays in view
      var sc = document.getElementById('tabsScroll');
      if (sc) {
        sc.scrollLeft = _tabScrollPos;
        // Also scroll active tab into view if it's not visible
        var activeBtn = sc.querySelector('.tab-btn.active');
        if (activeBtn) activeBtn.scrollIntoView({block:'nearest', inline:'nearest'});
      }
    });
  } else {
    setTimeout(function(){
      updatePageBreaks();
      if (state.section === 'template' && typeof initSectionSortable === 'function') initSectionSortable();
      var sc = document.getElementById('tabsScroll');
      if (sc) {
        sc.scrollLeft = _tabScrollPos;
        var activeBtn = sc.querySelector('.tab-btn.active');
        if (activeBtn) activeBtn.scrollIntoView({block:'nearest', inline:'nearest'});
      }
    }, 30);
  }
}

// ============================================================
// LIVE PAGE-BREAK INDICATOR (A4 boundary lines)
// ============================================================
function updatePageBreaks() {
  var paper = document.getElementById('cvOutput');
  var overlay = document.getElementById('pageBreakOverlay');
  if (!paper || !overlay) return;

  var pxPerMm = 96 / 25.4;            // CSS reference: 96dpi
  var pageHeightPx = 297 * pxPerMm;   // A4 height in px
  var h = paper.scrollHeight;
  var pages = Math.max(1, Math.ceil(h / pageHeightPx));

  overlay.style.height = h + 'px';

  var html = '';
  for (var i = 1; i < pages; i++) {
    var top = pageHeightPx * i;
    // Dashed red line marking end of page i
    html += '<div style="position:absolute;left:0;right:0;top:'+top+'px;border-top:1.5px dashed #ef4444;height:0"></div>';
    // Floating label
    html += '<div style="position:absolute;right:8px;top:'+(top+4)+'px;background:#ef4444;color:#fff;font-size:9px;font-weight:600;padding:2px 8px;border-radius:0 0 6px 6px;font-family:Inter,sans-serif">Batas Halaman '+i+' • lewat A4</div>';
  }

  // If content fits in 1 page, show a subtle reminder line at the A4 boundary
  if (pages === 1) {
    html += '<div style="position:absolute;left:0;right:0;top:'+pageHeightPx+'px;border-top:1px dashed #cbd5e1;height:0"></div>' +
            '<div style="position:absolute;right:8px;top:'+(pageHeightPx+4)+'px;background:#94a3b8;color:#fff;font-size:9px;font-weight:600;padding:2px 8px;border-radius:0 0 6px 6px;font-family:Inter,sans-serif">Batas 1 Halaman A4</div>';
    overlay.style.height = (pageHeightPx + 30) + 'px';
  }

  overlay.innerHTML = html;
}

// ============================================================
// INITIALIZE
// ============================================================
// Load saved data from localStorage (if any)
var hadSavedData = loadSavedData();
applyTheme();
render();

// Recalculate page-break indicators on window resize
window.addEventListener('resize', function() {
  if (typeof updatePageBreaks === 'function') updatePageBreaks();
});

// Show indicator if data was restored
if (hadSavedData) {
  setTimeout(function() {
    var el = document.getElementById('saveIndicator');
    if (el) {
      el.textContent = '✅ Data sebelumnya dimuat';
      el.style.opacity = '1';
      el.style.color = '#166534';
      setTimeout(function() {
        if (el) { el.style.color = '#94a3b8'; el.style.opacity = '0.6'; el.textContent = ''; }
      }, 3000);
    }
  }, 500);
}

