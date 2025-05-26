const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { getClassAttendanceSummary } = require('../controllers/classController');

// Routes
router.post('/', classController.createClass);
router.get('/', classController.getClasses);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);
router.get('/:id', classController.getClassById);
router.get('/:classId/attendance-summary', getClassAttendanceSummary);


module.exports = router;
