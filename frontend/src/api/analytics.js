import toast from "react-hot-toast";
import { API_BASE_URL } from "../config/api";

export async function triggerAnalyticsJob(setResult) {
  const triggerRes = await fetch(`${API_BASE_URL}/analytics/trigger`, {
    method: "POST",
  });

  if (!triggerRes.ok) {
    toast.error("Failed to trigger analytics job");
    return;
  }

  const { task_id } = await triggerRes.json();
  const loadingToast = toast.loading("Job started...");

  const poll = setInterval(async () => {
    const statusRes = await fetch(`${API_BASE_URL}/analytics/job-status/${task_id}`);
    const data = await statusRes.json();

    if (data.status === "SUCCESS") {
      toast.dismiss(loadingToast);
      toast.success("Analytics completed ✅");
      clearInterval(poll);

      setResult(data.result); // ✅ this updates the UI

    } else if (data.status === "FAILURE") {
      toast.dismiss(loadingToast);
      toast.error("Analytics failed ❌");
      clearInterval(poll);
    }
  }, 3000);
}
