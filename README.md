# AgriPulse

# 🌾 Field Insights Dashboard

A full-stack application to ingest sensor data, process it via background tasks, aggregate hourly insights, and visualize them through a sleek dashboard.

---

## 🚀 Live Demo

| Service         | Platform | URL                      |
|-----------------|----------|---------------------------|
| **Frontend**    | Vercel   | https://<your-vercel-url> |
| **Backend**     | Railway  | https://<your-railway-url> |
| **Database**    | Supabase | PostgreSQL                |
| **Queue**       | Upstash  | Redis                     |

---

## 📦 Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Hot Toast

### Backend
- FastAPI
- SQLAlchemy
- Celery
- PostgreSQL (via Supabase)
- Redis (via Upstash)

---

## 📁 Project Structure

.
├── backend/
│ ├── app/
│ │ ├── api/
│ │ ├── core/
│ │ ├── db/
│ │ ├── models/
│ │ ├── tasks/
│ │ └── main.py
│ ├── celery_worker.py
│ └── Dockerfile
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── main.jsx
│ ├── vite.config.js
│ └── package.json

---

## ⚙️ Features

- ✅ Upload sensor data from JSON files
- ✅ Queue-based data ingestion in batches
- ✅ Background aggregation of hourly averages
- ✅ Analytics view (temperature, humidity trends, etc.)
- ✅ Clean UI with file upload + visual feedback
