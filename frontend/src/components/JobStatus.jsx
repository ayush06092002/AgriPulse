import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { triggerAnalyticsJob } from "../api/analytics";

const BASE_URL = "http://localhost:8000";

export default function JobStatus() {
  const [result, setResult] = useState(null);

  return (
    <div className="p-4 mt-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Trigger Analytics Job</h2>
      <button
        onClick={() => triggerAnalyticsJob(setResult)}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Trigger Analytics Job
      </button>

      {result && (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-2">Analytics Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
