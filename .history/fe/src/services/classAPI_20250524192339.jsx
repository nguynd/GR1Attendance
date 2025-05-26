import axios from "axios";

const API_BASE = "http://localhost:3001/api";

export const getClasses = async () => {
  const res = await axios.get(`${API_BASE}/classes`);
  return res.data;
};

export const addClass = async (data) => {
  const res = await axios.post(`${API_BASE}/classes`, data);
  return res.data;
};

export const updateClass = async (id, data) => {
  const res = await axios.put(`${API_BASE}/classes/${id}`, data);
  return res.data;
};

export const deleteClass = async (id) => {
  const res = await axios.delete(`${API_BASE}/classes/${id}`);
  return res.data;
};