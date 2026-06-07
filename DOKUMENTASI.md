# Dokumentasi Projek — Sistem Rapor Online

---

## 1. Tech Stack & Framework

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js** | 16.0.10 | Framework React (App Router, SSR/SSG, API Routes) |
| **React** | 19.2.1 | Library UI |
| **TypeScript** | ^5 | Bahasa pemrograman |
| **Tailwind CSS** | 3.4.19 | Styling utility-first |
| **tailwind-merge** | ^3.4.0 | Merge class Tailwind tanpa konflik |
| **clsx** | ^2.1.1 | Helper gabungkan className |
| **class-variance-authority (CVA)** | ^0.7.1 | Membuat variant komponen UI |
| **Prisma** | ^5.22.0 | ORM — akses database |
| **@prisma/client** | ^5.22.0 | Generated client Prisma |
| **SQLite** (via Prisma) | — | Database (file-based: `prisma/dev.db`) |
| **Zod** | ^4.2.1 | Validasi schema (form, input) |
| **React Hook Form** | ^7.68.0 | Form handling |
| **@hookform/resolvers** | ^5.2.2 | Integrasi Zod + React Hook Form |
| **Radix UI** | — | Primitif UI (aksesibilitas): Avatar, Dialog, Dropdown Menu, Label, Select, Slot, Toast |
| **Lucide React** | ^0.561.0 | Icon library |
| **tailwindcss-animate** | ^1.0.7 | Animasi CSS untuk Tailwind |
| **ESLint** | ^9 | Linting |
| **PostCSS** | ^8.5.6 | CSS processing |

---

## 2. Struktur Folder

```
tugasakhir/
├── app/                          # Next.js App Router (halaman & API)
│   ├── layout.tsx                # Root layout — wrapper global aplikasi
│   ├── page.tsx                  # Halaman Login (root "/")
│   ├── globals.css               # CSS global + Tailwind imports
│   ├── favicon.ico
│   │
│   ├── (dashboard)/              # Route Group (tanpa mengubah URL)
│   │   ├── layout.tsx            # Dashboard layout — proteksi via cookie session
│   │   ├── logout-button.tsx     # Komponen tombol logout
│   │   │
│   │   ├── dashboard/
│   │   │   ├── admin/            # ── Panel Admin ──
│   │   │   │   ├── page.tsx              # Dashboard admin (overview)
│   │   │   │   ├── classes/page.tsx      # Kelola data kelas
│   │   │   │   └── users/page.tsx        # Kelola data pengguna (CRUD)
│   │   │   │
│   │   │   ├── teacher/          # ── Panel Guru ──
│   │   │   │   ├── page.tsx              # Dashboard guru (overview)
│   │   │   │   ├── grade-form.tsx        # Form input nilai siswa
│   │   │   │   └── report/
│   │   │   │       ├── page.tsx          # Daftar siswa + filter
│   │   │   │       └── [studentId]/      # Laporan nilai per siswa (dynamic route)
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── student/          # ── Panel Siswa ──
│   │   │   │   ├── page.tsx              # Dashboard siswa (nilai + predikat)
│   │   │   │   └── print-button.tsx      # Trigger print rapor
│   │   │   │
│   │   │   └── parent/           # ── Panel Orang Tua ──
│   │   │       └── page.tsx              # Lihat nilai anak
│   │
│   └── api/                      # API Routes (Next.js Route Handlers)
│       ├── auth/
│       │   ├── login/route.ts    # POST — login, set session cookie
│       │   └── logout/route.ts   # POST — logout, hapus cookie
│       ├── admin/
│       │   ├── users/route.ts    # GET/POST — daftar & tambah user
│       │   ├── users/[id]/route.ts # GET/PUT/DELETE — user by ID
│       │   └── classes/route.ts  # GET/POST — daftar & tambah kelas
│       ├── teacher/
│       │   ├── grades/route.ts   # GET/POST — nilai siswa
│       │   └── students/route.ts # GET — daftar siswa (by kelas)
│       ├── parent/
│       │   └── children/route.ts # GET — data anak dari orang tua
│       └── seed/route.ts         # GET — seed data dummy ke database
│
├── components/                   # Komponen UI reusable
│   └── ui/                       # Komponen dasar (radix + CVA + Tailwind)
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── table.tsx
│
├── lib/                          # Utility & konfigurasi internal
│   ├── prisma.ts                 # Singleton instance Prisma Client
│   └── utils.ts                  # Fungsi `cn()` — merge className (clsx + twMerge)
│
├── prisma/                       # Prisma ORM
│   ├── schema.prisma             # Definisi model database
│   └── dev.db                    # SQLite database file ( runtime)
│
├── public/                       # Static assets (gambar, font, icon)
│
├── package.json                  # Dependencies & scripts
├── package-lock.json
├── tsconfig.json                 # Konfigurasi TypeScript
├── tailwind.config.ts            # Konfigurasi Tailwind CSS
├── postcss.config.js / .mjs      # Konfigurasi PostCSS
├── eslint.config.mjs             # Konfigurasi ESLint
├── next-env.d.ts
├── next.config.ts                # Konfigurasi Next.js
├── .env                          # Environment variables (DATABASE_URL, dll.)
├── .gitignore
├── .next/                        # Build output Next.js (auto-generated)
├── node_modules/                 # Dependencies (auto-generated)
├── README.md
└── READMEME.md
```

---

## 3. Arsitektur & Auth

- **Autentikasi**: Session-based via **HTTP-only cookie** (`session`). Login diverifikasi dengan query `prisma.user.findUnique` (username + password). Cookie berisi `id`, `role`, `name`, `username` — berlaku 1 minggu.
- **Proteksi route**: `app/(dashboard)/layout.tsx` membaca cookie session, redirect ke `/` jika tidak ada.
- **Role-based access**:
  - `ADMIN` → `/dashboard/admin`
  - `TEACHER` → `/dashboard/teacher`
  - `STUDENT` → `/dashboard/student`
  - `PARENT` → `/dashboard/parent`
- **Route Group** (`(dashboard)`) memisahkan layout dashboard dari halaman login tanpa mempengaruhi URL.

---

## 4. Database Schema (Prisma)

```
User ──┬── Teacher (1:1)
       ├── Student (1:1) ──┬── Grade (1:N)
       │                   └── Parent (N:M via relasi)
       └── Parent (1:1)

Class (1:N) ── Student (N:1)
           └── Teacher (N:1)

Subject (1:N) ── Grade (N:1)
```

- **Grade**: nilai per `studentId + subjectId + semester + academicYear` (unique composite).
- **User role**: `ADMIN`, `TEACHER`, `STUDENT`, `PARENT`.

---

## 5. Scripts

```bash
npm run dev      # Jalankan dev server (localhost:3000)
npm run build    # Build produksi
npm run start    # Jalankan build produksi
npm run lint     # Jalankan ESLint
```

---

## 6. Catatan

- `astro` tercantum di `dependencies` tapi tidak tampak digunakan — kemungkinan leftover/eksperimen.
- `cookie.txt` ada di root — kemungkinan berisi data testing cookies.
- Path alias `@/` mengarah ke root project (`"@/*": ["./*"]` di `tsconfig.json`).
- Database menggunakan **SQLite** (file: `prisma/dev.db`). Konfigurasi: `DATABASE_URL` di `.env`.
