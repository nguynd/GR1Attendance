const express = require('express');
const router = express.Router();
const { createStudent, getStudentsByClass } = require('../controllers/studentController');

router.post('/', createStudent);

router.get('/:classId', getStudentsByClass);

module.exports = router;
