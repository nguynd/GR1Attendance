const express = require('express');
const router = express.Router();
const { createClass, getClasses } = require('../controllers/classController');

router.post('/', createClass);
router.get('/', getClasses);
router.put("/:id", classController.updateClass);
router.delete("/:id", classController.deleteClass);


module.exports = router;
