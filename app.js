/**
 * CV Builder Pro - ATS-Friendly Resume Builder
 * Pure Vanilla JS, no framework dependencies
 * Designed for GitHub Pages static hosting
 */

// ============================================================
// STATE MANAGEMENT
// ============================================================
var state = {
  section: 'personal',
  template: 'ats-clean',
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
function setTemplate(t) { state.template = t; render(); }
function scrollTabs(amount) {
  var el = document.getElementById('tabsScroll');
  if (el) el.scrollBy({ left: amount, behavior: 'smooth' });
}
function loadSample() { state.data = JSON.parse(JSON.stringify(sampleData)); render(); }
function resetData() {
  if (confirm('Yakin ingin menghapus semua data? Tindakan ini tidak bisa dibatalkan.')) {
    state.data = {personalInfo:{fullName:'',jobTitle:'',email:'',phone:'',location:'',linkedin:'',website:'',summary:''},experiences:[],education:[],skills:[],languages:[],certifications:[],projects:[],organizations:[]};
    render();
  }
}

// Personal
function updateP(field, val) { state.data.personalInfo[field] = val; renderPreview(); }

// Experience
function addExp() { state.data.experiences.push({id:gid(),company:'',position:'',startDate:'',endDate:'',current:false,description:''}); render(); }
function updExp(id,f,v) { var e=state.data.experiences.find(function(x){return x.id==id;}); if(e){e[f]=v; renderPreview();} }
function rmExp(id) { state.data.experiences=state.data.experiences.filter(function(x){return x.id!=id;}); render(); }

// Education
function addEdu() { state.data.education.push({id:gid(),institution:'',degree:'',startDate:'',endDate:'',description:''}); render(); }
function updEdu(id,f,v) { var e=state.data.education.find(function(x){return x.id==id;}); if(e){e[f]=v; renderPreview();} }
function rmEdu(id) { state.data.education=state.data.education.filter(function(x){return x.id!=id;}); render(); }

// Skills
function addSkill() { var inp=document.getElementById('skillInp'); var v=inp?inp.value.trim():''; if(v&&state.data.skills.indexOf(v)===-1){state.data.skills.push(v);render();} }
function rmSkill(i) { state.data.skills.splice(i,1); render(); }
function skillKey(e) { if(e.key==='Enter'){e.preventDefault();addSkill();} }

// Languages
function addLang() { state.data.languages.push({name:'',level:'Menengah'}); render(); }
function updLang(i,f,v) { state.data.languages[i][f]=v; renderPreview(); }
function rmLang(i) { state.data.languages.splice(i,1); render(); }

// Certifications
function addCert() { state.data.certifications.push({name:'',issuer:'',date:'',link:''}); render(); }
function updCert(i,f,v) { state.data.certifications[i][f]=v; renderPreview(); }
function rmCert(i) { state.data.certifications.splice(i,1); render(); }

// Projects
function addProj() { state.data.projects.push({id:gid(),name:'',description:'',role:'',link:''}); render(); }
function updProj(id,f,v) { var e=state.data.projects.find(function(x){return x.id==id;}); if(e){e[f]=v; renderPreview();} }
function rmProj(id) { state.data.projects=state.data.projects.filter(function(x){return x.id!=id;}); render(); }

// Organizations
function addOrg() { state.data.organizations.push({id:gid(),name:'',role:'',description:''}); render(); }
function updOrg(id,f,v) { var e=state.data.organizations.find(function(x){return x.id==id;}); if(e){e[f]=v; renderPreview();} }
function rmOrg(id) { state.data.organizations=state.data.organizations.filter(function(x){return x.id!=id;}); render(); }

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
      '</div></div>';
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
      '</div></div>';
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
      inp('Link Kredensial (opsional)','text',c.link,"updCert("+i+",'link',this.value)",'https://...','col-full') +
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
      '</div></div>';
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
      '</div></div>';
  });
  html += '<button class="btn-add" onclick="addOrg()">+ Tambah Organisasi</button>';
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
  var ts = [
    {id:'ats-clean', name:'ATS Standard', color:'#1e3a5f', desc:'Minimalis, teks rata kiri, optimal ATS', icon:'📄'},
    {id:'modern-clean', name:'Modern Minimalis', color:'#2563eb', desc:'Centered, background bar elegan', icon:'✨'},
    {id:'executive-split', name:'Executive Two-Column', color:'#0f766e', desc:'Split layout, sidebar info pribadi', icon:'📊'},
    {id:'modern-blue', name:'Modern Blue', color:'#3b82f6', desc:'Profesional dengan aksen biru', icon:'💎'},
    {id:'executive', name:'Executive Formal', color:'#1f2937', desc:'Serif font, formal & elegan', icon:'🏛️'},
    {id:'minimal-green', name:'Minimal Green', color:'#059669', desc:'Bersih, ringkas, aksen hijau', icon:'🌿'}
  ];
  var html = '<div class="section-title">🎨 Pilih Desain Template</div>' +
    '<p style="font-size:12px;color:#64748b;margin-bottom:14px">Pilih template yang sesuai dengan industri dan posisi target Anda. Data form tidak akan berubah saat mengganti template.</p>' +
    '<div class="template-grid">';
  ts.forEach(function(t) {
    html += '<div class="tpl-card'+(state.template===t.id?' active':'')+'" onclick="setTemplate(\''+t.id+'\')">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><div class="tpl-color" style="background:'+t.color+'"></div><span style="font-size:16px">'+t.icon+'</span></div>' +
      '<div class="tpl-name">'+t.name+'</div><div class="tpl-desc">'+t.desc+'</div></div>';
  });
  html += '</div>';
  html += atsTip('Template', 'Template "ATS Standard" menggunakan format single-column tanpa tabel atau grafik — paling aman untuk lolos parsing ATS. "Executive Two-Column" cocok untuk melamar langsung ke recruiter/headhunter. "Modern Minimalis" ideal untuk industri kreatif dan teknologi.');
  return html;
}

function atsTip(context, tip) {
  return '<div class="ats-tip"><div class="ats-tip-title">💡 Tips ATS — '+context+'</div>'+tip+'</div>';
}

// ============================================================
// CV PREVIEW RENDERERS
// ============================================================
function renderCV() {
  if (state.template === 'ats-clean') return cvATSClean();
  if (state.template === 'modern-clean') return cvModernClean();
  if (state.template === 'executive-split') return cvExecutiveSplit();
  if (state.template === 'modern-blue') return cvModernBlue();
  if (state.template === 'executive') return cvExecutive();
  if (state.template === 'minimal-green') return cvMinimalGreen();
  return cvATSClean();
}

function makeBullets(desc) {
  if (!desc) return '';
  var lines = desc.split('\n').filter(function(l){return l.trim();});
  if (!lines.length) return '';
  return '<ul class="cv-bullets">' + lines.map(function(l){return '<li>'+esc(l)+'</li>';}).join('') + '</ul>';
}

// --- TEMPLATE: MODERN CLEAN (Centered, background bar headers) ---
function cvModernClean() {
  var p=state.data.personalInfo, ex=state.data.experiences, ed=state.data.education,
      sk=state.data.skills, la=state.data.languages, ce=state.data.certifications,
      pr=state.data.projects, og=state.data.organizations;

  var secHead = function(title) {
    return '<div style="margin-bottom:10px;margin-top:18px"><div style="background:#f1f5f9;border-left:3px solid #2563eb;padding:6px 12px;font-size:10.5pt;font-weight:700;color:#1e3a5f;text-transform:uppercase;letter-spacing:0.8px">'+title+'</div></div>';
  };

  var html = '<div class="cv-preview" style="font-family:Calibri,Arial,sans-serif">';

  // Header - Centered
  html += '<div style="text-align:center;padding-bottom:16px;margin-bottom:4px;border-bottom:2px solid #2563eb">';
  html += '<h1 style="font-size:24pt;font-weight:700;color:#111;margin-bottom:4px">'+(p.fullName||'Nama Lengkap Anda')+'</h1>';
  if (p.jobTitle) html += '<div style="font-size:11.5pt;color:#2563eb;font-weight:600;margin-bottom:8px">'+esc(p.jobTitle)+'</div>';
  html += '<div style="font-size:9.5pt;color:#4b5563;display:flex;justify-content:center;flex-wrap:wrap;gap:6px">';
  var contacts = [];
  if (p.email) contacts.push('<span>'+esc(p.email)+'</span>');
  if (p.phone) contacts.push('<span>'+esc(p.phone)+'</span>');
  if (p.location) contacts.push('<span>'+esc(p.location)+'</span>');
  if (p.linkedin) contacts.push('<span>'+esc(p.linkedin)+'</span>');
  if (p.website) contacts.push('<span>'+esc(p.website)+'</span>');
  html += contacts.join('<span style="color:#cbd5e1;margin:0 4px">|</span>');
  html += '</div></div>';

  // Summary
  if (p.summary) {
    html += secHead('Ringkasan Profesional');
    html += '<p style="font-size:10pt;color:#374151;line-height:1.65;text-align:center;padding:0 16px">'+esc(p.summary)+'</p>';
  }

  // Experience
  if (ex.length) {
    html += secHead('Pengalaman Kerja');
    ex.forEach(function(e) {
      html += '<div class="cv-entry"><div class="cv-entry-header"><h3 style="font-size:10.5pt;font-weight:600">'+esc(e.position)+'</h3><span class="cv-entry-date" style="font-size:9pt;color:#6b7280">'+fmtDate(e.startDate)+' — '+(e.current?'Sekarang':fmtDate(e.endDate))+'</span></div>';
      html += '<div style="font-size:9.5pt;color:#2563eb;font-weight:500">'+esc(e.company)+'</div>';
      html += makeBullets(e.description) + '</div>';
    });
  }

  // Education
  if (ed.length) {
    html += secHead('Pendidikan');
    ed.forEach(function(e) {
      html += '<div class="cv-entry"><div class="cv-entry-header"><h3 style="font-size:10.5pt;font-weight:600">'+esc(e.degree)+'</h3><span class="cv-entry-date" style="font-size:9pt">'+esc(e.startDate)+' — '+esc(e.endDate)+'</span></div>';
      html += '<div style="font-size:9.5pt;color:#2563eb;font-weight:500">'+esc(e.institution)+'</div>';
      if (e.description) html += '<div style="font-size:9.5pt;color:#4b5563;margin-top:2px">'+esc(e.description)+'</div>';
      html += '</div>';
    });
  }

  // Skills
  if (sk.length) {
    html += secHead('Keahlian');
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">';
    sk.forEach(function(s) { html += '<span style="padding:3px 10px;background:#eff6ff;color:#1e40af;border-radius:4px;font-size:9.5pt;border:1px solid #dbeafe">'+esc(s)+'</span>'; });
    html += '</div>';
  }

  // Certifications
  if (ce.length) {
    html += secHead('Sertifikasi & Lisensi');
    ce.forEach(function(c) {
      html += '<div style="margin-bottom:4px;font-size:10pt;text-align:center"><strong>'+esc(c.name)+'</strong>';
      if (c.issuer) html += ' — '+esc(c.issuer);
      if (c.date) html += ' ('+esc(c.date)+')';
      html += '</div>';
    });
  }

  // Projects
  if (pr.length) {
    html += secHead('Proyek');
    pr.forEach(function(proj) {
      html += '<div class="cv-entry"><h3 style="font-size:10.5pt">'+esc(proj.name)+(proj.role?' — <span style="font-weight:400;font-style:italic">'+esc(proj.role)+'</span>':'')+'</h3>';
      if (proj.description) html += '<div style="font-size:10pt;color:#374151;margin-top:2px">'+esc(proj.description)+'</div>';
      html += '</div>';
    });
  }

  // Organizations
  if (og.length) {
    html += secHead('Organisasi');
    og.forEach(function(o) {
      html += '<div class="cv-entry"><h3 style="font-size:10.5pt">'+esc(o.name)+(o.role?' — <span style="font-weight:400;font-style:italic">'+esc(o.role)+'</span>':'')+'</h3>';
      if (o.description) html += '<div style="font-size:10pt;color:#374151;margin-top:2px">'+esc(o.description)+'</div>';
      html += '</div>';
    });
  }

  // Languages
  if (la.length) {
    html += secHead('Bahasa');
    html += '<div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap">';
    la.forEach(function(l) { html += '<span style="font-size:10pt;color:#374151">'+esc(l.name)+' <span style="color:#6b7280">('+esc(l.level)+')</span></span>'; });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

// --- TEMPLATE: EXECUTIVE SPLIT (Two-Column Layout) ---
function cvExecutiveSplit() {
  var p=state.data.personalInfo, ex=state.data.experiences, ed=state.data.education,
      sk=state.data.skills, la=state.data.languages, ce=state.data.certifications,
      pr=state.data.projects, og=state.data.organizations;

  var sideHead = function(title) {
    return '<div style="font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0f766e;margin-bottom:8px;margin-top:16px;padding-bottom:4px;border-bottom:1px solid #d1d5db">'+title+'</div>';
  };
  var mainHead = function(title) {
    return '<div style="margin-bottom:10px;margin-top:18px"><h2 style="font-size:11pt;font-weight:700;color:#0f766e;text-transform:uppercase;letter-spacing:0.5px;padding-bottom:4px;border-bottom:1.5px solid #0f766e;margin:0">'+title+'</h2></div>';
  };

  var html = '<div class="cv-preview" style="font-family:Calibri,Arial,sans-serif;display:flex;min-height:297mm;padding:0">';

  // === LEFT SIDEBAR ===
  html += '<div style="width:34%;background:#f8fffe;border-right:1px solid #e2e8f0;padding:24px 18px">';

  // Name & Title in sidebar
  html += '<div style="margin-bottom:16px;padding-bottom:14px;border-bottom:2px solid #0f766e">';
  html += '<h1 style="font-size:16pt;font-weight:700;color:#111;line-height:1.2;margin:0">'+(p.fullName||'Nama Anda')+'</h1>';
  if (p.jobTitle) html += '<div style="font-size:10pt;color:#0f766e;font-weight:600;margin-top:4px">'+esc(p.jobTitle)+'</div>';
  html += '</div>';

  // Contact
  html += sideHead('Kontak');
  html += '<div style="font-size:9pt;color:#374151;line-height:1.8">';
  if (p.email) html += '<div>&#9993; '+esc(p.email)+'</div>';
  if (p.phone) html += '<div>&#9742; '+esc(p.phone)+'</div>';
  if (p.location) html += '<div>&#9673; '+esc(p.location)+'</div>';
  if (p.linkedin) html += '<div>&#9741; '+esc(p.linkedin)+'</div>';
  if (p.website) html += '<div>&#9788; '+esc(p.website)+'</div>';
  html += '</div>';

  // Skills as tags
  if (sk.length) {
    html += sideHead('Keahlian');
    html += '<div style="display:flex;flex-wrap:wrap;gap:4px">';
    sk.forEach(function(s) {
      html += '<span style="display:inline-block;padding:3px 8px;background:#ccfbf1;color:#0f766e;border-radius:4px;font-size:8.5pt;font-weight:500;border:1px solid #99f6e4">'+esc(s)+'</span>';
    });
    html += '</div>';
  }

  // Languages
  if (la.length) {
    html += sideHead('Bahasa');
    la.forEach(function(l) {
      html += '<div style="font-size:9pt;color:#374151;margin-bottom:4px"><strong>'+esc(l.name)+'</strong> <span style="color:#6b7280">— '+esc(l.level)+'</span></div>';
    });
  }

  // Certifications
  if (ce.length) {
    html += sideHead('Sertifikasi');
    ce.forEach(function(c) {
      html += '<div style="font-size:9pt;color:#374151;margin-bottom:6px"><strong>'+esc(c.name)+'</strong>';
      if (c.issuer) html += '<br><span style="color:#6b7280;font-size:8.5pt">'+esc(c.issuer)+(c.date?', '+esc(c.date):'')+'</span>';
      html += '</div>';
    });
  }

  // Organizations (sidebar)
  if (og.length) {
    html += sideHead('Organisasi');
    og.forEach(function(o) {
      html += '<div style="font-size:9pt;color:#374151;margin-bottom:6px"><strong>'+esc(o.name)+'</strong>';
      if (o.role) html += '<br><span style="color:#6b7280;font-size:8.5pt">'+esc(o.role)+'</span>';
      html += '</div>';
    });
  }

  html += '</div>'; // end sidebar

  // === RIGHT MAIN CONTENT ===
  html += '<div style="width:66%;padding:24px 22px">';

  // Summary
  if (p.summary) {
    html += mainHead('Ringkasan Profesional');
    html += '<p style="font-size:10pt;color:#374151;line-height:1.65">'+esc(p.summary)+'</p>';
  }

  // Experience
  if (ex.length) {
    html += mainHead('Pengalaman Kerja');
    ex.forEach(function(e) {
      html += '<div class="cv-entry"><div class="cv-entry-header"><h3 style="font-size:10.5pt;font-weight:600;color:#111">'+esc(e.position)+'</h3><span class="cv-entry-date" style="font-size:9pt;color:#6b7280">'+fmtDate(e.startDate)+' — '+(e.current?'Sekarang':fmtDate(e.endDate))+'</span></div>';
      html += '<div style="font-size:9.5pt;color:#0f766e;font-weight:500">'+esc(e.company)+'</div>';
      html += makeBullets(e.description) + '</div>';
    });
  }

  // Education
  if (ed.length) {
    html += mainHead('Pendidikan');
    ed.forEach(function(e) {
      html += '<div class="cv-entry"><div class="cv-entry-header"><h3 style="font-size:10.5pt;font-weight:600">'+esc(e.degree)+'</h3><span class="cv-entry-date" style="font-size:9pt">'+esc(e.startDate)+' — '+esc(e.endDate)+'</span></div>';
      html += '<div style="font-size:9.5pt;color:#0f766e;font-weight:500">'+esc(e.institution)+'</div>';
      if (e.description) html += '<div style="font-size:9.5pt;color:#4b5563;margin-top:2px">'+esc(e.description)+'</div>';
      html += '</div>';
    });
  }

  // Projects
  if (pr.length) {
    html += mainHead('Proyek');
    pr.forEach(function(proj) {
      html += '<div class="cv-entry"><h3 style="font-size:10.5pt;font-weight:600">'+esc(proj.name)+(proj.role?' — <span style="font-weight:400;font-style:italic;color:#6b7280">'+esc(proj.role)+'</span>':'')+'</h3>';
      if (proj.description) html += '<div style="font-size:10pt;color:#374151;margin-top:2px">'+esc(proj.description)+'</div>';
      html += '</div>';
    });
  }

  html += '</div>'; // end main content
  html += '</div>'; // end flex container
  return html;
}


// --- TEMPLATE 1: ATS CLEAN (Optimal for ATS) ---
function cvATSClean() {
  var p=state.data.personalInfo, ex=state.data.experiences, ed=state.data.education,
      sk=state.data.skills, la=state.data.languages, ce=state.data.certifications,
      pr=state.data.projects, og=state.data.organizations;

  var html = '<div class="cv-preview" style="font-family:Calibri,Arial,sans-serif">';

  // Header
  html += '<div style="margin-bottom:14px">';
  html += '<h1 style="font-size:22pt;color:#111">'+(p.fullName||'Nama Lengkap Anda')+'</h1>';
  if (p.jobTitle) html += '<div style="font-size:11pt;color:#1e3a5f;font-weight:600;margin-top:2px">'+esc(p.jobTitle)+'</div>';
  html += '<div class="cv-contact" style="margin-top:6px">';
  var contacts = [];
  if (p.email) contacts.push(esc(p.email));
  if (p.phone) contacts.push(esc(p.phone));
  if (p.location) contacts.push(esc(p.location));
  if (p.linkedin) contacts.push(esc(p.linkedin));
  if (p.website) contacts.push(esc(p.website));
  html += contacts.join(' &nbsp;|&nbsp; ');
  html += '</div></div>';

  // Summary
  if (p.summary) {
    html += '<div class="cv-section"><h2 style="border-color:#1e3a5f;color:#1e3a5f">Ringkasan Profesional</h2>';
    html += '<p style="font-size:10pt;color:#374151;line-height:1.6">'+esc(p.summary)+'</p></div>';
  }

  // Experience
  if (ex.length) {
    html += '<div class="cv-section"><h2 style="border-color:#1e3a5f;color:#1e3a5f">Pengalaman Kerja</h2>';
    ex.forEach(function(e) {
      html += '<div class="cv-entry"><div class="cv-entry-header"><h3>'+esc(e.position)+'</h3><span class="cv-entry-date">'+fmtDate(e.startDate)+' — '+(e.current?'Sekarang':fmtDate(e.endDate))+'</span></div>';
      html += '<div class="cv-entry-sub">'+esc(e.company)+'</div>';
      html += makeBullets(e.description) + '</div>';
    });
    html += '</div>';
  }

  // Education
  if (ed.length) {
    html += '<div class="cv-section"><h2 style="border-color:#1e3a5f;color:#1e3a5f">Pendidikan</h2>';
    ed.forEach(function(e) {
      html += '<div class="cv-entry"><div class="cv-entry-header"><h3>'+esc(e.degree)+'</h3><span class="cv-entry-date">'+esc(e.startDate)+' — '+esc(e.endDate)+'</span></div>';
      html += '<div class="cv-entry-sub">'+esc(e.institution)+'</div>';
      if (e.description) html += '<div style="font-size:9.5pt;color:#4b5563;margin-top:2px">'+esc(e.description)+'</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  // Skills
  if (sk.length) {
    html += '<div class="cv-section"><h2 style="border-color:#1e3a5f;color:#1e3a5f">Keahlian</h2>';
    html += '<div class="cv-skills-list">'+sk.map(esc).join(' &nbsp;&bull;&nbsp; ')+'</div></div>';
  }

  // Certifications
  if (ce.length) {
    html += '<div class="cv-section"><h2 style="border-color:#1e3a5f;color:#1e3a5f">Sertifikasi & Lisensi</h2>';
    ce.forEach(function(c) {
      html += '<div style="margin-bottom:4px;font-size:10pt"><strong>'+esc(c.name)+'</strong>';
      if (c.issuer) html += ' — '+esc(c.issuer);
      if (c.date) html += ' ('+esc(c.date)+')';
      html += '</div>';
    });
    html += '</div>';
  }

  // Projects
  if (pr.length) {
    html += '<div class="cv-section"><h2 style="border-color:#1e3a5f;color:#1e3a5f">Proyek</h2>';
    pr.forEach(function(proj) {
      html += '<div class="cv-entry"><h3>'+esc(proj.name)+(proj.role?' — <span style="font-weight:400;font-style:italic">'+esc(proj.role)+'</span>':'')+'</h3>';
      if (proj.description) html += '<div style="font-size:10pt;color:#374151;margin-top:2px">'+esc(proj.description)+'</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  // Organizations
  if (og.length) {
    html += '<div class="cv-section"><h2 style="border-color:#1e3a5f;color:#1e3a5f">Organisasi & Kegiatan</h2>';
    og.forEach(function(o) {
      html += '<div class="cv-entry"><h3>'+esc(o.name)+(o.role?' — <span style="font-weight:400;font-style:italic">'+esc(o.role)+'</span>':'')+'</h3>';
      if (o.description) html += '<div style="font-size:10pt;color:#374151;margin-top:2px">'+esc(o.description)+'</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  // Languages
  if (la.length) {
    html += '<div class="cv-section"><h2 style="border-color:#1e3a5f;color:#1e3a5f">Bahasa</h2>';
    la.forEach(function(l) { html += '<div class="cv-lang-row">'+esc(l.name)+' — '+esc(l.level)+'</div>'; });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

// --- TEMPLATE 2: MODERN BLUE ---
function cvModernBlue() {
  var p=state.data.personalInfo, ex=state.data.experiences, ed=state.data.education,
      sk=state.data.skills, la=state.data.languages, ce=state.data.certifications,
      pr=state.data.projects, og=state.data.organizations;

  var html = '<div class="cv-preview" style="font-family:Calibri,Arial,sans-serif">';
  html += '<div style="border-bottom:3px solid #2563eb;padding-bottom:14px;margin-bottom:16px">';
  html += '<h1 style="color:#111">'+(p.fullName||'Nama Lengkap Anda')+'</h1>';
  if (p.jobTitle) html += '<div style="font-size:12pt;color:#2563eb;font-weight:600;margin-top:3px">'+esc(p.jobTitle)+'</div>';
  html += '<div class="cv-contact" style="margin-top:6px">';
  var c2=[];if(p.email)c2.push(esc(p.email));if(p.phone)c2.push(esc(p.phone));if(p.location)c2.push(esc(p.location));if(p.linkedin)c2.push(esc(p.linkedin));
  html += c2.join(' &nbsp;|&nbsp; ')+'</div></div>';

  if(p.summary) html+='<div class="cv-section"><h2 style="border-color:#2563eb;color:#2563eb">Profil</h2><p style="font-size:10pt;color:#374151;line-height:1.6">'+esc(p.summary)+'</p></div>';
  if(ex.length){html+='<div class="cv-section"><h2 style="border-color:#2563eb;color:#2563eb">Pengalaman</h2>';ex.forEach(function(e){html+='<div class="cv-entry"><div class="cv-entry-header"><h3>'+esc(e.position)+'</h3><span class="cv-entry-date">'+fmtDate(e.startDate)+' — '+(e.current?'Sekarang':fmtDate(e.endDate))+'</span></div><div class="cv-entry-sub">'+esc(e.company)+'</div>'+makeBullets(e.description)+'</div>';});html+='</div>';}
  if(ed.length){html+='<div class="cv-section"><h2 style="border-color:#2563eb;color:#2563eb">Pendidikan</h2>';ed.forEach(function(e){html+='<div class="cv-entry"><div class="cv-entry-header"><h3>'+esc(e.degree)+'</h3><span class="cv-entry-date">'+esc(e.startDate)+' — '+esc(e.endDate)+'</span></div><div class="cv-entry-sub">'+esc(e.institution)+'</div>'+(e.description?'<div style="font-size:9.5pt;color:#4b5563;margin-top:2px">'+esc(e.description)+'</div>':'')+'</div>';});html+='</div>';}
  if(sk.length) html+='<div class="cv-section"><h2 style="border-color:#2563eb;color:#2563eb">Keahlian</h2><div style="display:flex;flex-wrap:wrap;gap:6px">'+sk.map(function(s){return '<span style="padding:2px 10px;background:#eff6ff;color:#1d4ed8;border-radius:4px;font-size:9.5pt">'+esc(s)+'</span>';}).join('')+'</div></div>';
  if(ce.length){html+='<div class="cv-section"><h2 style="border-color:#2563eb;color:#2563eb">Sertifikasi</h2>';ce.forEach(function(c){html+='<div style="margin-bottom:4px;font-size:10pt"><strong>'+esc(c.name)+'</strong>'+(c.issuer?' — '+esc(c.issuer):'')+(c.date?' ('+esc(c.date)+')':'')+'</div>';});html+='</div>';}
  if(pr.length){html+='<div class="cv-section"><h2 style="border-color:#2563eb;color:#2563eb">Proyek</h2>';pr.forEach(function(proj){html+='<div class="cv-entry"><h3>'+esc(proj.name)+(proj.role?' — <span style="font-weight:400;font-style:italic">'+esc(proj.role)+'</span>':'')+'</h3>'+(proj.description?'<div style="font-size:10pt;color:#374151;margin-top:2px">'+esc(proj.description)+'</div>':'')+'</div>';});html+='</div>';}
  if(og.length){html+='<div class="cv-section"><h2 style="border-color:#2563eb;color:#2563eb">Organisasi</h2>';og.forEach(function(o){html+='<div class="cv-entry"><h3>'+esc(o.name)+(o.role?' — <span style="font-weight:400;font-style:italic">'+esc(o.role)+'</span>':'')+'</h3>'+(o.description?'<div style="font-size:10pt;color:#374151;margin-top:2px">'+esc(o.description)+'</div>':'')+'</div>';});html+='</div>';}
  if(la.length){html+='<div class="cv-section"><h2 style="border-color:#2563eb;color:#2563eb">Bahasa</h2>';la.forEach(function(l){html+='<div class="cv-lang-row">'+esc(l.name)+' — '+esc(l.level)+'</div>';});html+='</div>';}
  html+='</div>';
  return html;
}

// --- TEMPLATE 3: EXECUTIVE ---
function cvExecutive() {
  var p=state.data.personalInfo, ex=state.data.experiences, ed=state.data.education,
      sk=state.data.skills, la=state.data.languages, ce=state.data.certifications,
      pr=state.data.projects, og=state.data.organizations;

  var html = '<div class="cv-preview" style="font-family:\'Times New Roman\',Georgia,serif">';
  html += '<div style="text-align:center;border-bottom:2px solid #1f2937;padding-bottom:14px;margin-bottom:16px">';
  html += '<h1 style="font-size:24pt;font-weight:700;color:#1f2937;letter-spacing:1px">'+(p.fullName||'NAMA LENGKAP').toUpperCase()+'</h1>';
  if(p.jobTitle) html+='<div style="font-size:11pt;color:#4b5563;margin-top:4px;letter-spacing:0.5px">'+esc(p.jobTitle)+'</div>';
  html+='<div class="cv-contact" style="margin-top:8px;justify-content:center;display:flex;flex-wrap:wrap;gap:8px">';
  var c3=[];if(p.email)c3.push(esc(p.email));if(p.phone)c3.push(esc(p.phone));if(p.location)c3.push(esc(p.location));if(p.linkedin)c3.push(esc(p.linkedin));
  html+=c3.join(' &nbsp;&bull;&nbsp; ')+'</div></div>';

  if(p.summary) html+='<div class="cv-section"><h2 style="border-color:#1f2937;color:#1f2937;text-align:center;border-bottom:1px solid #d1d5db">RINGKASAN EKSEKUTIF</h2><p style="font-size:10.5pt;color:#374151;line-height:1.7;text-align:justify">'+esc(p.summary)+'</p></div>';
  if(ex.length){html+='<div class="cv-section"><h2 style="border-color:#1f2937;color:#1f2937">PENGALAMAN PROFESIONAL</h2>';ex.forEach(function(e){html+='<div class="cv-entry"><div class="cv-entry-header"><h3 style="font-size:11pt">'+esc(e.position)+'</h3><span class="cv-entry-date">'+fmtDate(e.startDate)+' — '+(e.current?'Sekarang':fmtDate(e.endDate))+'</span></div><div class="cv-entry-sub" style="font-size:10pt">'+esc(e.company)+'</div>'+makeBullets(e.description)+'</div>';});html+='</div>';}
  if(ed.length){html+='<div class="cv-section"><h2 style="border-color:#1f2937;color:#1f2937">PENDIDIKAN</h2>';ed.forEach(function(e){html+='<div class="cv-entry"><div class="cv-entry-header"><h3>'+esc(e.degree)+'</h3><span class="cv-entry-date">'+esc(e.startDate)+' — '+esc(e.endDate)+'</span></div><div class="cv-entry-sub">'+esc(e.institution)+'</div>'+(e.description?'<div style="font-size:10pt;color:#4b5563;margin-top:2px">'+esc(e.description)+'</div>':'')+'</div>';});html+='</div>';}
  if(sk.length) html+='<div class="cv-section"><h2 style="border-color:#1f2937;color:#1f2937">KOMPETENSI INTI</h2><div style="font-size:10pt;color:#374151;columns:2;column-gap:24px">'+sk.map(function(s){return '<div style="margin-bottom:3px">&bull; '+esc(s)+'</div>';}).join('')+'</div></div>';
  if(ce.length){html+='<div class="cv-section"><h2 style="border-color:#1f2937;color:#1f2937">SERTIFIKASI PROFESIONAL</h2>';ce.forEach(function(c){html+='<div style="margin-bottom:4px;font-size:10pt"><strong>'+esc(c.name)+'</strong>'+(c.issuer?' — '+esc(c.issuer):'')+(c.date?' ('+esc(c.date)+')':'')+'</div>';});html+='</div>';}
  if(pr.length){html+='<div class="cv-section"><h2 style="border-color:#1f2937;color:#1f2937">PROYEK UNGGULAN</h2>';pr.forEach(function(proj){html+='<div class="cv-entry"><h3>'+esc(proj.name)+(proj.role?' — '+esc(proj.role):'')+'</h3>'+(proj.description?'<div style="font-size:10pt;color:#374151;margin-top:2px">'+esc(proj.description)+'</div>':'')+'</div>';});html+='</div>';}
  if(og.length){html+='<div class="cv-section"><h2 style="border-color:#1f2937;color:#1f2937">KEANGGOTAAN & ORGANISASI</h2>';og.forEach(function(o){html+='<div class="cv-entry"><h3>'+esc(o.name)+(o.role?' — '+esc(o.role):'')+'</h3>'+(o.description?'<div style="font-size:10pt;color:#374151;margin-top:2px">'+esc(o.description)+'</div>':'')+'</div>';});html+='</div>';}
  if(la.length){html+='<div class="cv-section"><h2 style="border-color:#1f2937;color:#1f2937">BAHASA</h2>';la.forEach(function(l){html+='<div class="cv-lang-row">'+esc(l.name)+' — '+esc(l.level)+'</div>';});html+='</div>';}
  html+='</div>';
  return html;
}

// --- TEMPLATE 4: MINIMAL GREEN ---
function cvMinimalGreen() {
  var p=state.data.personalInfo, ex=state.data.experiences, ed=state.data.education,
      sk=state.data.skills, la=state.data.languages, ce=state.data.certifications,
      pr=state.data.projects, og=state.data.organizations;

  var html = '<div class="cv-preview" style="font-family:Calibri,Arial,sans-serif">';
  html += '<div style="margin-bottom:18px"><h1 style="font-weight:300;color:#111;font-size:24pt">'+(p.fullName||'Nama Anda')+'</h1>';
  if(p.jobTitle) html+='<div style="color:#059669;font-size:11pt;font-weight:500;margin-top:2px">'+esc(p.jobTitle)+'</div>';
  html+='<div class="cv-contact" style="margin-top:6px">';
  var c4=[];if(p.email)c4.push(esc(p.email));if(p.phone)c4.push(esc(p.phone));if(p.location)c4.push(esc(p.location));if(p.linkedin)c4.push(esc(p.linkedin));
  html+=c4.join(' &nbsp;|&nbsp; ')+'</div></div>';

  if(p.summary) html+='<div class="cv-section"><div style="border-left:3px solid #34d399;padding-left:12px;font-size:10pt;color:#4b5563;line-height:1.6">'+esc(p.summary)+'</div></div>';
  if(ex.length){html+='<div class="cv-section"><h2 style="border-color:#059669;color:#059669;font-size:10pt;letter-spacing:1.5px">PENGALAMAN</h2>';ex.forEach(function(e){html+='<div class="cv-entry"><div class="cv-entry-header"><h3 style="font-size:10.5pt">'+esc(e.position)+' <span style="font-weight:400;color:#6b7280">di '+esc(e.company)+'</span></h3><span class="cv-entry-date">'+fmtDate(e.startDate)+' — '+(e.current?'Sekarang':fmtDate(e.endDate))+'</span></div>'+makeBullets(e.description)+'</div>';});html+='</div>';}
  if(ed.length){html+='<div class="cv-section"><h2 style="border-color:#059669;color:#059669;font-size:10pt;letter-spacing:1.5px">PENDIDIKAN</h2>';ed.forEach(function(e){html+='<div class="cv-entry"><div class="cv-entry-header"><h3 style="font-size:10.5pt">'+esc(e.degree)+' <span style="font-weight:400;color:#6b7280">— '+esc(e.institution)+'</span></h3><span class="cv-entry-date">'+esc(e.startDate)+' — '+esc(e.endDate)+'</span></div>'+(e.description?'<div style="font-size:9.5pt;color:#6b7280;margin-top:2px">'+esc(e.description)+'</div>':'')+'</div>';});html+='</div>';}
  if(sk.length) html+='<div class="cv-section"><h2 style="border-color:#059669;color:#059669;font-size:10pt;letter-spacing:1.5px">KEAHLIAN</h2><div style="font-size:10pt;color:#374151">'+sk.map(esc).join(', ')+'</div></div>';
  if(ce.length){html+='<div class="cv-section"><h2 style="border-color:#059669;color:#059669;font-size:10pt;letter-spacing:1.5px">SERTIFIKASI</h2>';ce.forEach(function(c){html+='<div style="margin-bottom:3px;font-size:10pt">'+esc(c.name)+(c.issuer?' — '+esc(c.issuer):'')+(c.date?' ('+esc(c.date)+')':'')+'</div>';});html+='</div>';}
  if(pr.length){html+='<div class="cv-section"><h2 style="border-color:#059669;color:#059669;font-size:10pt;letter-spacing:1.5px">PROYEK</h2>';pr.forEach(function(proj){html+='<div class="cv-entry"><h3 style="font-size:10.5pt">'+esc(proj.name)+(proj.role?' <span style="font-weight:400;color:#6b7280">— '+esc(proj.role)+'</span>':'')+'</h3>'+(proj.description?'<div style="font-size:10pt;color:#374151;margin-top:2px">'+esc(proj.description)+'</div>':'')+'</div>';});html+='</div>';}
  if(og.length){html+='<div class="cv-section"><h2 style="border-color:#059669;color:#059669;font-size:10pt;letter-spacing:1.5px">ORGANISASI</h2>';og.forEach(function(o){html+='<div class="cv-entry"><h3 style="font-size:10.5pt">'+esc(o.name)+(o.role?' <span style="font-weight:400;color:#6b7280">— '+esc(o.role)+'</span>':'')+'</h3>'+(o.description?'<div style="font-size:10pt;color:#374151;margin-top:2px">'+esc(o.description)+'</div>':'')+'</div>';});html+='</div>';}
  if(la.length){html+='<div class="cv-section"><h2 style="border-color:#059669;color:#059669;font-size:10pt;letter-spacing:1.5px">BAHASA</h2>';la.forEach(function(l){html+='<div class="cv-lang-row">'+esc(l.name)+' ('+esc(l.level)+')</div>';});html+='</div>';}
  html+='</div>';
  return html;
}

// ============================================================
// TEMPLATE SELECTOR (Dashboard above preview)
// ============================================================
function tplSelectorBtns() {
  var ts = [
    {id:'ats-clean', label:'ATS Standard'},
    {id:'modern-clean', label:'Modern Minimalis'},
    {id:'executive-split', label:'Executive Two-Column'},
    {id:'modern-blue', label:'Modern Blue'},
    {id:'executive', label:'Executive Formal'},
    {id:'minimal-green', label:'Minimal Green'}
  ];
  return ts.map(function(t) {
    var isActive = state.template === t.id;
    return '<button onclick="setTemplate(\''+t.id+'\')" style="padding:5px 12px;border-radius:8px;font-size:11px;font-weight:'+(isActive?'600':'400')+';border:'+(isActive?'2px solid #2563eb':'1px solid #e2e8f0')+';background:'+(isActive?'#eff6ff':'#fff')+';color:'+(isActive?'#1d4ed8':'#64748b')+';cursor:pointer;transition:all 0.2s;font-family:inherit">'+t.label+'</button>';
  }).join('');
}

// ============================================================
// MAIN RENDER FUNCTION
// ============================================================
function renderPreview() {
  var el = document.getElementById('cvOutput');
  if (el) el.innerHTML = renderCV();
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
          '<div class="tpl-selector no-print" style="margin-bottom:16px;padding:12px 16px;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
            '<span style="font-size:11px;font-weight:600;color:#64748b;margin-right:4px">🎨 Template:</span>' +
            tplSelectorBtns() +
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
render();
