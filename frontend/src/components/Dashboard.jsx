import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://optimistic-happiness-production.up.railway.app/";

const SENSOR_TYPES = [
  "soil_moisture",
  "temperature",
  "humidity",
  "ph",
  "sunlight",
  "rainfall",
  "wind_speed",
  "soil_nitrogen",
];

export default function Dashboard() {
  const [fieldId, setFieldId] = useState("field_1");
  const [sensorType, setSensorType] = useState("temperature");
  const [data, setData] = useState([]);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/analytics/hourly`, {
        params: {
          field_id: fieldId,
          sensor_type: sensorType,
        },
      });
      setData(res.data.hourly_averages);
    } catch (err) {
      toast.error("Failed to fetch analytics");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [fieldId, sensorType]);

  return (
    <div className="p-4 mt-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Hourly Sensor Analytics</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={fieldId}
          onChange={(e) => setFieldId(e.target.value)}
          className="border px-2 py-1 rounded w-1/2"
          placeholder="Enter field ID"
        />

        <select
          value={sensorType}
          onChange={(e) => setSensorType(e.target.value)}
          className="border px-2 py-1 rounded w-1/2"
        >
          {SENSOR_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        {data.length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <ul className="text-sm space-y-1">
            {data.map((entry, idx) => (
              <li key={idx} className="border-b py-1">
                {entry.hour} → <strong>{entry.avg_value}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
