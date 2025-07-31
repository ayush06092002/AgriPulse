from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()

CELERY_BROKER_URL = os.getenv("REDIS_URL")

celery_app = Celery(
    "field_insights",
    broker=CELERY_BROKER_URL,
    backend=CELERY_BROKER_URL
)

celery_app.autodiscover_tasks(["app.tasks"])

# Required SSL configs for rediss:// (Upstash)
if CELERY_BROKER_URL.startswith("rediss://"):
    ssl_config = {
        "ssl_cert_reqs": "none"
    }

    celery_app.conf.broker_use_ssl = ssl_config
    celery_app.conf.redis_backend_use_ssl = ssl_config

celery_app.conf.task_routes = {
    "app.tasks.background_tasks.*": {"queue": "default"},
}
