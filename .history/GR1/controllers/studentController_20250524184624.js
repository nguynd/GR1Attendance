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
