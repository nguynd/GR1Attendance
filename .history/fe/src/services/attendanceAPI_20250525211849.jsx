import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// ✅ Gọi đúng tên: getAttendanceByClass
export const getAttendanceByClass = async (classId, date) => {
  const res = await axios.get(`${BASE_URL}/attendances/${classId}`, {
    params: { date },
  });
  return res.data;
};

// ✅ Gọi đúng tên: getAttendanceDatesByClass
export const getAttendanceDatesByClass = async (classId) => {
  const res = await axios.get(`${BASE_URL}/attendances/dates/${classId}`);
  return res.data;
};

// Khởi tạo điểm danh
export const initAttendanceByClass = async (classId) => {
  const res = await axios.post(`${BASE_URL}/attendances/init/${classId}`);
  return res.data;
};
