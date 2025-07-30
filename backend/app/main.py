from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.models.db_models import Base
from app.db.session import engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Field Insights Dashboard API",
    description="Backend for ingesting, processing, and analyzing farm sensor data.",
    version="1.0.0"
)

# CORS settings (for frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the API routes
app.include_router(api_router)
