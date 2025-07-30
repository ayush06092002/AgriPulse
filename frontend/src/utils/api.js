import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://optimistic-happiness-production.up.railway.app/";

export async function sendSensorData(dataBatch) {
  try {
    const response = await axios.post(`${BASE_URL}/sensor-data/`, dataBatch);
    return response.data;
  } catch (error) {
    toast.error("Upload failed");
    console.error("API Error:", error);
  }
}
