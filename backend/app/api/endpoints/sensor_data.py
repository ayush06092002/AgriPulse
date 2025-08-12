from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.sensor import SensorReadingIn
from app.models.db_models import SensorReading
from app.db.session import get_db

router = APIRouter()

@router.post("/")
async def ingest_sensor_data(
    data: List[SensorReadingIn],
    db: Session = Depends(get_db)
):
    if not data:
        raise HTTPException(status_code=400, detail="No data provided")

    # Map Pydantic models to SQLAlchemy models
    sensor_entries = [
        SensorReading(
            timestamp=item.timestamp,
            field_id=item.field_id,
            sensor_type=item.sensor_type,
            reading_value=item.reading_value,
            unit=item.unit
        )
        for item in data
    ]

    db.add_all(sensor_entries)
    db.commit()

    return {"message": f"Inserted {len(sensor_entries)} sensor records"}
