const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceByClass,
  initAttendanceByClass
} = require('../controllers/attendanceController'); 

// Ghi điểm danh cho 1 sinh viên
router.post('/', markAttendance);

// Lấy danh sách điểm danh theo lớp và ngày
router.get('/:classId', getAttendanceByClass);

// Khởi tạo điểm danh cho cả lớp hôm nay
router.post('/init/:classId', initAttendanceByClass);

module.exports = router;
