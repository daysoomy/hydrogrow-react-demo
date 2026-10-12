# HydroGrow — React Dashboard Demo

Dashboard **simulasi** HydroGrow untuk Business Plan Competition (BPC). Dibangun menggunakan React, Vite, Recharts, dan Lucide icons. Fokus pada MVP **IoT Monitoring Kit** untuk pemantauan pH, EC/TDS dan suhu air pada instalasi hidroponik yang sudah ada.

## Fitur

- UI premium, responsif: login, sidebar, KPI, grafik, status perangkat, notifikasi, laporan, pengaturan.
- Login demo; **bukan autentikasi yang aman** atau login produksi.
- Data **dummy/simulasi** berubah otomatis setiap **4 detik**; dapat dijeda/dilanjutkan.
- Pemilihan **3 tandon** dengan riwayat masing-masing.
- Ambang batas parameter dapat diubah untuk mendemonstrasikan peringatan.
- Ekspor data riwayat per tandon ke CSV.
- Menggunakan nilai *contoh*, **tidak terhubung sensor maupun internet/cloud aktual**.
- Tidak ada pemberian pupuk otomatis, tidak ada tindakan fisik terhadap instalasi.

## Jalankan di komputer

Memerlukan Node.js 20.19+ / 22.12+ dan npm.

```bash
npm install
npm run dev
```

Buka tautan dari terminal, umumnya http://localhost:5173.

## Akun login demo

- Email: `demo@hydrogrow.id`
- Password: `demo123`

**Perhatian:** kredensial disimpan di source code client-side untuk demo saja. Tidak ada database dan tidak ada keamanan autentikasi. Jangan dipakai untuk data nyata.

## Build sebelum deploy

```bash
npm run build
npm run preview
```

## Upload ke GitHub

1. Buat repo baru, mis. `hydrogrow-react-dashboard`.
2. Upload file proyek (jangan sertakan folder `node_modules` atau `dist`).
3. Atau gunakan Git:

```bash
git init
git add .
git commit -m "Create HydroGrow React dashboard demo"
git branch -M main
git remote add origin https://github.com/USERNAME/hydrogrow-react-dashboard.git
git push -u origin main
```

Ganti `USERNAME` sesuai akun GitHub.

## Deploy ke Vercel (opsi paling mudah)

1. Masuk ke https://vercel.com menggunakan GitHub.
2. Klik Add New → Project, pilih repo HydroGrow.
3. Framework `Vite` (biasanya terdeteksi otomatis).
4. Build command `npm run build`, output directory `dist`.
5. Deploy. Bagikan tautannya ke juri.

## Deploy ke GitHub Pages

Workflow deploy otomatis tersedia di `.github/workflows/deploy.yml`.

1. Di repo GitHub, buka Settings → Pages.
2. Pada Build and deployment, pilih **GitHub Actions**.
3. Push kode ke cabang `main` dan tunggu tab Actions selesai.
4. Akses `https://USERNAME.github.io/hydrogrow-react-dashboard/`.

> Catatan: Vite memakai `base: './'` agar aset bisa dijalankan dari sub-path GitHub Pages. Tautan di atas merupakan pola URL, bukan URL proyek yang sudah diterbitkan.

## Struktur proyek

```text
hydrogrow-react-demo/
├── .github/workflows/deploy.yml
├── public/
│   ├── logo.png
│   └── mascot.png
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── vite.config.js
├── package.json
└── README.md
```
