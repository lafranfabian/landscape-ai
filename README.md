# 🏡 LandPriceAI

LandPriceAI adalah aplikasi berbasis **Machine Learning** untuk memprediksi harga tanah di Indonesia menggunakan model **LightGBM**. Aplikasi ini terdiri dari backend **FastAPI** dan frontend **React + Vite**.

---

## 🚀 Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Chart.js

### Backend
- FastAPI
- LightGBM
- Pandas
- NumPy
- Joblib
- SHAP

### Database
- SQLite

---

# 📂 Struktur Project

```
landprice-ai/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
└── README.md
```

---

# ⚙️ Persyaratan

Pastikan telah menginstal:

- Python 3.10+
- Node.js 18+
- Git

Cek versi:

```bash
python --version
node -v
npm -v
git --version
```

---

# 📥 Clone Repository

```bash
git clone https://github.com/lafranfabian/landscape-ai.git
```

Masuk ke folder project:

```bash
cd landscape-ai
```

---

# ▶️ Menjalankan Backend

## 1. Masuk ke folder backend

```bash
cd backend
```

---

## 2. Buat Virtual Environment

Windows

```bash
python -m venv venv
```

---

## 3. Aktifkan Virtual Environment

CMD

```bash
venv\Scripts\activate
```

PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

Jika berhasil akan muncul

```
(venv)
```

di depan terminal.

---

## 4. Install Dependency

```bash
pip install -r requirements.txt
```

---

## 5. Jalankan Backend

```bash
uvicorn app.main:app --reload
```

Jika berhasil akan muncul

```
Uvicorn running on http://127.0.0.1:8000
```

Swagger API

```
http://127.0.0.1:8000/docs
```

---

## 6. Keluar dari Virtual Environment

```bash
deactivate
```

---

# 💻 Menjalankan Frontend

Buka terminal baru.

Masuk ke folder frontend

```bash
cd frontend
```

---

## Install Dependency

```bash
npm install
```

---

## Jalankan React

```bash
npm run dev
```

Jika berhasil akan muncul

```
Local:

http://localhost:5173
```

Buka browser

```
http://localhost:5173
```

---

# 🔄 Menjalankan Frontend & Backend Bersamaan

Gunakan dua terminal.

### Terminal 1

```bash
cd backend

venv\Scripts\activate

uvicorn app.main:app --reload
```

### Terminal 2

```bash
cd frontend

npm install

npm run dev
```

---

# 📌 API Endpoint

## Health Check

```
GET /
```

## Health

```
GET /health
```

## Predict

```
POST /predict
```

---

# 🛠 Troubleshooting

## ModuleNotFoundError

Install ulang dependency.

```bash
pip install -r requirements.txt
```

---

## npm command not found

Install Node.js terlebih dahulu.

https://nodejs.org

---

## Port 8000 sedang digunakan

Jalankan backend pada port lain.

```bash
uvicorn app.main:app --reload --port 8001
```

---

## Port 5173 sedang digunakan

Vite biasanya otomatis menggunakan port lain.

Contoh

```
http://localhost:5174
```

---

# 📜 License

Project ini dibuat untuk keperluan pembelajaran dan penelitian.

---

# 👨‍💻 Author

**Lafran Fabian Anandaditya**

Universitas Mercu Buana

Sistem Informasi
