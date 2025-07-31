import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { triggerAnalyticsJob } from "../api/analytics";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BASE_URL = "https://optimistic-happiness-production.up.railway.app";

const groupDataByFieldAndSensor = (data) => {
  const grouped = {};
  data.forEach((item) => {
    const key = `${item.field_id}-${item.sensor_type}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push({
      hour: new Date(item.hour).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avg_reading: item.avg_reading,
    });
  });
  return grouped;
};

export default function JobStatus() {
  const [result, setResult] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const [selectedField, setSelectedField] = useState("");
  const [selectedSensor, setSelectedSensor] = useState("");

  const handleChartSelection = (event) => {
    setSelectedChart(event.target.value);
  };

  const handleFieldSelection = (event) => {
    setSelectedField(event.target.value);
  };

  const handleSensorSelection = (event) => {
    setSelectedSensor(event.target.value);
  };

  const filteredData = result
    ? result.filter(
        (item) =>
          (!selectedField || item.field_id === selectedField) &&
          (!selectedSensor || item.sensor_type === selectedSensor)
      )
    : [];

  return (
    <div className="p-4 mt-6 mx-auto bg-white rounded shadow" style={{ width: "90%" }}>
      <h2 className="text-lg font-semibold mb-2">Trigger Analytics Job</h2>
      <button
        onClick={() => triggerAnalyticsJob(setResult)}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Trigger Analytics Job
      </button>

      {result && (
        <div className="mt-4 bg-white p-10 rounded shadow">
          <h3 className="font-semibold text-lg mb-4">Analytics Charts</h3>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Select Field:</label>
            <select
              className="p-2 border rounded"
              onChange={handleFieldSelection}
              value={selectedField}
            >
              <option value="">All Fields</option>
              {[...new Set(result.map((item) => item.field_id))].map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Select Sensor Type:</label>
            <select
              className="p-2 border rounded"
              onChange={handleSensorSelection}
              value={selectedSensor}
            >
              <option value="">All Sensor Types</option>
              {[...new Set(result.map((item) => item.sensor_type))].map((sensor) => (
                <option key={sensor} value={sensor}>
                  {sensor}
                </option>
              ))}
            </select>
          </div>

          {filteredData.length > 0 && (
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData.map((item) => ({
                  hour: new Date(item.hour).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  avg_reading: item.avg_reading,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avg_reading" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
