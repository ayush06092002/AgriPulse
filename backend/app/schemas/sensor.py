from pydantic import BaseModel, Field, model_validator
from typing import Optional, Literal
from datetime import datetime

class SensorReadingIn(BaseModel):
    timestamp: datetime
    field_id: str
    sensor_type: Literal[
        "soil_moisture", "temperature", "humidity", "ph",
        "sunlight", "rainfall", "wind_speed", "soil_nitrogen"
    ]
    reading_value: Optional[float] = None
    unit: Optional[str] = None

    @model_validator(mode='after')
    def validate_reading_value_range(self):
        """
        Validates the reading_value against the prescribed ranges for each sensor_type.
        """
        stype = self.sensor_type
        value = self.reading_value

        if value is None:
            return self # allow nulls

        ranges = {
            "soil_moisture": (0, 100),
            "temperature": (-10, 45),
            "humidity": (0, 100),
            "ph": (4.5, 9.0),
            "sunlight": (0, 1500),
            "rainfall": (0, 50),
            "wind_speed": (0, 30),
            "soil_nitrogen": (0, 100),
        }

        if stype in ranges:
            low, high = ranges[stype]
            if not (low <= value <= high):
                raise ValueError(f"{stype} reading must be between {low} and {high}")
        return self