from fastapi import APIRouter
from app.api.endpoints import sensor_data, analytics

router = APIRouter()

router.include_router(sensor_data.router, prefix="/sensor-data", tags=["Sensor Data"])
router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
