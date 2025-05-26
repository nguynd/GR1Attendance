const pool = require('../db');

exports.createStudent = async (req, res) => {
  const { name, student_id, class_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO students (name, student_id, class_id) VALUES ($1, $2, $3) RETURNING *',
      [name, student_id, class_id]
    );
  await pool.query(
  'UPDATE classes SET student_count = student_count + 1 WHERE id = $1',
  [class_id]
);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentsByClass = async (req, res) => {
  const classId = req.params.classId;
  try {
    const result = await pool.query(
      'SELECT * FROM students WHERE class_id = $1',
      [classId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id;

  try {
    // Lấy thông tin sinh viên để biết class_id trước khi xoá
    const studentResult = await pool.query(
      'SELECT class_id FROM students WHERE id = $1',
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: "Sinh viên không tồn tại" });
    }

    const classId = studentResult.rows[0].class_id;

    // Xoá sinh viên
    await pool.query(
      'DELETE FROM students WHERE id = $1',
      [studentId]
    );

    // Cập nhật số lượng sinh viên trong lớp
    await pool.query(
      'UPDATE classes SET student_count = student_count - 1 WHERE id = $1',
      [classId]
    );

    res.json({ message: "Đã xoá sinh viên và cập nhật lớp" });
  } catch (err) {
    console.error("Lỗi khi xoá sinh viên:", err);
    res.status(500).json({ error: err.message });
  }
};
