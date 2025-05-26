const pool = require('../db');

// Tạo 1 bản ghi điểm danh cho 1 sinh viên
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
      row.attendance_date.toISOString().split('T')[0]
    );
    res.json(dates);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách ngày điểm danh:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Lấy danh sách điểm danh theo lớp và ngày
const getAttendanceByClass = async (req, res) => {
  const classId = req.params.classId;
  const attendanceDate = req.query.date;

  // 🪵 Log đầu vào để kiểm tra đúng định dạng chưa
  console.log("👉 classId:", classId);
  console.log("👉 attendanceDate:", attendanceDate);

  try {
    const result = await pool.query(
      `SELECT * FROM attendances
       WHERE class_id = $1 AND attendance_date = $2`,
      [classId, attendanceDate]
    );

    // 🪵 Log kết quả trả về từ DB
    console.log("✅ DB trả về:", result.rows);

    res.json(result.rows);
  } catch (err) {
    console.error('Error in getAttendanceByClass:', err);
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
       SELECT student_id, class_id, CURRENT_DATE, TRUE
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
    console.error('Error in initAttendanceByClass:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  markAttendance,
  getAttendanceByClass,
  initAttendanceByClass,
  getAttendanceDatesByClass,
};
