import React from "react";
import UploadForm from "./components/UploadForm";
import Dashboard from "./components/Dashboard";
import JobStatus from "./components/JobStatus";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center p-6">
      <header className="w-full bg-blue-600 text-white py-4 shadow-md">
        <h1 className="text-center text-2xl font-bold">AgriPulse Dashboard</h1>
      </header>

      <main className="w-full max-w-6xl flex flex-col gap-6 mt-6">
        <UploadForm />
        <Dashboard />
        <JobStatus />
      </main>

      <footer className="w-full bg-gray-800 text-white py-4 mt-auto text-center">
        <p>&copy; 2025 AgriPulse. All rights reserved.</p>
      </footer>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
