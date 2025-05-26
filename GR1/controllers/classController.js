const pool = require('../db');

exports.createClass = async (req, res) => {
  const { class_code, class_name } = req.body;
  try {
    const check = await pool.query(
      'SELECT * FROM classes WHERE class_code = $1',
      [class_code]
    );
    if (check.rows.length > 0) {
      return res.status(400).json({ error: "Mã lớp đã tồn tại" });
    }

    const result = await pool.query(
      'INSERT INTO classes (class_code, class_name) VALUES ($1, $2) RETURNING *',
      [class_code, class_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM classes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateClass = async (req, res) => {
  const id = req.params.id;
  const { class_code, class_name } = req.body;

  try {
    const check = await pool.query(
      'SELECT * FROM classes WHERE class_code = $1 AND id != $2',
      [class_code, id]
    );
    if (check.rows.length > 0) {
      return res.status(400).json({ error: "Mã lớp đã tồn tại" });
    }

    const result = await pool.query(
      'UPDATE classes SET class_code = $1, class_name = $2 WHERE id = $3 RETURNING *',
      [class_code, class_name, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM classes WHERE id = $1', [id]);
    res.json({ message: "Đã xoá lớp học" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClassById = async (req, res) => {
  const classId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM classes WHERE id = $1', [classId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getClassAttendanceSummary = async (req, res) => {
  const { classId } = req.params;

  try {
    const result = await pool.query(
      `SELECT s.student_id, s.name, s.class_id,
              COUNT(a.status) FILTER (WHERE a.status = TRUE) AS appearance,
              (
                SELECT COUNT(DISTINCT attendance_date)
                FROM attendances
                WHERE class_id = $1
              ) AS total_sessions
       FROM students s
       LEFT JOIN attendances a
         ON s.student_id = a.student_id AND s.class_id = a.class_id
       WHERE s.class_id = $1
       GROUP BY s.student_id, s.name, s.class_id
       ORDER BY s.student_id`,
      [classId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi khi truy vấn attendance summary:", err);
    res.status(500).json({ error: err.message });
  }
};
