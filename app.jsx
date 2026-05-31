const { useState, useCallback, useRef } = React;

// ============ DATA TEMPLATES ============
const defaultData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: ''
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: []
};

const sampleData = {
  personalInfo: {
    fullName: 'Ahmad Rizki Pratama',
    jobTitle: 'Full Stack Developer',
    email: 'ahmad.rizki@email.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    linkedin: 'linkedin.com/in/ahmadrizki',
    website: 'ahmadrizki.dev',
    summary: 'Full Stack Developer berpengalaman 5+ tahun dalam membangun aplikasi web modern menggunakan React, Node.js, dan cloud technologies. Passionate dalam menciptakan solusi digital yang scalable dan user-friendly.'
  },
  experiences: [
    {
      id: 1,
      company: 'PT Teknologi Maju',
      position: 'Senior Full Stack Developer',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: 'Memimpin tim 5 developer dalam pengembangan platform e-commerce.\nMeningkatkan performa aplikasi sebesar 40% melalui optimasi database.\nMengimplementasikan CI/CD pipeline menggunakan GitHub Actions.'
    },
    {
      id: 2,
      company: 'Startup Digital Indonesia',
      position: 'Frontend Developer',
      startDate: '2019-06',
      endDate: '2021-12',
      current: false,
      description: 'Mengembangkan UI/UX untuk aplikasi fintech dengan 100K+ pengguna.\nMigrasi codebase dari jQuery ke React, meningkatkan maintainability.\nKolaborasi dengan tim desain untuk implementasi design system.'
    }
  ],
  education: [
    {
      id: 1,
      institution: 'Universitas Indonesia',
      degree: 'S1 Teknik Informatika',
      startDate: '2015',
      endDate: '2019',
      description: 'IPK 3.75/4.00. Aktif di komunitas programming kampus.'
    }
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git', 'REST API', 'GraphQL'],
  languages: [
    { name: 'Indonesia', level: 'Native' },
    { name: 'English', level: 'Professional' }
  ],
  certifications: [
    { name: 'AWS Certified Developer Associate', year: '2023' },
    { name: 'Meta Front-End Developer Certificate', year: '2022' }
  ]
};

// ============ TEMPLATE DEFINITIONS ============
const templates = {
  modern: { name: 'Modern', color: '#2563eb', description: 'Clean & profesional' },
  classic: { name: 'Klasik', color: '#1f2937', description: 'Tradisional & formal' },
  creative: { name: 'Kreatif', color: '#7c3aed', description: 'Bold & eye-catching' },
  minimal: { name: 'Minimal', color: '#059669', description: 'Simple & elegan' }
};

// ============ HELPER FUNCTIONS ============
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return month ? `${months[parseInt(month) - 1]} ${year}` : year;
}

function generateId() {
  return Date.now() + Math.random();
}

// ============ FORM COMPONENTS ============
function PersonalInfoForm({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-3 fade-in">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap</label>
          <input type="text" value={data.fullName} onChange={e => handleChange('fullName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Nama lengkap Anda" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Jabatan / Posisi</label>
          <input type="text" value={data.jobTitle} onChange={e => handleChange('jobTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Contoh: Software Engineer" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
          <input type="email" value={data.email} onChange={e => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="email@contoh.com" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Telepon</label>
          <input type="tel" value={data.phone} onChange={e => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="+62 xxx-xxxx-xxxx" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Lokasi</label>
          <input type="text" value={data.location} onChange={e => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Kota, Negara" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn</label>
          <input type="text" value={data.linkedin} onChange={e => handleChange('linkedin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="linkedin.com/in/username" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Website / Portfolio</label>
          <input type="text" value={data.website} onChange={e => handleChange('website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="www.website.com" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Ringkasan Profil</label>
          <textarea value={data.summary} onChange={e => handleChange('summary', e.target.value)} rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" placeholder="Tuliskan ringkasan singkat tentang diri Anda..." />
        </div>
      </div>
    </div>
  );
}

function ExperienceForm({ data, onChange }) {
  const addExperience = () => {
    onChange([...data, { id: generateId(), company: '', position: '', startDate: '', endDate: '', current: false, description: '' }]);
  };

  const updateExperience = (id, field, value) => {
    onChange(data.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const removeExperience = (id) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  return (
    <div className="space-y-4 fade-in">
      {data.map((exp, index) => (
        <div key={exp.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative">
          <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg" aria-label="Hapus pengalaman">&times;</button>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Perusahaan</label>
              <input type="text" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" placeholder="Nama perusahaan" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Posisi</label>
              <input type="text" value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" placeholder="Jabatan" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mulai</label>
              <input type="month" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Selesai</label>
              <div className="flex items-center gap-2">
                <input type="month" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white disabled:opacity-50" />
              </div>
              <label className="flex items-center gap-1 mt-1 cursor-pointer">
                <input type="checkbox" checked={exp.current} onChange={e => updateExperience(exp.id, 'current', e.target.checked)} className="rounded" />
                <span className="text-xs text-gray-500">Masih bekerja</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi</label>
              <textarea value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white" placeholder="Jelaskan tanggung jawab dan pencapaian (pisahkan dengan enter)" />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addExperience} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors">
        + Tambah Pengalaman
      </button>
    </div>
  );
}

function EducationForm({ data, onChange }) {
  const addEducation = () => {
    onChange([...data, { id: generateId(), institution: '', degree: '', startDate: '', endDate: '', description: '' }]);
  };

  const updateEducation = (id, field, value) => {
    onChange(data.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  const removeEducation = (id) => {
    onChange(data.filter(edu => edu.id !== id));
  };

  return (
    <div className="space-y-4 fade-in">
      {data.map((edu) => (
        <div key={edu.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative">
          <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg" aria-label="Hapus pendidikan">&times;</button>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Institusi</label>
              <input type="text" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" placeholder="Nama universitas/sekolah" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Gelar / Jurusan</label>
              <input type="text" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" placeholder="Contoh: S1 Teknik Informatika" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tahun Mulai</label>
              <input type="text" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" placeholder="2019" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tahun Selesai</label>
              <input type="text" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" placeholder="2023" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Keterangan</label>
              <textarea value={edu.description} onChange={e => updateEducation(edu.id, 'description', e.target.value)} rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white" placeholder="IPK, prestasi, organisasi..." />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addEducation} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors">
        + Tambah Pendidikan
      </button>
    </div>
  );
}

function SkillsForm({ data, onChange }) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    if (input.trim() && !data.includes(input.trim())) {
      onChange([...data, input.trim()]);
      setInput('');
    }
  };

  const removeSkill = (skill) => {
    onChange(data.filter(s => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-3 fade-in">
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Ketik skill lalu Enter" />
        <button onClick={addSkill} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">Tambah</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.map((skill, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            {skill}
            <button onClick={() => removeSkill(skill)} className="text-blue-400 hover:text-red-500 ml-1" aria-label={`Hapus skill ${skill}`}>&times;</button>
          </span>
        ))}
      </div>
    </div>
  );
}

function LanguagesForm({ data, onChange }) {
  const addLanguage = () => {
    onChange([...data, { name: '', level: 'Intermediate' }]);
  };

  const updateLanguage = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeLanguage = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 fade-in">
      {data.map((lang, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input type="text" value={lang.name} onChange={e => updateLanguage(index, 'name', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Bahasa" />
          <select value={lang.level} onChange={e => updateLanguage(index, 'level', e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
            <option value="Native">Native</option>
            <option value="Professional">Professional</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Basic">Basic</option>
          </select>
          <button onClick={() => removeLanguage(index)} className="text-gray-400 hover:text-red-500 text-lg" aria-label="Hapus bahasa">&times;</button>
        </div>
      ))}
      <button onClick={addLanguage} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors">
        + Tambah Bahasa
      </button>
    </div>
  );
}

function CertificationsForm({ data, onChange }) {
  const addCert = () => {
    onChange([...data, { name: '', year: '' }]);
  };

  const updateCert = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeCert = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 fade-in">
      {data.map((cert, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input type="text" value={cert.name} onChange={e => updateCert(index, 'name', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Nama sertifikasi" />
          <input type="text" value={cert.year} onChange={e => updateCert(index, 'year', e.target.value)}
            className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Tahun" />
          <button onClick={() => removeCert(index)} className="text-gray-400 hover:text-red-500 text-lg" aria-label="Hapus sertifikasi">&times;</button>
        </div>
      ))}
      <button onClick={addCert} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors">
        + Tambah Sertifikasi
      </button>
    </div>
  );
}


// ============ CV PREVIEW TEMPLATES ============
function ModernTemplate({ data }) {
  const { personalInfo, experiences, education, skills, languages, certifications } = data;
  return (
    <div className="cv-preview p-8 bg-white font-inter">
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-4 mb-5">
        <h1 className="text-2xl font-bold text-gray-900">{personalInfo.fullName || 'Nama Anda'}</h1>
        <p className="text-blue-600 font-medium mt-1">{personalInfo.jobTitle || 'Jabatan Anda'}</p>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
          {personalInfo.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Ringkasan Profil</h2>
          <p className="text-gray-700 text-xs leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Pengalaman Kerja</h2>
          {experiences.map(exp => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-600 text-xs">{exp.company}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDate(exp.startDate)} - {exp.current ? 'Sekarang' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.description && (
                <ul className="mt-1 space-y-0.5">
                  {exp.description.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i} className="text-xs text-gray-700 flex items-start gap-1">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Pendidikan</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600 text-xs">{edu.institution}</p>
                </div>
                <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
              </div>
              {edu.description && <p className="text-xs text-gray-600 mt-0.5">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Keahlian</h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, i) => (
              <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Languages & Certifications */}
      <div className="grid grid-cols-2 gap-4">
        {languages.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Bahasa</h2>
            {languages.map((lang, i) => (
              <p key={i} className="text-xs text-gray-700">{lang.name} — <span className="text-gray-500">{lang.level}</span></p>
            ))}
          </div>
        )}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Sertifikasi</h2>
            {certifications.map((cert, i) => (
              <p key={i} className="text-xs text-gray-700">{cert.name} <span className="text-gray-500">({cert.year})</span></p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ClassicTemplate({ data }) {
  const { personalInfo, experiences, education, skills, languages, certifications } = data;
  return (
    <div className="cv-preview p-8 bg-white font-inter">
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-4 mb-5">
        <h1 className="text-2xl font-bold text-gray-900 font-playfair">{personalInfo.fullName || 'Nama Anda'}</h1>
        <p className="text-gray-600 mt-1">{personalInfo.jobTitle || 'Jabatan Anda'}</p>
        <div className="flex justify-center flex-wrap gap-3 mt-2 text-xs text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.location && <span>| {personalInfo.location}</span>}
        </div>
        <div className="flex justify-center flex-wrap gap-3 mt-1 text-xs text-gray-500">
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>| {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-1 mb-2">Ringkasan Profil</h2>
          <p className="text-gray-700 text-xs leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-1 mb-3">Pengalaman Kerja</h2>
          {experiences.map(exp => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <span className="text-xs text-gray-500 italic">
                  {formatDate(exp.startDate)} - {exp.current ? 'Sekarang' : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-gray-600 text-xs italic">{exp.company}</p>
              {exp.description && (
                <ul className="mt-1 space-y-0.5 list-disc list-inside">
                  {exp.description.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i} className="text-xs text-gray-700">{line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-1 mb-3">Pendidikan</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between">
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-gray-600 text-xs italic">{edu.institution}</p>
              {edu.description && <p className="text-xs text-gray-600 mt-0.5">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-1 mb-2">Keahlian</h2>
          <p className="text-xs text-gray-700">{skills.join(' • ')}</p>
        </div>
      )}

      {/* Languages & Certifications */}
      <div className="grid grid-cols-2 gap-4">
        {languages.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-1 mb-2">Bahasa</h2>
            {languages.map((lang, i) => (
              <p key={i} className="text-xs text-gray-700">{lang.name} — {lang.level}</p>
            ))}
          </div>
        )}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-1 mb-2">Sertifikasi</h2>
            {certifications.map((cert, i) => (
              <p key={i} className="text-xs text-gray-700">{cert.name} ({cert.year})</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CreativeTemplate({ data }) {
  const { personalInfo, experiences, education, skills, languages, certifications } = data;
  return (
    <div className="cv-preview bg-white font-inter flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-purple-700 text-white p-6">
        <div className="mb-6">
          <div className="w-20 h-20 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold">
            {personalInfo.fullName ? personalInfo.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'CV'}
          </div>
          <h1 className="text-lg font-bold text-center">{personalInfo.fullName || 'Nama Anda'}</h1>
          <p className="text-purple-200 text-xs text-center mt-1">{personalInfo.jobTitle || 'Jabatan'}</p>
        </div>

        {/* Contact */}
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-purple-200">Kontak</h2>
          <div className="space-y-1 text-xs">
            {personalInfo.email && <p>📧 {personalInfo.email}</p>}
            {personalInfo.phone && <p>📱 {personalInfo.phone}</p>}
            {personalInfo.location && <p>📍 {personalInfo.location}</p>}
            {personalInfo.linkedin && <p>🔗 {personalInfo.linkedin}</p>}
            {personalInfo.website && <p>🌐 {personalInfo.website}</p>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-purple-200">Keahlian</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, i) => (
                <span key={i} className="px-2 py-0.5 bg-purple-600 rounded text-xs">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-purple-200">Bahasa</h2>
            {languages.map((lang, i) => (
              <p key={i} className="text-xs">{lang.name} — {lang.level}</p>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-purple-200">Sertifikasi</h2>
            {certifications.map((cert, i) => (
              <p key={i} className="text-xs mb-1">{cert.name} ({cert.year})</p>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-5">
            <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-2">Tentang Saya</h2>
            <p className="text-gray-700 text-xs leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-5">
            <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-3">Pengalaman</h2>
            {experiences.map(exp => (
              <div key={exp.id} className="mb-3 pl-3 border-l-2 border-purple-200">
                <h3 className="font-semibold text-gray-900 text-xs">{exp.position}</h3>
                <p className="text-purple-600 text-xs">{exp.company}</p>
                <p className="text-xs text-gray-400">
                  {formatDate(exp.startDate)} - {exp.current ? 'Sekarang' : formatDate(exp.endDate)}
                </p>
                {exp.description && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.description.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i} className="text-xs text-gray-700">• {line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-3">Pendidikan</h2>
            {education.map(edu => (
              <div key={edu.id} className="mb-2 pl-3 border-l-2 border-purple-200">
                <h3 className="font-semibold text-gray-900 text-xs">{edu.degree}</h3>
                <p className="text-purple-600 text-xs">{edu.institution}</p>
                <p className="text-xs text-gray-400">{edu.startDate} - {edu.endDate}</p>
                {edu.description && <p className="text-xs text-gray-600 mt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MinimalTemplate({ data }) {
  const { personalInfo, experiences, education, skills, languages, certifications } = data;
  return (
    <div className="cv-preview p-8 bg-white font-inter">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-light text-gray-900">{personalInfo.fullName || 'Nama Anda'}</h1>
        <p className="text-emerald-600 text-sm mt-0.5">{personalInfo.jobTitle || 'Jabatan Anda'}</p>
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-5">
          <p className="text-gray-600 text-xs leading-relaxed border-l-2 border-emerald-400 pl-3">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-medium text-emerald-600 uppercase tracking-widest mb-3">Pengalaman</h2>
          {experiences.map(exp => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-gray-900 text-xs">{exp.position} <span className="font-normal text-gray-500">di {exp.company}</span></h3>
                <span className="text-xs text-gray-400">
                  {formatDate(exp.startDate)} — {exp.current ? 'Sekarang' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.description && (
                <ul className="mt-1 space-y-0.5">
                  {exp.description.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i} className="text-xs text-gray-600 pl-2">— {line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-medium text-emerald-600 uppercase tracking-widest mb-3">Pendidikan</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-gray-900 text-xs">{edu.degree} <span className="font-normal text-gray-500">— {edu.institution}</span></h3>
                <span className="text-xs text-gray-400">{edu.startDate} — {edu.endDate}</span>
              </div>
              {edu.description && <p className="text-xs text-gray-500 pl-2 mt-0.5">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-medium text-emerald-600 uppercase tracking-widest mb-2">Keahlian</h2>
          <p className="text-xs text-gray-600">{skills.join(', ')}</p>
        </div>
      )}

      {/* Bottom row */}
      <div className="flex gap-8">
        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-medium text-emerald-600 uppercase tracking-widest mb-1">Bahasa</h2>
            {languages.map((lang, i) => (
              <p key={i} className="text-xs text-gray-600">{lang.name} ({lang.level})</p>
            ))}
          </div>
        )}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-medium text-emerald-600 uppercase tracking-widest mb-1">Sertifikasi</h2>
            {certifications.map((cert, i) => (
              <p key={i} className="text-xs text-gray-600">{cert.name}, {cert.year}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// ============ MAIN APP COMPONENT ============
function App() {
  const [cvData, setCvData] = useState(defaultData);
  const [activeSection, setActiveSection] = useState('personal');
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [showPreview, setShowPreview] = useState(false);
  const cvRef = useRef(null);

  const sections = [
    { id: 'personal', label: 'Data Pribadi', icon: '👤' },
    { id: 'experience', label: 'Pengalaman', icon: '💼' },
    { id: 'education', label: 'Pendidikan', icon: '🎓' },
    { id: 'skills', label: 'Keahlian', icon: '⚡' },
    { id: 'languages', label: 'Bahasa', icon: '🌍' },
    { id: 'certifications', label: 'Sertifikasi', icon: '📜' },
    { id: 'template', label: 'Template', icon: '🎨' },
  ];

  const loadSample = () => {
    setCvData(sampleData);
  };

  const resetData = () => {
    if (confirm('Yakin ingin menghapus semua data?')) {
      setCvData(defaultData);
    }
  };

  const exportPDF = () => {
    const element = cvRef.current;
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `CV_${cvData.personalInfo.fullName || 'document'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const renderTemplate = () => {
    const props = { data: cvData };
    switch (activeTemplate) {
      case 'modern': return <ModernTemplate {...props} />;
      case 'classic': return <ClassicTemplate {...props} />;
      case 'creative': return <CreativeTemplate {...props} />;
      case 'minimal': return <MinimalTemplate {...props} />;
      default: return <ModernTemplate {...props} />;
    }
  };

  const renderForm = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoForm data={cvData.personalInfo} onChange={val => setCvData({ ...cvData, personalInfo: val })} />;
      case 'experience':
        return <ExperienceForm data={cvData.experiences} onChange={val => setCvData({ ...cvData, experiences: val })} />;
      case 'education':
        return <EducationForm data={cvData.education} onChange={val => setCvData({ ...cvData, education: val })} />;
      case 'skills':
        return <SkillsForm data={cvData.skills} onChange={val => setCvData({ ...cvData, skills: val })} />;
      case 'languages':
        return <LanguagesForm data={cvData.languages} onChange={val => setCvData({ ...cvData, languages: val })} />;
      case 'certifications':
        return <CertificationsForm data={cvData.certifications} onChange={val => setCvData({ ...cvData, certifications: val })} />;
      case 'template':
        return (
          <div className="grid grid-cols-2 gap-3 fade-in">
            {Object.entries(templates).map(([key, tmpl]) => (
              <button key={key} onClick={() => setActiveTemplate(key)}
                className={`template-card p-4 rounded-xl border-2 text-left transition-all ${activeTemplate === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="w-8 h-8 rounded-lg mb-2" style={{ backgroundColor: tmpl.color }}></div>
                <p className="font-medium text-sm text-gray-900">{tmpl.name}</p>
                <p className="text-xs text-gray-500">{tmpl.description}</p>
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 no-print">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">CV Builder</h1>
            <span className="text-xs text-gray-400 hidden sm:inline">Pembuat CV Otomatis</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadSample} className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              📋 Contoh Data
            </button>
            <button onClick={resetData} className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              🗑️ Reset
            </button>
            <button onClick={() => setShowPreview(!showPreview)} className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors sm:hidden">
              {showPreview ? '✏️ Edit' : '👁️ Preview'}
            </button>
            <button onClick={exportPDF} className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              📥 Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row h-[calc(100vh-57px)]">
        {/* Left Panel - Form */}
        <div className={`w-full sm:w-[420px] bg-white border-r border-gray-200 flex flex-col no-print ${showPreview ? 'hidden sm:flex' : 'flex'}`}>
          {/* Section Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-100 px-2 py-2 gap-1 shrink-0">
            {sections.map(section => (
              <button key={section.id} onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  activeSection === section.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}>
                <span>{section.icon}</span>
                <span className="hidden md:inline">{section.label}</span>
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-4 sidebar-scroll">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              {sections.find(s => s.id === activeSection)?.icon} {sections.find(s => s.id === activeSection)?.label}
            </h2>
            {renderForm()}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className={`flex-1 overflow-y-auto bg-gray-200 p-4 sm:p-8 ${showPreview ? 'block' : 'hidden sm:block'}`}>
          <div className="max-w-[210mm] mx-auto shadow-xl" ref={cvRef}>
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ RENDER ============
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
