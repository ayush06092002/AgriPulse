from app.tasks.celery_config import celery_app
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.db_models import SensorReading
from sqlalchemy import func

@celery_app.task
def aggregate_hourly_avg():
    db: Session = SessionLocal()
    try:
        result = db.query(
            SensorReading.field_id,
            SensorReading.sensor_type,
            func.date_trunc('hour', SensorReading.timestamp).label("hour"),
            func.avg(SensorReading.reading_value).label("avg_reading")
        ).filter(SensorReading.reading_value != None).group_by(
            SensorReading.field_id,
            SensorReading.sensor_type,
            "hour"
        ).all()

        output = [
            {
                "field_id": row.field_id,
                "sensor_type": row.sensor_type,
                "hour": row.hour.isoformat(),
                "avg_reading": round(row.avg_reading, 2)
            }
            for row in result
        ]

        return output

    finally:
        db.close()
