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
  data: {
    personalInfo: {fullName:'',jobTitle:'',email:'',phone:'',location:'',linkedin:'',website:'',summary:''},
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
    organizations: []
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
        // Ensure all arrays exist (backward compatibility)
        if (!state.data.experiences) state.data.experiences = [];
        if (!state.data.education) state.data.education = [];
        if (!state.data.skills) state.data.skills = [];
        if (!state.data.languages) state.data.languages = [];
        if (!state.data.certifications) state.data.certifications = [];
        if (!state.data.projects) state.data.projects = [];
        if (!state.data.organizations) state.data.organizations = [];
        return true;
      }
    }
  } catch(e) { /* ignore parse errors */ }
  return false;
}

// Save current data to localStorage
function saveToStorage() {
  try {
    var toSave = { data: state.data, template: state.template, accentColor: state.accentColor, density: state.density, savedAt: new Date().toISOString() };
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
// SAMPLE DATA (Akuntan / Auditor Senior)
// ============================================================
var sampleData = {
  personalInfo: {
    fullName: 'Siti Nurhaliza Putri',
    jobTitle: 'Senior Auditor & Financial Analyst',
    email: 'siti.nurhaliza@email.com',
    phone: '+62 821-9876-5432',
    location: 'Jakarta, Indonesia',
    linkedin: 'linkedin.com/in/sitinurhaliza',
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
  ]
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
function setSection(s) { state.section = s; render(); }
function setTemplate(t) {
  state.template = t;
  state.accentColor = ''; // reset to new template's default accent
  autoSave();
  render();
}
function setAccent(color) { state.accentColor = color; autoSave(); render(); }
function setDensity(d) { state.density = d; autoSave(); render(); }
function scrollTabs(amount) {
  var el = document.getElementById('tabsScroll');
  if (el) el.scrollBy({ left: amount, behavior: 'smooth' });
}
function loadSample() { state.data = JSON.parse(JSON.stringify(sampleData)); autoSave(); render(); }
function resetData() {
  if (confirm('Yakin ingin menghapus semua data? Tindakan ini tidak bisa dibatalkan.')) {
    state.data = {personalInfo:{fullName:'',jobTitle:'',email:'',phone:'',location:'',linkedin:'',website:'',summary:''},experiences:[],education:[],skills:[],languages:[],certifications:[],projects:[],organizations:[]};
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

// PDF Export
function exportPDF() {
  var el = document.getElementById('cvOutput');
  if (!el) return;
  html2pdf().set({
    margin: 0,
    filename: 'CV_' + (state.data.personalInfo.fullName || 'document') + '.pdf',
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
  if (s === 'personal') return formPersonal();
  if (s === 'experience') return formExperience();
  if (s === 'education') return formEducation();
  if (s === 'skills') return formSkills();
  if (s === 'languages') return formLanguages();
  if (s === 'certifications') return formCertifications();
  if (s === 'projects') return formProjects();
  if (s === 'organizations') return formOrganizations();
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
  return '<div class="section-title">👤 Data Pribadi</div>' +
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
      txta('Deskripsi Tugas & Pencapaian',exp.description,"updExp("+exp.id+",'description',this.value)",'Pisahkan setiap poin dengan Enter. Gunakan format: Kata kerja aktif + tugas + hasil terukur',4,'col-full') +
      '</div>' +
      renderDocs(exp.docs || [], 'Exp', exp.id) +
      '</div>';
  });
  html += '<button class="btn-add" onclick="addExp()">+ Tambah Pengalaman Kerja</button>';
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

  // ---- TEMPLATE GRID (grouped by category) ----
  html += '<div style="margin-bottom:8px;font-size:12px;font-weight:600;color:#475569">Pilih Template</div>';
  TEMPLATE_CATEGORIES.forEach(function(cat) {
    html += '<div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;margin:12px 0 8px">'+cat+'</div>';
    html += '<div class="template-grid">';
    Object.keys(TEMPLATES).forEach(function(id) {
      var t = TEMPLATES[id];
      if (t.cat !== cat) return;
      html += '<div class="tpl-card'+(state.template===id?' active':'')+'" onclick="setTemplate(\''+id+'\')">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><div class="tpl-color" style="background:'+t.accent+'"></div><span style="font-size:15px">'+t.icon+'</span></div>' +
        '<div class="tpl-name">'+t.name+'</div><div class="tpl-desc">'+(descs[id]||'')+'</div></div>';
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
  // Template quick-buttons
  Object.keys(TEMPLATES).forEach(function(id) {
    var t = TEMPLATES[id];
    var isActive = state.template === id;
    html += '<button onclick="setTemplate(\''+id+'\')" title="'+t.name+' ('+t.cat+')" style="padding:5px 10px;border-radius:8px;font-size:11px;font-weight:'+(isActive?'600':'400')+';border:'+(isActive?'2px solid #2563eb':'1px solid #e2e8f0')+';background:'+(isActive?'#eff6ff':'#fff')+';color:'+(isActive?'#1d4ed8':'#64748b')+';cursor:pointer;transition:all 0.2s;font-family:inherit;white-space:nowrap">'+t.icon+' '+t.name+'</button>';
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
  autoSave(); // Auto-save after every data change
}

function render() {
  var tabs = [
    {id:'personal', icon:'👤', label:'Pribadi'},
    {id:'experience', icon:'💼', label:'Pengalaman'},
    {id:'education', icon:'🎓', label:'Pendidikan'},
    {id:'skills', icon:'⚡', label:'Keahlian'},
    {id:'languages', icon:'🌍', label:'Bahasa'},
    {id:'certifications', icon:'📜', label:'Sertifikasi'},
    {id:'projects', icon:'🚀', label:'Proyek'},
    {id:'organizations', icon:'🤝', label:'Organisasi'},
    {id:'import', icon:'📂', label:'Import CV'},
    {id:'review', icon:'✅', label:'Review'},
    {id:'template', icon:'🎨', label:'Template'}
  ];

  var tabsHtml = tabs.map(function(t) {
    return '<button class="tab-btn'+(state.section===t.id?' active':'')+'" onclick="setSection(\''+t.id+'\')">'+t.icon+' '+t.label+'</button>';
  }).join('');

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
          '<button class="btn btn-ghost" onclick="loadSample()">📋 Contoh Data</button>' +
          '<button class="btn btn-ghost" onclick="resetData()">🗑️ Reset</button>' +
          '<button class="btn btn-ghost" id="saveBtn" onclick="saveData()">💾 Save</button>' +
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
          // CV Paper
          '<div class="cv-paper" id="cvOutput">' + renderCV() + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

// ============================================================
// INITIALIZE
// ============================================================
// Load saved data from localStorage (if any)
var hadSavedData = loadSavedData();
render();

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
