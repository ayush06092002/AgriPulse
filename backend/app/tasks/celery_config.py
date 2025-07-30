from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()

CELERY_BROKER_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
# print(CELERY_BROKER_URL)

celery_app = Celery(
    "field_insights",
    broker=CELERY_BROKER_URL,
    backend=CELERY_BROKER_URL  # Optional if you want to track task status
)

celery_app.conf.task_routes = {
    "app.tasks.background_tasks.*": {"queue": "default"},
}
