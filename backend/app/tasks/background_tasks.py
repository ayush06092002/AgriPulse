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

        # For now, just log the result
        for row in result:
            print(f"[Hourly AVG] {row.field_id} | {row.sensor_type} @ {row.hour} → {round(row.avg_reading, 2)}")

    finally:
        db.close()
