const express = require('express');
const router = express.Router();
const { markAttendance, getAttendanceByClass } = require('../controllers/attendanceController'); 

router.post('/', markAttendance);

router.get('/:classId', getAttendanceByClass);

module.exports = router;
