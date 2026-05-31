# Sistem Informasi Nilai dan Rapor Online

Web-based Online Report Card System built with Next.js, Tailwind CSS, and Prisma.

## Mengapa Teknologi Ini Dipilih? (Tech Stack Decisions)

Berikut adalah penjelasan mengapa teknologi-teknologi tertentu dipilih untuk membangun proyek ini:

### 1. Kenapa TypeScript?
*   **Keamanan Tipe Data**: TypeScript membantu menangkap error bugs (seperti typo nama variabel atau ases properti null) saat penulisan kode (compile time), bukan saat aplikasi dijalankan user (runtime).
*   **Produktivitas Developer**: Fitur *Intellisense* dan *Autocomplete* yang sangat akurat mempercepat koding dan memudahkan navigasi codebase.
*   **Maintainability**: Kode lebih mudah dibaca dan didokumentasikan secara otomatis melalui definisi tipe, memudahkan pengembangan jangka panjang.

### 2. Kenapa Next.js (sebagai Fullstack/Backend)?
*   **Unified Architecture**: Next.js memungkinkan kita membangun Frontend (React) dan Backend (API Routes/Server Actions) dalam satu proyek yang sama. Tidak perlu mengelola dua repositori atau server terpisah.
*   **Server Side Rendering & Server Components**: Memungkinkan pengambilan data langsung di server untuk performa yang lebih cepat dan SEO yang lebih baik.
*   **Routing Mudah**: Menggunakan *File-system based routing* yang intuitif untuk membuat halaman dan API endpoint.

### 3. Kenapa Prisma (daripada Raw SQL/MySQL driver)?
*   **Type-Safety End-to-End**: Prisma men-generate tipe TypeScript berdasarkan skema database Anda. Jika tabel di database berubah, kode TypeScript akan otomatis error di bagian yang perlu diperbaiki, mencegah bug fatal.
*   **Kemudahan Penggunaan**: Query data menggunakan Prisma Client jauh lebih mudah dibaca dan ditulis daripada raw SQL (contoh: `db.user.findMany()` vs `SELECT * FROM users`).
*   **Abstraksi Database**: Saat ini proyek menggunakan **SQLite** untuk kemudahan development (portable). Dengan Prisma, kita bisa mengganti database ke **MySQL** atau **PostgreSQL** di masa depan hanya dengan mengubah 1 baris config, tanpa merombak semua kode query.

### 4. Kenapa Tailwind CSS?
*   **Kecepatan Development**: Styling dilakukan langsung di file HTML/JSX menggunakan utility classes, tidak perlu berpindah-pindah ke file `.css`.
*   **Konsistensi Desain**: Menggunakan sistem skala predefined untuk spacing, warna, dan tipografi, menjaga tampilan tetap rapi.
*   **Performa**: Tailwind secara otomatis membuang style yang tidak terpakai saat build (tree-shaking), menghasilkan file CSS yang sangat kecil.

### 5. Kenapa Menggunakan Semua Stack Ini Secara Bersamaan?
Kombinasi **TypeScript + Next.js + Prisma + Tailwind** memberikan sinergi terbaik untuk pengembangan web modern:
*   **End-to-End Type Safety**: Data dari database (Prisma) memiliki tipe yang pasti, yang diteruskan ke Backend (Next.js), lalu dikonsumsi Frontend. Kita tahu persis struktur data di setiap langkah.
*   **Efisiensi**: Setup proyek minimal, performa runtime maksimal, dan pengalaman developer yang sangat menyenangkan (DX).

---

## Features
- **Admin**: Menambahkan data Users, Kelas, dan Mata Pelajaran.
- **Teacher**: Input Nilai siswa.
- **Student/Parent**: Melihat dan Cetak Rapor.
- **Modern UI**: Desain responsif, bersih, dan interaktif.

## Getting Started

### Prerequisites
-   Node.js 18+ installed.

### Installation

1.  **Clone repository**
2.  **Install dependencies**:
    ```bash
    npm install
    # or
    pnpm install
    ```
3.  **Setup Database**:
    Pastikan file `.env` sudah ada. Jika belum, buat file `.env` dan isi dengan:
    ```env
    DATABASE_URL="file:./dev.db"
    ```
    Lalu jalankan migrasi database:
    ```bash
    npx prisma db push
    # or
    npx prisma migrate dev
    ```
4.  **Jalankan Project**:
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000).

5.  **Seed Database (Optional)**:
    Untuk mengisi data awal (user admin/guru/siswa default), akses URL berikut di browser saat server menyala:
    [http://localhost:3000/api/seed](http://localhost:3000/api/seed)

### Akun Default (Setelah Seed)

| Role | Username | Password |
|---|---|---|
| **Admin** | `admin` | `admin123` |
| **Teacher** | `guru` | `guru123` |
| **Student** | `siswa` | `siswa123` |
# TA-pak-firman
