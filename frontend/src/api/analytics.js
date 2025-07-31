import toast from "react-hot-toast";

export async function triggerAnalyticsJob(setResult) {
  const triggerRes = await fetch("https://optimistic-happiness-production.up.railway.app/analytics/trigger", {
    method: "POST",
  });

  if (!triggerRes.ok) {
    toast.error("Failed to trigger analytics job");
    return;
  }

  const { task_id } = await triggerRes.json();
  const loadingToast = toast.loading("Job started...");

  const poll = setInterval(async () => {
    const statusRes = await fetch(`https://optimistic-happiness-production.up.railway.app/analytics/job-status/${task_id}`);
    const data = await statusRes.json();

    if (data.status === "SUCCESS") {
      toast.dismiss(loadingToast);
      toast.success("Analytics completed ✅");
      clearInterval(poll);

      console.log("Result:", data.result);
      setResult(data.result); // ✅ this updates the UI

    } else if (data.status === "FAILURE") {
      toast.dismiss(loadingToast);
      toast.error("Analytics failed ❌");
      clearInterval(poll);
    }
  }, 3000);
}
