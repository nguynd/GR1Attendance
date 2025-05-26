const pool = require('../db');  

const markAttendance = async (req, res) => {
  const { student_id, class_id, attendance_date, status } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO attendances (student_id, class_id, attendance_date, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [student_id, class_id, attendance_date, status]
    );
    res.status(201).json(result.rows[0]);  
  } catch (err) {
    console.error('Error in markAttendance:', err);
    res.status(500).json({ error: err.message });  
  }
};

const getAttendanceByClass = async (req, res) => {
  const classId = req.params.classId;  
  const attendanceDate = req.query.date;  

  try {
    const result = await pool.query(
      `SELECT * FROM attendances
       WHERE class_id = $1 AND attendance_date = $2`,
      [classId, attendanceDate]  
    );
    res.json(result.rows);  
  } catch (err) {
    console.error('Error in getAttendanceByClass:', err);
    res.status(500).json({ error: err.message }); 
  }
};

module.exports = {
  markAttendance,
  getAttendanceByClass,
};
