import React from "react";
import UploadForm from "./components/UploadForm";
import Dashboard from "./components/Dashboard";
import JobStatus from "./components/JobStatus";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <UploadForm />
      <Dashboard />
      <JobStatus />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
