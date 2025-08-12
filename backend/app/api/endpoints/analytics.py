from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import SessionLocal, get_db
from app.models.db_models import SensorReading
from app.tasks.background_tasks import aggregate_hourly_avg
from celery.result import AsyncResult
from app.tasks.celery_config import celery_app

router = APIRouter()

@router.get("/job-status/{task_id}")
def get_job_status(task_id: str):
    result = AsyncResult(task_id, app=celery_app)

    response = {
        "task_id": task_id,
        "status": result.status,
    }

    if result.status == "SUCCESS":
        response["result"] = result.result
    elif result.status == "FAILURE":
        response["error"] = str(result.result)

    return response

@router.get("/")
def get_analytics(
    field_id: str = Query(...),
    sensor_type: str = Query(...),
    db: Session = Depends(get_db)
):
    query = db.query(
        func.count(SensorReading.id).label("count"),
        func.avg(SensorReading.reading_value).label("average"),
        func.min(SensorReading.reading_value).label("min"),
        func.max(SensorReading.reading_value).label("max")
    ).filter(
        SensorReading.field_id == field_id,
        SensorReading.sensor_type == sensor_type,
        SensorReading.reading_value != None
    )

    result = query.one()

    if result.count == 0:
        raise HTTPException(status_code=404, detail="No data found for the given field and sensor type")

    return {
        "field_id": field_id,
        "sensor_type": sensor_type,
        "count": result.count,
        "average": round(result.average, 2),
        "min": result.min,
        "max": result.max
    }

@router.post("/trigger", status_code=status.HTTP_202_ACCEPTED)
def trigger_analytics_task():
    task = aggregate_hourly_avg.delay()
    return {"message": "Analytics task triggered", "task_id": task.id}

@router.get("/hourly")
def get_hourly_averages(
    field_id: str = Query(...),
    sensor_type: str = Query(...),
    db: Session = Depends(get_db)
):
    results = db.query(
        func.date_trunc('hour', SensorReading.timestamp).label("hour"),
        func.avg(SensorReading.reading_value).label("avg_value")
    ).filter(
        SensorReading.field_id == field_id,
        SensorReading.sensor_type == sensor_type,
        SensorReading.reading_value != None
    ).group_by(
        func.date_trunc('hour', SensorReading.timestamp)
    ).order_by("hour").all()

    response = [
        {
            "hour": row.hour.isoformat(),
            "avg_value": round(row.avg_value, 2)
        }
        for row in results
    ]

    return {
        "field_id": field_id,
        "sensor_type": sensor_type,
        "hourly_averages": response
    }

