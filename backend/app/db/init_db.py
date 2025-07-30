from app.models.db_models import Base
from app.db.session import engine

def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created")

if __name__ == "__main__":
    init_db()
