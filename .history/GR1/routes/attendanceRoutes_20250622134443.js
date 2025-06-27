const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceByClass,
  initAttendanceByClass,
 getAttendanceDatesByClass,
 getAbsentDatesByStudent
} = require('../controllers/attendanceController'); 

// Ghi điểm danh cho 1 sinh viên
router.post('/', markAttendance);

// Lấy ds ngày điểm danh
router.get('/dates/:classId', getAttendanceDatesByClass);

// Lấy danh sách ngày vắng
router.get('/absent-dates', getAbsentDatesByStudent);

// Lấy danh sách điểm danh theo lớp và ngày
router.get('/:classId', getAttendanceByClass);

// Khởi tạo điểm danh cho cả lớp hôm nay
router.post('/init/:classId', initAttendanceByClass);



module.exports = router;
