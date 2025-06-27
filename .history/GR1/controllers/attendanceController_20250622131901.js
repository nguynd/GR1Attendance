const pool = require('../db');

// Tạo 1 bản ghi điểm danh cho 1 sinh viên
const markAttendance = async (req, res) => {
  const { student_id, class_id, attendance_date, status } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO attendances (student_id, class_id, attendance_date, status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id, class_id, attendance_date)
       DO UPDATE SET status = EXCLUDED.status
       RETURNING *`,
      [student_id, class_id, attendance_date, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error in markAttendance:", err); // ⚠️ Log để kiểm tra
    res.status(500).json({ error: err.message });
  }
};


const getAttendanceDatesByClass = async (req, res) => {
  const { classId } = req.params;

  try {
    const result = await pool.query(
      `SELECT DISTINCT attendance_date
       FROM attendances
       WHERE class_id = $1
       ORDER BY attendance_date DESC`,
      [classId]
    );

    const dates = result.rows.map(row =>
      row.attendance_date.toLocaleDateString("sv-SE")
    );
    res.json(dates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Lấy danh sách điểm danh theo lớp và ngày
const getAttendanceByClass = async (req, res) => {
  const classId = req.params.classId;
  const attendanceDate = req.query.date;

  try {
    const result = await pool.query(
      `SELECT * FROM attendances
       WHERE class_id = $1 AND attendance_date::text = $2`,
      [classId, attendanceDate]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tự động khởi tạo điểm danh cho toàn bộ sinh viên trong lớp
const initAttendanceByClass = async (req, res) => {
  const { classId } = req.params;

  try {
    const checkResult = await pool.query(
      `SELECT 1 FROM attendances
       WHERE class_id = $1 AND attendance_date = CURRENT_DATE
       LIMIT 1`,
      [classId]
    );

    if (checkResult.rowCount > 0) {
      return res.status(400).json({ message: "Lớp đã được điểm danh hôm nay." });
    }

    const insertResult = await pool.query(
      `INSERT INTO attendances (student_id, class_id, attendance_date, status)
       SELECT student_id, class_id, CURRENT_DATE, FALSE
       FROM students
       WHERE class_id = $1
       RETURNING *`,
      [classId]
    );

    res.status(201).json({
      message: "Khởi tạo điểm danh thành công.",
      inserted: insertResult.rowCount,
      data: insertResult.rows,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAbsentDatesByStudent = async (req, res) => {
  const { classId, studentId } = req.query;

  try {
    const result = await pool.query(
      `SELECT attendance_date
       FROM attendances
       WHERE class_id = $1 AND student_id = $2 AND status = FALSE
       ORDER BY attendance_date DESC`,
      [classId, studentId]
    );

    const absentDates = result.rows.map(r => r.attendance_date.toISOString().split('T')[0]);
    res.json(absentDates);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách buổi vắng:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  markAttendance,
  getAttendanceByClass,
  initAttendanceByClass,
  getAttendanceDatesByClass,
  getAbsentDatesByStudent
};
