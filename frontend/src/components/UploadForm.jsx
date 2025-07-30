import React, { useState } from "react";
import toast from "react-hot-toast";
import { enqueueData, getQueue, clearQueue } from "../utils/queue";
import { sendSensorData } from "../utils/api";

const MAX_QUEUE_SIZE = 50;

export default function UploadForm() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded && uploaded.type === "application/json") {
      setFile(uploaded);
    } else {
      toast.error("Please upload a valid JSON file");
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("No file selected");

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) return toast.error("JSON must be an array");

      let count = 0;
      let batchCount = 0;
      for (const record of parsed) {
        if (getQueue().length >= MAX_QUEUE_SIZE) {
          toast.loading("Sending batch...", { id: "flush-toast" });
          await flushQueue();
          toast.dismiss("flush-toast");
          batchCount++;
        }
        enqueueData(record);
        count++;
      }

      if (getQueue().length > 0) {
        toast.loading("Sending final batch...", { id: "flush-toast" });
        await flushQueue();
        toast.dismiss("flush-toast");
        batchCount++;
      }

      toast.success(`Uploaded ${count} records in ${batchCount} batches`);
    } catch (err) {
      toast.error("Invalid JSON format");
      console.error(err);
    }
  };

  const flushQueue = async () => {
    const batch = getQueue();
    await sendSensorData(batch);
    clearQueue();
  };

  return (
    <div className="p-4 border rounded shadow w-full max-w-xl mx-auto mt-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Upload Sensor Data (JSON)</h2>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="mb-3"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>
    </div>
  );
}
