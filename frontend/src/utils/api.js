import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config/api";

const BASE_URL = API_BASE_URL;

export async function sendSensorData(dataBatch) {
  try {
    const response = await axios.post(`${BASE_URL}/sensor-data/`, dataBatch);
    return response.data;
  } catch (error) {
    toast.error("Upload failed");
    console.error("API Error:", error);
  }
}
