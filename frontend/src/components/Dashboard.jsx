import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { API_BASE_URL } from "../config/api";

const BASE_URL = API_BASE_URL;

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
  const [lineColor, setLineColor] = useState("#8884d8");

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
    <div className="py-20 bg-gradient-to-br from-blue-500 to-green-400 flex flex-col items-center">
      <h2 className="text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg">
        Hourly Sensor Analytics
      </h2>

      <div className="flex flex-col md:flex-row gap-6 mb-8 w-full max-w-3xl px-4">
        <input
          type="text"
          value={fieldId}
          onChange={(e) => setFieldId(e.target.value)}
          className="border px-4 py-3 rounded-lg shadow-md w-full md:w-1/2 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-transform transform hover:scale-105"
          placeholder="Enter field ID"
        />

        <select
          value={sensorType}
          onChange={(e) => setSensorType(e.target.value)}
          className="border px-4 py-3 rounded-lg shadow-md w-full md:w-1/2 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-transform transform hover:scale-105"
        >
          {SENSOR_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8 text-center w-full max-w-md px-4">
        <label className="block text-lg font-medium text-white mb-3">
          Select Line Color:
        </label>
        <input
          type="color"
          value={lineColor}
          onChange={(e) => setLineColor(e.target.value)}
          className="w-24 h-12 border rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
        />
      </div>

      <div
        style={{ height: "500px" }}
        className="bg-white rounded-lg shadow-lg p-4 w-full max-w-5xl hover:shadow-2xl transition-shadow"
      >
        {data.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Line
                type="monotone"
                dataKey="avg_value"
                stroke={lineColor}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
