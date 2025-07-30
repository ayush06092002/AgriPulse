from app.tasks.celery_config import celery_app

# Required so Celery can discover tasks in background_tasks.py
import app.tasks.background_tasks

if __name__ == "__main__":
    celery_app.worker_main()
