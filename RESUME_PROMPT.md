# CV Builder Pro — Resume Prompt untuk Sesi Berikutnya

## URL Proyek
- GitHub Repo: https://github.com/amartha242001-lang/cv-builder
- Live Web: https://amartha242001-lang.github.io/cv-builder/

## Status File (per sesi ini berakhir)
- `app.js`, `templates.js`, `style.css`, `features.js`, `features2.js`, `index.html`
- Semua di-push ke branch `main` via git di folder lokal:
  `C:\Users\PC\Downloads\Web Pembuat CV otomatis\cv-builder-github\`

## Bug yang MASIH PERLU DIFIX

### 1. BUG KRITIS: Duplicate `margins` di state (line 22-23 app.js)
```js
// SAAT INI (SALAH - duplikat):
  margins: { top: 20, bottom: 20, left: 22, right: 22 },
  margins: { top: 20, bottom: 20, left: 22, right: 22 }, // page margins in mm
// FIX: hapus baris pertama, tinggalkan yang kedua saja
```

### 2. BUG: Tombol rata kiri/tengah/kanan/justify di tab PRIBADI tidak work
- Di Pengalaman/Pendidikan sudah work
- Di Pribadi (richTxta summary): alignment tidak ter-apply ke preview
- Penyebab: `updPNoRender` dipanggil tapi fungsi sudah ada (line ~335), 
  cek apakah `alignCenter` parameter di `tplRichText` override alignment state

### 3. FITUR MARGIN: UI sudah ditambahkan di formTemplate() tapi belum push bersih
- `setMargin()` dan `applyMargins()` sudah ada di app.js
- Perlu verifikasi margin UI muncul di tab Desain
- PDF export sudah pakai `state.margins` untuk margin

## Cara Fix Cepat (token minimal)

### Fix Bug 1 (duplicate margins) — 1 file edit:
Di `app.js` hapus line 22 yang duplikat, tinggalkan line 23.

### Fix Bug 2 (alignment Pribadi) — 1 file edit:
Di `templates.js` baris ~613, pastikan summary menggunakan:
```js
html += tplRichText(p.summary, p.textAlign||(alignCenter?'center':'left'), p.listType);
```
Bukan `esc(p.summary)`.

### Cara push ke GitHub:
```
git -C "cv-builder-github" add -A
git -C "cv-builder-github" -c user.email="amartha242001@users.noreply.github.com" -c user.name="amartha242001-lang" commit -m "fix"
git -C "cv-builder-github" push origin main
```
(Jalankan dari folder `Web Pembuat CV otomatis`)

## Fitur yang SUDAH BEKERJA
- 12 template CV, warna, spasi, font picker
- B/I/U formatting di kotak deskripsi Pengalaman & Pendidikan
- Font size picker (A↕) di bar atas
- Alignment di Pengalaman/Pendidikan 
- Cover letter dengan pengirim independen
- Upload foto, QR code, tanda tangan
- Auto-save localStorage
- Section drag & drop reorder
- Job matcher, review, import/export JSON
- AI Enhance, kamus kata kerja
- Multi CV slot, dark mode
- Download PDF
