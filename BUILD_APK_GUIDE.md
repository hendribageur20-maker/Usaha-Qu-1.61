# Panduan Push ke GitHub & Build APK Android Otomatis (Bengkel Qu 1.60)

Proyek ini telah dikonfigurasi lengkap dengan **Capacitor Android** dan **GitHub Actions Workflow** di:  
📁 `.github/workflows/build-apk.yml`

Repositori Git lokal juga **sudah diinisialisasi dan di-commit** (branch `main`). Anda tinggal menghubungkan ke URL repository GitHub Anda dan melakukan push.

---

## 🚀 Langkah 1: Hubungkan & Push ke GitHub

Jika Anda sudah membuat repository baru di GitHub (misalnya `https://github.com/username/bengkelqu-app`):

Jalankan perintah berikut di terminal Anda:

```bash
# 1. Tambahkan remote repository GitHub Anda (ganti URL dengan repository milik Anda)
git remote add origin https://github.com/USERNAME/NAMA-REPO-ANDA.git

# 2. Push seluruh kode dan alur workflow ke GitHub
git push -u origin main
```

*(Jika repository di GitHub Anda sudah memiliki commit awal seperti README/license bawaan GitHub, gunakan `git push -u origin main --force`)*.

---

## ⚡ Langkah 2: Proses Build APK Otomatis di GitHub Actions

Setelah Anda melakukan `git push`:

1. Buka halaman repositori Anda di **GitHub**.
2. Klik tab **Actions** di bilah menu atas.
3. Anda akan melihat alur kerja **"Build & Package Android APK"** sedang berjalan secara otomatis 🟡.
4. GitHub Actions akan:
   - Menyiapkan environment Node.js 22 & JDK 21
   - Mengompilasi web assets (`npm run build`)
   - Menyinkronkan Capacitor platform Android (`npx cap sync android`)
   - Menjalankan Gradle (`./gradlew assembleDebug`)
   - Mengemas file APK ke dalam artifact

> **Catatan:** Anda juga dapat memicu build kapan saja secara manual melalui tab **Actions** -> pilih **Build Android APK (Bengkel Qu 1.60)** -> klik tombol **Run workflow**.

---

## 📲 Langkah 3: Unduh File APK Hasil Kompilasi

1. Tunggu proses build selesai hingga muncul tanda centang hijau **Passed** (biasanya 2–4 menit).
2. Klik pada judul run yang baru saja selesai.
3. Gulir ke bagian paling bawah ke bagian **Artifacts**.
4. Klik **BengkelQu-1.60-APK** untuk mengunduh file zip yang berisi:
   - 📦 `BengkelQu-1.60.apk`
5. Ekstrak zip dan kirim file `.apk` ke ponsel Android Anda via WhatsApp, Telegram, Google Drive, atau kabel USB, lalu pasang (*Install*).

---

## 📋 Ringkasan File & Konfigurasi

- **Workflow GitHub**: `.github/workflows/build-apk.yml`
- **Konfigurasi Capacitor**: `capacitor.config.json` (App ID: `com.bengkelqu.app`, Nama: `Bengkel Qu`)
- **Folder Android Native**: `/android/` (termasuk AndroidManifest.xml, Gradle wrapper, dan res icons/splash)
