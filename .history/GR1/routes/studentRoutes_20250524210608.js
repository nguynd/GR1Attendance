const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/', studentController.createStudent);
router.get('/class/:classId', studentController.getStudentsByClass);
router.delete('/:id', studentController.deleteStudent); // 👈 thêm dòng này

module.exports = router;