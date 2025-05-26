// services/classAPI.jsx
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const getClasses = async () => {
  const res = await axios.get(`${API_BASE}/classes`);
  return res.data;
};

export const deleteStudent = async (id) => {
  return await axios.delete(`http://localhost:3001/api/students/${id}`);
};