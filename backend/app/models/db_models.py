from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, index=True)
    field_id = Column(String, index=True)
    sensor_type = Column(String, index=True)
    reading_value = Column(Float, nullable=True)
    unit = Column(String, nullable=True)
