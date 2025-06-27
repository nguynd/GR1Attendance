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

// Điểm danh
export const markAttendance = async (data) => {
  const res = await axios.post(`${BASE_URL}/attendances`, data);
  return res.data;
};

export const getAbsentDatesByStudent = async (classId, studentId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/attendances/absent-dates/${classId}/${studentId}`
    );
    return res.data; // array các chuỗi yyyy-mm-dd
  } catch (err) {
    console.error("API lỗi khi lấy buổi vắng:", err);
    return [];
  }
};

  export const restoreAttendance = async (classId, studentId, date) => {
    const res = await axios.put(`${BASE_URL}/attendances/restore`, {
      classId,
      studentId,
      date,
    });
    return res.data;
  };



