# Sistem Informasi Nilai dan Rapor Online

Web-based Online Report Card System built with Next.js, Tailwind CSS, and Prisma (SQLite).

## Features
- **Admin**: Manage Users, Classes, Subjects.
- **Teacher**: Input Grades for students.
- **Student/Parent**: View and Print Report Cards.
- **Modern UI**: Clean, responsive design.

## Tech Stack
-   **Framework**: Next.js 14+ (App Router)
-   **Styling**: Tailwind CSS + Shadcn Elements
-   **Database**: SQLite (via Prisma)
-   **Auth**: Simple Cookie-based Session

## Getting Started

### Prerequisites
-   Node.js 18+ installed.

### Installation

1.  Clone the repository (or download source).
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Initialize Configuration:
    *Note: The project uses Tailwind v3 configuration.*
    ```bash
    # Ensure .env exists
    echo 'DATABASE_URL="file:./dev.db"' > .env
    ```
4.  Setup Database:
    ```bash
    npx prisma db push
    npx prisma generate
    ```
5.  Seed Database (Create default users):
    Start the server first, then visit the seed URL.
    ```bash
    npm run dev
    ```
    Open browser to: [http://localhost:3000/api/seed](http://localhost:3000/api/seed)
    *You should see `{"success":true,"message":"Database seeded"}`*

### Usage Login Credentials (Default)

| Role | Username | Password |
|Data | Value | Value |
|---|---|---|
| **Admin** | `admin` | `admin123` |
| **Teacher** | `guru` | `guru123` |
| **Student** | `siswa` | `siswa123` |

### Pages
-   **Landing**: `http://localhost:3000` (Login)
-   **Admin**: `http://localhost:3000/dashboard/admin`
-   **Teacher**: `http://localhost:3000/dashboard/teacher`
-   **Student**: `http://localhost:3000/dashboard/student`
