import json
import random
from faker import Faker
from datetime import timedelta, datetime
import os

fake = Faker()
random.seed(42)

SENSOR_TYPES = {
    "soil_moisture": (0, 100, "%"),
    "temperature": (-10, 45, "°C"),
    "humidity": (0, 100, "%"),
    "ph": (4.5, 9.0, "pH units"),
    "sunlight": (0, 1500, "W/m^2"),
    "rainfall": (0, 50, "mm"),
    "wind_speed": (0, 30, "m/s"),
    "soil_nitrogen": (0, 100, "mg/kg"),
}

FIELD_IDS = [f"field_{i}" for i in range(1, 6)]
NUM_RECORDS_LIST = [250, 500, 750, 1000]

def maybe_null(value, probability=0.05):
    return None if random.random() < probability else value

def generate_record():
    sensor_type, (min_val, max_val, unit) = random.choice(list(SENSOR_TYPES.items()))
    record = {
        "timestamp": fake.date_time_between(start_date='-7d', end_date='now').isoformat() + "Z",
        "field_id": random.choice(FIELD_IDS),
        "sensor_type": sensor_type,
        "reading_value": maybe_null(round(random.uniform(min_val, max_val), 2)),
        "unit": maybe_null(unit)
    }
    return record

def generate_file(record_count):
    data = [generate_record() for _ in range(record_count)]
    filename = f"sensor_data_{record_count}.json"
    with open(filename, "w") as f:
        json.dump(data, f, indent=2)
    print(f"✅ Generated {filename} with {record_count} records")

if __name__ == "__main__":
    os.makedirs("generated_data", exist_ok=True)
    os.chdir("generated_data")
    for count in NUM_RECORDS_LIST:
        generate_file(count)
