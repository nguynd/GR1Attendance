import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// ✅ Lấy danh sách sinh viên theo ID lớp
export const getStudentsByClass = async (classId) => {
  const res = await axios.get(`${BASE_URL}/students/class/${classId}`);
  return res.data;
};

// ✅ Thêm sinh viên mới
export const createStudent = async (studentData) => {
  const res = await axios.post(`${BASE_URL}/students`, studentData);
  return res.data;
};

// ✅ Xoá sinh viên theo ID
export const deleteStudent = async (studentId) => {
  const res = await axios.delete(`${BASE_URL}/students/${studentId}`);
  return res.data;
};

// ✅ Lấy thông tin lớp theo ID
export const getClassById = async (classId) => {
  const res = await axios.get(`${BASE_URL}/classes/${classId}`);
  return res.data;
};

// ✅ Lấy tổng số buổi và số buổi có mặt của từng sinh viên trong lớp
export const getAttendanceSummaryByClass = async (classId) => {
  const res = await axios.get(`${BASE_URL}/classes/${classId}/attendance-summary`);
  return res.data;
};
