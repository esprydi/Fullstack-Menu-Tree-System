# Fullstack Menu Tree System

Sebuah sistem manajemen menu berarsitektur *fullstack* yang komprehensif. Aplikasi ini memungkinkan pengguna untuk membuat, membaca, memperbarui, menghapus, serta mengatur ulang susunan item menu bersarang (*nested*) secara interaktif menggunakan fitur *drag-and-drop*. Dibangun dengan standar skala *enterprise*.

🎥 **Video Demo:** [Tonton Demo Aplikasi](https://jam.dev/c/672b7a3e-c4ae-4053-8248-68db1b2748c9)

---

## 🛠️ Pilihan Teknologi & Keputusan Arsitektur

Proyek ini dibangun menggunakan arsitektur *full-stack* modern yang berfokus pada keamanan tipe (*type safety*), modularitas, dan skalabilitas:

- **Frontend:** Next.js (App Router), React, Tailwind CSS.
  - *Alasan:* Next.js menyediakan kemampuan *routing* dan rendering sisi server yang tangguh. Tailwind CSS memastikan pengembangan UI yang cepat dan responsif. Penggunaan Context API yang dikombinasikan dengan `react-hot-toast` memberikan manajemen *state* global dan respons antarmuka (UX) yang optimal tanpa kerumitan Redux.
- **Backend:** NestJS, TypeScript.
  - *Alasan:* NestJS menyediakan struktur arsitektur berstandar *enterprise* (*Controllers, Services, Modules*). Framework ini sangat memanfaatkan *decorators* dan menerapkan arsitektur berlapis yang ketat, sehingga kode sangat mudah dipelihara.
  - *Error Handling:* Mengimplementasikan `Global Exception Filter` kustom untuk menstandarkan semua respons error API dalam format JSON yang seragam dan rapi.
  - *Validasi:* Memanfaatkan `class-validator` dan `ValidationPipe` untuk validasi beban data (*payload*) secara ketat saat *runtime*.
- **Database & ORM:** PostgreSQL, TypeORM.
  - *Alasan:* PostgreSQL adalah basis data relasional yang sangat kuat. Pola `@Tree('closure-table')` pada TypeORM secara khusus dirancang untuk menangani data hierarkis bersarang yang dalam. Ini memungkinkan pencarian kedalaman (depth querying) dengan efisiensi O(1) dan mencegah masalah kueri rekursif (N+1 query problem).
- **Infrastruktur:** Docker & Docker Compose.
  - *Alasan:* Memastikan konsistensi lingkungan antara *development* (pengembangan) dan *production* (produksi). Ini membungkus basis data, backend, dan frontend ke dalam satu jaringan yang mudah direproduksi.

---

## ⚙️ Panduan Setup (Instalasi)

### Kebutuhan Sistem (Prerequisites)
- [Node.js](https://nodejs.org/en/) (v18 atau lebih tinggi)
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop)
- PostgreSQL (Jika ingin menjalankan secara lokal tanpa Docker)

### 1. Kloning Repositori
```bash
git clone <url-repositori-anda>
cd fullstack-menu-tree-system
```

### 2. Konfigurasi Environment Variables (.env)
Untuk menjaga kerahasiaan URL sensitif dan kredensial basis data, Anda harus mengatur variabel *environment*:

**Backend (`backend/`):**
```bash
cd backend
cp .env.example .env
# Edit file .env dan sesuaikan dengan kredensial basis data Anda
```

**Frontend (`frontend/`):**
```bash
cd frontend
cp .env.local.example .env.local
# Edit file .env.local dan konfigurasikan NEXT_PUBLIC_API_URL
```

---

## 💻 Cara Menjalankan Mode Development (Pengembangan)

Mode pengembangan sangat ideal untuk melakukan perubahan kode karena mengaktifkan fitur *Hot-Reloading* (perubahan instan) untuk frontend dan backend.

**Terminal 1 (Database & Backend):**
```bash
cd backend
npm install
# Jalankan Postgres menggunakan Docker (Opsional, atau gunakan Postgres lokal)
docker compose up menu_tree_db -d 
# Jalankan server backend
npm run start:dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```
- Frontend akan berjalan di `http://localhost:3000`
- Backend API akan berjalan di `http://localhost:3001` (atau port yang Anda atur di `.env`)

---

## 🚀 Cara Menjalankan Mode Production (Produksi)

Mode *Production* memastikan bahwa seluruh kode dikompilasi dan dioptimasi untuk performa maksimal.

**Backend:**
```bash
cd backend
npm install
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
npm start
```

---

## 🐳 Cara Menjalankan Menggunakan Docker (Bonus)

Untuk menjalankan seluruh ekosistem aplikasi (Basis Data + Backend + Frontend) dalam *container* yang terisolasi, Anda hanya perlu menjalankan satu perintah:

1. Pastikan Docker Desktop sudah menyala.
2. Dari direktori akar (root) proyek, jalankan:
```bash
# Melakukan build dan menjalankan semua container di latar belakang (detached mode)
docker compose up -d --build
```
3. Tunggu beberapa saat hingga basis data selesai menginisialisasi.
4. Akses aplikasi web melalui browser di `http://localhost:3000`.

Untuk menghentikan *container*:
```bash
docker compose down
```

---

## 📚 Dokumentasi API (Swagger)

Backend menyediakan antarmuka dokumentasi API yang interaktif menggunakan **Swagger UI**.

Setelah server backend berjalan, Anda dapat mengakses dokumentasi Swagger melalui tautan berikut:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)** *(Sesuaikan port jika Anda mengubahnya di .env)*

Antarmuka Swagger ini memungkinkan Anda untuk melihat seluruh endpoint yang tersedia, skema DTO yang dibutuhkan, serta menguji pemanggilan API secara langsung dari browser.

### 🔗 Daftar Ringkas Endpoint
- `GET /api/menus` - Mengambil seluruh data menu dalam bentuk hierarki (pohon).
- `POST /api/menus` - Membuat menu baru (mendukung parameter `parentId` untuk menjadikan sub-menu).
- `PUT /api/menus/:id` - Memperbarui informasi nama menu.
- `PATCH /api/menus/:id/move` - Memindahkan posisi menu ke *parent* yang berbeda (mendukung `null` untuk memindah ke root).
- `PATCH /api/menus/:id/reorder` - Mengatur urutan menu.
- `DELETE /api/menus/:id` - Menghapus menu beserta seluruh *sub-menu* (anak) di dalamnya.

---

## 🗄️ Skema Basis Data & Migrasi

Basis data pada aplikasi ini mengandalkan pola *Closure Table* dari TypeORM.

**Menjalankan Migrasi:**
Pada lingkungan produksi (production), fitur `synchronize` dinonaktifkan demi keamanan. Anda harus menjalankan skrip migrasi secara manual untuk membuat tabel di basis data.
```bash
cd backend
npm run migration:run
```

**Membuat Migrasi Baru:**
Jika Anda melakukan perubahan struktur pada entitas (`menu.entity.ts`), buatlah file migrasi baru menggunakan perintah:
```bash
npm run migration:generate
```

---

## 🧪 Uji Kode (Test Coverage)

Sisi backend menggunakan framework `Jest` untuk pengujian unit (*unit testing*) yang tangguh, mencakup Controllers maupun Services.

Untuk menjalankan seluruh *test suite*:
```bash
cd backend
npm run test
```
*Status Saat Ini: Seluruh logika inti (CRUD) dan penanganan exception telah terlindungi oleh tes, dan berhasil lulus (PASS).*
