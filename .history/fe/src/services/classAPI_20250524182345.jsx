// services/classAPI.js
import axios from "axios";

const API_BASE = "http://localhost:3001/api";

export const getClasses = async () => {
  const res = await axios.get(`${API_BASE}/classes`);
  return res.data;
};
